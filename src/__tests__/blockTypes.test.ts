import { btypes } from '../types';

test('btypes return value at different inputs', (): void => {
  expect(btypes(0x31464457)).toBe('WDF_BLOCKID_FILE');
  expect(btypes(0x41544144)).toBe('WDF_BLOCKID_DATA');
  expect(btypes(0x54534c59)).toBe('WDF_BLOCKID_YLIST');
  expect(btypes(0x54534c58)).toBe('WDF_BLOCKID_XLIST');
  expect(btypes(0x4e47524f)).toBe('WDF_BLOCKID_ORIGIN');
  expect(btypes(0x54584554)).toBe('WDF_BLOCKID_COMMENT');
  expect(btypes(0x41445857)).toBe('WDF_BLOCKID_WIREDATA');
  expect(btypes(0x42445857)).toBe('WDF_BLOCKID_DATASETDATA');
  expect(btypes(0x4d445857)).toBe('WDF_BLOCKID_MEASUREMENT');
  expect(btypes(0x53435857)).toBe('WDF_BLOCKID_CALIBRATION');
  expect(btypes(0x53495857)).toBe('WDF_BLOCKID_INSTRUMENT');
  expect(btypes(0x50414d57)).toBe('WDF_BLOCKID_MAPAREA');
  expect(btypes(0x4c544857)).toBe('WDF_BLOCKID_WHITELIGHT');
  expect(btypes(0x4c49414e)).toBe('WDF_BLOCKID_THUMBNAIL');
  expect(btypes(0x2050414d)).toBe('WDF_BLOCKID_MAP');
  expect(btypes(0x52414643)).toBe('WDF_BLOCKID_CURVEFIT');
  expect(btypes(0x534c4344)).toBe('WDF_BLOCKID_COMPONENT');
  expect(btypes(0x52414350)).toBe('WDF_BLOCKID_PCA');
  expect(btypes(0x4552434d)).toBe('WDF_BLOCKID_EM');
  expect(btypes(0x43444c5a)).toBe('WDF_BLOCKID_ZELDAC');
  expect(btypes(0x4c414352)).toBe('WDF_BLOCKID_RESPONSECAL');
  expect(btypes(0x20504143)).toBe('WDF_BLOCKID_CAP');
  expect(btypes(0x50524157)).toBe('WDF_BLOCKID_PROCESSING');
  expect(btypes(0x41524157)).toBe('WDF_BLOCKID_ANALYSIS');
  expect(btypes(0x4c424c57)).toBe('WDF_BLOCKID_SPECTRUMLABELS');
  expect(btypes(0x4b484357)).toBe('WDF_BLOCKID_CHECKSUM');
  expect(btypes(0x44435852)).toBe('WDF_BLOCKID_RXCALDATA');
  expect(btypes(0x46435852)).toBe('WDF_BLOCKID_RXCALFIT');
  expect(btypes(0x4c414358)).toBe('WDF_BLOCKID_XCAL');
  expect(btypes(0x48435253)).toBe('WDF_BLOCKID_SPECSEARCH');
  expect(btypes(0x504d4554)).toBe('WDF_BLOCKID_TEMPPROFILE');
  expect(btypes(0x56434e55)).toBe('WDF_BLOCKID_UNITCONVERT');
  expect(btypes(0x52505241)).toBe('WDF_BLOCKID_ARPLATE');
  expect(btypes(0x43454c45)).toBe('WDF_BLOCKID_ELECSIGN');
  expect(btypes(0x4c584b42)).toBe('WDF_BLOCKID_BKXLIST');
  expect(btypes(0x20585541)).toBe('WDF_BLOCKID_AUXILARYDATA');
  expect(btypes(0x474c4843)).toBe('WDF_BLOCKID_CHANGELOG');
  expect(btypes(0x46525553)).toBe('WDF_BLOCKID_SURFACE');
  expect(btypes(0xffffffff)).toBe('WDF_BLOCKID_ANY');
  expect(btypes(0x54455350)).toBe('WDF_STREAM_IS_PSET');
  expect(btypes(0x4d545343)).toBe('WDF_STREAM_IS_CSTM');
  expect(() => btypes(0x25)).toThrow('blockId 37 is not defined');
});
