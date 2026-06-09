import { formatFileSize, calculateSavings } from '../utils/fileSize';

/** @typedef {'idle'|'processing'|'preview'|'complete'|'error'} ConversionStatus */
/** @typedef {'image'|'pdf'|'generic'} PreviewType */

/**
 * @typedef {Object} FileSnapshot
 * @property {string} label
 * @property {string} fileName
 * @property {number} sizeBytes
 * @property {string} [formattedSize]
 * @property {string} [previewUrl]
 * @property {PreviewType} [previewType]
 */

/**
 * @typedef {Object} SavingsInfo
 * @property {number} bytesSaved
 * @property {number} percentSaved
 * @property {string} formattedSaved
 * @property {boolean} isReduction
 * @property {boolean} isIncrease
 * @property {boolean} isUnchanged
 */

/**
 * @typedef {Object} ComparisonItem
 * @property {string} id
 * @property {ConversionStatus} status
 * @property {FileSnapshot} before
 * @property {FileSnapshot|null} [after]
 * @property {SavingsInfo|null} [savings]
 * @property {Record<string, unknown>} [meta]
 */

export const CONVERSION_STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  PREVIEW: 'preview',
  COMPLETE: 'complete',
  ERROR: 'error',
};

/**
 * Membuat snapshot file standar untuk panel Before/After.
 */
export function createFileSnapshot({
  label = 'Asli',
  fileName = '',
  sizeBytes = 0,
  previewUrl = null,
  previewType = 'generic',
}) {
  return {
    label,
    fileName,
    sizeBytes,
    formattedSize: formatFileSize(sizeBytes),
    previewUrl,
    previewType,
  };
}

/**
 * Membangun item perbandingan lengkap setelah konversi/kompresi selesai.
 */
export function buildComparisonItem({
  id,
  before,
  after,
  status = CONVERSION_STATUS.COMPLETE,
  meta = {},
}) {
  const savings =
    after?.sizeBytes != null
      ? calculateSavings(before.sizeBytes, after.sizeBytes)
      : null;

  return {
    id,
    status,
    before: {
      ...before,
      formattedSize: before.formattedSize ?? formatFileSize(before.sizeBytes),
    },
    after: after
      ? {
          ...after,
          formattedSize: after.formattedSize ?? formatFileSize(after.sizeBytes),
        }
      : null,
    savings,
    meta,
  };
}

/**
 * Agregasi total Before vs After untuk beberapa file (batch/ZIP).
 */
export function buildAggregateComparison({ id, items, afterFileName, meta = {} }) {
  const totalBefore = items.reduce((s, i) => s + i.before.sizeBytes, 0);
  const totalAfter = items.reduce((s, i) => s + (i.after?.sizeBytes ?? 0), 0);

  return buildComparisonItem({
    id,
    status: CONVERSION_STATUS.COMPLETE,
    before: createFileSnapshot({
      label: 'Total Asli',
      fileName: `${items.length} berkas`,
      sizeBytes: totalBefore,
      previewType: 'generic',
    }),
    after: createFileSnapshot({
      label: 'Total Hasil',
      fileName: afterFileName,
      sizeBytes: totalAfter,
      previewType: 'generic',
    }),
    meta: { ...meta, fileCount: items.length, isAggregate: true },
  });
}
