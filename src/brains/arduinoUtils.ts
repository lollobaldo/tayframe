function bits_to_run_lengths_pulses(bit_list: number[]): number[] {
    let run_lengths = [];
    let currentCount = 0;
    let currentBit = null;

    for (let i = 0; i < bit_list.length; i++) {
        if (bit_list[i] !== currentBit) {
            if (currentBit !== null) {
                run_lengths.push(currentCount);
            }
            currentCount = 1;
            currentBit = bit_list[i];
        } else {
            currentCount++;
        }
    }
    
    if (currentBit !== null) {
        run_lengths.push(currentCount);
    }
    return run_lengths;
}

export function bits_to_arduino_string(bit_list: number[]) {
    const run_lengths = bits_to_run_lengths_pulses(bit_list);
    if (Math.max.apply(null, run_lengths) > 9) {
        throw new Error(`board can't accept over 9 of the same bit in a row.\n${bit_list}`);
    }

    return run_lengths;
}
