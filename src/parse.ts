import { IOBuffer } from 'iobuffer';

import { readAllBlocks, Block } from './readBlocks';
import { readFileHeader, FileHeader } from './readFileHeader';
/*
import { analyzeLogs, ParsedLogs } from './analyzeLogs';
*/

/**
 * wdf-parser takes a WDF input file as a buffer or array buffer
 * and retrieves an object storing all metadata, data and information from the
 * original "input.wdf" file.
 */

interface Wdf {
  fileHeader: FileHeader;
  blocks: Block[];
}
/**
 * Parses an WDF file
 *
 * @param data WDF file buffer
 * @return Object containing all the parsed information from the WDF file
 */
export function parse(data: Buffer | ArrayBuffer): Wdf {
  const iobuffer = new IOBuffer(data);
  const fileHeader = readFileHeader(iobuffer);
  const blocks = readAllBlocks(iobuffer, fileHeader);
  return { fileHeader, blocks };
}
