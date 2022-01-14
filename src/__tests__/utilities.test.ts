import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBytes64, isCorrupted } from '../utilities';

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

test('File is corrupted', () => {
const type = 'map';
let blocks = [
'WDF_BLOCKID_DATA',
'WDF_BLOCKID_YLIST',
'WDF_BLOCKID_XLIST',
'WDF_BLOCKID_ORIGIN'
]
expect(()=>isCorrupted(blocks,type)).toThrow('Missing blocks')
blocks = [
'WDF_BLOCKID_DATA',
'WDF_BLOCKID_YLIST',
'WDF_BLOCKID_XLIST',
'WDF_BLOCKID_ORIGIN',
'WDF_BLOCKID_MAPAREA'
]
expect(isCorrupted(blocks,type)).toBeUndefined()
})
