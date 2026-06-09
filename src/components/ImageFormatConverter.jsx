import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, HelpCircle, Download, RefreshCw, Image as ImageIcon, ChevronDown,
} from 'lucide-react';
import AdBanner from './AdBanner';
import { ConversionDashboard } from './dashboard';
import SquooshCompare from './dashboard/SquooshCompare';
import { useConversionComparison } from '../hooks/useConversionComparison';
import { CONVERSION_STATUS } from '../types/conversion';
import { calculateSavings, formatFileSize } from '../utils/fileSize';
import {
  IMAGE_FORMATS,
  getFormatById,
  convertImage,
  buildConvertedFileName,
} from '../utils/imageConvert';

const COMPARISON_ID = 'format-convert';

const ImageFormatConverter = () => {
  const [image, setImage] = useState(null);
  const [formatId, setFormatId] = useState('jpeg');
  const [quality, setQuality] = useState(75);
  const [previewResult, setPreviewResult] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');

  const fileInputRef = useRef(null);
  const previewTimerRef = useRef(null);

  const { items: comparisonItems, setComparison, reset: resetComparison } = useConversionComparison();

  const runPreview = useCallback(async (img, fmt, q) => {
    if (!img) return;
    setIsPreviewing(true);
    try {
      const result = await convertImage({
        source: img.preview,
        formatId: fmt,
        quality: q,
      });

      setPreviewResult(result);

      const format = getFormatById(fmt);
      setComparison(COMPARISON_ID, {
        before: {
          label: 'Asli',
          fileName: img.name,
          sizeBytes: img.sizeBytes,
          previewUrl: img.preview,
          previewType: 'image',
        },
        after: {
          label: 'Hasil',
          fileName: buildConvertedFileName(img.name, fmt),
          sizeBytes: result.sizeBytes,
          previewUrl: result.dataUrl,
          previewType: 'image',
        },
        status: CONVERSION_STATUS.PREVIEW,
        meta: { quality: q, format: format.label },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreviewing(false);
    }
  }, [setComparison]);

  const processFile = (file) => {
    const valid =
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp|bmp|gif)$/i.test(file.name);

    if (!valid) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP, BMP, GIF).');
      return;
    }

    const preview = URL.createObjectURL(file);
    const item = {
      id: 'single',
      file,
      name: file.name,
      sizeBytes: file.size,
      preview,
    };

    setImage(item);
    setDownloadUrl(null);
    setPreviewResult(null);

    setComparison(COMPARISON_ID, {
      before: {
        label: 'Asli',
        fileName: file.name,
        sizeBytes: file.size,
        previewUrl: preview,
        previewType: 'image',
      },
      status: CONVERSION_STATUS.IDLE,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
    setPreviewResult(null);
    setDownloadUrl(null);
    resetComparison();
  };

  // Pratinjau real-time saat format/kualitas berubah (seperti Squoosh)
  useEffect(() => {
    if (!image) return;

    clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(() => {
      runPreview(image, formatId, quality);
    }, 300);

    return () => clearTimeout(previewTimerRef.current);
  }, [image, formatId, quality, runPreview]);

  const handleDownload = () => {
    if (!previewResult || !image) return;

    const fileName = buildConvertedFileName(image.name, formatId);
    setDownloadUrl(previewResult.dataUrl);
    setDownloadName(fileName);

    setComparison(COMPARISON_ID, {
      before: {
        label: 'Asli',
        fileName: image.name,
        sizeBytes: image.sizeBytes,
        previewUrl: image.preview,
        previewType: 'image',
      },
      after: {
        label: 'Hasil',
        fileName,
        sizeBytes: previewResult.sizeBytes,
        previewUrl: previewResult.dataUrl,
        previewType: 'image',
      },
      status: CONVERSION_STATUS.COMPLETE,
      meta: { quality, format: getFormatById(formatId).label },
    });

    const link = document.createElement('a');
    link.href = previewResult.dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentFormat = getFormatById(formatId);
  const savings =
    image && previewResult
      ? calculateSavings(image.sizeBytes, previewResult.sizeBytes)
      : null;

  const uploadZone = !image ? (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="border-3 border-dashed border-slate-300 hover:border-brand-500 bg-white rounded-2xl p-12 text-center cursor-pointer transition-all hover:shadow-lg group"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="p-4 bg-brand-50 text-brand-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
        <Upload size={36} className="animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Tarik & Letakkan Satu Gambar di Sini</h3>
      <p className="text-slate-500 text-sm mt-1">
        Konversi format seperti Squoosh — JPG, PNG, WebP dengan perbandingan visual
      </p>
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {IMAGE_FORMATS.map((f) => (
          <span key={f.id} className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded uppercase">
            {f.ext}
          </span>
        ))}
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      {/* Header file */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <ImageIcon className="text-brand-500 shrink-0" size={20} />
          <div className="min-w-0 text-left">
            <p className="text-sm font-bold text-slate-800 truncate">{image.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(image.sizeBytes)}</p>
          </div>
        </div>
        <button
          onClick={removeImage}
          className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg shrink-0"
        >
          Ganti Gambar
        </button>
      </div>

      {/* Squoosh-style slider compare */}
      <SquooshCompare
        beforeUrl={image.preview}
        afterUrl={previewResult?.dataUrl}
        beforeSize={image.sizeBytes}
        afterSize={previewResult?.sizeBytes}
        beforeLabel="Asli"
        afterLabel="Hasil"
        formatLabel={currentFormat.label}
        savingsPercent={savings?.percentSaved ?? null}
      />

      {isPreviewing && (
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <RefreshCw size={12} className="animate-spin" />
          Memperbarui pratinjau...
        </p>
      )}
    </div>
  );

  const sidebar = (
    <div className="space-y-6">
      {/* Panel Compress ala Squoosh */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
          Konversi Format
        </h3>

        {image ? (
          <>
            {/* Format dropdown */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Format Output
              </label>
              <div className="relative">
                <select
                  value={formatId}
                  onChange={(e) => {
                    setFormatId(e.target.value);
                    setDownloadUrl(null);
                  }}
                  className="w-full appearance-none text-sm font-bold border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-white"
                >
                  {IMAGE_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-400">{currentFormat.desc}</p>
            </div>

            {/* Quality slider — hanya untuk lossy formats */}
            {currentFormat.hasQuality && (
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kualitas
                  </label>
                  <span className="text-sm font-extrabold text-brand-600">{quality}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseInt(e.target.value, 10));
                    setDownloadUrl(null);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>File Kecil</span>
                  <span>Kualitas Tinggi</span>
                </div>
              </div>
            )}

            {/* Live size badge */}
            {previewResult && savings && (
              <div className="p-3 bg-slate-900 rounded-xl text-white text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Ukuran Hasil</p>
                <p className="text-2xl font-black text-emerald-400 tabular-nums">
                  {formatFileSize(previewResult.sizeBytes)}
                </p>
                <p className={`text-xs font-bold mt-1 ${
                  savings.isReduction ? 'text-emerald-300' : savings.isIncrease ? 'text-amber-300' : 'text-slate-400'
                }`}>
                  {savings.isReduction
                    ? `↓ Hemat ${savings.percentSaved}%`
                    : savings.isIncrease
                      ? `↑ ${Math.abs(savings.percentSaved)}% lebih besar`
                      : 'Ukuran sama'}
                </p>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!previewResult || isPreviewing}
              className="flex justify-center items-center w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg space-x-2 text-sm"
            >
              <Download size={18} />
              <span>Unduh {currentFormat.ext.toUpperCase()}</span>
            </button>
          </>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            Upload gambar untuk memilih format output.
          </p>
        )}
      </div>

      {downloadUrl && (
        <p className="text-[10px] text-emerald-600 font-bold text-center">
          ✓ {downloadName} berhasil diunduh
        </p>
      )}
    </div>
  );

  return (
    <ConversionDashboard
      title="Konversi Format"
      highlight="Gambar"
      description="Ubah JPG ↔ PNG ↔ WebP dengan slider perbandingan visual ala Squoosh — ukuran file diperbarui secara real-time."
      comparisonItems={comparisonItems}
      showComparison={false}
      adTop={<AdBanner type="horizontal" />}
      adSidebar={<AdBanner type="square" />}
      sidebar={sidebar}
      infoBox={
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
          <HelpCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">Cara pakai (seperti Squoosh):</p>
            <p>1. Upload satu gambar → geser slider tengah untuk bandingkan Asli vs Hasil.</p>
            <p>2. Pilih format output (JPEG, WebP, PNG) — ukuran langsung terupdate.</p>
            <p>3. Atur kualitas slider → lihat persentase hemat di panel bawah.</p>
            <p>4. Klik Unduh saat puas dengan hasilnya.</p>
          </div>
        </div>
      }
    >
      {uploadZone}
    </ConversionDashboard>
  );
};

export default ImageFormatConverter;
