import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import {
  readBlockHeader,
  /*readBlockBody,*/ readAllBlocks,
} from '../readBlocks';
import { readFileHeader } from '../readFileHeader';

describe('parsing 6x6.wdf', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const wdfBuffer = new IOBuffer(wdf);
  const fileHeader = readFileHeader(wdfBuffer);
  const { nPoints /* data values p spectrum */, nSpectra /* n of spectra */ } =
    fileHeader;
  wdfBuffer.mark(); //512
  it('header block', () => {
    let blockHeader = readBlockHeader(wdfBuffer);
    expect(blockHeader).toStrictEqual({
      blockType: 'WDF_BLOCKID_DATA',
      blockSize: 146176,
      uuid: '0' /* 0 means it is the only block of type "DATA"*/,
    });
    /* if block size is wrong this fails */
    expect(blockHeader.blockSize).toBe(nPoints * nSpectra * 4 + 16);
  });
  it('allBlocks', () => {
    wdfBuffer.reset(); //512
    const allBlocks = readAllBlocks(wdfBuffer, fileHeader);
    expect(allBlocks).toHaveLength(13);
    const DATA = allBlocks.filter(
      (block) => block.blockHeader.blockType === 'WDF_BLOCKID_DATA',
    );
    expect(DATA).toHaveLength(1);
    expect(wdfBuffer.offset).toBe(wdfBuffer.length);
  });
});
