/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { btypes } from './blockTypes';
import { readBytes64 } from './utilities';

// Custom Types
export interface AppVersion {
  [key: string]: number;
}
export class ParsedHeader {
  signature: string;
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
 * @param buffer WDF buffer
 * @return Object containing WDF semantic versioning
 */
function appVersion(buffer: IOBuffer): AppVersion {
  const [major, minor, patch, build] = new Uint16Array(buffer.readBytes(8));
  return { major, minor, patch, build };
}

/**
 * Universal identifier (as a string) for the file
 * @param buffer WDF buffer
 * @return uuid as a string
 */
function uuid(buffer: IOBuffer): string {
  let version = new Uint32Array(buffer.readBytes(16));
  return version.join('.');
}

/**
 * Main buffer parsing - First 512 bytes
 * @param buffer WDF buffer
 * @return File Metadata
 */
export function analyzeFileHeader(buffer: IOBuffer): ParsedHeader {
  const signature:string = btypes(buffer.readUint32()); /* block id */
  const version:number =
    buffer.readUint32(); /* The version of this (wdf) specification used by this file. */
  const size:number = Number(
    buffer.readBigUint64(),
  ); /* The size of this block (512bytes)*/
  const flags:number = Number(
    buffer.readBigUint64(),
  ); /* flags from the Wdf flags enumeration */
  const uuid:string =
    uuid(buffer); /* a file unique identifier - never changed once allocated */
  const unused0:number = Number(buffer.readBigUint64());
  const unused1:number = buffer.readUint32();
  const ntracks:number =
    buffer.readUint32(); /* if WdfXYXY flag is set - contains the number of tracks used */
  const status:number = buffer.readUint32(); /* file status word (error code) */
  const npoints:number =
    buffer.readUint32(); /* number of points per spectrum */
  const nspectra:number = Number(
    buffer.readBigUint64()
  ); /* number of actual spectra (capacity) */
  const ncollected:number = Number(
    buffer.readBigUint64()
  ); /* number of spectra written into the file (count) */
  const naccum:number =
    buffer.readUint32(); /* number of accumulations per spectrum */
  const ylistcount:number =
    buffer.readUint32(); /* number of elements in the y-list (>1 for image) */
  const xlistcount:number =
    buffer.readUint32(); /* number of elements for the x-list */
  const origincount:number =
    buffer.readUint32(); /* number of data origin lists */
  const appname:string = buffer
    .readUtf8(24)
    .replace(/\x00/g, ''); /* application name (utf-8 encoded) */
  const appversion:AppVersion =
    appVersion(buffer); /* application version (major,minor,patch,build) */
  const scantype:number =
    buffer.readUint32(); /* scan type - WdfScanType enum  */
  const type:number =
    buffer.readUint32(); /* measurement type - WdfType enum  */
  const timeStart:number = Number(
    buffer.readBigUint64()
  ); /* collection start time as FILETIME */
  const timeEnd:number = Number(
    buffer.readBigUint64(),
  ); /* collection end time as FILETIME */
  const units:number =
    buffer.readUint32(); /* spectral data units (one of WdfDataUnits) */
  const laserwavenum:number = buffer.readFloat32(); /* laser wavenumber */
  const spare:number[] = readBytes64(buffer, 6);
  const user:string = buffer
    .readUtf8(32)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  const title:string = buffer
    .readUtf8(160)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  const padding:number[] = readBytes64(buffer, 6); /*padded to 512 bytes*/
  const free:number[] = readBytes64(buffer, 4); /*available for third party use */
  const reserved:number = readBytes64(
    buffer,
    4,
  ); /*reserved for internal use by WiRE */
  const parseHeader:ParseHeader={
  signature,
  version,
  size,
  flags,
  uuid,
  unused0,
  unused1,
  ntracks,
  status,
  npoints,
  nspectra,
  ncollected,
  naccum,
  ylistcount,
  xlistcount,
  origincount,
  appname,
  appversion,
  scantype,
  type,
  timeStart,
  timeEnd,
  units,
  laserwavenum,
  spare,
  user,
  title,
  padding,
  free,
  reserved }
  return parsedHeader;
}
