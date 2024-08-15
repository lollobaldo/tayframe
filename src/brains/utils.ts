export const normalizeToRange = (input: number, inputMin = 0, inputMax = 255, outputMin = 0, outputMax = 100): number => {
  // Clamp the input to the input range
  const clampedInput = Math.max(inputMin, Math.min(inputMax, input));

  // Calculate the input and output ranges
  const inputRange = inputMax - inputMin;
  const outputRange = outputMax - outputMin;

  // Normalize the input to a 0-1 range
  const normalizedInput = (clampedInput - inputMin) / inputRange;

  // Scale the normalized input to the output range and round to nearest integer
  return Math.round(normalizedInput * outputRange + outputMin);

}

// Print a byte to 2-character hex string
const byteToHexPadded = (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2);

export const hexToBytes = (hex: string) => {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substring(c, c + 2), 16));
  return bytes;
}

export const bytesToHexString = (byteArray: [number, number, number]) => {
    const bytes = byteArray.map(byteToHexPadded)
    return `#${bytes.join('')}`;
}

export const isIphone = () => ([
      'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
      'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document));
