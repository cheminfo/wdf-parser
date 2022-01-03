/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { btypes } from './blockTypes';
import { readBytes64, getUUId, getAppVersion, AppVersion } from './utilities';

export interface FileHeader {
  signature: string;
  version: number;
  fileHeaderSize: number;
  flags: number;
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
  type: number;
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
 * File Header parsing - First 512 bytes
 * @param buffer WDF buffer
 * @return File Metadata
 */
export function readFileHeader(buffer: IOBuffer): FileHeader {
  const signature: string = btypes(
    buffer.readUint32(),
  ); /* Block Id to check wether this is WDF format.*/
  const version =
    buffer.readUint32(); /* The version of WDF specification used by this file. */
  const fileHeaderSize = Number(
    buffer.readBigUint64(),
  ); /* The size of this file header block (512bytes)*/
  const flags = Number(
    buffer.readBigUint64(),
  ); /* flags from the Wdf flags enumeration */
  const uuid: string = getUUId(
    buffer,
    16,
  ); /* a file unique identifier - never changed once allocated */
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
  const appVersion: AppVersion =
    getAppVersion(buffer); /* application version (major,minor,patch,build) */
  const scanType = buffer.readUint32(); /* scan type - WdfScanType enum  */
  const type = buffer.readUint32(); /* measurement type - WdfType enum  */
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
