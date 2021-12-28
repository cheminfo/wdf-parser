import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBytes64 } from '../utilities';

//test still being written
test('analyze different group of bytes', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const buffer = new IOBuffer(wdf);
  expect(() => readBytes64(buffer, 0, BigInt64Array)).toThrow(
    'nGroups has to be different from 0',
  );
  //read group of 64 bit
  buffer.offset = 8;
  const for64 = readBytes64(buffer, 2, BigUint64Array);
  console.log(for64);
  expect(buffer.offset).toBe(24);
});
