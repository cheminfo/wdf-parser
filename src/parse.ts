import type { InputData } from 'iobuffer';
import { IOBuffer } from 'iobuffer';

import type { Block } from './readBlock.ts';
import { readBlock } from './readBlock.ts';
import type { FileHeader } from './readFileHeader.ts';
import { readFileHeader } from './readFileHeader.ts';
import { isCorrupted } from './utilities.ts';

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
export function parse(data: InputData): Wdf {
  const buffer = new IOBuffer(data);
  const fileHeader = readFileHeader(buffer);

  const blocks: Block[] = [];
  const blockHeaderTypes: string[] = [];

  while (buffer.offset < buffer.length) {
    const block = readBlock(buffer, fileHeader);
    blocks.push(block);
    blockHeaderTypes.push(block.blockType);
  }

  /* check if the block headers are complete */
  isCorrupted(blockHeaderTypes, fileHeader.type);

  return { fileHeader, blocks };
}
