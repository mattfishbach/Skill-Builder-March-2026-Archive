import { Storage } from "@google-cloud/storage";
import { readdir, stat } from "fs/promises";
import path from "path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
if (!BUCKET_ID) {
  console.error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");
  process.exit(1);
}

const ASSETS_DIR = path.resolve(process.cwd(), "attached_assets");

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".txt": "text/plain",
  };
  return types[ext] || "application/octet-stream";
}

async function uploadFile(filePath: string, filename: string) {
  const bucket = storageClient.bucket(BUCKET_ID!);
  const destPath = `public/${filename}`;
  const file = bucket.file(destPath);

  const [exists] = await file.exists();
  if (exists) {
    console.log(`  SKIP (already exists): ${destPath}`);
    return;
  }

  const fileStat = await stat(filePath);
  const sizeMB = (fileStat.size / (1024 * 1024)).toFixed(1);
  console.log(`  Uploading ${filename} (${sizeMB} MB)...`);

  await bucket.upload(filePath, {
    destination: destPath,
    contentType: getContentType(filename),
    resumable: fileStat.size > 5 * 1024 * 1024,
  });

  console.log(`  DONE: ${destPath}`);
}

async function main() {
  console.log(`Uploading assets from: ${ASSETS_DIR}`);
  console.log(`To bucket: ${BUCKET_ID}/public/\n`);

  const files = await readdir(ASSETS_DIR);
  const targetExts = [".mp4", ".mov", ".pdf", ".png", ".jpg", ".jpeg"];

  const targetFiles = files.filter((f) =>
    targetExts.includes(path.extname(f).toLowerCase())
  );

  console.log(`Found ${targetFiles.length} files to upload:\n`);

  for (const filename of targetFiles) {
    const filePath = path.join(ASSETS_DIR, filename);
    try {
      await uploadFile(filePath, filename);
    } catch (err) {
      console.error(`  ERROR uploading ${filename}:`, err);
    }
  }

  console.log("\nUpload complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
