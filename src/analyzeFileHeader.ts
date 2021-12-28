/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { btypes } from './blockTypes';
import { readBytes64 } from './utilities';
// Custom Types
export interface AppVersion {
  [key: string]: number;
}
export interface ParsedHeader {
  signature: number;
  version: number;
  size: number;
  flags: number;
  uuid: string;
  unused0: number;
  unused1: number;
  ntracks: number;
  status: number;
  npoints: number;
  nspectra: number;
  ncollected: number;
  naccum: number;
  ylistcount: number;
  xlistcount: number;
  origincount: number;
  appname: string;
  appversion: AppVersion;
  scantype: number;
  type: number;
  timeStart: number;
  timeEnd: number;
  units: number;
  laserwavenum: number;
  spare: number[];
  user: string;
  title: string;
  padding: number[];
  free: number[];
  reserved: number[];
}

// Utils
/**
 * Build the semantic versioning
 * @param {IOBuffer} buffer WDF buffer
 * @return {AppVersion} Object containing WDF semantic versioning
 */
function appVersion(buffer: IOBuffer): AppVersion {
const [major,minor,patch,build] = new Uint16Array(buffer.readBytes(8));
return { major, minor, patch, build }
}

/**
 * Universal identifier (as a string) for the file
 * @param {IOBuffer} buffer WDF buffer
 * @return {string} uuid as a string
 */
function uuid(buffer: IOBuffer): string {
let version = new Uint32Array(buffer.readBytes(16))
return version.join('.')
}

/**
 * Main buffer parsing - First 512 bytes
 * @param {IOBuffer} buffer WDF buffer
 * @return {object} File Metadata
 */
export function analyzeFileHeader(buffer: IOBuffer): ParsedHeader {
  let parsedHeader: { [key: string]: any } = {};
  parsedHeader.signature = btypes(buffer.readUint32()); /* block id */
  parsedHeader.version =
    buffer.readUint32(); /* The version of this (wdf) specification used by this file. */
  parsedHeader.size = Number(
    buffer.readBigUint64()
  ); /* The size of this block (512bytes)*/
  parsedHeader.flags = Number(
    buffer.readBigUint64()
  ); /* flags from the Wdf flags enumeration */
  parsedHeader.uuid =
    uuid(buffer); /* a file unique identifier - never changed once allocated */
  parsedHeader.unused0 = Number(buffer.readBigUint64());
  parsedHeader.unused1 = buffer.readUint32();
  parsedHeader.ntracks =
    buffer.readUint32(); /* if WdfXYXY flag is set - contains the number of tracks used */
  parsedHeader.status = buffer.readUint32(); /* file status word (error code) */
  parsedHeader.npoints =
    buffer.readUint32(); /* number of points per spectrum */
  parsedHeader.nspectra = Number(
    buffer.readBigUint64(),
  ); /* number of actual spectra (capacity) */
  parsedHeader.ncollected = Number(
    buffer.readBigUint64(),
  ); /* number of spectra written into the file (count) */
  parsedHeader.naccum =
    buffer.readUint32(); /* number of accumulations per spectrum */
  parsedHeader.ylistcount =
    buffer.readUint32(); /* number of elements in the y-list (>1 for image) */
  parsedHeader.xlistcount =
    buffer.readUint32(); /* number of elements for the x-list */
  parsedHeader.origincount =
    buffer.readUint32(); /* number of data origin lists */
  parsedHeader.appname = buffer
    .readUtf8(24)
    .replace(/\x00/g, ''); /* application name (utf-8 encoded) */
  parsedHeader.appversion =
    appVersion(buffer); /* application version (major,minor,patch,build) */
  parsedHeader.scantype =
    buffer.readUint32(); /* scan type - WdfScanType enum  */
  parsedHeader.type =
    buffer.readUint32(); /* measurement type - WdfType enum  */
  parsedHeader.timeStart = Number(
    buffer.readBigUint64(),
  ); /* collection start time as FILETIME */
  parsedHeader.timeEnd = Number(
    buffer.readBigUint64(),
  ); /* collection end time as FILETIME */
  parsedHeader.units =
    buffer.readUint32(); /* spectral data units (one of WdfDataUnits) */
  parsedHeader.laserwavenum = buffer.readFloat32(); /* laser wavenumber */
  parsedHeader.spare = readBytes64(buffer, 6);
  parsedHeader.user = buffer
    .readUtf8(32)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  parsedHeader.title = buffer
    .readUtf8(160)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  parsedHeader.padding = readBytes64(
    buffer, 6); /*padded to 512 bytes*/
  parsedHeader.free = readBytes64(
    buffer, 4); /*available for third party use */
  parsedHeader.reserved = readBytes64(
    buffer, 4); /*reserved for internal use by WiRE */
  return parsedHeader as ParsedHeader;
}
