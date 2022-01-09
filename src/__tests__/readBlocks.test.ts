import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { readBlockHeader, readBlockBody, readAllBlocks } from '../readBlocks';
import { readFileHeader } from '../readFileHeader';

describe('block parsing 6x6.wdf', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const wdfBuffer = new IOBuffer(wdf);
  const fileHeader = readFileHeader(wdfBuffer);
  const {
    nPoints /* number of data values per spectrum */,
    nSpectra /* number of actual spectra (capacity) */,
    //nCollected /*number of spectra written to file */,
  } = fileHeader;
  wdfBuffer.mark(); //512
  let blockHeader = readBlockHeader(wdfBuffer);
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
  it('block body', () => {
    const blockBody = readBlockBody(wdfBuffer, fileHeader, blockHeader);
    const dataPoints = (blockHeader - 16) * 8;
    expect(blockBody).toHaveLength(dataPoints);
    expect(dataPoints / nPoints).toBe(nSpectra);
  });
  it('allBlocks', () => {
    wdfBuffer.reset(); //512
    const allBlocks = readAllBlocks(wdfBuffer, fileHeader);
    expect(allBlocks).toHaveLength(13);
    expect(wdfBuffer.offset).toBe(wdfBuffer.length);
  });
});
