import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ScrollToTop from './components/ScrollToTop';

// Lazy-load tool components - ini memotong initial bundle secara signifikan
// karena jspdf + pdf-lib + html2canvas (~1.3 MB) hanya di-load saat user
// benar-benar membuka tool, bukan saat landing page.
const ImageToPdf = lazy(() => import('./components/ImageToPdf'));
const MergePdf = lazy(() => import('./components/MergePdf'));
const SplitPdf = lazy(() => import('./components/SplitPdf'));
const PdfToImage = lazy(() => import('./components/PdfToImage'));
const ImageCompressor = lazy(() => import('./components/ImageCompressor'));
const ImageFormatConverter = lazy(() => import('./components/ImageFormatConverter'));

const ToolLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Memuat alat...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-rose-500 selection:text-white">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<ToolLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jpg-to-pdf" element={<ImageToPdf initialType="jpg" />} />
              <Route path="/png-to-pdf" element={<ImageToPdf initialType="png" />} />
              <Route path="/merge-pdf" element={<MergePdf />} />
              <Route path="/split-pdf" element={<SplitPdf />} />
              <Route path="/pdf-to-jpg" element={<PdfToImage />} />
              <Route path="/compress-image" element={<ImageCompressor />} />
              <Route path="/convert-format" element={<ImageFormatConverter />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;