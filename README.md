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

const arrayBuffer = readFileSync(join(__dirname, 'spectra.wdf'));

const result = parse(arrayBuffer);
// result is an object containing everything that was parsed
```

## Examples

## Useful Links

## ToDo
- [x] parse file header
- [x] parse DATA block
- [x] parse XLIST and YLIST block
- [x] parse ORIGIN block
- [ ] parse MAPAREA
- [ ] test and write examples on this readme file

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

