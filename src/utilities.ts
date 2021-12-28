import { IOBuffer } from 'iobuffer';
import { IntArraySupportOption } from 'prettier';

export type ReadBytes64 = (
  buffer: IOBuffer,
  nGroups: number,
  typedArrayConstructor:BigInt64ArrayConstructor|BigUint64ArrayConstructor,
) => number[];
/**
 * Reads n groups of bytes of certain length
 * @param {IOBuffer} buffer WDF buffer
 * @param {number} nGroups number of bytes
 * @param {TypedArrayConstructor} tArrayConstructor type of the constructor for the new array.
 * @return {number[]} array of X-bit bytes.
 */
export const readBytes64: ReadBytes64 = (buffer, nGroups, tArrayConstructor) => {
  if (nGroups === 0) {
    throw new Error('nGroups has to be different from 0');
  }
  let groupsOf64:number[]=[];
  switch(tArrayConstructor){
    case BigInt64Array:
      for (let i=0; i<nGroups;i++){
        groupsOf64.push(Number(buffer.readBigInt64()));
      }
      return groupsOf64
    case BigUint64Array:
      for (let i=0; i<nGroups;i++){
        groupsOf64.push(Number(buffer.readBigUint64()));
      }
      return groupsOf64;
      default:
        throw new Error(`${tArrayConstructor} is not a valid argument.`)
}
}