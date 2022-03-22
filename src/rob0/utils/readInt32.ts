export const readInt32 = (rawBytes: Uint8Array, offset: number): number => {
  return rawBytes[offset] | (rawBytes[offset + 1] << 8) | (rawBytes[offset + 2] << 16) | (rawBytes[offset + 3] << 24);
};
