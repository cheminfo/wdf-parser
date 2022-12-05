/* eslint no-control-regex: 0 */
import { IOBuffer } from 'iobuffer';

import {
  getMeasurementUnits,
  getListType,
  getWdfSpectrumFlags,
  WdfSpectrumFlags,
  windowsTimeToMs,
  getHeaderOfSet,
  HeaderOfSet,
} from './maps';
import { BlockHeader, readBlockHeader } from './readBlockHeader';
import { FileHeader } from './readFileHeader';

/**
 * Represents the main data unit 'Block', extends [[`BlockHeader`]]
 * @extends BlockHeader
 */
export interface Block extends BlockHeader {
  /** Single or Multiple spectra (always array of arrays) */
  spectra?: DataBlock;
  /** x coordinates object */
  xList?: ListBlock;
  /** May be relevant for images */
  yList?: ListBlock;
  /** x and y origins when mapping + other data */
  origins?: OriginBlock[];
  //data?:
}

/** Raw spectral data */
export type DataBlock = Float32Array[];

/** XList or YList share this schema */
export interface ListBlock {
  /** type of data in list i.e: Spectral, Spatial, T, P, Checksum, Time */
  type: string;
  /** The units of type. i.e cm-1, nm, etc */
  units: string;
  /**  data is ordered high to low or L to H, spacing bw points need not be constant. */
  values: Float32Array;
}

/** Stores critical info about spectras/images.  Must-be blocks: Time (spectra acquisition), Flags raised ...*/
export interface OriginBlock extends HeaderOfSet {
  /** Origins used for maps, etc */
  axisOrigins?: Float64Array | BigUint64Array;
  /** Array of objects, Flags for a each spectrum, if a spectrum.
Ex: error, errorCode, saturated, cosmicRay */
  spectrumFlags?: WdfSpectrumFlags[];
  /** Array of dates in Milliseconds since Epoch */
  spectrumDates?: number[];
  /** parsed values without a known/specific meaning */
  otherValues?: BigUint64Array;
}

/**
 * Parses Block body according to the specific block type
 * @param buffer - from new IOBuffer(WdfFile)
 * @param fileHeader - full file header | {nSpectra,nPoints, yListCount}
 * @param offset - Where the block's body starts | uses current buffer offset
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
      let spectras32: Float32Array[] = [];
      for (let i = 0; i < nSpectra; i++) {
        const currentSpectra = buffer.readArray(nPoints, 'float32');
        spectras32.push(currentSpectra);
      }
      thisBlock.spectra = spectras32;
      break;
    }

    case 'WDF_BLOCKID_XLIST':
    case 'WDF_BLOCKID_YLIST': {
      /*XList contains (npoint) unit values for the x axis.*/
      const type = buffer.readUint32();
      const units = buffer.readUint32();
      /* only for the XList block nFloats=nPoints. */
      const nXorYPoints = (bodySize - 8) / 4;
      const valuesXorY = buffer.readArray(nXorYPoints, 'float32');

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
            data[set].axisOrigins = buffer.readArray(nSpectra, 'float64');
            break;
          }

          case 'Flags': {
            /* Spectra errors & metadata */
            let spectrumFlags: WdfSpectrumFlags[] = [];
            for (let i = 0; i < nSpectra; i++) {
              spectrumFlags[i] = getWdfSpectrumFlags(buffer.readBigUint64());
            }
            data[set].spectrumFlags = spectrumFlags;
            break;
          }
          case 'Time': {
            let spectrumDates: number[] = [];
            for (let i = 0; i < nSpectra; i++) {
              spectrumDates[i] = windowsTimeToMs(buffer.readBigUint64());
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
