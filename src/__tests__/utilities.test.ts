import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBytes64 } from '../utilities';

//test still being written
test('analyze different group of bytes', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const buffer = new IOBuffer(wdf);
  expect(() => readBytes64(buffer, 0)).toThrow(
    'nGroups has to be different from 0',
  );
  //read group of 64 bit
  buffer.offset = 8;
  const [size, flags] = readBytes64(buffer, 2);
  expect(size).toBe(512);
  expect(flags).toBe(0);
  expect(buffer.offset).toBe(24);
});
