import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readGroupOfBytes } from '../utilities';

//test still being written
test('analyze different group of bytes', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const buffer = new IOBuffer(wdf);
  expect(() => readGroupOfBytes(buffer, 0, 'readBigInt64')).toThrow(
    'nGroups has to be different from 0',
  );
  //read group of 64 bit
  buffer.offset = 8;
  const for64 = readGroupOfBytes(buffer, 2, 'readBigInt64');
  expect(buffer.offset).toBe(24);
  //read group of 32 bit
  buffer.offset = 0;
  const for32 = readGroupOfBytes(buffer, 2, 'readUint32');
  expect(buffer.offset).toBe(8);
  //read group of 16 bit
  buffer.offset = 0;
  const for16 = readGroupOfBytes(buffer, 2, 'readUint16');
  expect(buffer.offset).toBe(4);
  expect(() => readGroupOfBytes(buffer, 2, 'readFloat32')).toThrow(
    'readFloat32 not found. Only 64,32,16 bit functions are allowed.',
  );
});
