import { btypes, getScanType, getOverallSpectraDescription, getListType, getMeasurementUnits } from '../types';

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

test('Experiment\'s Measurement Units', (): void => {
expect(getMeasurementUnits(0)).toBe("arbitrary units")
expect(getMeasurementUnits(1)).toBe("Raman shift (cm-1)")
expect(getMeasurementUnits(2)).toBe("wavenumber (nm)")
expect(getMeasurementUnits(3)).toBe("10-9 metres (nm)")
expect(getMeasurementUnits(4)).toBe("electron volts (eV)")
expect(getMeasurementUnits(5)).toBe("10-6 metres (um)")
expect(getMeasurementUnits(6)).toBe("counts")
expect(getMeasurementUnits(7)).toBe("electrons")
expect(getMeasurementUnits(8)).toBe("10-3 metres (mm)")
expect(getMeasurementUnits(9)).toBe("metres (m)")
expect(getMeasurementUnits(10)).toBe("Temperature (K)")
expect(getMeasurementUnits(11)).toBe("Pascals (Pa)")
expect(getMeasurementUnits(12)).toBe("seconds (s)")
expect(getMeasurementUnits(13)).toBe("milliseconds (ms)")
expect(getMeasurementUnits(14)).toBe("Hours (hs)")
expect(getMeasurementUnits(15)).toBe("Days (ds)")
expect(getMeasurementUnits(16)).toBe("Pixels")
expect(getMeasurementUnits(17)).toBe("Intensity")
expect(getMeasurementUnits(18)).toBe("Relative Intensity")
expect(getMeasurementUnits(19)).toBe("Degrees")
expect(getMeasurementUnits(20)).toBe("Temperature (C)")
expect(getMeasurementUnits(21)).toBe("Temperature (F)")
expect(getMeasurementUnits(22)).toBe("Kelvin per minute")
expect(getMeasurementUnits(23)).toBe("Filetime as Windows FileTime")
expect(getMeasurementUnits(24)).toBe("Endmarker")
expect(()=>getMeasurementUnits(25)).toThrow("Unexpected value for unit: 25")
})


test('Experiment\'s List Units', (): void => {
expect(getListType(0)).toBe("arbitrary")
expect(getListType(1)).toBe("spectral")
expect(getListType(2)).toBe("Intensity")
expect(getListType(3)).toBe("X position")
expect(getListType(4)).toBe("Y axis position")
expect(getListType(5)).toBe("Z axis (vertical) position")
expect(getListType(6)).toBe("R axis (rotary) position")
expect(getListType(7)).toBe("Theta angle (rotary) position")
expect(getListType(8)).toBe("phi angle (rotary) position")
expect(getListType(9)).toBe("Temperature")
expect(getListType(10)).toBe("Pressure")
expect(getListType(11)).toBe("Time")
expect(getListType(12)).toBe("Derived")
expect(getListType(13)).toBe("Polarization")
expect(getListType(14)).toBe("Focus Track Z position")
expect(getListType(15)).toBe("Temperature Ramp rate")
expect(getListType(16)).toBe("Spectrum Data Checksum")
expect(getListType(17)).toBe("Bit Flags")
expect(getListType(18)).toBe("Elapsed Time Intervals")
expect(getListType(19)).toBe("Frequency")
expect(getListType(20)).toBe("Microplate Well Spatial X")
expect(getListType(21)).toBe("Microplate Well Spatial Y")
expect(getListType(22)).toBe("Location Index")
expect(getListType(23)).toBe("Well Reference")
expect(getListType(24)).toBe("End Marker")
expect(()=>getListType(25)).toThrow("Unexpected List unit: 25")
})


test('Word describing the type of spectra in the file', (): void => {
expect(getOverallSpectraDescription(0)).toBe("unspecified")
expect(getOverallSpectraDescription(1)).toBe("single")
expect(getOverallSpectraDescription(2)).toBe("series")
expect(getOverallSpectraDescription(3)).toBe("map")
expect(()=>getOverallSpectraDescription(25)).toThrow("Expected: 0,1,2 or 3. Got 25")	
})

test('Type of scan done corresponds to value', ():void =>{
expect(getScanType(0)).toBe("WdfScanType_Unspecified")
expect(getScanType(1)).toBe("WdfScanType_Static")
expect(getScanType(2)).toBe("WdfScanType_Continuous")
expect(getScanType(3)).toBe("WdfScanType_StepRepeat")
expect(getScanType(4)).toBe("WdfScanType_FilterScan")
expect(getScanType(5)).toBe("WdfScanType_FilterImage")
expect(getScanType(6)).toBe("WdfScanType_StreamLine")
expect(getScanType(7)).toBe("WdfScanType_StreamLineHR")
expect(getScanType(8)).toBe("WdfScanType_Point")
expect(getScanType(256)).toBe("WdfScanType_MultitrackStitched")
expect(getScanType(512)).toBe("WdfScanType_MultitrackDiscrete")
expect(getScanType(1024)).toBe("WdfScanType_LineFocusMapping")
expect(()=>getScanType(25)).toThrow("25 is not in the set of possible values")
})
