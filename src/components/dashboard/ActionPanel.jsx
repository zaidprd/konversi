import React from 'react';
import { CheckCircle2, Download, RefreshCw } from 'lucide-react';

/**
 * Panel aksi sidebar reusable — progress, download, tombol utama.
 */
const ActionPanel = ({
  title,
  emptyMessage,
  isReady = true,
  isProcessing = false,
  progress = 0,
  processStep = '',
  downloadUrl = null,
  downloadName = '',
  downloadLabel = 'Unduh Hasil',
  onAction,
  actionLabel = 'Mulai',
  actionIcon: ActionIcon,
  onReset,
  resetLabel = 'Ulangi',
  footerNote = '🔒 Proses 100% lokal di browser Anda.',
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
      {title}
    </h3>

    {!isReady ? (
      <div className="text-slate-400 py-6 text-xs">
        <p>{emptyMessage}</p>
      </div>
    ) : (
      <div className="space-y-4">
        {isProcessing ? (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{processStep}</span>
              <span className="font-bold text-brand-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-center items-center text-xs text-slate-500 mt-2">
              <RefreshCw className="animate-spin text-brand-500 mr-2" size={12} />
              Sedang memproses...
            </div>
          </div>
        ) : downloadUrl ? (
          <div className="space-y-3 py-2">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-start text-left">
              <CheckCircle2 size={16} className="text-emerald-500 mr-2 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Selesai!</p>
                <p className="text-slate-600 mt-0.5 text-[10px] break-all">{downloadName}</p>
              </div>
            </div>
            <a
              href={downloadUrl}
              download={downloadName}
              className="flex justify-center items-center w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-md space-x-2 text-sm"
            >
              <Download size={16} />
              <span>{downloadLabel}</span>
            </a>
            {onReset && (
              <button
                onClick={onReset}
                className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto mt-2"
              >
                {resetLabel}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onAction}
            className="flex justify-center items-center w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg space-x-2 text-sm"
          >
            {ActionIcon && <ActionIcon size={18} />}
            <span>{actionLabel}</span>
          </button>
        )}
        <div className="text-[10px] text-slate-400">{footerNote}</div>
      </div>
    )}
  </div>
);

export default ActionPanel;
