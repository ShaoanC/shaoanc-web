import imageCompression from 'browser-image-compression';
import compressionWorkerUrl from 'browser-image-compression/dist/browser-image-compression.js?url';

const jpegOptions = { maxSizeMB: 1.5, maxWidthOrHeight: 2560, fileType: 'image/jpeg', initialQuality: .88 };

export async function compressJpeg(file: File, options: { maxSizeMB?: number; maxWidthOrHeight?: number; initialQuality?: number } = {}): Promise<File> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    return await imageCompression(file, { ...jpegOptions, ...options, useWebWorker: true, libURL: compressionWorkerUrl, signal: controller.signal });
  } catch (err) {
    // The library already retries ordinary worker errors on the main thread. An aborted
    // worker also enters that path, but its aborted signal immediately rejects it.
    if (!controller.signal.aborted) throw err;
    return imageCompression(file, { ...jpegOptions, ...options, useWebWorker: false });
  } finally { clearTimeout(timeout); }
}
