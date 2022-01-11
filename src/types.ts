/**
 * Maps numeric type for block-header or file-header to a semantic label (a name)
 * @export
 * @param blockId type code
 * @return Semantic label for block
 */
export function btypes(blockId: number): string {
  switch (blockId) {
    case 0x31464457:
      return 'WDF_BLOCKID_FILE'; /** holds important file metadata */
    case 0x41544144:
      return 'WDF_BLOCKID_DATA'; /** all spectras, in 32b floating numbers */
    case 0x54534c59:
      return 'WDF_BLOCKID_YLIST'; /** holds values in case 2D images were taken.
    For spectra is a single value and is usually ignored */
    case 0x54534c58:
      return 'WDF_BLOCKID_XLIST'; /** nPoints unit values for x axis */
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
      throw new Error(`blockId ${blockId} is not defined`);
  }
}

/**
 * Get descriptive spectral data-unit from code
 * @export
 * @param num code
 * @return spectral data-units used
 */
export function getMeasurementUnits(num: number): string {
  switch (num) {
    case 0:
      return 'arbitrary units';
    case 1:
      return 'Raman shift (cm-1)';
    case 2:
      return 'wavenumber (nm)';
    case 3:
      return '10-9 metres (nm)';
    case 4:
      return 'electron volts (eV)';
    case 5:
      return '10-6 metres (um)';
    case 6:
      return 'counts';
    case 7:
      return 'electrons';
    case 8:
      return '10-3 metres (mm)';
    case 9:
      return 'metres (m)';
    case 10:
      return 'Temperature (K)';
    case 11:
      return 'Pascals (Pa)';
    case 12:
      return 'seconds (s)';
    case 13:
      return 'milliseconds (ms)';
    case 14:
      return 'Hours (hs)';
    case 15:
      return 'Days (ds)';
    case 16:
      return 'Pixels';
    case 17:
      return 'Intensity';
    case 18:
      return 'Relative Intensity';
    case 19:
      return 'Degrees';
    case 20:
      return 'Temperature (C)';
    case 21:
      return 'Temperature (F)';
    case 22:
      return 'Kelvin per minute';
    case 23:
      return 'Filetime as Windows FileTime';
    case 24:
      return 'Endmarker';
    default:
      throw new Error(`Unexpected value for unit: ${num}`);
  }
}

/**
 * Get descriptive spectral data-unit from code
 * @export
 * @param code
 * @return unit to use in axis
 */
export function getListType(unit: number): string {
  switch (unit) {
    case 0:
      return 'arbitrary'; /**< arbitrary type */
    case 1:
      return 'spectral'; /*deprecated*/
    case 2:
      return 'Intensity'; /**< arbitrary type */
    case 3:
      return 'X position'; /**< arbitrary type */
    case 4:
      return 'Y axis position'; /**< arbitrary type */
    case 5:
      return 'Z axis (vertical) position'; /**< arbitrary type */
    case 6:
      return 'R axis (rotary) position';
    case 7:
      return 'Theta angle (rotary) position';
    case 8:
      return 'phi angle (rotary) position';
    case 9:
      return 'Temperature';
    case 10:
      return 'Pressure';
    case 11:
      return 'Time';
    case 12:
      return 'Derived';
    case 13:
      return 'Polarization';
    case 14:
      return 'Focus Track Z position';
    case 15:
      return 'Temperature Ramp rate';
    case 16:
      return 'Spectrum Data Checksum';
    case 17:
      return 'Bit Flags';
    case 18:
      return 'Elapsed Time Intervals';
    case 19:
      return 'Frequency';
    case 20:
      return 'Microplate Well Spatial X';
    case 21:
      return 'Microplate Well Spatial Y';
    case 22:
      return 'Location Index';
    case 23:
      return 'Well Reference';
    case 24:
      return 'End Marker';
    default:
      throw new Error(`Unexpected List unit: ${unit}`);
  }
}

/**
 * Descriptive tag for spectra in file (unspecified, single,series, map)
 * @param type from the fileheader
 * @returns semantic type
 */
export type OverallSpectraDescription =
  | 'unspecified'
  | 'single'
  | 'series'
  | 'map';
export function getOverallSpectraDescription(
  type: number,
): OverallSpectraDescription {
  switch (type) {
    case 0:
      return 'unspecified';
    case 1:
      return 'single'; /* file contains a single spectrum */
    case 2:
      return 'series'; /* file contains multiple spectra with one common data origin (time, depth, temperature etc) */
    case 3:
      return 'map'; /* file contains multiple spectra with more that one common data origin. Typically area maps use X and Y spatial origins. Volume maps use X, Y and Z. The WMAP block normally defines the physical region.obeys the maparea object. check scan type for streamline, linefocus, etc. */
    default:
      throw new Error(`Expected: 0,1,2 or 3. Got ${type}`);
  }
}

/**
 *
 * Retrieves the name of the data collection method used (scan type)
 * @export
 * @param scanType the data collection method used
 * @return semantic scan type
 */

export function getScanType(scanType: number): string {
  switch (scanType) {
    case 0x0000:
      return 'WdfScanType_Unspecified';
    /*< for data that does not represent a spectrum collected from a Renishaw system */
    case 0x0001:
      /*< for single readout off the detector. Can be spectrum or image */
      return 'WdfScanType_Static';
    case 0x0002:
      /*< for readouts using continuous extended scanning. Can be spectrum or image (unlikely; impossible for x axis readout) */
      return 'WdfScanType_Continuous';
    case 0x0003:
      /*< for multiple statics taken at slightly overlapping ranges, then 'stitched' together to a single extended spectrum. Can be spectrum or image (unlikely) */
      return 'WdfScanType_StepRepeat';
    case 0x0004:
      /*< filter image and filter scan both supported purely for historical reasons */
      return 'WdfScanType_FilterScan';
    case 0x0005:
      return 'WdfScanType_FilterImage';
    case 0x0006:
      /*< must be a WdfType_Map measurement */
      return 'WdfScanType_StreamLine';
    case 0x0007:
      /*< must be a WdfType_Map measurement */
      return 'WdfScanType_StreamLineHR';
    case 0x0008:
      /*< for scans performed with a point detector */
      return 'WdfScanType_Point';

    /* The values below for multitrack and linefocus are flags that can be ORed with the above integer values
     *  - multitrack discrete on fixed grating systems will only be static
     *  - multitrack discrete could, on a fibre-probe system, be continuous, stitched, or static
     *  - linefocusmapping similarly couild be continuous, stitched, or static, but at time of writing is static
     */
    case 0x0100:
      /*< result is not a multitrack file */
      return 'WdfScanType_MultitrackStitched';
    case 0x0200:
      /*< result is multitrack file (wdf header has multitrack flag set).*/
      return 'WdfScanType_MultitrackDiscrete';
    case 0x0400:
      /*< Could be Static, Continuous (not yet implemented, impossible for x axis readout), or StepAndRepeat (not yet implemented) */
      return 'WdfScanType_LineFocusMapping';
    default:
      throw new Error(`${scanType} is not in the set of possible values`);
  }
}

export interface WdfSpectrumFlags {
  /**< Saturation flag. Some part of the spectrum data was saturated */
  saturated: boolean;
  /**< Error flag. An error occurred while collecting this spectrum */
  error: boolean;
  /**< Cosmic ray flag. A cosmic ray was detected and accepted in software */
  cosmicRay: boolean;
  errorCode: number;
}

export function getWdfSpectrumFlags(flags: bigint): WdfSpectrumFlags {
  const flagsString = flags.toString(2);
  const lowerIsFlags = parseInt(flagsString.slice(0, 32));
  const upperIsError = parseInt(flagsString.slice(32));
  return {
    saturated: (lowerIsFlags & 0) !== 0,
    error: (lowerIsFlags & 0b10) !== 0,
    cosmicRay: (lowerIsFlags & 0b100) !== 0,
    errorCode: upperIsError,
  } as WdfSpectrumFlags;
}
