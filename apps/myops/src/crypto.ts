// packages/myops/src/crypto.ts
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const VERSION = 0x01;
const IV_LEN = 12;
const TAG_LEN = 16;

export function loadMasterKey(
  b64: string | undefined = process.env.MASTER_KEY,
): Buffer {
  throw new Error("TODO");
}

export function encrypt(plain: Buffer, key: Buffer, aad?: Buffer): Buffer {
  throw new Error("TODO");
}

export function decrypt(blob: Buffer, key: Buffer, aad?: Buffer): Buffer {
  throw new Error("TODO");
}

export function sha256Hex(data: Buffer | string): string {
  throw new Error("TODO");
}
