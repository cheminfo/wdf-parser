import { readFileSync } from 'fs';
import { join } from 'path';

import { parse } from '../parse';

describe('parse', () => {
  it('6x6', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const result = parse(wdf);
    expect(result).toBeDefined();
    // we have another parser that should give a pretty similar result
  });
});
