# WDF file format

WDF is a new file format developed by Renishaw, used in the WiRE Software Suite for storing Raman spectra and images. 

The spectra, metadata, and other information is stored in binary format. **wdf-parser** reads the
binary file and outputs an object with all the parsed information.  

The [WDF format description]() is used for mapping the bits to human readable data.

A WDF file is a set of blocks of different type. It starts with a special File Header Block followed by Blocks of different type.
 
* File Header: First block of the file. 512B. 
* Block: divided into block header and body.
  * Block Header: 16 bytes structure.
  * Block Body: variable length, depending on Block type

The File Header contains file metadata about the whole file, such as file signature, WDF version
used (currently v1).

After the 512B there comes the Block. First the _blockHeader_ and then the _blockBody_. The block header
is 16B and the main information is the _blockSize_ (including header) and _blockType_.

Using the _blockSize_ we could skip to the next block. Each block header is parsed in the same way, and
each body is parsed according to the _blockType_. Basically _blockType_ is the mark for how to
analyze the next _blockSize_ - 16 bytes.

There are a few main blocks ('\*' must always exist):
* DataBlock\*: stores spectral values for every spectra
* ListBlock\*: axis values, time of acquisition, etc.
* Origin\*: whose body itself if composed by a header and further blocks - or sets, with header and body.
* Map and Map Area

```
FileHeader bytes

Block1
    BlockHeader
    BlockBody(DataBlock)
        spectral data

Block2 
    BlockHeader
    BlockBody(ListBlock)
       metadata
       list data

Block3 
    BlockHeader
    BlockBody(Origin)
        number of sets
        set1
            setHeader (label)
            setBlock (specific for 'label')
        set2
            setHeader ('Time')
            setBlock (specific for 'Time')
        set3
            setHeader ('Flags')
            setBlock (specific for 'Flags')
        ...
...
```

<!--

[Official file specification](https://github.com/cheminfo/eln-docs/blob/main/docs/30_structural_analysis/includes/spc/spc.pdf)

[Thermo Scientific SPC File Developer Kit ](https://web.archive.org/web/20150131073636/http://ftirsearch.com/features/converters/spcfileformat.HTM)

[c6h6 documentation](https://docs.c6h6.org/docs/eln/structural_analysis/includes/spc/README)
-->
