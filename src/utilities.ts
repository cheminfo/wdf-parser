/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { SubheaderOrigin } from './readBlocks';
import {
  getMeasurementUnits,
  getListType,
  OverallSpectraDescription,
} from './types';

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

export interface AppVersion {
  [key: string]: number;
}
/**
 * Build the semantic versioning
 * @param buffer WDF buffer
 * @return Object containing WDF semantic versioning
 */
export function getAppVersion(version: Uint8Array): AppVersion {
  const [major, minor, patch, build] = new Uint16Array(version.buffer);
  return { major, minor, patch, build };
}
/**
 * Universal identifier (as a string) for files and blocks
 * @param buffer WDF buffer
 * @param Id values for Id in Uint8Array
 * @return uuid as a string
 */
export function getUUId(Id: Uint8Array): string {
  let version = new Uint32Array(Id.buffer);
  return version.join('.');
}

/**
 * Gets the parameter in each bit of the flag
 * @param flag First byte of the main header
 * @returns The parameters
 */
export interface FlagParameters {
  [key: string]: boolean;
}
export function getFlagParameters(flag: number): FlagParameters {
  const xyxy = (flag & 1) !== 0; /*multiple X list and data block exist*/
  const checkSum = (flag & 2) !== 0; /*checksum is enabled*/
  const cosmicRayRemoval =
    (flag & 4) !== 0; /*hardware cosmic ray removal was enabled*/
  const multitrack = (flag & 8) !== 0; /* separated X list for each spectrum */
  const saturation = (flag & 16) !== 0; /* saturated datasets exist*/
  const fileBackup =
    (flag & 32) !== 0; /* a complete backup file has been created*/
  const temporary =
    (flag & 64) !==
    0; /* this is a temporary file set for Display Title else filename*/
  const slice =
    (flag & 128) !==
    0; /*Indicates that file has been extracted from WdfVol file slice like X / Y / Z.*/
  return {
    xyxy,
    checkSum,
    cosmicRayRemoval,
    multitrack,
    saturation,
    fileBackup,
    temporary,
    slice,
  };
}

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

/**
 * Convert a Windows FILETIME to a Javascript Date
 * intervals since January 1, 1601 (UTC)
 * @export
 * @param fileTime - the number of 100ns
 * @returns {Date}
 * from https://balrob.blogspot.com/2014/04/windows-filetime-to-javascript-date.html
 **/
export function fileTimeToDate(fileTime: bigint): Date {
  return new Date(Number(fileTime) / 10000 - 11644473600000);
}

export function subheaderOrigin(buffer: IOBuffer): SubheaderOrigin {
  const typeAndFlag = buffer.readUint32();
  /*not sure how to analyze flag yet */
  const flag = typeAndFlag.toString(2)[0] as '1' | '0';
  const type = getListType(parseInt(typeAndFlag.toString(2).slice(17), 2));
  const unit = getMeasurementUnits(buffer.readUint32());
  const label = buffer.readChars(16).replace(/\x00/g, '');
  return { flag, type, unit, label };
}
