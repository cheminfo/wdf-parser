import {IOBuffer} from 'iobuffer';


/**
 * My module
 * @returns A very important number
 */

export function analyzeFileHeader(header: IOBuffer):object {
  /**
   * Main header parsing - First 512 bytes
   * @param {object} buffer WDF buffer
   * @return {object} Main header
   */
  const signature = <number>header.readUint32(); //typeId for block header
  const version = <number>header.readUint32(); //version if it's file header, uid otherwise
  const size = <number>Number(header.readBigUint64()); //512bytes for file header.
  return {signature, version, size};
}

export function parse(data: Buffer | ArrayBuffer): object {
  const iobuffer = new IOBuffer(data);
  const fileHeader = analyzeFileHeader(iobuffer)
  return fileHeader;
}
