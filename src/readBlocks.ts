/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { btypes } from './blockTypes';
import { getUUId } from './utilities';

export interface BlockHeader {
  blockType: string;
  blockSize: number;
  uuid: string;
}
export type BlockBody = Float32Array | Uint32Array | void; //temporary type.
export interface Block {
  blockHeader: BlockHeader;
  blockBody: BlockBody;
}

/**
 * Block Header Parsing - Block's first 16 bytes
 * @param buffer WDF buffer
 * @return blockHeader Block metadata
 */
export function readBlockHeader(buffer: IOBuffer): BlockHeader {

  /* read properties */
  const blockType: string = btypes(buffer.readUint32());
  const uuid: string = getUUId(buffer); //block have uuid=0 when they are unique in their type.
  const blockSize = Number(buffer.readBigUint64()); /* in bytes */
 console.log(blockType)
  /* assign with appropriate type */
  return { blockType, uuid, blockSize } as BlockHeader;
}

/**
 * Parses Block body according to the specific block type
 * @param buffer WDF buffer
 * @param blockHeader size of the whole block (body+header)
 * @return array of datapoints and current buffer offset
 */
export function readBlockBody(
 /* data in the order in which was collected in */
  buffer: IOBuffer,
  blockHeader: BlockHeader,
): BlockBody {
  const { blockSize, blockType } = blockHeader;
  const headerSize = 16;
  const bodySize = blockSize - headerSize;

  const getBytes: Uint8Array = buffer.readBytes(bodySize);

  switch (blockType) {
    case 'WDF_BLOCKID_DATA':
      /* 32 bit little endian IEEE floating point values. 
	  The number of floating point values is equal to the 
	  product of the file header items nspectra and npoints 
	  */
      const dataPoints: Float32Array = new Float32Array(getBytes);
      return dataPoints;
    case 'WDF_BLOCKID_XLIST':
	    const typeAndUnits = buffer.readBytes(8)
            console.log(new Uint32Array(typeAndUnits))
      return (new Uint32Array(typeAndUnits))
    case 'WDF_BLOCKID_YLIST':
      return;
    default:
      return;
  }
}

/**
 * Parses all the Blocks in the file
 * @param buffer WDF buffer
 * @return array of objects storing {blockHeader, blockBody} for each block
 */
export function readAllBlocks(buffer: IOBuffer): Block[] {
  let blocks: Block[] = [];
  while (buffer.length > buffer.offset) {
    const blockHeader = readBlockHeader(buffer);
    const blockBody = readBlockBody(buffer, blockHeader);
    blocks.push({ blockHeader, blockBody });
  }
  return blocks;
}
