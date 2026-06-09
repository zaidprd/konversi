import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { formatFileSize } from '../../utils/fileSize';

/**
 * Perbandingan visual drag-slider ala Squoosh — geser untuk lihat Asli vs Hasil.
 */
const SquooshCompare = ({
  beforeUrl,
  afterUrl,
  beforeSize,
  afterSize,
  beforeLabel = 'Asli',
  afterLabel = 'Hasil',
  formatLabel = '',
  savingsPercent = null,
}) => {
  const [position, setPosition] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!afterUrl) setPosition(100);
    else setPosition(50);
  }, [afterUrl]);

  if (!beforeUrl) return null;

  return (
    <div className="space-y-3">
      {/* Canvas area — dark seperti Squoosh */}
      <div
        ref={containerRef}
        className="relative bg-slate-900 rounded-2xl overflow-hidden select-none"
        style={{ minHeight: '320px', maxHeight: '480px' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-4"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
        >
          <div className="relative inline-flex items-center justify-center max-w-full max-h-[420px]">
            <img
              src={beforeUrl}
              alt="Asli"
              className="block max-w-full max-h-[420px] w-auto h-auto object-contain"
              draggable={false}
            />
            {afterUrl && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                <img
                  src={afterUrl}
                  alt="Hasil"
                  className="block max-w-full max-h-[420px] w-auto h-auto object-contain"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* Divider + handle */}
          {afterUrl && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-lg z-10 cursor-ew-resize"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border-2 border-slate-300 shadow-xl flex items-center justify-center">
                <GripVertical size={16} className="text-slate-600" />
              </div>
            </div>
          )}
        </div>

        {/* Label kiri/kanan */}
        {afterUrl && (
          <>
            <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {beforeLabel}
            </div>
            <div className="absolute top-3 right-3 bg-brand-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {afterLabel}{formatLabel ? ` · ${formatLabel}` : ''}
            </div>
          </>
        )}
      </div>

      {/* Toolbar bawah — zoom */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(25, z - 15))}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          title="Perkecil"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-bold text-slate-500 w-12 text-center tabular-nums">{zoom}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(200, z + 15))}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          title="Perbesar"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoom(100)}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          title="Reset zoom"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Info bar ukuran — seperti Squoosh bottom panel */}
      {afterUrl && beforeSize != null && afterSize != null && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900 rounded-xl text-white">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Asli</p>
              <p className="text-lg font-black tabular-nums">{formatFileSize(beforeSize)}</p>
            </div>
            <div className="text-slate-500 text-xl">→</div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Hasil</p>
              <p className="text-lg font-black tabular-nums text-emerald-400">{formatFileSize(afterSize)}</p>
            </div>
          </div>
          {savingsPercent != null && (
            <div className={`self-start sm:self-center text-sm font-extrabold px-4 py-2 rounded-full ${
              savingsPercent > 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : savingsPercent < 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-700 text-slate-300'
            }`}>
              {savingsPercent > 0 ? `↓ ${savingsPercent}%` : savingsPercent < 0 ? `↑ ${Math.abs(savingsPercent)}%` : '0%'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SquooshCompare;
