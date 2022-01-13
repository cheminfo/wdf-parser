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
      signature: 'Wdf_BLOCKID_FILE',
      /*the version of the WDF used */
      version: 1,
      /* fixed in 512*/
      fileHeaderSize: 512,
      user: 'Raman',
      title: 'Simple mapping measurement 1',
      appName: 'WiRE',
      /* number of actual spectra (capacity) */
      spare: [0, 0, 0, 0, 0, 0],
      /*number of spectra collected */
      nSpectra: 36,
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
      scanType: 'WdfScanType_Static',
    });
    console.log(result.originCount);
    // test number of keys in result object;
    expect(Object.keys(result)).toHaveLength(30);
  });
});
