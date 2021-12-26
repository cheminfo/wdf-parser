import { IOBuffer } from 'iobuffer';

export type ReadGroupsOfBytes = (
  buffer: IOBuffer,
  nGroups: number,
  IOFn: string,
) => number[];
/**
 * Reads n groups of bytes (representing numbers) of certain length
 * @param {IOBuffer} buffer WDF buffer
 * @param {nGroups} number number of bytes
 * @param {IOFn} string name of IOBuffer static function for X-bits byte.
 * @return array of X-bit bytes.
 */
export const readGroupOfBytes: ReadGroupsOfBytes = (buffer, nGroups, IOFn) => {
  if (nGroups === 0) {
    throw new Error('nGroups has to be different from 0');
  }
  let groupOfBytes: number[] = [];
  switch (IOFn) {
    case 'readBigUint64':
    case 'readBigInt64':
      for (let i = 0; i < nGroups; i++) {
        groupOfBytes.push(Number(buffer[IOFn]()));
      }
      break;
    case 'readUint32':
    case 'readInt32':
    case 'readInt16':
    case 'readUint16':
      for (let i = 0; i < nGroups; i++) {
        groupOfBytes.push(buffer[IOFn]());
      }
      break;
    default:
      throw new Error(
        `${IOFn} not found. Only 64,32,16 bit functions are allowed.`,
      );
  }

  return groupOfBytes;
};
