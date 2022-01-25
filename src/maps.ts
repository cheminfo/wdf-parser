/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';
/** all these functions take a simple numeric input and
map it to a word or human readable output
@module maps
*/
/** wdf file is divided in blocks. Each blog has one of these types. */
export type BlockTypes =
  | 'WDF_BLOCKID_FILE'
  | 'WDF_BLOCKID_DATA'
  | 'WDF_BLOCKID_YLIST'
  | 'WDF_BLOCKID_XLIST'
  | 'WDF_BLOCKID_ORIGIN'
  | 'WDF_BLOCKID_COMMENT'
  | 'WDF_BLOCKID_WIREDATA'
  | 'WDF_BLOCKID_DATASETDATA'
  | 'WDF_BLOCKID_MEASUREMENT'
  | 'WDF_BLOCKID_CALIBRATION'
  | 'WDF_BLOCKID_INSTRUMENT'
  | 'WDF_BLOCKID_MAPAREA'
  | 'WDF_BLOCKID_WHITELIGHT'
  | 'WDF_BLOCKID_THUMBNAIL'
  | 'WDF_BLOCKID_MAP'
  | 'WDF_BLOCKID_CURVEFIT'
  | 'WDF_BLOCKID_COMPONENT'
  | 'WDF_BLOCKID_PCA'
  | 'WDF_BLOCKID_EM'
  | 'WDF_BLOCKID_ZELDAC'
  | 'WDF_BLOCKID_RESPONSECAL'
  | 'WDF_BLOCKID_CAP'
  | 'WDF_BLOCKID_PROCESSING'
  | 'WDF_BLOCKID_ANALYSIS'
  | 'WDF_BLOCKID_SPECTRUMLABELS'
  | 'WDF_BLOCKID_CHECKSUM'
  | 'WDF_BLOCKID_RXCALDATA'
  | 'WDF_BLOCKID_RXCALFIT'
  | 'WDF_BLOCKID_XCAL'
  | 'WDF_BLOCKID_SPECSEARCH'
  | 'WDF_BLOCKID_TEMPPROFILE'
  | 'WDF_BLOCKID_UNITCONVERT'
  | 'WDF_BLOCKID_ARPLATE'
  | 'WDF_BLOCKID_ELECSIGN'
  | 'WDF_BLOCKID_BKXLIST'
  | 'WDF_BLOCKID_AUXILARYDATA'
  | 'WDF_BLOCKID_CHANGELOG'
  | 'WDF_BLOCKID_SURFACE'
  | 'WDF_BLOCKID_ANY'
  | 'WDF_STREAM_IS_PSET'
  | 'WDF_STREAM_IS_CSTM';

/**
 * Maps numeric type for block-header or file-header to a semantic label (a name)
 * @export
 * @param blockId type code
 * @return Semantic label for block
 */
export function getBlockTypes(blockId: number): BlockTypes {
  switch (blockId) {
    case 0x31464457:
      return 'WDF_BLOCKID_FILE'; /** holds important file metadata */
    case 0x41544144:
      return 'WDF_BLOCKID_DATA'; /** all spectras, in 32b floating numbers */
    case 0x54534c59:
      return 'WDF_BLOCKID_YLIST'; /** holds values in case 2D images were taken.
    For spectra is a single value and is usually ignored */
    case 0x54534c58:
      return 'WDF_BLOCKID_XLIST'; /** nPoints unit values for x axis */
    case 0x4e47524f:
      return 'WDF_BLOCKID_ORIGIN'; /** hold a header and then sets, which are like subblocks */
    case 0x54584554:
      return 'WDF_BLOCKID_COMMENT';
    case 0x41445857:
      return 'WDF_BLOCKID_WIREDATA';
    case 0x42445857:
      return 'WDF_BLOCKID_DATASETDATA';
    case 0x4d445857:
      return 'WDF_BLOCKID_MEASUREMENT';
    case 0x53435857:
      return 'WDF_BLOCKID_CALIBRATION';
    case 0x53495857:
      return 'WDF_BLOCKID_INSTRUMENT';
    case 0x50414d57:
      return 'WDF_BLOCKID_MAPAREA';
    case 0x4c544857:
      return 'WDF_BLOCKID_WHITELIGHT';
    case 0x4c49414e:
      return 'WDF_BLOCKID_THUMBNAIL';
    case 0x2050414d:
      return 'WDF_BLOCKID_MAP';
    case 0x52414643:
      return 'WDF_BLOCKID_CURVEFIT';
    case 0x534c4344:
      return 'WDF_BLOCKID_COMPONENT';
    case 0x52414350:
      return 'WDF_BLOCKID_PCA';
    case 0x4552434d:
      return 'WDF_BLOCKID_EM';
    case 0x43444c5a:
      return 'WDF_BLOCKID_ZELDAC';
    case 0x4c414352:
      return 'WDF_BLOCKID_RESPONSECAL';
    case 0x20504143:
      return 'WDF_BLOCKID_CAP';
    case 0x50524157:
      return 'WDF_BLOCKID_PROCESSING';
    case 0x41524157:
      return 'WDF_BLOCKID_ANALYSIS';
    case 0x4c424c57:
      return 'WDF_BLOCKID_SPECTRUMLABELS';
    case 0x4b484357:
      return 'WDF_BLOCKID_CHECKSUM';
    case 0x44435852:
      return 'WDF_BLOCKID_RXCALDATA';
    case 0x46435852:
      return 'WDF_BLOCKID_RXCALFIT';
    case 0x4c414358:
      return 'WDF_BLOCKID_XCAL';
    case 0x48435253:
      return 'WDF_BLOCKID_SPECSEARCH';
    case 0x504d4554:
      return 'WDF_BLOCKID_TEMPPROFILE';
    case 0x56434e55:
      return 'WDF_BLOCKID_UNITCONVERT';
    case 0x52505241:
      return 'WDF_BLOCKID_ARPLATE';
    case 0x43454c45:
      return 'WDF_BLOCKID_ELECSIGN';
    case 0x4c584b42:
      return 'WDF_BLOCKID_BKXLIST';
    case 0x20585541:
      return 'WDF_BLOCKID_AUXILARYDATA';
    case 0x474c4843:
      return 'WDF_BLOCKID_CHANGELOG';
    case 0x46525553:
      return 'WDF_BLOCKID_SURFACE';
    case 0xffffffff:
      return 'WDF_BLOCKID_ANY';
    case 0x54455350:
      return 'WDF_STREAM_IS_PSET';
    case 0x4d545343:
      return 'WDF_STREAM_IS_CSTM';
    default:
      throw new Error(`blockId ${blockId} is not defined`);
  }
}

/* Unit that the measurement recorded by the instrument/system is supposed to be in */
export type MeasurementUnits =
  | 'arbitrary units'
  | 'Raman shift (cm-1)'
  | 'wavenumber (nm)'
  | '10-9 metres (nm)'
  | 'electron volts (eV)'
  | '10-6 metres (um)'
  | 'counts'
  | 'electrons'
  | '10-3 metres (mm)'
  | 'metres (m)'
  | 'Temperature (K)'
  | 'Pascals (Pa)'
  | 'seconds (s)'
  | 'milliseconds (ms)'
  | 'Hours (hs)'
  | 'Days (ds)'
  | 'Pixels'
  | 'Intensity'
  | 'Relative Intensity'
  | 'Degrees'
  | 'Temperature (C)'
  | 'Temperature (F)'
  | 'Kelvin per minute'
  | 'Filetime as Windows FileTime'
  | 'Endmarker';

/**
 * Get descriptive measurement-unit from code
 * @export
 * @param code
 * @return code mapped to human readable measurement data-unit
 */
export function getMeasurementUnits(code: number): MeasurementUnits {
  switch (code) {
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
      throw new Error(`Unexpected value for unit: ${code}`);
  }
}

/** Type of data the axis (X or Y) holds */
export type ListTypes =
  | 'arbitrary'
  | 'spectral'
  | 'Intensity'
  | 'X position'
  | 'Y axis position'
  | 'Z axis (vertical) position'
  | 'R axis (rotary) position'
  | 'Theta angle (rotary) position'
  | 'phi angle (rotary) position'
  | 'Temperature'
  | 'Pressure'
  | 'Time'
  | 'Derived'
  | 'Polarization'
  | 'Focus Track Z position'
  | 'Temperature Ramp rate'
  | 'Spectrum Data Checksum'
  | 'Bit Flags'
  | 'Elapsed Time Intervals'
  | 'Frequency'
  | 'Microplate Well Spatial X'
  | 'Microplate Well Spatial Y'
  | 'Location Index'
  | 'Well Reference'
  | 'End Marker';

/**
 * Get descriptive data-unit for an axis from code
 * @export
 * @param unit
 * @return unit to use in axis
 */
export function getListType(unit: number): ListTypes {
  switch (unit) {
    case 0:
      return 'arbitrary'; /**< arbitrary type */
    case 1:
      return 'spectral'; /*deprecated, use frequency*/
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
      throw new Error(`Unexpected List unit: ${unit}`);
  }
}

/**
 * Descriptive tag for spectra in file (unspecified, single,series, map)
 * @export
 * @param type from the fileheader
 * @returns semantic type
 */
export type OverallSpectraDescription =
  | 'unspecified'
  | 'single'
  | 'series'
  | 'map';
export function getOverallSpectraDescription(
  type: number,
): OverallSpectraDescription {
  switch (type) {
    case 0:
      return 'unspecified';
    case 1:
      return 'single'; /** file contains a single spectrum */
    case 2:
      return 'series'; /* file contains multiple spectra with one common data origin (time, depth, temperature etc) */
    case 3:
      return 'map'; /* file contains multiple spectra with more that one common data origin. Typically area maps use X and Y spatial origins. Volume maps use X, Y and Z. The WMAP block normally defines the physical region.obeys the maparea object. check scan type for streamline, linefocus, etc. */
    default:
      throw new Error(`Expected: 0,1,2 or 3. Got ${type}`);
  }
}

/* exporting all the types will give more information when hovering on
properties */
export type ScanType =
  | 'WdfScanType_Unspecified'
  | 'WdfScanType_Static'
  | 'WdfScanType_Continuous'
  | 'WdfScanType_StepRepeat'
  | 'WdfScanType_FilterScan'
  | 'WdfScanType_FilterImage'
  | 'WdfScanType_StreamLine'
  | 'WdfScanType_StreamLineHR'
  | 'WdfScanType_Point'
  | 'WdfScanType_MultitrackStitched'
  | 'WdfScanType_MultitrackDiscrete'
  | 'WdfScanType_LineFocusMapping';

/**
 *
 * Retrieves the name of the data collection method used (scan type)
 * @export
 * @param scanType the data collection method used
 * @return semantic scan type
 */
export function getScanType(scanType: number): ScanType {
  switch (scanType) {
    case 0x0000:
      return 'WdfScanType_Unspecified';
    /*< for data that does not represent a spectrum collected from a Renishaw system */
    case 0x0001:
      /*< for single readout off the detector. Can be spectrum or image */
      return 'WdfScanType_Static';
    case 0x0002:
      /*< for readouts using continuous extended scanning. Can be spectrum or image (unlikely; impossible for x axis readout) */
      return 'WdfScanType_Continuous';
    case 0x0003:
      /*< for multiple statics taken at slightly overlapping ranges, then 'stitched' together to a single extended spectrum. Can be spectrum or image (unlikely) */
      return 'WdfScanType_StepRepeat';
    case 0x0004:
      /*< filter image and filter scan both supported purely for historical reasons */
      return 'WdfScanType_FilterScan';
    case 0x0005:
      return 'WdfScanType_FilterImage';
    case 0x0006:
      /*< must be a WdfType_Map measurement */
      return 'WdfScanType_StreamLine';
    case 0x0007:
      /*< must be a WdfType_Map measurement */
      return 'WdfScanType_StreamLineHR';
    case 0x0008:
      /*< for scans performed with a point detector */
      return 'WdfScanType_Point';
    /* The values below for multitrack and linefocus are flags that can be ORed with the above integer values
     *  - multitrack discrete on fixed grating systems will only be static
     *  - multitrack discrete could, on a fibre-probe system, be continuous, stitched, or static
     *  - linefocusmapping similarly couild be continuous, stitched, or static, but at time of writing is static
     */
    case 0x0100:
      /*< result is not a multitrack file */
      return 'WdfScanType_MultitrackStitched';
    case 0x0200:
      /*< result is multitrack file (wdf header has multitrack flag set).*/
      return 'WdfScanType_MultitrackDiscrete';
    case 0x0400:
      /*< Could be Static, Continuous (not yet implemented, impossible for x axis readout), or StepAndRepeat (not yet implemented) */
      return 'WdfScanType_LineFocusMapping';
    default:
      throw new Error(`${scanType} is not in the set of possible values`);
  }
}

export interface WdfSpectrumFlags {
  /**< Saturation flag. Some part of the spectrum data was saturated */
  saturated: boolean;
  /**< Error flag. An error occurred while collecting this spectrum */
  error: boolean;
  /**< Cosmic ray flag. A cosmic ray was detected and accepted in software */
  cosmicRay: boolean;
  errorCode: number;
}
/** Analyzes the information in lower and high part of the 64B number.
Spectrum flags are details to be aware of when reading the spectra */
export function getWdfSpectrumFlags(
  lower: number,
  higher: number,
): WdfSpectrumFlags {
  return {
    saturated: (lower & 1) !== 0,
    error: (lower & 0b10) !== 0,
    cosmicRay: (lower & 0b100) !== 0,
    errorCode: higher >>> 31,
  } as WdfSpectrumFlags;
}

export interface AppVersion {
  major: number;
  minor: number;
  patch: number;
  build: number;
}

export interface FlagParameters {
  /** multiple X list and data block exist*/
  xyxy: boolean;
  /** checksum is enabled*/
  checkSum: boolean;
  /** hardware cosmic ray removal was enabled*/
  cosmicRayRemoval: boolean;
  /** separated X list for each spectrum */
  multitrack: boolean;
  /** saturated datasets exist*/
  saturation: boolean;
  /** a complete backup file has been created*/
  fileBackup: boolean;
  /** this is a temporary file set for Display Title else filename*/
  temporary: boolean;
  /** Indicates that file has been extracted from WdfVol file slice like X / Y / Z.*/
  slice: boolean;
}

/**
 * Gets the parameter in each bit of the flag.
 * These parameters specify a particular file property
 * @param flag First byte of the main header
 * @returns The parameters
 */
export function getFlagParameters(flag: number): FlagParameters {
  const xyxy = (flag & 1) !== 0;
  const checkSum = (flag & 2) !== 0;
  const cosmicRayRemoval = (flag & 4) !== 0;
  const multitrack = (flag & 8) !== 0;
  const saturation = (flag & 16) !== 0;
  const fileBackup = (flag & 32) !== 0;
  const temporary = (flag & 64) !== 0;
  const slice = (flag & 128) !== 0;
  return {
    xyxy,
    checkSum,
    cosmicRayRemoval,
    multitrack,
    saturation,
    fileBackup,
    temporary,
    slice,
  } as FlagParameters;
}

/**
 * Convert a Windows FILETIME to a Javascript Date
 * intervals since January 1, 1601 (UTC)
 * @export
 * @param fileTime - the number of 100ns in Windows Filetime
 * @returns Milliseconds since Epoch
 * from https://balrob.blogspot.com/2014/04/windows-filetime-to-javascript-date.html
 **/
export function windowsTimeToMs(fileTime: bigint) {
  return Number(fileTime) / 10000 - 11644473600000;
}

export interface HeaderOfSet {
  /** type i.e: Spectral, Spatial, T, P, Checksum, Time */
  type: string;
  /** Important Origin 1, Alternative Origin 0 */
  flag: 'important' | 'alternative';
  /** The units of the origin list values. i.e cm-1, nm, etc */
  unit: string;
  /** Identified for the block i.e X, Y, Cheksum */
  label: string;
  /** next properties depend on the label */
  /** Array, axis origin for every (all) spectrum. X,Y 'd be != origin blocks */
}

/**
 * Reads the header for each set in an origin block
 * @param buffer
 * @returns header of the set
 */
export function getHeaderOfSet(buffer: IOBuffer): HeaderOfSet {
  const typeAndFlag = buffer.readUint32();
  /* >>> because it is unsigned integer */
  const flag = typeAndFlag >>> 31 === 1 ? 'important' : 'alternative';
  const type = getListType(typeAndFlag & (2 ** 14 - 1));
  const unit = getMeasurementUnits(buffer.readUint32());
  const label = buffer.readChars(16).replace(/\x00/g, '');
  return { flag, type, unit, label };
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
 * Calculate the universal identifier (as a string) for files and blocks
 * @param buffer WDF buffer
 * @param Id values for Id in Uint8Array
 * @return uuid as a string
 */
export function getUUId(Id: Uint8Array): string {
  let version = new Uint32Array(Id.buffer);
  return version.join('.');
}
