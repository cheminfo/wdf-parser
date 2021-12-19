import { IOBuffer } from 'iobuffer';

/**
 * My module
 * @returns A very important number
 */

export function calcAppVersion(header:IOBuffer):object{
const major = header.readUint16();
const minor = header.readUint16();
const patch = header.readUint16();
const build = header.readUint16();
return {major,minor,patch,build}
}
export function uuid(header:IOBuffer):string{
let id:number[]=[];
for(let i=0; i<4; i++){id.push(header.readUint32())};
return id.join('.')
}
export function analyzeFileHeader(header: IOBuffer): object {
  /**
   * Main header parsing - First 512 bytes
   * @param {object} buffer WDF buffer
   * @return {object} Main header
   */
  const parsedHeader:{[key:string]:any}={ }
  parsedHeader.signature = header.readUint32();/* Magic number to check that this is a WDF file (WDF_BLOCKID_FILE) */
  parsedHeader.version = header.readUint32();/* The version of this (wdf) specification used by this file. */
  parsedHeader.size = Number(header.readBigUint64());/* The size of this block (512bytes)*/
  parsedHeader.flags = Number(header.readBigUint64());/* flags from the Wdf flags enumeration */
  parsedHeader.uuid = uuid(header);/* a file unique identifier - never changed once allocated */
  parsedHeader.unused0 = Number(header.readBigUint64);
  parsedHeader.unused1 = Number(header.readBigUint32);
  parsedHeader.ntracks = header.skip(12).readUint32();/* if WdfXYXY flag is set - contains the number of tracks used */
  parsedHeader.status = header.readUint32();/* file status word (error code) */
 parsedHeader.npoints = header.readUint32();/* number of points per spectrum */
 parsedHeader.nspectra = Number(header.readBigUint64())/* number of actual spectra (capacity) */
 parsedHeader.ncollected = Number(header.readBigUint64())/* number of spectra written into the file (count) */
parsedHeader.naccum = header.readUint32();/* number of accumulations per spectrum */
parsedHeader.ylistcount = header.readUint32();/* number of elements in the y-list (>1 for image) */
parsedHeader.xlistcount = header.readUint32();/* number of elements for the x-list */
parsedHeader.origincount = header.readUint32();/* number of data origin lists */
parsedHeader.appname = header.readUtf8(24); /* application name (utf-8 encoded) */
parsedHeader.appversion = calcAppVersion(header);/* application version (major,minor,patch,build) */
parsedHeader.scantype = header.readUint32();/* scan type - WdfScanType enum  */
parsedHeader.type = header.readUint32()/* measurement type - WdfType enum  */
parsedHeader.time_start = Number(header.readBigUint64());/* collection start time as FILETIME */
parsedHeader.time_end = Number(header.readBigUint64());/* collection end time as FILETIME */
parsedHeader.units = header.readUint32();/* spectral data units (one of WdfDataUnits) */
parsedHeader.laserwavenum = header.readFloat32();/* laser wavenumber */
parsedHeader.spare = [];
for(let i=0; i<6; i++){
parsedHeader
.spare
.push(Number(header.readBigUint64()))
}
parsedHeader.user = header.readUtf8(32);/* utf-8 encoded user name */
parsedHeader.title = header.readUtf8(160);/* utf-8 encoded user name */
parsedHeader.padding = [];/*padded to 512 bytes*/
for(let i=0; i<6; i++){
parsedHeader
.free
.push(Number(header.readBigUint64()))
}
parsedHeader.free = [];/*available for third party use */
for(let i=0; i<4; i++){
parsedHeader
.free
.push(Number(header.readBigUint64()))
}
parsedHeader.reserved = [];/*reserved for internal use by WiRE */
for(let i=0; i<4; i++){
parsedHeader
.reserved
.push(Number(header.readBigUint64()))
}
return parsedHeader;
}

export function parse(data: Buffer | ArrayBuffer): object {
  const iobuffer = new IOBuffer(data);
  const fileHeader = analyzeFileHeader(iobuffer);
  return fileHeader;
}
