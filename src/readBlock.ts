/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import {
  getMeasurementUnits,
  getListType,
  getWdfSpectrumFlags,
  WdfSpectrumFlags,
  fileTimeToDate,
  getHeaderOfSet,
  HeaderOfSet,
} from './maps';
import { BlockHeader, readBlockHeader } from './readBlockHeader';
import { FileHeader } from './readFileHeader';

/** represents the main data unit 'Block', we define the type and subtypes */
export interface Block extends BlockHeader {
  spectrum?: DataBlock;
  xList?: ListBlock;
  yList?: ListBlock;
  origins?: OriginBlock[];
  //data?:
}

/** raw spectral (array or arrays) data */
export type DataBlock = Float32Array[] | Float32Array;

/** Stores X or Y Axis Values (the same for each spectrum in a file)
data is ordered high to low or L to H, and the spacing between points need not be constant.
*/
export interface ListBlock {
  /** type of data in list i.e: Spectral, Spatial, T, P, Checksum, Time */
  type: string;
  /** The units of type. i.e cm-1, nm, etc */
  units: string;
  /** the data stored, if any */
  values: Float32Array;
}

/** Stores critical info about spectras/images.  Must-be blocks: Time (spectra acquisition), Flags
 * raised ...*/
export interface OriginBlock extends HeaderOfSet {
  axisOrigins?: Float64Array | BigUint64Array;
  /** Array of objects, Flags for a each spectrum, if a spectrum.
Ex: error, errorCode, saturated, cosmicRay */
  spectrumFlags?: WdfSpectrumFlags[];
  spectrumDates?: Date[];
  otherValues?: BigUint64Array;
}

/**
 * Parses Block body according to the specific block type
 * @param buffer WDF buffer
 * @param fileHeader full file header | {nSpectra,nPoints}
 * @param blockHeader full block header | {blockSize,blockType}
 * @param offset Where the block's body starts | uses current buffer offset
 * @return array of datapoints and current buffer offset
 */
export function readBlock(
  buffer: IOBuffer,
  fileHeader:
    | FileHeader
    | Pick<FileHeader, 'nSpectra' | 'nPoints' | 'yListCount'>,
  offset?: number,
): Block {
  /* an offset can be assigned manually if desired */
  if (offset) buffer.offset = offset;

  /* use part of the file header */
  const { nSpectra, nPoints, yListCount } = fileHeader;

  /* set header properties, we further populate it later */
  let thisBlock: Block = readBlockHeader(buffer);

  /* use part of the block header */
  const { blockSize, blockType } = thisBlock;

  const headerSize = 16;
  const bodySize = blockSize - headerSize;

  /* don't analyze YLIST if no image */
  if (blockType === 'WDF_BLOCKID_YLIST' && yListCount <= 1) {
    /* The YList block stores values for 2D image */
    buffer.offset += bodySize;
    /* just returns the header */
    return thisBlock;
  }

  /* using case a:{} scopes the variables */
  switch (blockType) {
    case 'WDF_BLOCKID_DATA': {
      let spectras32: Float32Array[] | Float32Array = [];
      for (let i = 0; i < nSpectra; i++) {
        let currentSpectra = new Float32Array(nPoints);
        for (let j = 0; j < nPoints; j++) {
          currentSpectra[j] = buffer.readFloat32();
        }
        spectras32.push(currentSpectra);
      }
      thisBlock.spectrum =
        spectras32.length === 1 ? spectras32.flat() : spectras32;
      break;
    }
    /*values not necessarily equally spaced, they're ordered Low to High or H to L*/
    case 'WDF_BLOCKID_XLIST':
    case 'WDF_BLOCKID_YLIST': {
      /*XList contains (npoint) unit values for the x axis.*/
      const type = buffer.readUint32();
      const units = buffer.readUint32();
      /* only for the XList block nFloats=nPoints. */
      const nXorYPoints = (bodySize - 8) / 4;
      let valuesXorY = new Float32Array(nXorYPoints);

      for (let i = 0; i < nXorYPoints; i++) {
        valuesXorY[i] = buffer.readFloat32();
      }

      const list = {
        type: getListType(type),
        units: getMeasurementUnits(units),
        /* for only-spectral files, YLIST.list will be a single meaningless number (array length 1) */
        values: valuesXorY,
      } as ListBlock;

      if (blockType.includes('XLIST')) {
        thisBlock.xList = list;
      } else {
        thisBlock.yList = list;
      }
      break;
    }

    case 'WDF_BLOCKID_ORIGIN': {
      let data: OriginBlock[] = [];
      const nDataOriginSets = buffer.readUint32();

      /* iterate over each of the "subblocks", or sets. */
      for (let set = 0; set < nDataOriginSets; set++) {
        /* each set has a header with same structure */
        const headerOfSet: HeaderOfSet = getHeaderOfSet(buffer);
        data.push(headerOfSet);

        const typeOfSet = headerOfSet.label;

        switch (typeOfSet) {
          case 'X':
          case 'Y': {
            let os = new Float64Array(nSpectra);
            for (let i = 0; i < nSpectra; i++) {
              os[i] = buffer.readFloat64();
            }
            data[set].axisOrigins = os;
            break;
          }

          case 'Flags': {
            /* Spectra errors & metadata */
            let spectrumFlags: WdfSpectrumFlags[] = [];
            for (let i = 0; i < nSpectra; i++) {
              const lower = buffer.readUint32();
              const higher = buffer.readUint32();
              spectrumFlags[i] = getWdfSpectrumFlags(lower, higher);
            }
            data[set].spectrumFlags = spectrumFlags;
            break;
          }
          case 'Time': {
            let spectrumDates: Date[] = [];
            for (let i = 0; i < nSpectra; i++) {
              spectrumDates[i] = fileTimeToDate(buffer.readBigUint64());
            }
            data[set].spectrumDates = spectrumDates;
            break;
          }
          default: {
            buffer.offset += nSpectra * 8;
            //data[set].otherValues = new BigUint64Array(bodyOfSet);
            break;
          }
        }
      }

      thisBlock.origins = data;
      break;
    }

    /* default case for other not analyzed (but read) file blocks */
    default:
      buffer.offset += bodySize;
  }
  return thisBlock;
}
