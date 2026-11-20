import assert from "node:assert";
import { sha256Hex } from "../src/crypto";

assert.equal(
  sha256Hex("abc"),
  "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
);
console.log("✓ sha256");
