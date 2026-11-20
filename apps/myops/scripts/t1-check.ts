import assert from "node:assert";
import { sha256Hex, loadMasterKey, encrypt, decrypt } from "../src/crypto";
import { randomBytes } from "node:crypto";

assert.equal(
  sha256Hex("abc"),
  "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
);
console.log("✓ sha256");

assert.equal(loadMasterKey(Buffer.alloc(32).toString("base64")).length, 32);
assert.throws(() => loadMasterKey(Buffer.alloc(31).toString("base64")));
assert.throws(() => loadMasterKey(""));
assert.throws(() => loadMasterKey(undefined));
console.log("✓ loadMasterKey");

const key = randomBytes(32);
const a = encrypt(Buffer.from("สวัสดี"), key);
const b = encrypt(Buffer.from("สวัสดี"), key);
assert.equal(a[0], 0x01); // version
assert.equal(a.length, 1 + 12 + 16 + Buffer.from("สวัสดี").length); // ความยาวถูก
assert.ok(!a.equals(b)); // ข้อความเดิม แต่ blob ต่างกัน
assert.ok(!a.subarray(1, 13).equals(b.subarray(1, 13))); // IV ต่างกัน
console.log("✓ encrypt");

// round-trip
for (const p of [
  Buffer.alloc(0),
  Buffer.from("สวัสดี"),
  randomBytes(1024 * 1024),
]) {
  assert.ok(decrypt(encrypt(p, key), key).equals(p));
}

// แก้ 1 ไบต์ใน iv / tag / ciphertext → ต้อง throw
for (const i of [1, 13, 29]) {
  const bad = Buffer.from(encrypt(Buffer.from("hello"), key));
  bad[i] ^= 0xff;
  assert.throws(() => decrypt(bad, key));
}

// key ผิด, AAD ผิด
const blob = encrypt(Buffer.from("hello"), key, Buffer.from("msg-1"));
assert.throws(() => decrypt(blob, randomBytes(32), Buffer.from("msg-1")));
assert.throws(() => decrypt(blob, key, Buffer.from("msg-2")));
assert.ok(
  decrypt(blob, key, Buffer.from("msg-1")).equals(Buffer.from("hello")),
);

// blob สั้นเกิน
assert.throws(() => decrypt(Buffer.alloc(10), key));
console.log("✓ decrypt");
