/**
 * Utilitas konversi format gambar — browser-native (Canvas API).
 * Mendukung format yang tersedia di browser modern tanpa WASM.
 */

export const IMAGE_FORMATS = [
  {
    id: 'jpeg',
    label: 'JPEG (MozJPEG-style)',
    mime: 'image/jpeg',
    ext: 'jpg',
    hasQuality: true,
    desc: 'Terbaik untuk foto & ukuran kecil',
  },
  {
    id: 'webp',
    label: 'WebP',
    mime: 'image/webp',
    ext: 'webp',
    hasQuality: true,
    desc: 'Modern, ringan, dukung transparansi',
  },
  {
    id: 'png',
    label: 'PNG',
    mime: 'image/png',
    ext: 'png',
    hasQuality: false,
    desc: 'Lossless, ideal untuk grafis & transparansi',
  },
];

export function getFormatById(id) {
  return IMAGE_FORMATS.find((f) => f.id === id) ?? IMAGE_FORMATS[0];
}

export function dataUrlSizeBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.round(base64.length * (3 / 4));
}

export function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Konversi gambar ke format target.
 * @returns {{ dataUrl: string, sizeBytes: number, width: number, height: number }}
 */
export async function convertImage({ source, formatId, quality = 0.75 }) {
  const format = getFormatById(formatId);
  const img = typeof source === 'string' ? await loadImageElement(source) : source;

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  let dataUrl;
  if (format.hasQuality) {
    dataUrl = canvas.toDataURL(format.mime, quality / 100);
  } else {
    dataUrl = canvas.toDataURL(format.mime);
  }

  return {
    dataUrl,
    sizeBytes: dataUrlSizeBytes(dataUrl),
    width: canvas.width,
    height: canvas.height,
    format,
  };
}

export function buildConvertedFileName(originalName, formatId) {
  const format = getFormatById(formatId);
  const base = originalName.replace(/\.[^/.]+$/, '');
  return `${base}_konversi.${format.ext}`;
}
