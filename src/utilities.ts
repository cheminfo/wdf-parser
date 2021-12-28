import { IOBuffer } from 'iobuffer';

export type ReadBytes64 = (buffer: IOBuffer, nGroups: number) => number[];
/**
 * Reads n groups of bytes of certain length
 * @param {IOBuffer} buffer WDF buffer
 * @param {number} nGroups number of bytes
 * @return {number[]} array of X-bit bytes.
 */
export const readBytes64: ReadBytes64 = (buffer, nGroups) => {
  if (nGroups === 0) {
    throw new Error('nGroups has to be different from 0');
  }
  let groupsOf64: number[] = [];
  for (let i = 0; i < nGroups; i++) {
    groupsOf64.push(Number(buffer.readBigUint64()));
  }
  return groupsOf64;
};
