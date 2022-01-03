import { IOBuffer } from 'iobuffer';

// Types
export interface AppVersion {
  [key: string]: number;
}
export type ReadBytes64 = (buffer: IOBuffer, nGroups: number) => number[];

/**
 * Reads n groups of bytes of certain length
 * @param buffer WDF buffer
 * @param nGroups number of bytes
 * @return array of X-bit bytes.
 */
export const readBytes64: ReadBytes64 = (buffer, nGroups) => {
  if (nGroups === 0) {
    throw new Error('nGroups has to be different from 0');
  }
  let groupsOf64: number[] = [];
  for (let i = 0; i < nGroups; i++) {
    groupsOf64.push(Number(buffer.readBigUint64()));
  }
  return groupsOf64;
};

/**
 * Build the semantic versioning
 * @param buffer WDF buffer
 * @return Object containing WDF semantic versioning
 */
export function getAppVersion(buffer: IOBuffer): AppVersion {
  const [major, minor, patch, build] = new Uint16Array(buffer.readBytes(8).buffer);
  return { major, minor, patch, build };
}

/**
 * Universal identifier (as a string) for files and blocks
 * @param buffer WDF buffer
 * @param bytes number of bytes to read
 * @return uuid as a string
 */
export function getUUId(buffer: IOBuffer, bytes = 4): string {
  let version = new Uint32Array(buffer.readBytes(bytes).buffer);
  return version.join('.');
}
