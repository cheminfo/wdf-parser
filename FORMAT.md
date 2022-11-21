# WDF file format

WDF is a new file format developed by Renishaw, used in the WiRE Software Suite for storing Raman spectra, images and results from several devices.

Most data is stored in binary format. **wdf-parser** reads the binary file and outputs an object with all the parsed information.

The [WDF format description]() is used for mapping the bits to human readable data.

A WDF file is a set of blocks of different type. First the File Header Block followed by others. To this point, the file looks like:

- File Header: First block of the file. 512B.
- Block: divided into block header and body.
  - Block Header: 16 bytes structure.
  - Block Body: variable length, depending on Block type

The JSON object returned by the parser looks like this:

```
{
  meta:{ p1, p2, p3...}
  blocks: [ array of blocks ]
}
```

Each block in the array of block has this structure:

```
{
  blockSize,
  blockType,
  uuid,
  p4
}
```

**p4** is a placeholder for a key that depends in the block type (correlates with blockBody), the other properties can be correlated with the blockHeader (occupy 16B in total).

For p4 (which is variable size, not fixed), the most useful bits are:

- For type 'DATA' it will be _spectrum_
- For 'XLIST' it will be xList, and is an object with properties. The path `xList.values` will hold
  an array of unit values for the _x_ axis.

There are a few main blocks ('\*' must always exist):

- DataBlock\*: stores spectral values for every spectra
- ListBlock\*: axis values, time of acquisition, etc.
- Origin\*: whose body itself if composed by a header and further blocks - or sets, with header and body.
- Map and Map Area

```
FileHeader bytes

Block1(DATA)
    BlockHeader
    spectrum

Block2 (XLIST)
     BlockHeader
     xList

Block3(ORIGIN)
    BlockHeader
    sets:[ {set1}, {set2}...]
...
```
