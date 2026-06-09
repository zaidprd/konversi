import React from 'react';

/**
 * Bar visual perbandingan ukuran — inspirasi Squoosh size indicator.
 * Lebar relatif menunjukkan proporsi before vs after.
 */
const FileSizeBar = ({ beforeBytes, afterBytes, className = '' }) => {
  const max = Math.max(beforeBytes, afterBytes, 1);
  const beforePct = Math.max((beforeBytes / max) * 100, 4);
  const afterPct = Math.max((afterBytes / max) * 100, 4);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 w-10 shrink-0">Asli</span>
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${beforePct}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-emerald-600 w-10 shrink-0">Hasil</span>
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${afterPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FileSizeBar;
