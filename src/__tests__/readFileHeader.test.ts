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
      /* it is WDF file and not SPC or otherwise*/
      signature: 'WDF_BLOCKID_FILE',
      /*the version of the WDF used */
      version: 1,
      /* fixed in 512*/
      fileHeaderSize: 512,
      user: 'Raman',
      title: 'Simple mapping measurement 1',
      appName: 'WiRE',
      spare: [0, 0, 0, 0, 0, 0],
      /* number of actual spectra (capacity) */
      nSpectra: 36,
      /*number of spectra collected */
      nCollected: 36,
      /* > 1 means image */
      yListCount: 1,
      /* for variable measured in this experiment */
      xListCount: 1015,
      units: 'counts',
      /* error code. 0 is no error */
      status: 0,
      /* !=0 when flags.xyxy is set*/
      nTracks: 0,
      /* for single readout off the detector. Can be spectrum or image */
      scanType: 'WdfScanType_Static',
    });
    // test number of keys in result object;
    expect(Object.keys(result)).toHaveLength(30);
  });
});
