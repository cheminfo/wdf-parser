/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import { FileHeader } from './readFileHeader';
import {
  btypes,
  getMeasurementUnits,
  getListType,
  getWdfSpectrumFlags,
  WdfSpectrumFlags,
} from './types';
import {
  getUUId,
  isCorrupted,
  fileTimeToDate,
  subheaderOrigin,
} from './utilities';

/* the main object is the Block, we define the type and subtypes */
export interface Block {
  /** Object with block metadata */
  blockHeader: BlockHeader;
  /** block properties and data */
  blockBody: BlockBody;
}

/* The Header is the same for every block */
export interface BlockHeader {
  /** block identity */
  blockType: string;
  /** block size including header (16B) in bytes */
  blockSize: number;
  /** unique id block. uuid=0 -> unique block with this type */
  uuid: string;
}

/* body is different for different blocks */
export type BlockBody = DataBlock | ListBlock | OriginBlock[] | []; //temporary type.

/* Types for the block body (depends on the blockHeader 'Type') */
/** Array of arrays, each of them a spectra as Float32Array */
export interface DataBlock {
  /** Raw data for the spectra */
  spectras: Float32Array[];
}

/** Stores X or Y Axis Values (the same for each spectrum in a file,
we valuesForBlocks to real, meaningful values using ORIGIN).
data is ordered high to low or L to H,
and the spacing between points need not be constant.
*/
export interface ListBlock {
  /** type of data in list i.e: Spectral, Spatial, T, P, Checksum, Time */
  type: string;
  /** The units of type. i.e cm-1, nm, etc */
  units: string;
  /** the data stored, if any */
  list: Float32Array;
}

/** Stores critical info about spectras/images.  Must-be blocks: Time (spectra acquisition), Flags raised during each aquisition, Checksum values for each dataset if CFR was in use.  */
export interface SubheaderOrigin {
  /** type i.e: Spectral, Spatial, T, P, Checksum, Time */
  type: string;
  /** Important Origin 1, Alternative Origin 0 */
  flag: '1' | '0';
  /** The units of the origin list values. i.e cm-1, nm, etc */
  unit: string;
  /** Identified for the block i.e X, Y, Cheksum */
  label: string;
  /** next properties depend on the label */
  /** Array, axis origin for every (all) spectrum. X,Y 'd be != origin blocks */
}
export interface OriginBlock extends SubheaderOrigin {
  axisOrigins?: Float64Array | BigUint64Array;
  /** Array of objects, Flags for a each spectrum, if a spectrum.
Ex: error, errorCode, saturated, cosmicRay */
  spectrumFlags?: WdfSpectrumFlags[];
  spectrumDates?: Date[];
  otherValues?: BigUint64Array;
}

/**
 * Block Header Parsing - Block's first 16 bytes
 * @param buffer WDF buffer
 * @param [offset] byte number where to start reading | uses current offset
 * @return blockHeader Block metadata
 */
export function readBlockHeader(
  buffer: IOBuffer,
  offset?: number,
): BlockHeader {
  /*an offset can be assigned manually if desired*/
  if (offset) buffer.offset = offset;

  const blockType: string = btypes(buffer.readUint32());
  const uuid: string = getUUId(buffer.readBytes(4));
  const blockSize = Number(buffer.readBigUint64()); // Bytes

  /* assign with appropriate type */
  return { blockType, uuid, blockSize } as BlockHeader;
}

/**
 * Parses Block body according to the specific block type
 * @param buffer WDF buffer
 * @param fileHeader full file header | {nSpectra,nPoints}
 * @param blockHeader full block header | {blockSize,blockType}
 * @param offset Where the block's body starts | uses current buffer offset
 * @return array of datapoints and current buffer offset
 */
export function readBlockBody(
  buffer: IOBuffer,
  fileHeader: FileHeader | Pick<FileHeader, 'nSpectra' | 'nPoints'>,
  blockHeader: BlockHeader | Pick<BlockHeader, 'blockSize' | 'blockType'>,
  offset?: number,
): BlockBody {
  const { nSpectra, nPoints } = fileHeader;
  const { blockSize, blockType } = blockHeader;

  /*an offset can be assigned manually if desired*/
  if (offset) buffer.offset = offset;

  /*take some measurements*/
  const headerSize = 16;
  const bodySize = blockSize - headerSize;

  /* using case a:{} scopes the variables */
  switch (blockType) {
    case 'WDF_BLOCKID_DATA': {
      let spectras32: Float32Array[] = [];
      for (let i = 0; i < nSpectra; i++) {
        const spectra8: Uint8Array = buffer.readBytes(4 * nPoints);
        spectras32.push(new Float32Array(spectra8.buffer));
      }
      return { spectras: spectras32 } as DataBlock;
    }
    /*values not necessarily equally spaced, they're ordered Low to High or H to L*/
    case 'WDF_BLOCKID_XLIST':
    case 'WDF_BLOCKID_YLIST': {
      const first8Bytes: Uint8Array = buffer.readBytes(8);
      const [type, units] = new Uint32Array(first8Bytes.buffer);

      // For the XList block, the number of floats is equal to npoints.
      const axisValues: Uint8Array = buffer.readBytes(bodySize - 8);
      return {
        type: getListType(type),
        units: getMeasurementUnits(units),
        /* for only-spectral files, YLIST.list will be a single meaningless number (array length 1) */
        list: new Float32Array(axisValues.buffer),
      } as ListBlock;
    }

    case 'WDF_BLOCKID_ORIGIN': {
      let data: OriginBlock[] = [];
      const nDataOriginSets = buffer.readUint32();
      for (let set = 0; set < nDataOriginSets; set++) {
        const subheader = subheaderOrigin(buffer);
        data.push(subheader);

        /* origin holds a 64bit piece of important data per set, and the sets are = nSpectra */
        const valuesForBlocks: ArrayBuffer = buffer.readBytes(
          nSpectra * 8,
        ).buffer;
        const label = subheader.label;

        /* X|Y set */
        if (['X', 'Y'].includes(label)) {
          data[set].axisOrigins = new Float64Array(valuesForBlocks);
        } else if (label === 'Flags') {
          /* Spectra errors & metadata */
          let spectrumFlags: WdfSpectrumFlags[] = [];
          new BigUint64Array(valuesForBlocks).forEach((spectraFlags) => {
            spectrumFlags.push(getWdfSpectrumFlags(spectraFlags));
          });
          data[set].spectrumFlags = spectrumFlags;
        } else if (label === 'Time') {
          let spectrumDates: Date[] = [];
          new BigUint64Array(valuesForBlocks).forEach((spectraDate) => {
            spectrumDates.push(fileTimeToDate(spectraDate));
          });
          data[set].spectrumDates = spectrumDates;
        } else {
          data[set].otherValues = new BigUint64Array(valuesForBlocks);
        }
      }
      return data;
    }
    default:
      buffer.readBytes(bodySize);
      return [];
  }
}

/**
 * Parses all the Blocks in the file
 * @param buffer WDF buffer
 * @param fileHeader fileHeader object | {nSpectra, nPoints}
 * @return array of objects storing {blockHeader, blockBody} for each block
 */
export function readAllBlocks(
  buffer: IOBuffer,
  fileHeader: FileHeader,
): Block[] {
  let blocks: Block[] = [];
  let blockHeaderTypes: string[] = [];
  while (buffer.length > buffer.offset) {
    const blockHeader = readBlockHeader(buffer);
    const blockBody = readBlockBody(buffer, fileHeader, blockHeader);
    blocks.push({ blockHeader, blockBody });
    blockHeaderTypes.push(blockHeader.blockType);
  }

  // check if the block headers are complete
  isCorrupted(blockHeaderTypes, fileHeader.type);

  return blocks;
}
