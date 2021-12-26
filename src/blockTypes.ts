/**
 * Gives meaning to type codes
 * @param {number} blockId type code
 * @return {string} String corresponding to the code
 */
export function btypes(blockId: number): string {
  switch (blockId) {
    case 0x31464457:
      return 'WDF_BLOCKID_FILE';
    case 0x41544144:
      return 'WDF_BLOCKID_DATA';
    case 0x54534c59:
      return 'WDF_BLOCKID_YLIST';
    case 0x54534c58:
      return 'WDF_BLOCKID_XLIST';
    case 0x4e47524f:
      return 'WDF_BLOCKID_ORIGIN';
    case 0x54584554:
      return 'WDF_BLOCKID_COMMENT';
    case 0x41445857:
      return 'WDF_BLOCKID_WIREDATA';
    case 0x42445857:
      return 'WDF_BLOCKID_DATASETDATA';
    case 0x4d445857:
      return 'WDF_BLOCKID_MEASUREMENT';
    case 0x53435857:
      return 'WDF_BLOCKID_CALIBRATION';
    case 0x53495857:
      return 'WDF_BLOCKID_INSTRUMENT';
    case 0x50414d57:
      return 'WDF_BLOCKID_MAPAREA';
    case 0x4c544857:
      return 'WDF_BLOCKID_WHITELIGHT';
    case 0x4c49414e:
      return 'WDF_BLOCKID_THUMBNAIL';
    case 0x2050414d:
      return 'WDF_BLOCKID_MAP';
    case 0x52414643:
      return 'WDF_BLOCKID_CURVEFIT';
    case 0x534c4344:
      return 'WDF_BLOCKID_COMPONENT';
    case 0x52414350:
      return 'WDF_BLOCKID_PCA';
    case 0x4552434d:
      return 'WDF_BLOCKID_EM';
    case 0x43444c5a:
      return 'WDF_BLOCKID_ZELDAC';
    case 0x4c414352:
      return 'WDF_BLOCKID_RESPONSECAL';
    case 0x20504143:
      return 'WDF_BLOCKID_CAP';
    case 0x50524157:
      return 'WDF_BLOCKID_PROCESSING';
    case 0x41524157:
      return 'WDF_BLOCKID_ANALYSIS';
    case 0x4c424c57:
      return 'WDF_BLOCKID_SPECTRUMLABELS';
    case 0x4b484357:
      return 'WDF_BLOCKID_CHECKSUM';
    case 0x44435852:
      return 'WDF_BLOCKID_RXCALDATA';
    case 0x46435852:
      return 'WDF_BLOCKID_RXCALFIT';
    case 0x4c414358:
      return 'WDF_BLOCKID_XCAL';
    case 0x48435253:
      return 'WDF_BLOCKID_SPECSEARCH';
    case 0x504d4554:
      return 'WDF_BLOCKID_TEMPPROFILE';
    case 0x56434e55:
      return 'WDF_BLOCKID_UNITCONVERT';
    case 0x52505241:
      return 'WDF_BLOCKID_ARPLATE';
    case 0x43454c45:
      return 'WDF_BLOCKID_ELECSIGN';
    case 0x4c584b42:
      return 'WDF_BLOCKID_BKXLIST';
    case 0x20585541:
      return 'WDF_BLOCKID_AUXILARYDATA';
    case 0x474c4843:
      return 'WDF_BLOCKID_CHANGELOG';
    case 0x46525553:
      return 'WDF_BLOCKID_SURFACE';
    case 0xffffffff:
      return 'WDF_BLOCKID_ANY';
    case 0x54455350:
      return 'WDF_STREAM_IS_PSET';
    case 0x4d545343:
      return 'WDF_STREAM_IS_CSTM';
    default:
      throw new Error('This blockId is not defined');
  }
}
