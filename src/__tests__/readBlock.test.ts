import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { IOBuffer } from 'iobuffer';
import { expect, test } from 'vitest';

import { readBlock } from '../readBlock.ts';
import { readFileHeader } from '../readFileHeader.ts';

const wdf = readFileSync(join(import.meta.dirname, 'data/6x6.wdf'));
const wdfBuffer = new IOBuffer(wdf);
const fileHeader = readFileHeader(wdfBuffer);
const { nSpectra } = fileHeader;

test('reads and returns a data block', () => {
  const { blockType, blockSize, uuid, spectra } = readBlock(
    wdfBuffer,
    fileHeader,
  );

  expect(blockType).toBe('WDF_BLOCKID_DATA');
  expect(blockSize).toBe(146176);
  expect(uuid).toBe('0');
  expect(spectra).toHaveLength(nSpectra);
});

test('uses previous result to read next block', () => {
  const { blockType, blockSize, yList } = readBlock(wdfBuffer, fileHeader);

  expect(blockType).toBe('WDF_BLOCKID_YLIST');
  expect(blockSize).toBe(28);
  expect(yList).toBeUndefined();
});
