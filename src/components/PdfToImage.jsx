import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Upload, FileText, HelpCircle, Image as ImageIcon } from 'lucide-react';
import AdBanner from './AdBanner';
import { ConversionDashboard, ActionPanel } from './dashboard';
import { useConversionComparison } from '../hooks/useConversionComparison';
import { buildDownloadName } from '../config/brand';
import { CONVERSION_STATUS } from '../types/conversion';

const COMPARISON_ID = 'pdf-to-img';

const PdfToImage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [libError, setLibError] = useState(false);

  const fileInputRef = useRef(null);
  const { items: comparisonItems, setComparison, reset: resetComparison } = useConversionComparison();

  useEffect(() => {
    if (window.pdfjsLib) {
      setIsLibLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setIsLibLoaded(true);
    };
    script.onerror = () => setLibError(true);
    document.body.appendChild(script);
  }, []);

  const processFile = async (file) => {
    if (!isLibLoaded) {
      alert('Pustaka PDF sedang dimuat. Harap tunggu beberapa detik.');
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Mohon pilih file PDF yang valid.');
      return;
    }

    setIsProcessing(true);
    setProcessStep('Membaca berkas PDF...');
    setProgress(15);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      setPdfFile({ file, name: file.name, sizeBytes: file.size, bytes: arrayBuffer });
      setPageCount(pdf.numPages);
      setDownloadUrl(null);

      setComparison(COMPARISON_ID, {
        before: {
          label: 'PDF Asli',
          fileName: file.name,
          sizeBytes: file.size,
          previewType: 'pdf',
        },
        status: CONVERSION_STATUS.IDLE,
        meta: { pageCount: pdf.numPages },
      });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat membaca PDF.');
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

  const convertPdfToImages = async () => {
    if (!pdfFile || !isLibLoaded) return;

    setIsProcessing(true);
    setProgress(10);
    setProcessStep('Memulai render halaman...');
    setComparison(COMPARISON_ID, {
      before: {
        label: 'PDF Asli',
        fileName: pdfFile.name,
        sizeBytes: pdfFile.sizeBytes,
        previewType: 'pdf',
      },
      status: CONVERSION_STATUS.PROCESSING,
      meta: { pageCount },
    });

    try {
      const zip = new JSZip();
      const pdf = await window.pdfjsLib.getDocument({ data: pdfFile.bytes }).promise;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const cleanName = pdfFile.name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= pageCount; i++) {
        setProgress(Math.round(10 + (i / pageCount) * 75));
        setProcessStep(`Merender Halaman ${i} dari ${pageCount}...`);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;

        const imgBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        zip.file(`${cleanName}_halaman_${i}.jpg`, imgBase64, { base64: true });
      }

      setProgress(90);
      setProcessStep('Mengompres menjadi ZIP...');

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(zipBlob);
      const outName = buildDownloadName('pdf_ke_gambar', 'zip');

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
          label: 'ZIP Gambar JPG',
          fileName: outName,
          sizeBytes: zipBlob.size,
          previewType: 'generic',
        },
        status: CONVERSION_STATUS.COMPLETE,
        meta: { pageCount, format: 'JPG' },
      });

      setProgress(100);
      setProcessStep('Konversi Berhasil!');

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = outName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat merender PDF ke Gambar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const mainContent = !isLibLoaded && !libError ? (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-600">Memuat pustaka PDF...</p>
    </div>
  ) : libError ? (
    <div className="bg-white border border-red-200 rounded-2xl p-12 text-center">
      <p className="text-sm font-semibold text-red-600">Gagal memuat modul PDF. Periksa koneksi internet.</p>
    </div>
  ) : !pdfFile ? (
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
      <h3 className="text-lg font-bold text-slate-800">Tarik & Letakkan File PDF di Sini</h3>
      <p className="text-slate-500 text-sm mt-1">atau klik untuk memilih berkas</p>
    </div>
  ) : (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
        <h3 className="font-bold text-slate-800 flex items-center">
          <ImageIcon className="text-brand-500 mr-2" size={20} />
          PDF Siap Dikonversi
        </h3>
        <button onClick={removeFile} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg">
          Ganti File
        </button>
      </div>
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center font-bold text-sm">PDF</div>
        <div>
          <h4 className="font-bold text-sm text-slate-800">{pdfFile.name}</h4>
          <p className="text-xs text-slate-500 mt-1">{pageCount} Halaman → {pageCount} file JPG</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto">
        {Array.from({ length: Math.min(pageCount, 24) }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-slate-50 border rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-500">
            <FileText size={16} />
            <span className="font-bold mt-1">{i + 1}.jpg</span>
          </div>
        ))}
        {pageCount > 24 && <div className="aspect-[3/4] bg-slate-50 border border-dashed rounded-lg flex items-center justify-center text-[10px] text-slate-400">+{pageCount - 24}</div>}
      </div>
    </div>
  );

  return (
    <ConversionDashboard
      title="Konversi"
      highlight="PDF ke Gambar (JPG)"
      description="Ekstrak halaman PDF menjadi JPG — lihat perbandingan ukuran PDF asli vs ZIP hasil secara transparan."
      comparisonItems={comparisonItems}
      showComparison={comparisonItems.length > 0}
      adTop={<AdBanner type="horizontal" />}
      adSidebar={<AdBanner type="square" />}
      sidebar={
        <ActionPanel
          title="Konversi PDF"
          emptyMessage="Pilih file PDF terlebih dahulu."
          isReady={!!pdfFile && isLibLoaded}
          isProcessing={isProcessing}
          progress={progress}
          processStep={processStep}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="Unduh ZIP Gambar"
          onAction={convertPdfToImages}
          actionLabel="Konversi PDF ke JPG"
          actionIcon={ImageIcon}
          onReset={() => setDownloadUrl(null)}
          resetLabel="Konversi Ulang"
        />
      }
      infoBox={
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
          <HelpCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600">
            <p className="font-bold text-slate-700">Perbandingan ukuran transparan:</p>
            <p>Panel hasil menampilkan ukuran PDF asli vs total ZIP gambar JPG — Anda tahu persis berapa besar output sebelum mengunduh.</p>
          </div>
        </div>
      }
    >
      {mainContent}
    </ConversionDashboard>
  );
};

export default PdfToImage;
