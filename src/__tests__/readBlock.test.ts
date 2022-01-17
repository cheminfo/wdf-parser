import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBlock } from '../readBlock';
import { readFileHeader } from '../readFileHeader';

describe('parsing 6x6.wdf', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const wdfBuffer = new IOBuffer(wdf);
  const fileHeader = readFileHeader(wdfBuffer);
  const { nSpectra } = fileHeader;
  it('reads and returns a data block', () => {
    const { blockType, blockSize, uuid, spectrum } = readBlock(
      wdfBuffer,
      fileHeader,
    );
    expect(blockType).toBe('WDF_BLOCKID_DATA');
    expect(blockSize).toBe(146176);
    expect(uuid).toBe('0');
    expect(spectrum).toHaveLength(nSpectra);
  });
  it('uses previous result to read next block', () => {
    const { blockType, blockSize, yList } = readBlock(wdfBuffer, fileHeader);
    expect(blockType).toBe('WDF_BLOCKID_YLIST');
    expect(blockSize).toBe(28);
    expect(yList).toBeUndefined();
  });
});
