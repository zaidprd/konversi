import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import {
  Upload, FileImage, Trash2, RotateCw, ArrowLeft, ArrowRight,
  Settings, HelpCircle, FileText,
} from 'lucide-react';
import AdBanner from './AdBanner';
import { ConversionDashboard, ActionPanel } from './dashboard';
import { useConversionComparison } from '../hooks/useConversionComparison';
import { buildDownloadName } from '../config/brand';
import { CONVERSION_STATUS } from '../types/conversion';
import { sumFileSizes, formatFileSize } from '../utils/fileSize';

const COMPARISON_ID = 'img-to-pdf';

const ImageToPdf = ({ initialType = 'jpg' }) => {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [orientation, setOrientation] = useState('auto');
  const [pageSize, setPageSize] = useState('a4');
  const [margin, setMargin] = useState('none');

  const fileInputRef = useRef(null);
  const { items: comparisonItems, setComparison, reset: resetComparison } = useConversionComparison();

  const allowedTypes =
    initialType === 'png'
      ? ['image/png']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];

  const updateBeforeComparison = (imgs) => {
    if (imgs.length === 0) {
      resetComparison();
      return;
    }
    setComparison(COMPARISON_ID, {
      before: {
        label: 'Total Gambar',
        fileName: `${imgs.length} berkas ${initialType.toUpperCase()}`,
        sizeBytes: sumFileSizes(imgs.map((i) => ({ sizeBytes: i.sizeBytes }))),
        previewUrl: imgs[0]?.preview,
        previewType: 'image',
      },
      status: CONVERSION_STATUS.IDLE,
      meta: { imageCount: imgs.length, pageSize, orientation, margin },
    });
  };

  const processFiles = (files) => {
    const validFiles = files.filter((file) => {
      if (initialType === 'png') return file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
      return (
        allowedTypes.includes(file.type) ||
        /\.(jpe?g|png|webp|bmp)$/i.test(file.name)
      );
    });

    if (validFiles.length === 0) {
      alert(`Mohon pilih file gambar yang valid (${initialType === 'png' ? 'PNG saja' : 'JPG, PNG, WebP'}).`);
      return;
    }

    const newImages = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      sizeBytes: file.size,
      preview: URL.createObjectURL(file),
      rotation: 0,
    }));

    setImages((prev) => {
      const next = [...prev, ...newImages];
      updateBeforeComparison(next);
      return next;
    });
    setDownloadUrl(null);
  };

  const handleFileChange = (e) => processFiles(Array.from(e.target.files));
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    processFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      const next = prev.filter((i) => i.id !== id);
      updateBeforeComparison(next);
      return next;
    });
    setDownloadUrl(null);
  };

  const rotateImage = (id) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img))
    );
    setDownloadUrl(null);
  };

  const moveImage = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setImages(updated);
    setDownloadUrl(null);
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    resetComparison();
    setDownloadUrl(null);
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const convertToPdf = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setProgress(10);
    setProcessStep('Membaca berkas gambar...');

    const totalInputBytes = sumFileSizes(images.map((i) => ({ sizeBytes: i.sizeBytes })));
    setComparison(COMPARISON_ID, {
      before: {
        label: 'Total Gambar',
        fileName: `${images.length} berkas`,
        sizeBytes: totalInputBytes,
        previewUrl: images[0].preview,
        previewType: 'image',
      },
      status: CONVERSION_STATUS.PROCESSING,
      meta: { imageCount: images.length },
    });

    try {
      const pageFormats = {
        a4: { width: 595.28, height: 841.89 },
        letter: { width: 612.0, height: 792.0 },
      };
      const marginSizes = { none: 0, small: 15, large: 30 };
      const selectedMargin = marginSizes[margin];
      let pdfDoc = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgress(Math.round(10 + (i / images.length) * 80));
        setProcessStep(`Memproses Gambar ${i + 1} dari ${images.length}...`);

        const imgEl = await loadImage(item.preview);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const is90or270 = item.rotation === 90 || item.rotation === 270;
        canvas.width = is90or270 ? imgEl.height : imgEl.width;
        canvas.height = is90or270 ? imgEl.width : imgEl.height;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.drawImage(imgEl, -imgEl.width / 2, -imgEl.height / 2);

        const rotatedImgData = canvas.toDataURL('image/jpeg', 0.9);
        let finalPageWidth, finalPageHeight, finalOrient = 'p';

        if (pageSize === 'fit') {
          finalPageWidth = canvas.width * 0.75;
          finalPageHeight = canvas.height * 0.75;
          finalOrient = finalPageWidth > finalPageHeight ? 'l' : 'p';
        } else {
          const baseFormat = pageFormats[pageSize];
          let targetOrient = orientation === 'auto' ? (canvas.width > canvas.height ? 'landscape' : 'portrait') : orientation;
          if (targetOrient === 'landscape') {
            finalPageWidth = baseFormat.height;
            finalPageHeight = baseFormat.width;
            finalOrient = 'l';
          } else {
            finalPageWidth = baseFormat.width;
            finalPageHeight = baseFormat.height;
          }
        }

        if (i === 0) {
          pdfDoc = new jsPDF({ orientation: finalOrient, unit: 'pt', format: pageSize === 'fit' ? [finalPageWidth, finalPageHeight] : pageSize });
        } else {
          pdfDoc.addPage(pageSize === 'fit' ? [finalPageWidth, finalPageHeight] : pageSize, finalOrient);
        }

        const usableWidth = finalPageWidth - selectedMargin * 2;
        const usableHeight = finalPageHeight - selectedMargin * 2;
        const scale = Math.min(usableWidth / canvas.width, usableHeight / canvas.height);
        const drawWidth = canvas.width * scale;
        const drawHeight = canvas.height * scale;
        pdfDoc.addImage(rotatedImgData, 'JPEG', selectedMargin + (usableWidth - drawWidth) / 2, selectedMargin + (usableHeight - drawHeight) / 2, drawWidth, drawHeight);
      }

      setProgress(95);
      setProcessStep('Menyimpan berkas PDF...');

      const pdfBlob = pdfDoc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const outName = buildDownloadName('konversi', 'pdf');

      setDownloadUrl(blobUrl);
      setDownloadName(outName);

      setComparison(COMPARISON_ID, {
        before: {
          label: 'Total Gambar',
          fileName: `${images.length} berkas (${formatFileSize(totalInputBytes)})`,
          sizeBytes: totalInputBytes,
          previewUrl: images[0].preview,
          previewType: 'image',
        },
        after: {
          label: 'PDF Hasil',
          fileName: outName,
          sizeBytes: pdfBlob.size,
          previewType: 'pdf',
        },
        status: CONVERSION_STATUS.COMPLETE,
        meta: { imageCount: images.length, pageSize, orientation, margin },
      });

      setProgress(100);
      setProcessStep('Selesai!');

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = outName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengonversi gambar ke PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadZone =
    images.length === 0 ? (
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-3 border-dashed border-slate-300 hover:border-brand-500 bg-white rounded-2xl p-12 text-center cursor-pointer transition-all hover:shadow-lg group"
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept={allowedTypes.join(',')} className="hidden" />
        <div className="p-4 bg-brand-50 text-brand-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
          <Upload size={36} className="animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Tarik & Letakkan Gambar Anda di Sini</h3>
        <p className="text-slate-500 text-sm mt-1">atau klik untuk menelusuri berkas</p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">{initialType.toUpperCase()}</span>
          {initialType === 'jpg' && (
            <>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">PNG</span>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">WebP</span>
            </>
          )}
        </div>
      </div>
    ) : (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 flex items-center">
            <FileImage className="text-brand-500 mr-2" size={20} />
            Berkas Terunggah ({images.length} Gambar)
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg">Tambah</button>
            <button onClick={clearAll} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg">Hapus Semua</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
          {images.map((img, index) => (
            <div key={img.id} className="relative border border-slate-200 bg-slate-50 rounded-xl p-3 hover:border-brand-300 transition-all">
              <div className="absolute top-2 left-2 z-10 bg-slate-900/80 text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full">{index + 1}</div>
              <div className="aspect-square rounded-lg bg-white overflow-hidden border flex items-center justify-center">
                <img src={img.preview} alt={img.name} style={{ transform: `rotate(${img.rotation}deg)` }} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-xs font-bold text-slate-700 truncate mt-2">{img.name}</p>
              <p className="text-[10px] text-slate-500">{formatFileSize(img.sizeBytes)}</p>
              <div className="mt-2 pt-2 border-t flex justify-between">
                <div className="flex gap-1">
                  <button onClick={() => moveImage(index, 'left')} disabled={index === 0} className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"><ArrowLeft size={14} /></button>
                  <button onClick={() => moveImage(index, 'right')} disabled={index === images.length - 1} className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"><ArrowRight size={14} /></button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => rotateImage(img.id)} className="p-1 hover:bg-brand-50 rounded"><RotateCw size={14} /></button>
                  <button onClick={() => removeImage(img.id)} className="p-1 hover:bg-rose-50 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  const sidebar = (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        <h3 className="font-bold text-slate-800 flex items-center border-b border-slate-100 pb-3">
          <Settings className="text-slate-500 mr-2" size={18} />
          Pengaturan Halaman
        </h3>
        {images.length > 0 && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Orientasi</label>
              <div className="grid grid-cols-3 gap-2">
                {['auto', 'portrait', 'landscape'].map((id) => (
                  <button key={id} onClick={() => { setOrientation(id); setDownloadUrl(null); }} className={`py-2 text-xs font-semibold rounded-lg border ${orientation === id ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold' : 'border-slate-200 text-slate-600'}`}>
                    {id === 'auto' ? 'Auto' : id === 'portrait' ? 'Tegak' : 'Mendatar'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ukuran</label>
              {[
                { id: 'a4', label: 'A4' },
                { id: 'letter', label: 'Letter' },
                { id: 'fit', label: 'Fit Gambar' },
              ].map((opt) => (
                <button key={opt.id} onClick={() => { setPageSize(opt.id); setDownloadUrl(null); }} className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border text-left ${pageSize === opt.id ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold' : 'border-slate-200 text-slate-600'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Margin</label>
              <div className="grid grid-cols-3 gap-2">
                {['none', 'small', 'large'].map((id) => (
                  <button key={id} onClick={() => { setMargin(id); setDownloadUrl(null); }} className={`py-2 text-xs font-semibold rounded-lg border ${margin === id ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold' : 'border-slate-200 text-slate-600'}`}>
                    {id === 'none' ? 'Tanpa' : id === 'small' ? 'Tipis' : 'Lebar'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <ActionPanel
        title="Konversi"
        emptyMessage="Pilih gambar terlebih dahulu."
        isReady={images.length > 0}
        isProcessing={isProcessing}
        progress={progress}
        processStep={processStep}
        downloadUrl={downloadUrl}
        downloadName={downloadName}
        downloadLabel="Unduh PDF"
        onAction={convertToPdf}
        actionLabel="Konversi ke PDF"
        actionIcon={FileText}
        onReset={() => setDownloadUrl(null)}
        resetLabel="Konversi Ulang"
      />
    </div>
  );

  return (
    <ConversionDashboard
      title="Konversi"
      highlight={`${initialType.toUpperCase()} ke PDF`}
      description={`Ubah gambar ${initialType.toUpperCase()} menjadi PDF — lihat perbandingan ukuran total gambar vs PDF hasil.`}
      comparisonItems={comparisonItems}
      showComparison={comparisonItems.length > 0}
      adTop={<AdBanner type="horizontal" />}
      adSidebar={<AdBanner type="square" />}
      sidebar={sidebar}
      infoBox={
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
          <HelpCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">Tips konversi maksimal:</p>
            <p>• Gunakan margin <strong>Tanpa</strong> + ukuran <strong>Fit</strong> untuk PDF terkecil.</p>
            <p>• Panel perbandingan menampilkan total ukuran gambar vs PDF hasil secara real-time.</p>
          </div>
        </div>
      }
    >
      {uploadZone}
    </ConversionDashboard>
  );
};

export default ImageToPdf;
