import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { IOBuffer } from 'iobuffer';
import { expect, test } from 'vitest';

import { readBlockHeader } from '../readBlockHeader.ts';

test('6x6', () => {
  const wdf = readFileSync(join(import.meta.dirname, 'data/6x6.wdf'));
  const wdfBuffer = new IOBuffer(wdf);
  const result = readBlockHeader(wdfBuffer, 512);

  expect(result).toMatchObject({
    blockType: 'WDF_BLOCKID_DATA',
    blockSize: 146176,
    uuid: '0',
  });
  expect(Object.keys(result)).toHaveLength(3);
});
