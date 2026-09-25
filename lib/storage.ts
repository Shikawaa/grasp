import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION || "eu-central-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.warn("⚠️ AWS / Neon Object Storage environment variables are missing.");
}

export const s3Client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
  forcePathStyle: true, // Required for Neon Object Storage
});

/**
 * Upload a file buffer to a Neon Object Storage bucket.
 */
export async function uploadFile(
  bucket: "pdfs" | "audio",
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  if (bucket === "audio") {
    return getPublicAudioUrl(key);
  }

  return key;
}

/**
 * Generate a presigned URL to view or download a private file (e.g. PDF).
 * @param key The object key (e.g. `${userId}/${contentId}.pdf`)
 * @param expiresIn Expiration time in seconds (default: 3600 = 1 hour)
 */
export async function getSignedPdfUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: "pdfs",
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Construct the permanent public URL for a public_read asset (e.g. audio MP3).
 */
export function getPublicAudioUrl(key: string): string {
  const base = (process.env.AWS_ENDPOINT_URL_S3 || "").replace(/\/$/, "");
  return `${base}/audio/${key}`;
}

/**
 * Delete a file from a bucket.
 */
export async function deleteFile(bucket: "pdfs" | "audio", key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
}
