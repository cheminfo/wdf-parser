# wdf-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse raman WDF file.

## Installation

`$ npm i wdf-parser`

## Usage

```js
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'wdf-parser';

const arrayBuffer = readFileSync(join(__dirname, 'spectra.spc'));

const result = parse(arrayBuffer);
// result is a JSON object containing everything that was parsed
```

### WDF file format

WDF is a new file format used in the WiRE Software Suite for storing Raman spectra.

The data is stored in binary format. <!--with some parts encoded in ASCII. As such, the file must be viewed in either a hex editor or any compatible spectroscopy software.-->

A WDF file is a set of blocks of different type. It starts with a special File Header Block followed by Blocks of different type.
 
* File Header: 512 bytes. The first 16 bytes match the Block Header.
* Block: divided into block header and body.
  * Block Header: 16 bytes structure.
  * Block Body: variable length, depending on Block type

The File Header contains file metadata about the whole file, such as file signature, version.

<!--
The Data block contains the spectrum data and is composed of a subheader for each spectrum, the X values _before_ the subheader if **XY** or **XYY**, else _after_ each subheader if **XYXY**. After the subheader and X values come the Y values, which are read according to the method determined in the Main Header.

The Log block contains miscellaneous information that varies for each file, with a part written in ASCII and another one in binary.

[Official file specification](https://github.com/cheminfo/eln-docs/blob/main/docs/30_structural_analysis/includes/spc/spc.pdf)

[Thermo Scientific SPC File Developer Kit ](https://web.archive.org/web/20150131073636/http://ftirsearch.com/features/converters/spcfileformat.HTM)

[c6h6 documentation](https://docs.c6h6.org/docs/eln/structural_analysis/includes/spc/README)
-->
## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/wdf-parser.svg
[npm-url]: https://www.npmjs.com/package/wdf-parser
[ci-image]: https://github.com/cheminfo/wdf-parser/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/wdf-parser/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/wdf-parser.svg
[codecov-url]: https://codecov.io/gh/cheminfo/wdf-parser
[download-image]: https://img.shields.io/npm/dm/wdf-parser.svg
[download-url]: https://www.npmjs.com/package/wdf-parser

