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
      appName: 'WiRE',
      signature: 'WDF_BLOCKID_FILE',
      version: 1,
      fileHeaderSize: 512,
      spare: [0, 0, 0, 0, 0, 0],
      title: 'Simple mapping measurement 1',
      user: 'Raman',
    });
    expect(Object.keys(result)).toHaveLength(30);
  });
});
