/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import {
  getBlockTypes,
  BlockTypes,
  getMeasurementUnits,
  MeasurementUnits,
  getOverallSpectraDescription,
  OverallSpectraDescription,
  getScanType,
  ScanType,
  getAppVersion,
  getWdfFlags,
  WdfFlags,
  windowsTimeToMs,
} from './maps';
import { readBytes64 } from './utilities';

/**
 * File Header structure
 * it is the first 512B of the file
 */
export interface FileHeader {
  /** used to check whether this is WDF format, if not it errors out */
  signature: 'WDF_BLOCKID_FILE';
  /** Version of WDF specification used by this file. */
  version: number;
  /** Size of file header block (512B) */
  fileHeaderSize: number;
  /** Flags raised in the experiment */
  flags: WdfFlags;
  /** file unique identifier */
  uuid: string;
  unused0: number;
  unused1: number;
  /** if flags.xyxy is true - contains the number of tracks used */
  nTracks: number;
  /** file status word (error code) */
  status: number;
  /** number of points -data values- per spectra */
  nPoints: number;
  /** number of actual spectra (capacity) */
  nSpectra: number;
  /** number of spectra written into the file (count) */
  nCollected: number;
  /** number of accumulations per spectrum */
  nAccum: number;
  /** number of elements in the y-list (>1 for image) */
  yListCount: number;
  /** number of elements (points) for the x-axis (xlist) */
  xListCount: number;
  /** number of data origin lists */
  originCount: number;
  /** application name (utf-8 encoded) */
  appName: string;
  /** application version (major,minor,patch,build) */
  appVersion: { minor: number; major: number; patch: number; build: number };
  /** scan type - WdfScanType enum  */
  scanType: ScanType;
  /** measurement type - WdfType enum  */
  type: OverallSpectraDescription;
  /** collection start time as milliseconds since Epoch */
  timeStart: number;
  /** collection end time as milliseconds since Epoch */
  timeEnd: number;
  /** spectral data units (one of WdfDataUnits) */
  units: MeasurementUnits;
  /** laser wavenumber */
  laserWavenum: number;
  spare: number[];
  /** utf-8 encoded user name */
  user: string;
  /** utf-8 encoded title */
  title: string;
  /** padded to 512 bytes */
  padding: number[];
  /** available for third party use */
  free: number[];
  /** reserved for internal use by WiRE */
  reserved: number[];
}

/**
 * File Header parsing - First 512 bytes. The file header is the first block of the file
 * but it is different from the rest of the block headers. It has many more properties that
 * describe the file, and it is 512B long, as opposed to 16B.
 * @param buffer WDF buffer as IOBuffer i.e `new IOBuffer(file.wdf)`
 * @return File Metadata
 */
export function readFileHeader(buffer: IOBuffer): FileHeader {
  buffer.offset = 0;

  const signature: BlockTypes = getBlockTypes(buffer.readUint32());
  if (signature !== 'WDF_BLOCKID_FILE') {
    throw new Error(`expected WDF_BLOCKID_FILE, got ${signature}`);
  }
  const version: number = buffer.readUint32();
  if (version !== 1) {
    /* we may include try block for 2>version>1.0 */
    throw new Error(`Script parses version 1. Found v.${version}`);
  }
  const fileHeaderSize = Number(buffer.readBigUint64());
  const flags: WdfFlags = getWdfFlags(buffer.readBigUint64());
  const uuid: string = buffer.readArray(4, 'uint32').join('.');
  const unused0 = Number(buffer.readBigUint64());
  const unused1 = buffer.readUint32();
  const nTracks = buffer.readUint32();
  const status = buffer.readUint32();
  const nPoints = buffer.readUint32();
  const nSpectra = Number(buffer.readBigUint64());
  const nCollected = Number(buffer.readBigUint64());
  const nAccum = buffer.readUint32();
  const yListCount = buffer.readUint32();
  const xListCount = buffer.readUint32();
  const originCount = buffer.readUint32();
  const appName: string = buffer.readUtf8(24).replace(/\x00/g, '');
  const appVersion = getAppVersion(buffer.readArray(4, 'uint16'));
  const scanType: ScanType = getScanType(buffer.readUint32());
  const type: OverallSpectraDescription = getOverallSpectraDescription(
    buffer.readUint32(),
  );
  const timeStart = windowsTimeToMs(buffer.readBigUint64());
  const timeEnd = windowsTimeToMs(buffer.readBigUint64());
  const units: MeasurementUnits = getMeasurementUnits(buffer.readUint32());
  const laserWavenum = buffer.readFloat32();
  const spare: number[] = readBytes64(buffer, 6);
  const user: string = buffer.readUtf8(32).replace(/\x00/g, '');
  const title: string = buffer.readUtf8(160).replace(/\x00/g, '');
  const padding: number[] = readBytes64(buffer, 6);
  const free: number[] = readBytes64(buffer, 4);
  const reserved: number[] = readBytes64(buffer, 4);
  const fileHeader: FileHeader = {
    title,
    type,
    units,
    nSpectra,
    nPoints,
    scanType,
    laserWavenum,
    yListCount,
    xListCount,
    nCollected,
    nAccum,
    originCount,
    flags,
    nTracks,
    status,
    user,
    timeStart,
    timeEnd,
    signature,
    appName,
    appVersion,
    version,
    fileHeaderSize,
    uuid,
    spare,
    unused0,
    unused1,
    padding,
    free,
    reserved,
  };
  return fileHeader;
}
