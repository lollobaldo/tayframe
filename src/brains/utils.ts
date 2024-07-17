// Print a byte to 2-character hex string
const byteToHexPadded = (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2);

export const bytesToHexString = (byteArray: [number, number, number]) => {
    const bytes = byteArray.map(byteToHexPadded)
    return `#${bytes.join('')}`;
}