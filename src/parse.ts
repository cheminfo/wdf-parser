import { IOBuffer } from 'iobuffer';

/**
 * My module
 * @returns A very important number
 */
export function parse(data: Buffer | ArrayBuffer): object {
  const iobuffer = new IOBuffer(data);
  return {};
}
