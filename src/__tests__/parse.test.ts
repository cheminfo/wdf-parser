import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { xSum } from 'ml-spectra-processing';
import { expect, test } from 'vitest';
import { parseXY } from 'xy-parser';

import type { Wdf } from '../parse.ts';
import { parse } from '../parse.ts';

test('6x6', () => {
  const wdf = readFileSync(join(import.meta.dirname, 'data/6x6.wdf'));
  const result = parse(wdf);

  expect(Object.keys(result.fileHeader)).toHaveLength(30);
  expect(result).toMatchSnapshot();
  expect(new Date(result.fileHeader.timeEnd)).toStrictEqual(
    new Date('2021-10-01T11:57:09.948Z'),
  );
});

test('caco3 matches the WiRE text export', () => {
  const { x, y } = readCaco3Wdf();
  const reference = parseXY(
    readFileSync(join(import.meta.dirname, 'data/caco3.txt')),
  );

  expect(x).toHaveLength(1015);
  expect(reference.x).toHaveLength(1015);

  /* the text export prints 6 decimals of the stored float32 values */
  expect(x[0]).toBeCloseTo(at(reference.x, 0), 5);
  expect(x.at(-1)).toBeCloseTo(at(reference.x, -1), 5);
  expect(y[0]).toBeCloseTo(at(reference.y, 0), 5);
  expect(y.at(-1)).toBeCloseTo(at(reference.y, -1), 5);

  expect(xSum(x)).toBeCloseTo(xSum(reference.x), 3);
  expect(xSum(y)).toBeCloseTo(xSum(reference.y), 3);
});

function readCaco3Wdf() {
  const wdf = parse(
    readFileSync(join(import.meta.dirname, 'data/caco3.wdf')),
  ) satisfies Wdf;
  const x = wdf.blocks.find((block) => block.xList)?.xList?.values;
  const y = wdf.blocks.find((block) => block.spectra)?.spectra?.[0];
  if (!x || !y) {
    throw new Error('the wdf file has no XLIST or DATA block');
  }
  return { x, y };
}

function at(
  values: { at: (index: number) => number | undefined },
  index: number,
) {
  const value = values.at(index);
  if (value === undefined) {
    throw new Error(`no value at index ${index}`);
  }
  return value;
}
