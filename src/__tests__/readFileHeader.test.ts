import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readFileHeader } from '../readFileHeader';

describe('parse file header', () => {
  it('6x6', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const wdfBuffer = new IOBuffer(wdf);
    const result = readFileHeader(wdfBuffer);
    expect(result).toMatchObject({
      signature:
        'WDF_BLOCKID_FILE' /* it is WDF file and not SPC or otherwise*/,
      version: 1 /*the version of the WDF used */,
      fileHeaderSize: 512,
      user: 'Raman',
      title: 'Simple mapping measurement 1',
      appName: 'WiRE',
      spare: [0, 0, 0, 0, 0, 0],
      nSpectra: 36 //* number of actual spectra (capacity) */
      nCollected: 36 /*number of spectra collected */,
      yListCount: 1 /* > 1 means image */,
      units: 'counts' /* for variable measured in this experiment */,
      status: 0 /* no error */,
      nTracks: 0,
      scanType: 'WdfScanType_Static',
    });
    console.log(result.nSpectra);
    expect(Object.keys(result)).toHaveLength(30);
  });
});
