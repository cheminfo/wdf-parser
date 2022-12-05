import { IOBuffer } from 'iobuffer';

import { getBlockTypes } from './maps';

/** Structure for the 16B Block Header */
export interface BlockHeader {
  /** block identity */
  uuid: string;
  /** block size including header (16B) in bytes */
  blockType: string;
  /** unique id block. uuid=0 -> unique block with this type */
  blockSize: number;
}

/**
 * Block Header Parsing - Block's first 16 bytes
 * @param buffer Wdf as IOBuffer, i.e `new IOBuffer(file.wdf)`.
 * @param offset byte number where to start reading | uses current offset
 * @return blockHeader Block metadata
 */
export function readBlockHeader(
  buffer: IOBuffer,
  offset?: number,
): BlockHeader {
  /*an offset can be assigned manually if desired*/
  if (offset) buffer.offset = offset;

  const blockType: string = getBlockTypes(buffer.readUint32());
  const uuid: string = buffer.readUint32().toString(10);
  const blockSize = Number(buffer.readBigUint64()); // Bytes
  /* assign with appropriate type */
  return { blockType, uuid, blockSize };
}
