import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import {
  Upload, FileImage, Trash2, HelpCircle, CheckCircle2, Download, RefreshCw, Sliders,
} from 'lucide-react';
import AdBanner from './AdBanner';
import { ConversionDashboard } from './dashboard';
import { useConversionComparison } from '../hooks/useConversionComparison';
import { BRAND, buildDownloadName } from '../config/brand';
import { CONVERSION_STATUS } from '../types/conversion';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [isZip, setIsZip] = useState(false);

  const fileInputRef = useRef(null);
  const previewTimerRef = useRef(null);

  const {
    items: comparisonItems,
    setBefore,
    setPreview,
    setAfter,
    setProcessing,
    removeItem,
    reset: resetComparison,
    getAggregate,
  } = useConversionComparison();

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const compressSingle = useCallback(async (item, qualityDecimal) => {
    const imgEl = await loadImage(item.preview);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    ctx.drawImage(imgEl, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', qualityDecimal);
    const base64Len = dataUrl.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = Math.round(base64Len * (3 / 4));

    return {
      dataUrl,
      sizeInBytes,
      fileName: item.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg',
    };
  }, []);

  const handleFileChange = (e) => {
    processFiles(Array.from(e.target.files));
  };

  const processFiles = (files) => {
    const validFiles = files.filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) ||
        /\.(jpe?g|png|webp)$/i.test(file.name)
    );

    if (validFiles.length === 0) {
      alert('Mohon pilih file gambar yang valid (JPG, JPEG, PNG, atau WebP).');
      return;
    }

    const newImages = validFiles.map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      const preview = URL.createObjectURL(file);

      setBefore(id, {
        fileName: file.name,
        sizeBytes: file.size,
        previewUrl: preview,
        previewType: 'image',
      });

      return { id, file, name: file.name, sizeBytes: file.size, preview };
    });

    setImages((prev) => [...prev, ...newImages]);
    setDownloadUrl(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    processFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
    removeItem(id);
    setDownloadUrl(null);
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    resetComparison();
    setDownloadUrl(null);
  };

  // Pratinjau real-time saat slider kualitas berubah (inspirasi Squoosh)
  useEffect(() => {
    if (images.length === 0) return;

    clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(async () => {
      const qualityDecimal = quality / 100;
      for (const item of images) {
        try {
          const result = await compressSingle(item, qualityDecimal);
          setPreview(item.id, {
            fileName: result.fileName,
            sizeBytes: result.sizeInBytes,
            previewUrl: result.dataUrl,
            previewType: 'image',
            meta: { quality },
          });
        } catch {
          /* abaikan error pratinjau */
        }
      }
    }, 350);

    return () => clearTimeout(previewTimerRef.current);
  }, [quality, images, compressSingle, setPreview]);

  const compressImages = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setProgress(10);
    setProcessStep('Menginisialisasi kompresi...');
    setDownloadUrl(null);

    try {
      const qualityDecimal = quality / 100;
      const zip = new JSZip();
      let zipBlob = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProcessing(item.id);
        setProgress(Math.round(10 + (i / images.length) * 75));
        setProcessStep(`Mengompres "${item.name}"...`);

        const result = await compressSingle(item, qualityDecimal);

        setAfter(item.id, {
          fileName: result.fileName,
          sizeBytes: result.sizeInBytes,
          previewUrl: result.dataUrl,
          previewType: 'image',
          meta: { quality },
        });

        if (images.length > 1) {
          zip.file(result.fileName, result.dataUrl.split(',')[1], { base64: true });
        }
      }

      setProgress(90);

      let singleResult = null;

      if (images.length === 1) {
        singleResult = await compressSingle(images[0], qualityDecimal);
        setIsZip(false);
        setDownloadUrl(singleResult.dataUrl);
        setDownloadName(singleResult.fileName);
      } else {
        setIsZip(true);
        setProcessStep('Mengompilasi berkas ZIP...');
        zipBlob = await zip.generateAsync({ type: 'blob' });
        const blobUrl = URL.createObjectURL(zipBlob);
        const outName = buildDownloadName('kompresi_gambar', 'zip');

        setDownloadUrl(blobUrl);
        setDownloadName(outName);
      }

      setProgress(100);
      setProcessStep('Kompresi Gambar Berhasil!');

      const link = document.createElement('a');
      if (singleResult) {
        link.href = singleResult.dataUrl;
        link.download = singleResult.fileName;
      } else if (zipBlob) {
        link.href = URL.createObjectURL(zipBlob);
        link.download = buildDownloadName('kompresi_gambar', 'zip');
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengompres gambar. Silakan coba kembali.');
    } finally {
      setIsProcessing(false);
    }
  };

  const aggregateItem =
    images.length > 1 && comparisonItems.some((i) => i.status === CONVERSION_STATUS.COMPLETE)
      ? getAggregate(downloadName || 'hasil_kompresi.zip', { quality })
      : null;

  const uploadZone =
    images.length === 0 ? (
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
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
        />
        <div className="p-4 bg-brand-50 text-brand-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
          <Upload size={36} className="animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Tarik & Letakkan Gambar di Sini</h3>
        <p className="text-slate-500 text-sm mt-1">atau klik untuk memilih file dari komputer Anda</p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">JPG / JPEG</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">PNG</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">WebP</span>
        </div>
      </div>
    ) : (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 flex items-center">
            <FileImage className="text-brand-500 mr-2" size={20} />
            Berkas Gambar Terpilih ({images.length} Berkas)
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg transition-colors"
            >
              Tambah Gambar
            </button>
            <button
              onClick={clearAll}
              className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg transition-colors"
            >
              Hapus Semua
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
        />
        <p className="text-xs text-slate-500 mb-4">
          Geser kualitas di panel kanan â€” ukuran hasil diperbarui secara real-time seperti Squoosh.
        </p>
        <div className="space-y-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={img.preview} alt="" className="w-10 h-10 rounded-lg object-cover border" />
                <span className="text-xs font-bold text-slate-700 truncate">{img.name}</span>
              </div>
              <button
                onClick={() => removeImage(img.id)}
                className="p-1.5 hover:bg-rose-100 text-rose-600 rounded shrink-0"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );

  const sidebar = (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
        Kualitas Kompresi
      </h3>

      {images.length > 0 ? (
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kualitas Gambar
              </label>
              <span className="text-sm font-extrabold text-brand-600">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => {
                setQuality(parseInt(e.target.value, 10));
                setDownloadUrl(null);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Kompresi Tinggi</span>
              <span>Kualitas Tinggi</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            {isProcessing ? (
              <div className="space-y-3 py-2 text-center">
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
              <div className="space-y-3 py-2 text-center">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-start text-left">
                  <CheckCircle2 size={16} className="text-emerald-500 mr-2 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Kompresi Selesai!</p>
                    <p className="text-slate-600 mt-0.5 text-[10px] break-all">{downloadName}</p>
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  className="flex justify-center items-center w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-md space-x-2 text-sm"
                >
                  <Download size={16} />
                  <span>Unduh Hasil ({isZip ? 'ZIP' : 'JPG'})</span>
                </a>
                <button
                  onClick={() => setDownloadUrl(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto mt-2"
                >
                  Sesuaikan Kualitas Lagi
                </button>
              </div>
            ) : (
              <button
                onClick={compressImages}
                className="flex justify-center items-center w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg space-x-2 text-sm"
              >
                <Sliders size={18} />
                <span>Mulai Kompres Gambar</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-slate-400 py-6 text-xs text-center">
          <p>Silakan pilih gambar terlebih dahulu untuk mengatur opsi kualitas kompresi.</p>
        </div>
      )}
    </div>
  );

  const infoBox = (
    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
      <HelpCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
      <div className="text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-700">Keunggulan ${BRAND.name}:</p>
        <p>â€¢ <strong>Transparansi ukuran file</strong> â€” lihat perbandingan Asli â†’ Hasil secara real-time sebelum unduh.</p>
        <p>â€¢ <strong>Pratinjau langsung</strong> â€” geser slider kualitas dan ukuran hasil langsung terupdate langsung.</p>
        <p>â€¢ <strong>100% lokal</strong> â€” file tidak pernah di-upload ke server pihak ketiga.</p>
      </div>
    </div>
  );

  return (
    <ConversionDashboard
      title="Kompres Gambar"
      highlight="JPG / PNG"
      description="Kurangi ukuran file gambar hingga 90% dengan perbandingan Before vs After yang transparan â€” gratis, aman, dan instan."
      comparisonItems={comparisonItems}
      aggregateItem={aggregateItem}
      showComparison={comparisonItems.length > 0}
      adTop={<AdBanner type="horizontal" />}
      adSidebar={<AdBanner type="square" />}
      sidebar={sidebar}
      infoBox={infoBox}
    >
      {uploadZone}
    </ConversionDashboard>
  );
};

export default ImageCompressor;

