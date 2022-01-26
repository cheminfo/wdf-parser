/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { OverallSpectraDescription } from './maps';

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
 * @param type Describing the what kind of spectral data we have. See
 * [[`OverallSpectraDescription`]].
 * @return void for sane file | throws an error with a list of missing blocks
 */
export function isCorrupted(
  blockTypes: string[],
  type: OverallSpectraDescription,
): void {
  /*
   standard blocks which must be available in any wdf file
   they **do not** necessarily appear in a specific order or position
   in wdf file
*/
  let standardBlocks: string[] = [
    'WDF_BLOCKID_DATA',
    'WDF_BLOCKID_YLIST',
    'WDF_BLOCKID_XLIST',
    'WDF_BLOCKID_ORIGIN',
  ];

  // these must exist only for particular measurement type
  if (type === 'series' || type === 'map') {
    standardBlocks.push('WDF_BLOCKID_MAPAREA');
  }

  // here we store any missing block
  let notFound: string[] = [];

  // these blocks must exist
  standardBlocks.forEach((stb) => {
    if (!blockTypes.includes(stb)) notFound.push(stb);
  });

  if (notFound.length !== 0) {
    throw new Error(`File is corrupt. Missing blocks: ${notFound.join(' ,')}`);
  }
}
