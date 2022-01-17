import { IOBuffer } from 'iobuffer';

import {getBlockTypes, getUUId } from './maps';

export interface BlockHeader {
  uuid: string;
  /** block identity */
  blockType: string;
  /** block size including header (16B) in bytes */
  blockSize: number;
  /** unique id block. uuid=0 -> unique block with this type */
}

/**
 * Block Header Parsing - Block's first 16 bytes
 * @param buffer WDF buffer
 * @param [offset] byte number where to start reading | uses current offset
 * @return blockHeader Block metadata
 */
export function readBlockHeader(
  buffer: IOBuffer,
  offset?: number,
): BlockHeader {
  /*an offset can be assigned manually if desired*/
  if (offset) buffer.offset = offset;

  const blockType: string = getBlockTypes(buffer.readUint32());
  const uuid: string = getUUId(buffer.readBytes(4));
  const blockSize = Number(buffer.readBigUint64()); // Bytes
  /* assign with appropriate type */
  return { blockType, uuid, blockSize }
}
