/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { FileHeader } from './readFileHeader';
import { btypes, getMeasurementUnits, getListType } from './types';
import { getUUId, isCorrupted } from './utilities';

export interface BlockHeader {
  /** block identity */
  blockType: string;
  /** block size including header (16B) in bytes */
  blockSize: number;
  /** unique id for the block.
   uuid=0 --> only block with this type .
  */
  uuid: string;
}

export type BlockBody = DataBlock | ListBlock | []; //temporary type.
export interface Block {
  blockHeader: BlockHeader;
  blockBody: BlockBody;
}
export interface ListBlock {
  type: string;
  units: string;
  data: Float32Array;
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

  const blockType: string = btypes(buffer.readUint32());
  const uuid: string = getUUId(buffer.readBytes(4));
  const blockSize = Number(buffer.readBigUint64()); // Bytes

  /* assign with appropriate type */
  return { blockType, uuid, blockSize } as BlockHeader;
}

interface DataBlock {
  spectras: Float32Array[];
}
interface ListBlock {
  type: string;
  units: string;
  xList: Float32Array;
}

/**
 * Parses Block body according to the specific block type
 * @param buffer WDF buffer
 * @param fileHeader full file header | {nSpectra,nPoints}
 * @param blockHeader full block header | {blockSize,blockType}
 * @param offset Where the block's body starts | uses current buffer offset
 * @return array of datapoints and current buffer offset
 */
export function readBlockBody(
  buffer: IOBuffer,
  fileHeader: FileHeader | Pick<FileHeader, 'nSpectra' | 'nPoints'>,
  blockHeader: BlockHeader | Pick<BlockHeader, 'blockSize' | 'blockType'>,
  offset?: number,
): BlockBody {
  const { nSpectra, nPoints } = fileHeader;
  const { blockSize, blockType } = blockHeader;

  /*an offset can be assigned manually if desired*/
  if (offset) buffer.offset = offset;

  /*take some measurements*/
  const headerSize = 16;
  const bodySize = blockSize - headerSize; 

  /* using case a:{} scopes the variables */
  switch (blockType) {
    case 'WDF_BLOCKID_DATA': {
      let spectras32: Float32Array[] = [];
      for (let i = 0; i < nSpectra; i++) {
        const spectra8: Uint8Array = buffer.readBytes(4 * nPoints);
        spectras32.push(new Float32Array(spectra8.buffer));
      }
      return { spectras: spectras32 } as DataBlock;
    }

    case 'WDF_BLOCKID_XLIST': {
      const first8Bytes:Uint8Array = buffer.readBytes(8);
      const [type, units] = new Uint32Array(first8Bytes.buffer);

      // For the XList block, the number of floats is equal to npoints.
      const xAxisValues:Uint8Array = buffer.readBytes(4 * nPoints);
      return {
        type: getListType(type),
        units: getMeasurementUnits(units),
        xList: new Float32Array(xAxisValues.buffer),
      } as ListBlock;
    }
    case 'WDF_BLOCKID_YLIST':{
      const first8Bytes:Uint8Array = buffer.readBytes(8);
      const [type, units] = new Uint32Array(first8Bytes.buffer);
// the number of points is equal to (the block size - sizeof(WdfBlock) - sizeof(uint32_t) -sizeof(uint32_t)) / sizeof(float)
      const yAxisValues:Uint8Array = buffer.readBytes((bodySize-8));
      return {
        type: getListType(type),
        units: getMeasurementUnits(units),
	/* for spectra (no images) yList will be a single meaningless number*/
        yList: new Float32Array(yAxisValues.buffer),
      } as ListBlock;

    }

    default:
      buffer.readBytes(bodySize);
      return [];
  }
}

/**
 * Parses all the Blocks in the file
 * @param buffer WDF buffer
 * @param fileHeader fileHeader object | {nSpectra, nPoints}
 * @return array of objects storing {blockHeader, blockBody} for each block
 */
export function readAllBlocks(
  buffer: IOBuffer,
  fileHeader: FileHeader,
): Block[] {
  let blocks: Block[] = [];
  let blockHeaderTypes: string[] = [];
  while (buffer.length > buffer.offset) {
    const blockHeader = readBlockHeader(buffer);
    const blockBody = readBlockBody(buffer, fileHeader, blockHeader);
    blocks.push({ blockHeader, blockBody });
    blockHeaderTypes.push(blockHeader.blockType);
  }

  // check if the block headers are complete
  isCorrupted(blockHeaderTypes, fileHeader.type);

  return blocks;
}
