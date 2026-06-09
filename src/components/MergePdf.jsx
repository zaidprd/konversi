import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Upload, FileText, Trash2, ArrowUp, ArrowDown, HelpCircle, Layers,
} from 'lucide-react';
import AdBanner from './AdBanner';
import { ConversionDashboard, ActionPanel } from './dashboard';
import { useConversionComparison } from '../hooks/useConversionComparison';
import { BRAND, buildDownloadName } from '../config/brand';
import { CONVERSION_STATUS } from '../types/conversion';
import { sumFileSizes } from '../utils/fileSize';

const COMPARISON_ID = 'merge-result';

const MergePdf = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');

  const fileInputRef = useRef(null);
  const { items: comparisonItems, setComparison, reset: resetComparison } = useConversionComparison();

  const updateBeforeComparison = (files) => {
    if (files.length === 0) {
      resetComparison();
      return;
    }
    setComparison(COMPARISON_ID, {
      before: {
        label: 'Total Input',
        fileName: `${files.length} berkas PDF`,
        sizeBytes: sumFileSizes(files.map((f) => ({ sizeBytes: f.sizeBytes }))),
        previewType: 'pdf',
      },
      status: CONVERSION_STATUS.IDLE,
      meta: { fileCount: files.length },
    });
  };

  const processFiles = async (files) => {
    const validFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (validFiles.length === 0) {
      alert('Mohon pilih file PDF yang valid.');
      return;
    }

    const newFiles = [];
    for (const file of validFiles) {
      let pageCount = 'N/A';
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        pageCount = pdf.getPageCount() + ' Halaman';
      } catch (err) {
        console.error('Error reading PDF metadata:', err);
      }

      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        sizeBytes: file.size,
        pages: pageCount,
      });
    }

    setPdfFiles((prev) => {
      const next = [...prev, ...newFiles];
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

  const removeFile = (id) => {
    setPdfFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      updateBeforeComparison(next);
      return next;
    });
    setDownloadUrl(null);
  };

  const moveFile = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pdfFiles.length) return;
    const updated = [...pdfFiles];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setPdfFiles(updated);
    setDownloadUrl(null);
  };

  const clearAll = () => {
    setPdfFiles([]);
    resetComparison();
    setDownloadUrl(null);
  };

  const doMergePdf = async () => {
    if (pdfFiles.length < 2) {
      alert('Mohon unggah minimal 2 file PDF untuk digabungkan.');
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    setProcessStep('Membuat dokumen PDF baru...');
    setComparison(COMPARISON_ID, {
      before: {
        label: 'Total Input',
        fileName: `${pdfFiles.length} berkas PDF`,
        sizeBytes: sumFileSizes(pdfFiles.map((f) => ({ sizeBytes: f.sizeBytes }))),
        previewType: 'pdf',
      },
      status: CONVERSION_STATUS.PROCESSING,
      meta: { fileCount: pdfFiles.length },
    });

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < pdfFiles.length; i++) {
        const item = pdfFiles[i];
        setProgress(Math.round(15 + (i / pdfFiles.length) * 75));
        setProcessStep(`Menggabungkan "${item.name}"...`);

        const fileBytes = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgress(90);
      setProcessStep('Mengompilasi berkas PDF akhir...');

      const mergedPdfBytes = await mergedPdf.save();
      const pdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const outName = buildDownloadName('gabungan', 'pdf');

      setDownloadUrl(blobUrl);
      setDownloadName(outName);

      setComparison(COMPARISON_ID, {
        before: {
          label: 'Total Input',
          fileName: `${pdfFiles.length} berkas PDF`,
          sizeBytes: sumFileSizes(pdfFiles.map((f) => ({ sizeBytes: f.sizeBytes }))),
          previewType: 'pdf',
        },
        after: {
          label: 'PDF Gabungan',
          fileName: outName,
          sizeBytes: pdfBlob.size,
          previewType: 'pdf',
        },
        status: CONVERSION_STATUS.COMPLETE,
        meta: { fileCount: pdfFiles.length },
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
      alert(err.message || 'Terjadi kesalahan saat menggabungkan berkas PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadZone =
    pdfFiles.length === 0 ? (
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-3 border-dashed border-slate-300 hover:border-brand-500 bg-white rounded-2xl p-12 text-center cursor-pointer transition-all hover:shadow-lg group"
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="application/pdf" className="hidden" />
        <div className="p-4 bg-brand-50 text-brand-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
          <Upload size={36} className="animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Tarik & Letakkan File PDF di Sini</h3>
        <p className="text-slate-500 text-sm mt-1">atau klik untuk memilih file dari perangkat Anda</p>
      </div>
    ) : (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 flex items-center">
            <FileText className="text-brand-500 mr-2" size={20} />
            Daftar Berkas PDF ({pdfFiles.length})
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg">
              Tambah PDF
            </button>
            <button onClick={clearAll} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg">
              Hapus Semua
            </button>
          </div>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {pdfFiles.map((file, index) => (
            <div key={file.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="flex items-center space-x-3 truncate">
                <div className="w-10 h-10 bg-brand-50 text-brand-500 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">PDF</div>
                <div className="truncate text-left">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{file.name}</h4>
                  <p className="text-xs text-slate-500">{file.pages}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => moveFile(index, 'down')} disabled={index === pdfFiles.length - 1} className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={() => removeFile(file.id)} className="p-1.5 hover:bg-rose-100 text-rose-600 rounded"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <ConversionDashboard
      title="Gabungkan Berkas"
      highlight="PDF"
      description="Gabungkan beberapa PDF menjadi satu — lihat perbandingan ukuran total input vs hasil gabungan secara transparan."
      comparisonItems={comparisonItems}
      showComparison={comparisonItems.length > 0}
      adTop={<AdBanner type="horizontal" />}
      adSidebar={<AdBanner type="square" />}
      sidebar={
        <ActionPanel
          title="Penggabungan PDF"
          emptyMessage="Unggah minimal 2 file PDF untuk mengaktifkan penggabungan."
          isReady={pdfFiles.length >= 2}
          isProcessing={isProcessing}
          progress={progress}
          processStep={processStep}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="Unduh PDF Hasil"
          onAction={doMergePdf}
          actionLabel="Gabungkan PDF!"
          actionIcon={Layers}
          onReset={() => setDownloadUrl(null)}
          resetLabel="Edit Urutan / Gabungkan Lagi"
        />
      }
      infoBox={
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
          <HelpCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">Transparansi ukuran file:</p>
            <p>Panel perbandingan menampilkan total ukuran semua PDF input vs ukuran PDF hasil gabungan — angka transparan yang bisa Anda cek sendiri sebelum unduh.</p>
          </div>
        </div>
      }
    >
      {uploadZone}
    </ConversionDashboard>
  );
};

export default MergePdf;
