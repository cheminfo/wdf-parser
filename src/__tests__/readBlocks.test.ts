import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBlockHeader, readBlockBody, readAllBlocks } from '../readBlocks';
import { readFileHeader } from '../readFileHeader';

describe('parses blocks', () => {
  it('6x6', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const wdfBuffer = new IOBuffer(wdf);
    const { nPoints, nSpectra } = readFileHeader(wdfBuffer);
    wdfBuffer.mark(); //512
    const blockHeader = readBlockHeader(wdfBuffer);
    const blockBody = readBlockBody(wdfBuffer, blockHeader);
    console.log(blockHeader.uuid);
    expect(blockHeader.blockType).toBe('WDF_BLOCKID_DATA');
    /* nPoints*nSpectra+16 has to be the whole block size, when there is one data block*/
    expect(blockHeader.blockSize).toBe(nPoints * nSpectra * 4 + 16);
    //    expect(blockBody).not.toBe(undefined) && expect(blockBody.length).toBe(146160);

    wdfBuffer.reset(); //512
    expect(readAllBlocks(wdfBuffer)).toHaveLength(13);
  });
});
