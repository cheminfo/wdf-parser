import { IOBuffer } from 'iobuffer';

import { Block, readBlock } from './readBlock';
import { readFileHeader, FileHeader } from './readFileHeader';
import { isCorrupted } from './utilities';

/**
 * wdf-parser takes a WDF input file as a buffer or array buffer
 * and retrieves an object storing all metadata, data and information from the
 * original "input.wdf" file.
 * @module parse
 */

export interface Wdf {
  /** fileHeader header of the WdfFile */
  fileHeader: FileHeader;
  /** blocks Array of different data blocks (spectra, x coords,...) */
  blocks: Block[];
}

/**
 * Parses a .wdf Raman file and outputs all the parsed information
 *
 * @param data WDF file buffer
 * @return JSON Object containing all the parsed information from the WDF file
 */
export function parse(data: BinaryData): Wdf {
  const buffer = new IOBuffer(data);
  const fileHeader = readFileHeader(buffer);

  let blocks: Block[] = [];
  let blockHeaderTypes: string[] = [];

  while (buffer.offset < buffer.length) {
    const block = readBlock(buffer, fileHeader);
    blocks.push(block);
    blockHeaderTypes.push(block.blockType);
  }

  /* check if the block headers are complete */
  isCorrupted(blockHeaderTypes, fileHeader.type);

  return { fileHeader, blocks };
}
