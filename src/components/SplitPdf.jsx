import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Upload, FileText, Trash2, HelpCircle, Layers } from 'lucide-react';
import AdBanner from './AdBanner';
import { ConversionDashboard, ActionPanel } from './dashboard';
import { useConversionComparison } from '../hooks/useConversionComparison';
import { buildDownloadName } from '../config/brand';
import { CONVERSION_STATUS } from '../types/conversion';

const COMPARISON_ID = 'split-result';

const SplitPdf = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [isZip, setIsZip] = useState(false);
  const [splitMode, setSplitMode] = useState('all');
  const [customRange, setCustomRange] = useState('1-2');

  const fileInputRef = useRef(null);
  const { items: comparisonItems, setComparison, reset: resetComparison } = useConversionComparison();

  const processFile = async (file) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Mohon pilih file PDF yang valid.');
      return;
    }

    setIsProcessing(true);
    setProcessStep('Membaca struktur berkas PDF...');
    setProgress(20);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const totalPages = pdf.getPageCount();

      setPdfFile({ file, name: file.name, sizeBytes: file.size, bytes: arrayBuffer });
      setPageCount(totalPages);
      setCustomRange(totalPages > 1 ? `1-${totalPages}` : '1');
      setDownloadUrl(null);

      setComparison(COMPARISON_ID, {
        before: {
          label: 'PDF Asli',
          fileName: file.name,
          sizeBytes: file.size,
          previewType: 'pdf',
        },
        status: CONVERSION_STATUS.IDLE,
        meta: { pageCount: totalPages },
      });
    } catch (err) {
      console.error(err);
      alert('Gagal membaca berkas PDF. Pastikan berkas tidak dikunci sandi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => e.target.files[0] && processFile(e.target.files[0]);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    e.dataTransfer.files[0] && processFile(e.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setPdfFile(null);
    setPageCount(0);
    setDownloadUrl(null);
    resetComparison();
  };

  const parseRanges = (rangeStr, maxPage) => {
    const pages = new Set();
    rangeStr.replace(/\s+/g, '').split(',').forEach((part) => {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, Math.min(start, end)); i <= Math.min(maxPage, Math.max(start, end)); i++) {
            pages.add(i - 1);
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPage) pages.add(pageNum - 1);
      }
    });
    return Array.from(pages).sort((a, b) => a - b);
  };

  const doSplitPdf = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    setProgress(10);
    setProcessStep('Menginisialisasi pemisahan...');
    setComparison(COMPARISON_ID, {
      before: {
        label: 'PDF Asli',
        fileName: pdfFile.name,
        sizeBytes: pdfFile.sizeBytes,
        previewType: 'pdf',
      },
      status: CONVERSION_STATUS.PROCESSING,
      meta: { pageCount, splitMode },
    });

    try {
      const sourcePdf = await PDFDocument.load(pdfFile.bytes);
      const cleanName = pdfFile.name.replace(/\.pdf$/i, '');
      let resultBlob = null;
      let outName = '';
      let outputIsZip = false;

      if (splitMode === 'all') {
        outputIsZip = true;
        const zip = new JSZip();

        for (let i = 0; i < pageCount; i++) {
          setProgress(Math.round(10 + (i / pageCount) * 75));
          setProcessStep(`Membuat berkas Halaman ${i + 1}...`);

          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(copiedPage);
          zip.file(`${cleanName}_halaman_${i + 1}.pdf`, await newPdf.save());
        }

        setProgress(90);
        setProcessStep('Mengompres menjadi ZIP...');
        resultBlob = await zip.generateAsync({ type: 'blob' });
        outName = buildDownloadName('pecah_halaman', 'zip');
      } else {
        const pageIndices = parseRanges(customRange, pageCount);
        if (pageIndices.length === 0) {
          alert('Format rentang halaman tidak valid.');
          setIsProcessing(false);
          return;
        }

        setProgress(50);
        setProcessStep(`Menyalin ${pageIndices.length} halaman...`);

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const bytes = await newPdf.save();
        resultBlob = new Blob([bytes], { type: 'application/pdf' });
        outName = `${cleanName}_rentang_${customRange.replace(/\s+/g, '')}.pdf`;
      }

      const blobUrl = URL.createObjectURL(resultBlob);
      setIsZip(outputIsZip);
      setDownloadUrl(blobUrl);
      setDownloadName(outName);

      setComparison(COMPARISON_ID, {
        before: {
          label: 'PDF Asli',
          fileName: pdfFile.name,
          sizeBytes: pdfFile.sizeBytes,
          previewType: 'pdf',
        },
        after: {
          label: outputIsZip ? 'ZIP Hasil' : 'PDF Hasil',
          fileName: outName,
          sizeBytes: resultBlob.size,
          previewType: outputIsZip ? 'generic' : 'pdf',
        },
        status: CONVERSION_STATUS.COMPLETE,
        meta: { pageCount, splitMode, outputPages: splitMode === 'all' ? pageCount : parseRanges(customRange, pageCount).length },
      });

      setProgress(100);
      setProcessStep('Pecah PDF Berhasil!');

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = outName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses pemisahan halaman.');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadZone = !pdfFile ? (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="border-3 border-dashed border-slate-300 hover:border-brand-500 bg-white rounded-2xl p-12 text-center cursor-pointer transition-all hover:shadow-lg group"
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
      <div className="p-4 bg-brand-50 text-brand-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
        <Upload size={36} className="animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Tarik & Letakkan Berkas PDF di Sini</h3>
      <p className="text-slate-500 text-sm mt-1">atau klik untuk memilih berkas</p>
    </div>
  ) : (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
        <h3 className="font-bold text-slate-800 flex items-center">
          <FileText className="text-brand-500 mr-2" size={20} />
          Berkas PDF yang Dipilih
        </h3>
        <button onClick={removeFile} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg">
          Ganti File
        </button>
      </div>
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center font-bold text-sm">PDF</div>
        <div>
          <h4 className="font-bold text-sm text-slate-800">{pdfFile.name}</h4>
          <p className="text-xs text-slate-500 mt-1">{pageCount} Halaman</p>
        </div>
      </div>
    </div>
  );

  const sidebar = (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
          Opsi Pemisahan
        </h3>
        {pdfFile ? (
          <>
            <div className="flex flex-col space-y-2">
              {[
                { id: 'all', label: 'Ekstrak Semua Halaman', desc: 'Setiap halaman jadi PDF terpisah (ZIP)' },
                { id: 'range', label: 'Rentang Kustom', desc: 'Halaman spesifik ke satu PDF' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setSplitMode(opt.id); setDownloadUrl(null); }}
                  className={`p-3 text-xs font-bold rounded-xl border text-left ${splitMode === opt.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <p>{opt.label}</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
            {splitMode === 'range' && (
              <input
                type="text"
                value={customRange}
                onChange={(e) => { setCustomRange(e.target.value); setDownloadUrl(null); }}
                className="w-full text-sm font-bold border border-slate-300 rounded-lg px-3 py-2 focus:border-brand-500 focus:outline-none"
                placeholder="Contoh: 1-3, 5"
              />
            )}
          </>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">Pilih PDF terlebih dahulu.</p>
        )}
      </div>
      <ActionPanel
        title="Pecah PDF"
        emptyMessage="Pilih file PDF untuk memulai."
        isReady={!!pdfFile}
        isProcessing={isProcessing}
        progress={progress}
        processStep={processStep}
        downloadUrl={downloadUrl}
        downloadName={downloadName}
        downloadLabel={`Unduh Hasil (${isZip ? 'ZIP' : 'PDF'})`}
        onAction={doSplitPdf}
        actionLabel="Proses Pecahkan PDF"
        actionIcon={Layers}
        onReset={() => setDownloadUrl(null)}
        resetLabel="Pecah Rentang Lain"
      />
    </div>
  );

  return (
    <ConversionDashboard
      title="Pecah Berkas"
      highlight="PDF"
      description="Ekstrak halaman PDF — lihat perbandingan ukuran file asli vs hasil pecahan secara transparan."
      comparisonItems={comparisonItems}
      showComparison={comparisonItems.length > 0}
      adTop={<AdBanner type="horizontal" />}
      adSidebar={<AdBanner type="square" />}
      sidebar={sidebar}
      infoBox={
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
          <HelpCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">Format rentang:</p>
            <p>• Tunggal: <code className="bg-slate-200 px-1 rounded">3</code> • Rentang: <code className="bg-slate-200 px-1 rounded">1-5</code> • Kombinasi: <code className="bg-slate-200 px-1 rounded">1-3, 5, 7-9</code></p>
          </div>
        </div>
      }
    >
      {uploadZone}
    </ConversionDashboard>
  );
};

export default SplitPdf;
