import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBlockHeader } from '../readBlockHeader';

describe('parse block header', () => {
  it('6x6', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const wdfBuffer = new IOBuffer(wdf);
    const result = readBlockHeader(wdfBuffer, 512);
    expect(result).toMatchObject({
      blockType: 'WDF_BLOCKID_DATA',
      blockSize: 146176,
      uuid: '0',
    });
    expect(Object.keys(result)).toHaveLength(3);
  });
});
