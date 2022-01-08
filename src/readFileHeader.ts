/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { btypes } from './types';
import {
  readBytes64,
  getUUId,
  getMeasurementType,
  getAppVersion,
  getFlagParameters,
  AppVersion,
  FlagParameters,
  MeasurementType,
} from './utilities';

export interface FileHeader {
  signature: string;
  version: number;
  fileHeaderSize: number;
  flags: FlagParameters;
  uuid: string;
  unused0: number;
  unused1: number;
  nTracks: number;
  status: number;
  nPoints: number;
  nSpectra: number;
  nCollected: number;
  nAccum: number;
  yListCount: number;
  xListCount: number;
  originCount: number;
  appName: string;
  appVersion: AppVersion;
  scanType: number;
  type: MeasurementType;
  timeStart: number;
  timeEnd: number;
  units: number;
  laserWavenum: number;
  spare: number[];
  user: string;
  title: string;
  padding: number[];
  free: number[];
  reserved: number[];
}

/**
 * File Header parsing - First 512 bytes. The file header is the first block of the file
 * but it is different from the rest of the block headers. It has many more properties that
 * describe the file, and it is 512B long, as opposed to 16B.
 * @param buffer WDF buffer
 * @return File Metadata
 */
export function readFileHeader(buffer: IOBuffer): FileHeader {
  /* next we determine all the properties included in the file header */
  const signature: string = btypes(
    buffer.readUint32(),
  ); /* used to check whether this is WDF format. */
  const version: number = (function getVersion(version: number): number {
    if (version !== 1) {
      throw new Error(`Script parses version 1. Found v.${version}`);
    }
    return version;
  })(buffer.readUint32()); /* Version of WDF specification used by this file. */
  const fileHeaderSize = Number(
    buffer.readBigUint64(),
  ); /* Size of file header block (512B) */
  const flags: FlagParameters = getFlagParameters(
    Number(buffer.readBigUint64()),
  );
  /* flags from the WdfFlags enumeration */
  const uuid: string = getUUId(
    buffer.readBytes(16),
  ); /* file unique identifier */
  const unused0 = Number(buffer.readBigUint64());
  const unused1 = buffer.readUint32();
  const nTracks =
    buffer.readUint32(); /* if WdfXYXY flag is set - contains the number of tracks used */
  const status = buffer.readUint32(); /* file status word (error code) */
  const nPoints = buffer.readUint32(); /* number of points per spectrum */
  const nSpectra = Number(
    buffer.readBigUint64(),
  ); /* number of actual spectra (capacity) */
  const nCollected = Number(
    buffer.readBigUint64(),
  ); /* number of spectra written into the file (count) */
  const nAccum = buffer.readUint32(); /* number of accumulations per spectrum */
  const yListCount =
    buffer.readUint32(); /* number of elements in the y-list (>1 for image) */
  const xListCount =
    buffer.readUint32(); /* number of elements for the x-list */
  const originCount = buffer.readUint32(); /* number of data origin lists */
  const appName: string = buffer
    .readUtf8(24)
    .replace(/\x00/g, ''); /* application name (utf-8 encoded) */
  const appVersion: AppVersion = getAppVersion(
    buffer.readBytes(8),
  ); /* application version (major,minor,patch,build) */
  const scanType = buffer.readUint32(); /* scan type - WdfScanType enum  */
  const type: MeasurementType = getMeasurementType(
    buffer.readUint32(),
  ); /* measurement type - WdfType enum  */
  const timeStart = Number(
    buffer.readBigUint64(),
  ); /* collection start time as FILETIME */
  const timeEnd = Number(
    buffer.readBigUint64(),
  ); /* collection end time as FILETIME */
  const units =
    buffer.readUint32(); /* spectral data units (one of WdfDataUnits) */
  const laserWavenum = buffer.readFloat32(); /* laser wavenumber */
  const spare: number[] = readBytes64(buffer, 6);
  const user: string = buffer
    .readUtf8(32)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  const title: string = buffer
    .readUtf8(160)
    .replace(/\x00/g, ''); /* utf-8 encoded title */
  const padding: number[] = readBytes64(buffer, 6); /* padded to 512 bytes */
  const free: number[] = readBytes64(
    buffer,
    4,
  ); /*available for third party use */
  const reserved: number[] = readBytes64(
    buffer,
    4,
  ); /*reserved for internal use by WiRE */
  const fileHeader: FileHeader = {
    signature,
    version,
    fileHeaderSize,
    flags,
    uuid,
    unused0,
    unused1,
    nTracks,
    status,
    nPoints,
    nSpectra,
    nCollected,
    nAccum,
    yListCount,
    xListCount,
    originCount,
    appName,
    appVersion,
    scanType,
    type,
    timeStart,
    timeEnd,
    units,
    laserWavenum,
    spare,
    user,
    title,
    padding,
    free,
    reserved,
  };
  return fileHeader;
}
