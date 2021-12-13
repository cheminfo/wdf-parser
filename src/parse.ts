import { IOBuffer } from 'iobuffer';

/**
 * My module
 * @returns A very important number
 */
export function parse(data: Buffer | ArrayBuffer): object {
  const iobuffer = new IOBuffer(data);

  const result: any = {};
  const firstByte = iobuffer.readByte();
  if (firstByte === 87) {
    result.fileKind = 'wdf file';
  }
  iobuffer.readFloat32();
  console.log(firstByte);
  return result;
}
