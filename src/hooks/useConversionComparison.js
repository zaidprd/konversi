import { useState, useCallback } from 'react';
import {
  CONVERSION_STATUS,
  createFileSnapshot,
  buildComparisonItem,
  buildAggregateComparison,
} from '../types/conversion';

/**
 * Hook terpusat untuk mengelola state Before vs After di semua alat konversi.
 *
 * @example
 * const { items, setBefore, setAfter, setPreview, reset, aggregate } = useConversionComparison();
 */
export function useConversionComparison() {
  const [items, setItems] = useState([]);

  const upsertItem = useCallback((id, updater) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index === -1) {
        const newItem = typeof updater === 'function' ? updater(null) : updater;
        return newItem ? [...prev, newItem] : prev;
      }
      const updated = typeof updater === 'function' ? updater(prev[index]) : updater;
      if (!updated) return prev.filter((i) => i.id !== id);
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  /** Daftarkan file asli segera setelah upload */
  const setBefore = useCallback(
    (id, { fileName, sizeBytes, previewUrl, previewType = 'image', label = 'Asli' }) => {
      upsertItem(id, () => ({
        id,
        status: CONVERSION_STATUS.IDLE,
        before: createFileSnapshot({ label, fileName, sizeBytes, previewUrl, previewType }),
        after: null,
        savings: null,
        meta: {},
      }));
    },
    [upsertItem]
  );

  /** Update preview real-time (mis. saat slider kualitas berubah) */
  const setPreview = useCallback(
    (id, { fileName, sizeBytes, previewUrl, previewType = 'image', meta = {} }) => {
      upsertItem(id, (existing) => {
        if (!existing) return null;
        return buildComparisonItem({
          id,
          before: existing.before,
          after: createFileSnapshot({
            label: 'Pratinjau',
            fileName,
            sizeBytes,
            previewUrl,
            previewType,
          }),
          status: CONVERSION_STATUS.PREVIEW,
          meta: { ...existing.meta, ...meta },
        });
      });
    },
    [upsertItem]
  );

  /** Set hasil final setelah konversi/kompresi selesai */
  const setAfter = useCallback(
    (id, { fileName, sizeBytes, previewUrl, previewType = 'image', meta = {} }) => {
      upsertItem(id, (existing) => {
        if (!existing) return null;
        return buildComparisonItem({
          id,
          before: existing.before,
          after: createFileSnapshot({
            label: 'Hasil',
            fileName,
            sizeBytes,
            previewUrl,
            previewType,
          }),
          status: CONVERSION_STATUS.COMPLETE,
          meta: { ...existing.meta, ...meta },
        });
      });
    },
    [upsertItem]
  );

  const setProcessing = useCallback(
    (id) => {
      upsertItem(id, (existing) =>
        existing ? { ...existing, status: CONVERSION_STATUS.PROCESSING } : null
      );
    },
    [upsertItem]
  );

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const reset = useCallback(() => setItems([]), []);

  /** Set satu item perbandingan lengkap (untuk alat single-output: merge, split, pdf-to-img) */
  const setComparison = useCallback(
    (id, { before, after = null, status = CONVERSION_STATUS.IDLE, meta = {} }) => {
      upsertItem(id, () => {
        const beforeSnap = createFileSnapshot(before);
        if (!after) {
          return { id, status, before: beforeSnap, after: null, savings: null, meta };
        }
        return buildComparisonItem({
          id,
          before: beforeSnap,
          after: createFileSnapshot(after),
          status,
          meta,
        });
      });
    },
    [upsertItem]
  );

  const getAggregate = useCallback(
    (afterFileName, meta = {}) => {
      const complete = items.filter((i) => i.status === CONVERSION_STATUS.COMPLETE && i.after);
      if (complete.length === 0) return null;
      return buildAggregateComparison({
        id: 'aggregate',
        items: complete,
        afterFileName,
        meta,
      });
    },
    [items]
  );

  return {
    items,
    setBefore,
    setPreview,
    setAfter,
    setProcessing,
    setComparison,
    removeItem,
    reset,
    getAggregate,
  };
}
