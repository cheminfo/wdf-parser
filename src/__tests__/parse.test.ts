import { readFileSync } from 'fs';
import { join } from 'path';

/* // @ts-expect-error
import { parse as spcParse } from 'spc-parser';
*/
//import {btypes} from '../blockTypes';
import { parse } from '../parse';

describe('parse', () => {
  it('6x6', () => {
    const wdf = readFileSync(join(__dirname, 'data/6x6.wdf'));
    const result = parse(wdf);
    expect(result).toMatchObject({
      appname: 'WiRE',
      signature: 0x31464457,
      version: 1,
      size: 512,
      spare: [0, 0, 0, 0, 0, 0],
      title: 'Simple mapping measurement 1',
      user: 'Raman',
    });
    // we have another parser that should give a pretty similar result
    // const spc = readFileSync(join(__dirname, 'data/6x6.spc'));
    // const resultSPC = spcParse(spc);
    // //console.log(resultSPC);
    // expect(resultSPC).toBeDefined();
  });
});
