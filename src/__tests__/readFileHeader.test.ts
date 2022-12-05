import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readFileHeader, FileHeader } from '../readFileHeader';

describe('read file headers', () => {
  it('simple map', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const wdfBuffer = new IOBuffer(wdf);
    const result = readFileHeader(wdfBuffer);
    const expected: Partial<FileHeader> = {
      signature: 'WDF_BLOCKID_FILE',
      version: 1,
      fileHeaderSize: 512,
      user: 'Raman',
      title: 'Simple mapping measurement 1',
      appName: 'WiRE',
      spare: [0, 0, 0, 0, 0, 0],
      nSpectra: 36,
      nCollected: 36,
      yListCount: 1,
      xListCount: 1015,
      units: 'counts',
      status: 0,
      nTracks: 0,
      scanType: 'WdfScanType_Static',
      type: 'map',
      originCount: 5 /* Time, Flags, X, Y, Checksum, Header */,
    };
    expect(result).toMatchObject(expected);
    expect(Object.keys(result)).toHaveLength(30);
  });
  it('single scan', () => {
    const buffer = new IOBuffer(readFileSync(join(__dirname, 'data/sp.wdf')));
    const result = readFileHeader(buffer);
    expect(result).toMatchObject({
      title: 'Single scan measurement 1',
      type: 'single',
      units: 'counts',
      nSpectra: 1,
      nPoints: 1015,
      scanType: 'WdfScanType_Static',
      laserWavenum: 18788.16015625,
      yListCount: 1,
      xListCount: 1015,
      nCollected: 1,
      nAccum: 3,
      originCount: 3,
      status: 0,
      user: 'Nanonics',
      appVersion: { major: 4, minor: 1, patch: 0, build: 4308 },
    });
  });
  it('Not a WDF file', () => {
    const buffer = new IOBuffer(new Uint8Array([0x57, 0x44, 0x47, 0x31]));
    expect(() => readFileHeader(buffer)).toThrow('Not a WDF file');
  });
  it('Unsupported version', () => {
    const buffer = new IOBuffer(
      new Uint8Array([0x57, 0x44, 0x46, 0x31, 0x06, 0x00, 0x00, 0x00]),
    );
    expect(() => readFileHeader(buffer)).toThrow('Script parses version 1');
  });
});
