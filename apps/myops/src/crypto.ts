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
  if (!b64) {
    throw new Error("MASTER_KEY is not set");
  }

  const key = Buffer.from(b64, "base64");

  if (key.length !== 32) {
    throw new Error(`MASTER_KEY must be 32 bytes, got ${key.length}`);
  }
  return key;
}

export function encrypt(plain: Buffer, key: Buffer, aad?: Buffer): Buffer {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv("aes-256-gcm", key, iv, {
    authTagLength: TAG_LEN,
  });
  if (aad) cipher.setAAD(aad);

  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();

  const ver = Buffer.from([VERSION]);

  return Buffer.concat([ver, iv, tag, ciphertext]);
}

export function decrypt(blob: Buffer, key: Buffer, aad?: Buffer): Buffer {
  if (blob.length < 1 + IV_LEN + TAG_LEN) {
    throw new Error(
      `Encrypted blob too short: need at least ${1 + IV_LEN + TAG_LEN} bytes, got ${blob.length}`,
    );
  }
  if (blob[0] !== VERSION) {
    throw new Error(`Unsupported blob version: ${blob[0]}`);
  }

  const iv = blob.subarray(1, 1 + IV_LEN);
  const tag = blob.subarray(1 + IV_LEN, 1 + IV_LEN + TAG_LEN);
  const ciphertext = blob.subarray(1 + IV_LEN + TAG_LEN);

  const decipher = createDecipheriv("aes-256-gcm", key, iv, {
    authTagLength: TAG_LEN,
  });
  if (aad) decipher.setAAD(aad);

  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function sha256Hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}
