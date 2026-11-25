import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { sha256Hex } from "./crypto";
import { requireEnv } from "./env";

let client: S3Client | undefined;

function getClient(): S3Client {
  if (client) return client;

  client = new S3Client({
    endpoint: requireEnv("B2_ENDPOINT"),
    region: requireEnv("B2_REGION"),
    credentials: {
      accessKeyId: requireEnv("B2_KEY_ID"),
      secretAccessKey: requireEnv("B2_APP_KEY"),
    },
  });
  return client;
}

export async function putObject(
  key: string,
  data: Buffer,
): Promise<{ sha256: string; size: number }> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: requireEnv("B2_BUCKET"),
      Key: key,
      Body: data,
    }),
  );

  return { sha256: sha256Hex(data), size: data.length };
}

export async function getObject(key: string): Promise<Buffer> {
  const res = await getClient().send(
    new GetObjectCommand({ Bucket: requireEnv("B2_BUCKET"), Key: key }),
  );
  if (!res.Body) throw new Error(`B2 object "${key}" has no body`);
  return Buffer.from(await res.Body.transformToByteArray());
}

export async function verifyObject(
  key: string,
  expectedSha256: string,
): Promise<boolean> {
  const object = await getObject(key);
  return expectedSha256 === sha256Hex(object);
}
