import { IOBuffer } from 'iobuffer';

import { analyzeFileHeader, ParsedHeader } from './analyzeFileHeader';
/*
import { analyzeBlocks, ParsedBlocks } from './analyzeBlocks';
import { analyzeLogs, ParsedLogs } from './analyzeLogs';
*/

/**
 * wdf-parser takes a WDF input file as a buffer or array buffer
 * and retrieves an object storing all metadata, data and information from the
 * original "input.wdf" file.
 */

interface Wdf {
  fileHeader: ParsedHeader;
  dataBlocks: undefined;
  logs: undefined;
}
/**
 * Parses an WDF file
 *
 * @param {IOBuffer} data WDF file buffer
 * @return {object} Object containing all the information from the WDF file
 */
export function parse(data: Buffer | ArrayBuffer): Wdf {
  const iobuffer = new IOBuffer(data);
  const fileHeader = analyzeFileHeader(iobuffer);
  const dataBlocks = undefined; // yet to write parser
  const logs = undefined; //yet to write parser
  return { fileHeader, dataBlocks, logs };
}
