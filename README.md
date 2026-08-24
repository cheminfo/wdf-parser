# wdf-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse raman WDF file.

## Installation

`$ npm i wdf-parser`

This package is ESM-only. CommonJS consumers need Node.js >= 22.12 or any 24.x
or later, which support `require()` of synchronous ESM, or can migrate to
`import`.

## Usage

```js
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'wdf-parser';

const data = readFileSync(join(import.meta.dirname, 'spectra.wdf'));

const result = parse(data);
// result is an object containing everything that was parsed
```

### API

`parse(data)` takes the content of a `.wdf` file (a `Buffer`, `ArrayBuffer`,
`TypedArray` or `IOBuffer`) and returns a `Wdf` object:

| Property     | Type         | Description                                                             |
| ------------ | ------------ | ----------------------------------------------------------------------- |
| `fileHeader` | `FileHeader` | The 512-byte file header: title, user, units, number of spectra, dates. |
| `blocks`     | `Block[]`    | One entry per block found in the file, in file order.                   |

Each `Block` carries its `blockType`, `blockSize` and `uuid`, plus the parsed
body when the block type is supported: `spectra` (`Float32Array[]`), `xList` /
`yList` (`{ type, units, values }`) and `origins`.

## Examples

```js
const result = parse(readFileSync('6x6.wdf'));

result.fileHeader.title;
// 'Simple mapping measurement 1'
result.fileHeader.type;
// 'map'
result.blocks.map((block) => block.blockType);
// ['WDF_BLOCKID_DATA', 'WDF_BLOCKID_YLIST', 'WDF_BLOCKID_XLIST', ...]
```

## Useful Links

- [WDF file format description](./FORMAT.md) — the block layout this parser reads.

## ToDo

- [x] parse file header
- [x] parse DATA block
- [x] parse XLIST and YLIST block
- [x] parse ORIGIN block
- [ ] parse MAPAREA
- [ ] test and write examples on this readme file

Some test files were taken from the a [this Github repo](https://github.com/alchem0x2A/py-wdf-reader).

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
