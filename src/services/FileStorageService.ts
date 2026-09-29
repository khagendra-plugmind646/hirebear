/**
 * Private object storage abstraction. Swap the bundled-file implementation
 * below for an S3/R2-backed one once you outgrow it — the interface (and
 * every caller) stays the same. Nothing here ever returns a permanent
 * public URL.
 */
export interface FileStorageService {
  upload(key: string, data: Buffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
  getFile(key: string): Promise<Buffer>;
  /** Returns a URL that is only valid for `expiresInSeconds`. */
  createTemporaryDownload(key: string, expiresInSeconds: number): Promise<string>;
}

// --- Bundled-file implementation, for launch ------------------------------
// Excel files live in /private-files at the project root (NOT inside
// /public — anything in /public is served directly to anyone who guesses
// the URL). This folder is committed to git and deployed as part of the
// build, so `getFile`/`createTemporaryDownload` work on Vercel too — reading
// bundled files is fine on a serverless filesystem, only writing isn't.
//
// To add or replace a product's file for launch: drop the .xlsx into
// private-files/products/, commit it, and set Product.filePath to
// "products/your-file.xlsx" (see scripts/seed.ts). `upload`/`delete` below
// only work on a writable local disk during `npm run dev` — the admin
// "Upload" button will fail on Vercel until you move to real object
// storage, so for now update files via git + redeploy instead.
class BundledFileStorageService implements FileStorageService {
  private baseDir = process.env.PRIVATE_FILES_DIR || "./private-files";

  async upload(key: string, data: Buffer): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const full = path.join(this.baseDir, key);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, data);
  }

  async delete(key: string): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");
    await fs.unlink(path.join(this.baseDir, key)).catch(() => {});
  }

  async getFile(key: string): Promise<Buffer> {
    const fs = await import("fs/promises");
    const path = await import("path");
    return fs.readFile(path.join(this.baseDir, key));
  }

  async createTemporaryDownload(key: string, expiresInSeconds: number): Promise<string> {
    // The link itself is a short-lived signed token, verified by
    // /api/purchases/download-file/[token] — never a direct file path,
    // so the underlying key/location is never exposed to the client.
    const jwt = await import("jsonwebtoken");
    const token = jwt.sign({ key }, process.env.NEXTAUTH_SECRET as string, {
      expiresIn: expiresInSeconds,
    });
    return `/api/purchases/download-file/${token}`;
  }
}

export function getFileStorageService(): FileStorageService {
  // Swap this for an S3/R2 implementation behind the same interface once
  // STORAGE_PROVIDER is set to something other than "local".
  return new BundledFileStorageService();
}
