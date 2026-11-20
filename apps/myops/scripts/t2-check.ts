import assert from "node:assert";
import { randomBytes } from "node:crypto";
import { putObject, getObject, verifyObject } from "../src/storage";
import { encrypt, decrypt, sha256Hex } from "../src/crypto";

process.loadEnvFile(); // โหลดค่าจาก .env (ใช้ได้ใน Node 24)

const key = `t2-check/${randomBytes(8).toString("hex")}`;
const data = randomBytes(1024 * 1024);

const r = await putObject(key, data);
assert.equal(r.sha256, sha256Hex(data));
assert.equal(r.size, data.length);
console.log("✓ put");

assert.ok((await getObject(key)).equals(data));
console.log("✓ get");

assert.equal(await verifyObject(key, r.sha256), true);
assert.equal(await verifyObject(key, "0".repeat(64)), false);
console.log("✓ verify");

await assert.rejects(() => getObject("t2-check/does-not-exist"));
console.log("✓ missing key throws");

// ท่อเต็ม: เข้ารหัส → อัปโหลด → ดาวน์โหลด → ถอดรหัส
const mk = randomBytes(32);
const plain = Buffer.from("สวัสดี B2");
const k2 = `t2-check/${randomBytes(8).toString("hex")}`;
await putObject(k2, encrypt(plain, mk, Buffer.from(k2)));
assert.ok(decrypt(await getObject(k2), mk, Buffer.from(k2)).equals(plain));
console.log("✓ encrypt → B2 → decrypt");
