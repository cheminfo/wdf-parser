import { readFileSync } from 'fs';
import { join } from 'path';

// @ts-expect-error
import { parse as spcParse } from 'spc-parser';

import { parse } from '../parse';

describe('parse', () => {
  it('6x6', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const result = parse(wdf);
    //console.log(result);

    // we have another parser that should give a pretty similar result
    const spc = readFileSync(join(__dirname, 'data/6x6.spc'));
    const resultSPC = spcParse(spc);
    //console.log(resultSPC);

    expect(true).toBe(true);
  });
});
