import React from 'react';
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Image as ImageIcon,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { CONVERSION_STATUS } from '../../types/conversion';
import FileSizeBar from './FileSizeBar';

const PreviewPanel = ({ snapshot, variant }) => {
  const isBefore = variant === 'before';
  const borderClass = isBefore
    ? 'border-slate-200 bg-slate-50'
    : 'border-emerald-200 bg-emerald-50/40';

  return (
    <div className={`flex-1 rounded-xl border-2 ${borderClass} p-4 flex flex-col min-w-0`}>
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[10px] font-extrabold uppercase tracking-widest ${
            isBefore ? 'text-slate-500' : 'text-emerald-600'
          }`}
        >
          {snapshot?.label ?? (isBefore ? 'Sebelum' : 'Sesudah')}
        </span>
        {snapshot?.sizeBytes != null && (
          <span
            className={`text-sm font-black tabular-nums ${
              isBefore ? 'text-slate-700' : 'text-emerald-700'
            }`}
          >
            {snapshot.formattedSize}
          </span>
        )}
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center min-h-[120px] md:min-h-[140px] rounded-lg bg-white border border-slate-100 overflow-hidden">
        {snapshot?.previewUrl && snapshot.previewType === 'image' ? (
          <img
            src={snapshot.previewUrl}
            alt={snapshot.fileName}
            className="max-h-[140px] max-w-full object-contain"
          />
        ) : snapshot?.previewType === 'pdf' ? (
          <div className="flex flex-col items-center text-slate-400">
            <FileText size={40} className="text-brand-400 mb-2" />
            <span className="text-[10px] font-bold">PDF</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <ImageIcon size={36} />
            <span className="text-[10px] mt-1">Pratinjau</span>
          </div>
        )}
      </div>

      {snapshot?.fileName && (
        <p className="mt-2 text-[11px] font-semibold text-slate-600 truncate" title={snapshot.fileName}>
          {snapshot.fileName}
        </p>
      )}
    </div>
  );
};

const SavingsBadge = ({ savings, status }) => {
  if (!savings && status !== CONVERSION_STATUS.PROCESSING) return null;

  if (status === CONVERSION_STATUS.PROCESSING) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-100">
        <RefreshCw size={12} className="animate-spin" />
        Memproses...
      </div>
    );
  }

  if (status === CONVERSION_STATUS.PREVIEW) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-100">
        <RefreshCw size={12} />
        Pratinjau Langsung
      </div>
    );
  }

  const { percentSaved, formattedSaved, isReduction, isIncrease, isUnchanged } = savings;

  if (isUnchanged) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
        <Minus size={12} />
        Ukuran sama
      </div>
    );
  }

  if (isIncrease) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-100">
        <TrendingUp size={12} />
        +{Math.abs(percentSaved)}% ({formattedSaved} lebih besar)
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100">
      <TrendingDown size={12} />
      Hemat {percentSaved}% ({formattedSaved})
    </div>
  );
};

/**
 * Kartu perbandingan Before vs After — komponen inti Conversion Dashboard.
 *
 * @param {Object} props
 * @param {import('../../types/conversion').ComparisonItem} props.item
 * @param {boolean} [props.compact] - Layout ringkas untuk daftar multi-file
 * @param {React.ReactNode} [props.actions] - Tombol unduh/hapus di kanan bawah
 */
const ComparisonCard = ({ item, compact = false, actions = null }) => {
  const { before, after, savings, status, meta } = item;
  const showAfter = after && status !== CONVERSION_STATUS.IDLE;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-brand-200 transition-colors">
        {before.previewUrl && (
          <img
            src={before.previewUrl}
            alt=""
            className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold text-slate-800 truncate">{before.fileName}</p>
          <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
            <span className="text-slate-500">{before.formattedSize}</span>
            {showAfter && (
              <>
                <ArrowRight size={10} className="text-slate-300 shrink-0" />
                <span className="text-emerald-600 font-bold">{after.formattedSize}</span>
              </>
            )}
          </div>
        </div>
        <SavingsBadge savings={savings} status={status} />
        {actions}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      {/* Header: ukuran real-time */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Ukuran File:</span>
            <span className="text-sm font-black text-slate-700 tabular-nums">
              {before.formattedSize}
            </span>
            {showAfter && (
              <>
                <ArrowRight size={14} className="text-brand-400 shrink-0" />
                <span className="text-sm font-black text-emerald-600 tabular-nums">
                  {after.formattedSize}
                </span>
              </>
            )}
          </div>
          <SavingsBadge savings={savings} status={status} />
        </div>

        {showAfter && (
          <div className="mt-3">
            <FileSizeBar beforeBytes={before.sizeBytes} afterBytes={after.sizeBytes} />
          </div>
        )}
      </div>

      {/* Before vs After panels */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
          <PreviewPanel snapshot={before} variant="before" />

          <div className="hidden md:flex items-center justify-center px-1">
            <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
              <ArrowRight size={16} className="text-brand-500" />
            </div>
          </div>

          {showAfter ? (
            <PreviewPanel snapshot={after} variant="after" />
          ) : (
            <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center min-h-[160px]">
              <RefreshCw
                size={24}
                className={`text-slate-300 mb-2 ${status === CONVERSION_STATUS.PROCESSING ? 'animate-spin text-brand-400' : ''}`}
              />
              <p className="text-xs font-semibold text-slate-400 text-center">
                {status === CONVERSION_STATUS.PROCESSING
                  ? 'Sedang mengonversi...'
                  : 'Hasil akan muncul di sini'}
              </p>
            </div>
          )}
        </div>

        {(meta?.quality != null || meta?.format) && (
          <p className="mt-3 text-[10px] text-slate-400 text-center">
            {meta?.format && <>Format: <strong className="text-slate-600">{meta.format}</strong></>}
            {meta?.quality != null && <> · Kualitas: <strong className="text-slate-600">{meta.quality}%</strong></>}
          </p>
        )}

        {actions && <div className="mt-4 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default ComparisonCard;
