import { normalizeToRange } from "./utils";

export enum Chance {
    CHANCE_100_PCT = 0b000,
    CHANCE_88_PCT  = 0b001,
    CHANCE_67_PCT  = 0b010,
    CHANCE_50_PCT  = 0b011,
    CHANCE_32_PCT  = 0b100,
    CHANCE_16_PCT  = 0b101,
    CHANCE_10_PCT  = 0b110,
    CHANCE_4_PCT   = 0b111
}

export enum Time {
    TIME_0_MS      = 0b000,
    TIME_32_MS     = 0b001,
    TIME_96_MS     = 0b010,
    TIME_192_MS    = 0b011,
    TIME_480_MS    = 0b100,
    TIME_960_MS    = 0b101,
    TIME_2400_MS   = 0b110,
    TIME_3840_MS   = 0b111
}

const TIMES = [Time.TIME_0_MS, Time.TIME_32_MS, Time.TIME_96_MS, Time.TIME_192_MS,
    Time.TIME_480_MS, Time.TIME_960_MS, Time.TIME_2400_MS, Time.TIME_3840_MS];
export namespace Time {
    export function fromByte(val: number): Time {
        const idx = normalizeToRange(val, 0, 255, 0, 7);
        return TIMES[idx];
    }
}

enum GlobalSustainTime {
    TIME_64_MS     = 0b000,
    TIME_112_MS    = 0b001,
    TIME_160_MS    = 0b010,
    TIME_208_MS    = 0b011,
    TIME_480_MS    = 0b100,
    TIME_960_MS    = 0b101,
    TIME_2400_MS   = 0b110,
    TIME_3840_MS   = 0b111
}

interface FieldFragment {
    byte: number;
    offset: number;
    width: number;
    srcOffset: number;
}

interface Field {
    fragments: FieldFragment[];
    valueType: any;
    default?: any;
    readOnly: boolean;
}

class FieldTypeException extends Error {}
class FieldKeyException extends Error {}
class FieldReadOnlyException extends Error {}
class CommandDecodeException extends Error {}

class GenericCommand {
    protected _buffer: number[];

    constructor(buffer: number[]) {
        this._buffer = buffer;
    }

    toString(): string {
        const bufferStr = this._buffer.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
        return `${this.constructor.name}(bytes=${bufferStr})`;
    }

    equals(other: GenericCommand): boolean {
        return other instanceof GenericCommand && 
            this._buffer.every((value, index) => value === other._buffer[index]);
    }
}

class Command {
    public static _commands: Command[] = [];
    protected static _encodingMap: number[] = [
        0x21, 0x32, 0x54, 0x65, 0xa9, 0x9a, 0x6d, 0x29,
        0x56, 0x92, 0xa1, 0xb4, 0xb2, 0x84, 0x66, 0x2a,
        0x4c, 0x6a, 0xa6, 0x95, 0x62, 0x51, 0x42, 0x24,
        0x35, 0x46, 0x8a, 0xac, 0x8c, 0x6c, 0x2c, 0x4a,
        0x59, 0x86, 0xa4, 0xa2, 0x91, 0x64, 0x55, 0x44,
        0x22, 0x31, 0xb1, 0x52, 0x85, 0x96, 0xa5, 0x69,
        0x5a, 0x2d, 0x4d, 0x89, 0x45, 0x34, 0x61, 0x25,
        0x36, 0xad, 0x94, 0xaa, 0x8d, 0x49, 0x99, 0x26,
    ];

    protected _buffer: number[] = [];
    protected _fieldValues: { [key: string]: any } = {};

    protected static _decodingMap: { [key: number]: number } = Object.fromEntries(
        Command._encodingMap.map((value, index) => [value, index])
    );
    
    constructor(fieldValues: { [key: string]: any }) {
        this._populateFields(fieldValues);
        this._validateFields();
        this._populateBuffer();
    }

    encode(): number[] {
        let encodedBytes = [...this._buffer];
        let checksum = 0;

        for (let i = 2; i < encodedBytes.length; i++) {
            encodedBytes[i] = Command._encodingMap[encodedBytes[i]];
            checksum += encodedBytes[i];
        }

        checksum = (checksum >> 2) & 0x3F;
        checksum = Command._encodingMap[checksum];
        encodedBytes[1] = checksum;

        let encodedBits: number[] = [];
        for (let b of encodedBytes) {
            for (let i = 0; i < 8; i++) {
                if (encodedBits.length > 0 || b & 0b1) {
                    encodedBits.push(b & 0b1);
                }
                b >>= 1;
            }
        }

        while (encodedBits[encodedBits.length - 1] === 0) {
            encodedBits.pop();
        }

        return encodedBits;
    }

    static decode(encodedBits: number[], verifyChecksum: boolean = true): Command | GenericCommand {
        let encodedBytes: number[] = [0];
        let numLeadingZeroes = 0;

        for (let i = 0; i < encodedBits.length; i++) {
            if (encodedBits[i] === 0 && encodedBytes.length === 1 && encodedBytes[0] === 0) {
                numLeadingZeroes++;
                continue;
            }

            let bitPos = i + 7 - numLeadingZeroes;
            let byteIndex = Math.floor(bitPos / 8);
            while (encodedBytes.length - 1 < byteIndex) {
                encodedBytes.push(0);
            }
            if (encodedBits[i]) {
                encodedBytes[byteIndex] |= 1 << (bitPos % 8);
            }
        }

        if (encodedBytes.length !== 6 && encodedBytes.length !== 9) {
            throw new CommandDecodeException(`Invalid command size: ${encodedBytes.length}`);
        }

        let checksum = 0;
        let decodedBytes = new Array(encodedBytes.length).fill(0);
        decodedBytes[0] = encodedBytes[0];

        for (let i = 2; i < encodedBytes.length; i++) {
            checksum += encodedBytes[i];
            if (!(encodedBytes[i] in Command._decodingMap)) {
                throw new CommandDecodeException(`Invalid byte at offset ${i}: ${encodedBytes[i].toString(16)}`);
            }
            decodedBytes[i] = Command._decodingMap[encodedBytes[i]];
        }

        let expectedChecksum = (checksum >> 2) & 0x3F;
        expectedChecksum = Command._encodingMap[expectedChecksum];
        if (verifyChecksum && encodedBytes[1] !== expectedChecksum) {
            throw new CommandDecodeException(`Checksum mismatch: expected ${expectedChecksum.toString(16)}, received ${encodedBytes[1].toString(16)}`);
        }

        let matchClasses: typeof Command[] = [];
        for (let cls of Command._commands as any[]) {
            if (cls._numBytes !== decodedBytes.length ||
                cls._flagsType !== ((decodedBytes[2] >> 1) & 0b111) ||
                ('_actionId' in cls && cls._actionId !== (decodedBytes[7] & 0x1F))) {
                continue;
            }
            matchClasses.push(cls);
        }

        if (matchClasses.length === 0) {
            return new GenericCommand(decodedBytes);
        } else if (matchClasses.length > 1) {
            throw new CommandDecodeException(`Multiple matching commands found: ${matchClasses.map(c => c.name).join(', ')}`);
        }

        let cls = matchClasses[0] as any;
        let fieldValues: { [key: string]: any } = {};

        for (let [fieldName, field] of Object.entries(cls._fields)) {
            let rawFieldValue = 0;
            for (let fragment of (field as any).fragments) {
                let fragmentValue = decodedBytes[fragment.byte] >> fragment.offset;
                fragmentValue &= (1 << fragment.width) - 1;
                rawFieldValue |= fragmentValue << fragment.srcOffset;
            }
            let fieldValue = (field as any).valueType(rawFieldValue);
            fieldValues[fieldName] = fieldValue;
        }

        return new cls(fieldValues);
    }

    private _populateFields(fieldValues: { [key: string]: any }): void {
        this._fieldValues = fieldValues;
        const fields = (this.constructor as any)._fields;

        for (let [fieldName, fieldValue] of Object.entries(this._fieldValues)) {
            if (!(fieldName in fields)) {
                throw new FieldKeyException(`Unexpected field: ${fieldName} = ${fieldValue}`);
            }
            let field = fields[fieldName];
            // ignore for now weird python idiom
            if (false && !(fieldValue instanceof field.valueType)) {
                console.log(fieldValue, field.valueType);
                throw new FieldTypeException(`Field ${fieldName} type mismatch: expected ${field.valueType.name}, received ${fieldValue.constructor.name} (value: ${fieldValue})`);
            }
            if (field.readOnly && fieldValue !== field.default) {
                throw new FieldReadOnlyException(`Field ${fieldName} may not be modified from the default value of ${field.default}`);
            }
        }

        let missingFields = new Set(Object.keys(fields));
        for (let fieldName of Object.keys(this._fieldValues)) {
            missingFields.delete(fieldName);
        }

        for (let fieldName of Array.from(missingFields)) {
            let field = fields[fieldName];
            if (field.default !== undefined) {
                this._fieldValues[fieldName] = field.default;
                missingFields.delete(fieldName);
            }
        }

        if (missingFields.size > 0) {
            throw new FieldKeyException(`Missing fields: ${Array.from(missingFields).sort().join(', ')}`);
        }
    }

    protected _validateFields(): void {
        // This method can be overridden by subclasses
    }

    private _populateBuffer(): void {
        const cls = this.constructor as typeof Command;
        this._buffer = new Array((cls as any)._numBytes).fill(0);

        this._buffer[0] = 0b10000000; // Magic value
        this._buffer[2] = (cls as any)._flagsType << 1;
        if (this._buffer.length === 9 && '_actionId' in cls) {
            this._buffer[7] = cls._actionId as any;
        }

        for (let [fieldName, field] of Object.entries((cls as any)._fields)) {
            let fieldValue = Number(this._fieldValues[fieldName]);
            for (let fragment of (field as any).fragments) {
                let fragmentValue = fieldValue >> fragment.srcOffset;
                fragmentValue &= (1 << fragment.width) - 1;
                fragmentValue <<= fragment.offset;
                this._buffer[fragment.byte] |= fragmentValue;
            }
        }
    }

    toString(): string {
        const cls = this.constructor as typeof Command;
        const bufferStr = this._buffer.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
        const fieldsStr = Object.entries(this._fieldValues)
            .sort((a, b) => {
                const fieldA = (cls as any)._fields[a[0]];
                const fieldB = (cls as any)._fields[b[0]];
                return fieldA.fragments[0].byte * 8 + fieldA.fragments[0].offset - 
                       (fieldB.fragments[0].byte * 8 + fieldB.fragments[0].offset);
            })
            .map(([k, v]) => `${k}=${v}`)
            .join(', ');
        return `${cls.name}(bytes=${bufferStr}, ${fieldsStr})`;
    }

    equals(other: Command): boolean {
        return other instanceof Command &&
            Object.entries(this._fieldValues).every(([key, value]) => 
                other._fieldValues[key] === value
            );
    }
}

class CommandSingleColor extends Command {
    protected static _numBytes = 6;
    protected static _flagsType = 0b000;
    protected static _fields: { [key: string]: Field } = {
        'onStart':    { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'gstEnable':  { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'green':      { fragments: [{ byte: 3, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'red':        { fragments: [{ byte: 4, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'blue':       { fragments: [{ byte: 5, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
    };

    protected _validateFields(): void {
        if (this._fieldValues['onStart']) {
            if (!this._fieldValues['gstEnable']) {
                throw new Error("If onStart is true, gstEnable must also be true");
            }
        }
    }
}

class CommandSingleColorExt extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b000;
    protected static _fields: { [key: string]: Field } = {
        'onStart':       { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'gstEnable':     { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'green':         { fragments: [{ byte: 3, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'red':           { fragments: [{ byte: 4, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'blue':          { fragments: [{ byte: 5, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'chance':        { fragments: [{ byte: 6, offset: 0, width: 3, srcOffset: 0 }], valueType: Chance, default: Chance.CHANCE_100_PCT, readOnly: false },
        'attack':        { fragments: [{ byte: 6, offset: 3, width: 3, srcOffset: 0 }], valueType: Time, default: Time.TIME_480_MS, readOnly: false },
        'sustain':       { fragments: [{ byte: 7, offset: 0, width: 3, srcOffset: 0 }], valueType: Time, default: Time.TIME_480_MS, readOnly: false },
        'release':       { fragments: [{ byte: 7, offset: 3, width: 3, srcOffset: 0 }], valueType: Time, default: Time.TIME_480_MS, readOnly: false },
        'groupId':       { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
        'enableRepeat':  { fragments: [{ byte: 8, offset: 5, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
    };

    protected _validateFields(): void {
        if (this._fieldValues['onStart']) {
            if (!this._fieldValues['gstEnable']) {
                throw new Error("If onStart is true, gstEnable must also be true");
            }
        }
    }
}

class CommandTwoColors extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b010;
    protected static _fields: { [key: string]: Field } = {
        'onStart':   { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: true },
        'gstEnable': { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'green1':    { fragments: [{ byte: 3, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'red1':      { fragments: [{ byte: 4, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'blue1':     { fragments: [{ byte: 5, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'green2':    { fragments: [{ byte: 6, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'red2':      { fragments: [{ byte: 7, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'blue2':     { fragments: [{ byte: 8, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
    };
}

class CommandSetConfig extends Command {
    protected static _numBytes = 6;
    protected static _flagsType = 0b001;
    protected static _fields: { [key: string]: Field } = {
        'onStart':      { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'gstEnable':    { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'profileIdLo':  { fragments: [{ byte: 3, offset: 0, width: 4, srcOffset: 0 }], valueType: Number, readOnly: false },
        'profileIdHi':  { fragments: [{ byte: 3, offset: 4, width: 2, srcOffset: 0 }, { byte: 4, offset: 0, width: 2, srcOffset: 2 }], valueType: Number, readOnly: false },
        'isRandom':     { fragments: [{ byte: 4, offset: 2, width: 1, srcOffset: 0 }], valueType: Boolean, readOnly: false },
        'attack':       { fragments: [{ byte: 4, offset: 3, width: 3, srcOffset: 0 }], valueType: Time, default: Time.TIME_480_MS, readOnly: false },
        'sustain':      { fragments: [{ byte: 5, offset: 0, width: 3, srcOffset: 0 }], valueType: Time, default: Time.TIME_480_MS, readOnly: false },
        'release':      { fragments: [{ byte: 5, offset: 3, width: 3, srcOffset: 0 }], valueType: Time, default: Time.TIME_480_MS, readOnly: false },
    };

    protected _validateFields(): void {
        if (this._fieldValues['onStart']) {
            if (!this._fieldValues['gstEnable']) {
                throw new Error("If onStart is true, gstEnable must also be true");
            }
        }
    }
}

class CommandSetColor extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 0;
    protected static _fields: { [key: string]: Field } = {
        'onStart':      { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable':    { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'green':        { fragments: [{ byte: 3, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'red':          { fragments: [{ byte: 4, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'blue':         { fragments: [{ byte: 5, offset: 0, width: 6, srcOffset: 2 }], valueType: Number, readOnly: false },
        'profileId':    { fragments: [{ byte: 6, offset: 0, width: 4, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
        'isBackground': { fragments: [{ byte: 6, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'skipDisplay':  { fragments: [{ byte: 6, offset: 5, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'groupId':      { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };
}

class CommandSetGroupSel extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 1;
    protected static _fields: { [key: string]: Field } = {
        'onStart':     { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable':   { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'green':       { fragments: [{ byte: 3, offset: 0, width: 4, srcOffset: 4 }], valueType: Number, default: 0, readOnly: false },
        'red':         { fragments: [{ byte: 3, offset: 4, width: 2, srcOffset: 4 }, { byte: 4, offset: 0, width: 2, srcOffset: 6 }], valueType: Number, default: 0, readOnly: false },
        'blue':        { fragments: [{ byte: 4, offset: 2, width: 4, srcOffset: 4 }], valueType: Number, default: 0, readOnly: false },
        'groupSel':    { fragments: [{ byte: 5, offset: 0, width: 3, srcOffset: 0 }], valueType: Number, readOnly: false },
        'skipDisplay': { fragments: [{ byte: 6, offset: 5, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'groupId':     { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };
}

class CommandSetGroupId extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 2;
    protected static _fields: { [key: string]: Field } = {
        'onStart':     { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable':   { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'green':       { fragments: [{ byte: 3, offset: 0, width: 4, srcOffset: 4 }], valueType: Number, default: 0, readOnly: false },
        'red':         { fragments: [{ byte: 3, offset: 4, width: 2, srcOffset: 4 }, { byte: 4, offset: 0, width: 2, srcOffset: 6 }], valueType: Number, default: 0, readOnly: false },
        'blue':        { fragments: [{ byte: 4, offset: 2, width: 4, srcOffset: 4 }], valueType: Number, default: 0, readOnly: false },
        'groupSel':    { fragments: [{ byte: 5, offset: 0, width: 3, srcOffset: 0 }], valueType: Number, readOnly: false },
        'newGroupId':  { fragments: [{ byte: 6, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, readOnly: false },
        'skipDisplay': { fragments: [{ byte: 6, offset: 5, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'groupId':     { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };

    protected _validateFields(): void {
        if (this._fieldValues['newGroupId'] <= 0) {
            throw new Error("New Group ID needs to be 1 or higher");
        }
    }
}

class CommandSetRepeatDelayTime extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 7;
    protected static _fields: { [key: string]: Field } = {
        'onStart':     { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable':   { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'repeatDelay': { fragments: [{ byte: 6, offset: 0, width: 3, srcOffset: 0 }], valueType: Time, readOnly: false },
        'groupId':     { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };
}

class CommandSetRepeatCount extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 8;
    protected static _fields: { [key: string]: Field } = {
        'onStart':     { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable':   { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'repeatCount': { fragments: [{ byte: 5, offset: 0, width: 6, srcOffset: 0 }, { byte: 6, offset: 0, width: 2, srcOffset: 6 }], valueType: Number, readOnly: false },
        'groupId':     { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };

    protected _validateFields(): void {
        if (this._fieldValues['repeatCount'] > 255) {
            throw new Error("Repeat count must be 255 or less");
        }
    }
}

class CommandSetGlobalSustainTime extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 9;
    protected static _fields: { [key: string]: Field } = {
        'onStart':       { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable':     { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'globalSustain': { fragments: [{ byte: 4, offset: 0, width: 3, srcOffset: 0 }], valueType: GlobalSustainTime, readOnly: false },
        'groupId':       { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };
}

class CommandSetOffReset extends Command {
    protected static _numBytes = 9;
    protected static _flagsType = 0b111;
    protected static _actionId = 15;
    protected static _fields: { [key: string]: Field } = {
        'onStart':   { fragments: [{ byte: 2, offset: 0, width: 1, srcOffset: 0 }], valueType: Boolean, default: true, readOnly: true },
        'gstEnable': { fragments: [{ byte: 2, offset: 4, width: 1, srcOffset: 0 }], valueType: Boolean, default: false, readOnly: false },
        'nreset':    { fragments: [{ byte: 6, offset: 5, width: 1, srcOffset: 0 }], valueType: Boolean, readOnly: false },
        'groupId':   { fragments: [{ byte: 8, offset: 0, width: 5, srcOffset: 0 }], valueType: Number, default: 0, readOnly: false },
    };
}

// Export all classes and enums
export {
    GlobalSustainTime,
    FieldTypeException,
    FieldKeyException,
    FieldReadOnlyException,
    CommandDecodeException,
    GenericCommand,
    Command,
    CommandSingleColor,
    CommandSingleColorExt,
    CommandTwoColors,
    CommandSetConfig,
    CommandSetColor,
    CommandSetGroupSel,
    CommandSetGroupId,
    CommandSetRepeatDelayTime,
    CommandSetRepeatCount,
    CommandSetGlobalSustainTime,
    CommandSetOffReset
};