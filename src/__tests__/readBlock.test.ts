import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { IOBuffer } from 'iobuffer';
import { describe, expect, it } from 'vitest';

import { readBlock } from '../readBlock.ts';
import { readFileHeader } from '../readFileHeader.ts';

describe('parsing 6x6.wdf', () => {
  const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
  const wdfBuffer = new IOBuffer(wdf);
  const fileHeader = readFileHeader(wdfBuffer);
  const { nSpectra } = fileHeader;

  it('reads and returns a data block', () => {
    const { blockType, blockSize, uuid, spectra } = readBlock(
      wdfBuffer,
      fileHeader,
    );

    expect(blockType).toBe('WDF_BLOCKID_DATA');
    expect(blockSize).toBe(146176);
    expect(uuid).toBe('0');
    expect(spectra).toHaveLength(nSpectra);
  });

  it('uses previous result to read next block', () => {
    const { blockType, blockSize, yList } = readBlock(wdfBuffer, fileHeader);

    expect(blockType).toBe('WDF_BLOCKID_YLIST');
    expect(blockSize).toBe(28);
    expect(yList).toBeUndefined();
  });
});
