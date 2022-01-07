import { IOBuffer } from 'iobuffer';

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
 * Get descriptive unit from code
 * @param buffer WDF buffer
 * @param bytes number of bytes to read
 * @return uuid as a string
 */
export function getXListUnit(num: number): string {
  switch (num) {
    case 0:
      return 'arbitrary units';
    case 1:
      return 'Raman shift (cm-1)';
    case 2:
      return 'wavenumber (nm)';
    case 3:
      return '10-9 metres (nm)';
    case 4:
      return 'electron volts (eV)';
    case 5:
      return '10-6 metres (um)';
    case 6:
      return 'counts';
    case 7:
      return 'electrons';
    case 8:
      return '10-3 metres (mm)';
    case 9:
      return 'metres (m)';
    case 10:
      return 'Temperature (K)';
    case 11:
      return 'Pascals (Pa)';
    case 12:
      return 'seconds (s)';
    case 13:
      return 'milliseconds (ms)';
    case 14:
      return 'Hours (hs)';
    case 15:
      return 'Days (ds)';
    case 16:
      return 'Pixels';
    case 17:
      return 'Intensity';
    case 18:
      return 'Relative Intensity';
    case 19:
      return 'Degrees';
    case 20:
      return 'Temperature (C)';
    case 21:
      return 'Temperature (F)';
    case 22:
      return 'Kelvin per minute';
    case 23:
      return 'Filetime as Windows FileTime';
    case 24:
      return 'Endmarker';
    default:
      return `Unexpected value for num:${num}`;
  }
}

/**
 * Gets the parameter in each bit of the flag
 * @param flag First byte of the main header
 * @returns The parameters
 */
export interface FlagParameters { [key: string]: boolean }
export function getFlagParameters(flag: number): FlagParameters {
  const xyxy = (flag & 1) !== 0; //
  const checkSum = (flag & 2) !== 0; //
  const cosmicRayRemoval = (flag & 4) !== 0; //
  const multitrack = (flag & 8) !== 0; //
  const saturation = (flag & 16) !== 0; //
  const fileBackup = (flag & 32) !== 0; //
  const temporary = (flag & 64) !== 0; //
  const slice = (flag & 128) !== 0; //
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
 * Descriptive name for measurement type
 * @param type from the fileheader
 * @returns semantic type
 */
export type MeasurementType = 'unspecified' | 'single' | 'series' | 'map';
export function getMeasurementType(type: number): MeasurementType {
  switch (type) {
    case 0:
      return 'unspecified';
    case 1:
      return 'single'; /** file contains a single spectrum */
    case 2:
      return 'series'; /**< file contains multiple spectra with one common data origin (time, depth, temperature etc) */
    case 3:
      return 'map'; /**< file contains multiple spectra with more that one common data origin. Typically area maps use X and Y spatial origins. Volume maps use X, Y and Z. The WMAP block normally defines the physical region.obeys the maparea object. check scan type for streamline, linefocus, etc. */
    default:
      throw new Error(`Expected: 0,1,2 or 3. Got ${type}`);
  }
}

export function getXListType(XList: number): string {
  switch (XList) {
    case 0:
      return 'arbitrary'; /**< arbitrary type */
    case 1:
      return 'spectral'; /*deprecated*/
    case 2:
      return 'Intensity'; /**< arbitrary type */
    case 3:
      return 'X position'; /**< arbitrary type */
    case 4:
      return 'Y axis position'; /**< arbitrary type */
    case 5:
      return 'Z axis (vertical) position'; /**< arbitrary type */
    case 6:
      return 'R axis (rotary) position';
    case 7:
      return 'Theta angle (rotary) position';
    case 8:
      return 'phi angle (rotary) position';
    case 9:
      return 'Temperature';
    case 10:
      return 'Pressure';
    case 11:
      return 'Time';
    case 12:
      return 'Derived';
    case 13:
      return 'Polarization';
    case 14:
      return 'Focus Track Z position';
    case 15:
      return 'Temperature Ramp rate';
    case 16:
      return 'Spectrum Data Checksum';
    case 17:
      return 'Bit Flags';
    case 18:
      return 'Elapsed Time Intervals';
    case 19:
      return 'Frequency';
    case 20:
      return 'Microplate Well Spatial X';
    case 21:
      return 'Microplate Well Spatial Y';
    case 22:
      return 'Location Index';
    case 23:
      return 'Well Reference';
    case 24:
      return 'End Marker';
    default:
      throw new Error(`Unexpected XList value: ${XList}`);
  }
}

/** 
* Checks whether the wdf file is corrupted.
* @param blockTypes all the blocks found in file (excluding file header)
* @return void for sane file | throws an error with a list of missing blocks 
*/
export function isCorrupted(blockTypes:string[], measurementType:string):void{
/* 
   standard blocks which must be available in any wdf file 
   they **do not** necessarily appear in a specific order or position
   in wdf file
*/
const standardBlocks:string[] = [
      'WDF_BLOCKID_DATA',
      'WDF_BLOCKID_YLIST',
      'WDF_BLOCKID_XLIST',
      'WDF_BLOCKID_ORIGIN'
]; 

// here we store any missing block
let notFound:string[] = [];

// these must exist
standardBlocks.forEach( (stb) => {
	if(!blockTypes.includes(stb)) notFound.push(stb)
})

// these must exist only for particular measurement type
const seriesIsNot = measurementType==='series' && !blockTypes.includes('series')
const mapIsNot = measurementType==='series' && !blockTypes.includes('series')
if(seriesIsNot) notFound.push('WDF_BLOCKID_MAPAREA');
if(mapIsNot) notFound.push('WDF_BLOCKID_MAPAREA');

if (notFound.length !== 0){
	throw new Error(`File is corrupt. Missing blocks: ${notFound}`)
}
}
