import { IOBuffer } from 'iobuffer';

/**
 * My module
 * @returns A very important number
 */

/**
 * Build the semantic versioning
 * @param {IOBuffer} buffer WDF buffer
 * @return {object} Object containing WDF semantic versioning
 */

function appVersion(buffer: IOBuffer): { [key: string]: number } {
  const major = buffer.readUint16();
  const minor = buffer.readUint16();
  const patch = buffer.readUint16();
  const build = buffer.readUint16();
  return { major, minor, patch, build };
}

/**
 * Universal identifier (as a string) for the file
 * @param {IOBuffer} buffer WDF buffer
 * @return {string} uuid as a string
 */
function uuid(buffer: IOBuffer): string {
  let id: number[] = [];
  for (let i = 0; i < 4; i++) {
    id.push(buffer.readUint32());
  }
  return id.join('.');
}

/**
 * Main buffer parsing - First 512 bytes
 * @param {IOBuffer} buffer WDF buffer
 * @return {object} File Metadata
 */
function analyzeFileHeader(buffer: IOBuffer): { [key: string]: any } {
  const parsedHeader: { [key: string]: any } = {};
  parsedHeader.signature =
    buffer.readUint32(); /* Magic number to check that this is a WDF file (WDF_BLOCKID_FILE) */
  parsedHeader.version =
    buffer.readUint32(); /* The version of this (wdf) specification used by this file. */
  parsedHeader.size = Number(
    buffer.readBigUint64(),
  ); /* The size of this block (512bytes)*/
  parsedHeader.flags = Number(
    buffer.readBigUint64(),
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
  parsedHeader.spare = [];
  for (let i = 0; i < 6; i++) {
    parsedHeader.spare.push(Number(buffer.readBigUint64()));
  }
  parsedHeader.user = buffer
    .readUtf8(32)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  parsedHeader.title = buffer
    .readUtf8(160)
    .replace(/\x00/g, ''); /* utf-8 encoded user name */
  parsedHeader.padding = []; /*padded to 512 bytes*/
  for (let i = 0; i < 6; i++) {
    parsedHeader.padding.push(Number(buffer.readBigUint64()));
  }
  parsedHeader.free = []; /*available for third party use */
  for (let i = 0; i < 4; i++) {
    parsedHeader.free.push(Number(buffer.readBigUint64()));
  }
  parsedHeader.reserved = []; /*reserved for internal use by WiRE */
  for (let i = 0; i < 4; i++) {
    parsedHeader.reserved.push(Number(buffer.readBigUint64()));
  }
  return parsedHeader;
}

/**
 * Parses an WDF file
 *
 * @param {IOBuffer} data WDF file buffer
 * @return {object} Object containing all the information from the WDF file
 */

export function parse(data: Buffer | ArrayBuffer): { [key: string]: any } {
  const iobuffer = new IOBuffer(data);
  const fileHeader = analyzeFileHeader(iobuffer);
  //console.log('Is the offset 512?', result.offset===512)
  return fileHeader;
}
