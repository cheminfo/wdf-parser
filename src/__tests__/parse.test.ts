import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

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
