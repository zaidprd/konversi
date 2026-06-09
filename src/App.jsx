import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ImageToPdf from './components/ImageToPdf';
import MergePdf from './components/MergePdf';
import SplitPdf from './components/SplitPdf';
import PdfToImage from './components/PdfToImage';
import ImageCompressor from './components/ImageCompressor';
import ImageFormatConverter from './components/ImageFormatConverter';

function App() {
  const [currentTool, setCurrentTool] = useState('home');

  // Scroll to top on tool change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTool]);

  const handleSelectTool = (toolId) => {
    setCurrentTool(toolId);
  };

  const renderActiveTool = () => {
    switch (currentTool) {
      case 'home':
        return <LandingPage onSelectTool={handleSelectTool} />;
      case 'jpg-to-pdf':
        return <ImageToPdf initialType="jpg" />;
      case 'png-to-pdf':
        return <ImageToPdf initialType="png" />;
      case 'merge-pdf':
        return <MergePdf />;
      case 'split-pdf':
        return <SplitPdf />;
      case 'pdf-to-img':
        return <PdfToImage />;
      case 'img-compress':
        return <ImageCompressor />;
      case 'img-format':
        return <ImageFormatConverter />;
      default:
        return <LandingPage onSelectTool={handleSelectTool} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <Header currentTool={currentTool} setCurrentTool={setCurrentTool} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderActiveTool()}
      </main>

      {/* Footer Branding & Links */}
      <Footer setCurrentTool={setCurrentTool} />
    </div>
  );
}

export default App;
