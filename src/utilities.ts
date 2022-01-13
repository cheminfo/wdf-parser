/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import {
  getMeasurementUnits,
  getListType,
  OverallSpectraDescription,
} from './maps';

export type ReadBytes64 = (buffer: IOBuffer, nGroups: number) => number[];

/**
 * Reads n groups of bytes of certain length
 * @param buffer WDF buffer
 * @param nGroups number of bytes
 * @return array of X-bit bytes.
 */
export const readBytes64: ReadBytes64 = (buffer, nGroups) => {
  if (nGroups === 0) {
    throw new Error('nGroups has to be different from 0');
  }
  let groupsOf64: number[] = [];
  for (let i = 0; i < nGroups; i++) {
    groupsOf64.push(Number(buffer.readBigUint64()));
  }
  return groupsOf64;
};

/**
 * Checks whether the wdf file is corrupted.
 * @param blockTypes all the blocks found in file (excluding file header)
 * @return void for sane file | throws an error with a list of missing blocks
 */
export function isCorrupted(
  blockTypes: string[],
  overallSpectraDescription: OverallSpectraDescription,
): void {
  /*
   standard blocks which must be available in any wdf file
   they **do not** necessarily appear in a specific order or position
   in wdf file
*/
  const standardBlocks: string[] = [
    'WDF_BLOCKID_DATA',
    'WDF_BLOCKID_YLIST',
    'WDF_BLOCKID_XLIST',
    'WDF_BLOCKID_ORIGIN',
  ];

  // here we store any missing block
  let notFound: string[] = [];

  /*
  almost no difference bw indexOf & includes
  https://262.ecma-international.org/6.0/#sec-string.prototype.includes
  */
  // these blocks must exist
  standardBlocks.forEach((stb) => {
    if (!blockTypes.includes(stb)) notFound.push(stb);
  });

  // these must exist only for particular measurement type
  const seriesIsNot =
    overallSpectraDescription === 'series' && !blockTypes.includes('series');
  const mapIsNot =
    overallSpectraDescription === 'series' && !blockTypes.includes('series');
  if (seriesIsNot) notFound.push('WDF_BLOCKID_MAPAREA');
  if (mapIsNot) notFound.push('WDF_BLOCKID_MAPAREA');

  if (notFound.length !== 0) {
    throw new Error(`File is corrupt. Missing blocks: ${notFound.join(' ,')}`);
  }
}
