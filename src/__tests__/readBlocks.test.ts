import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import {
  readBlockHeader,
  /*readBlockBody,*/ readAllBlocks,
} from '../readBlocks';
import { readFileHeader } from '../readFileHeader';

describe('block parsing 6x6.wdf', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const wdfBuffer = new IOBuffer(wdf);
  const { nPoints, nSpectra } = readFileHeader(wdfBuffer);
  wdfBuffer.mark(); //512
  const blockHeader = readBlockHeader(wdfBuffer);
  it('header block', () => {
    expect(blockHeader).toStrictEqual({
      blockType: 'WDF_BLOCKID_DATA',
      blockSize: 146176,
      uuid: '0',
    });

    /* nPoints*nSpectra+16 has to be the whole block size, when there is one data block*/
    /* consistency-check */
    expect(blockHeader.blockSize).toBe(nPoints * nSpectra * 4 + 16);
  });
  /* remains to test block body */
  it('allBlocks', () => {
    wdfBuffer.reset(); //512
    const allBlocks = readAllBlocks(wdfBuffer);
    expect(allBlocks).toHaveLength(13);
    expect(wdfBuffer.offset).toBe(wdfBuffer.length);
  });
});
