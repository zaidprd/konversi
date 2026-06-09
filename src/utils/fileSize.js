/**
 * Utilitas ukuran file — dipakai di seluruh Conversion Dashboard.
 */

const UNITS = ['B', 'KB', 'MB', 'GB'];

export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '—';
  if (bytes === 0) return '0 B';

  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  const decimals = i === 0 ? 0 : value >= 10 ? 1 : 2;

  return `${value.toFixed(decimals)} ${UNITS[i]}`;
}

export function calculateSavings(originalBytes, resultBytes) {
  const bytesSaved = originalBytes - resultBytes;
  const percentSaved =
    originalBytes > 0 ? Math.round((bytesSaved / originalBytes) * 100) : 0;

  return {
    bytesSaved,
    percentSaved,
    formattedSaved: formatFileSize(Math.abs(bytesSaved)),
    isReduction: bytesSaved > 0,
    isIncrease: bytesSaved < 0,
    isUnchanged: bytesSaved === 0,
  };
}

export function sumFileSizes(items) {
  return items.reduce((sum, item) => sum + (item.sizeBytes ?? 0), 0);
}
