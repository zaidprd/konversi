import React, { useState } from 'react';
import { RefreshCw, Menu, X, ArrowLeft, Heart, Sparkles, Megaphone, ChevronDown } from 'lucide-react';
import { BRAND } from '../config/brand';

const Header = ({ currentTool, setCurrentTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toolsList = [
    { id: 'jpg-to-pdf', name: 'JPG ke PDF' },
    { id: 'png-to-pdf', name: 'PNG ke PDF' },
    { id: 'merge-pdf', name: 'Gabung PDF' },
    { id: 'split-pdf', name: 'Pecah PDF' },
    { id: 'pdf-to-img', name: 'PDF ke Gambar' },
    { id: 'img-compress', name: 'Kompres Gambar' },
    { id: 'img-format', name: 'Konversi Format Gambar' },
  ];

  const handleToolSelect = (toolId) => {
    setCurrentTool(toolId);
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const goHomeAndScroll = (targetId) => {
    if (currentTool !== 'home') {
      setCurrentTool('home');
    }
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleToolSelect('home')}>
            <div className="bg-gradient-to-tr from-brand-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-brand-200">
              <RefreshCw size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              {BRAND.name}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleToolSelect('home')}
              className={`text-sm font-semibold transition-colors ${
                currentTool === 'home' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>

            {/* Dropdown Tools */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors focus:outline-none"
              >
                Semua Alat
                <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  {toolsList.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-500 mr-2"></span>
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => goHomeAndScroll('pro')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pro
            </button>

            <button
              onClick={() => goHomeAndScroll('pasang-iklan')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1"
            >
              <Megaphone size={14} />
              <span>Pasang Iklan</span>
            </button>

            <button
              onClick={() => goHomeAndScroll('faq')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentTool !== 'home' && (
              <button
                onClick={() => handleToolSelect('home')}
                className="flex items-center text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Kembali ke Beranda
              </button>
            )}

            <button
              onClick={() => goHomeAndScroll('pasang-iklan')}
              className="flex items-center space-x-1 text-sm text-slate-700 hover:text-brand-600 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-200 transition-colors bg-slate-50"
            >
              <Megaphone size={15} />
              <span>Pasang Iklan</span>
            </button>

            <button
              onClick={() => goHomeAndScroll('pro')}
              className="flex items-center space-x-1 text-sm bg-gradient-to-r from-brand-500 to-rose-500 hover:from-brand-600 hover:to-rose-600 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-brand-100 transform active:scale-95"
            >
              <Sparkles size={15} />
              <span>Pro (Gratis)</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {currentTool !== 'home' && (
              <button
                onClick={() => handleToolSelect('home')}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fadeIn">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => handleToolSelect('home')}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
                currentTool === 'home' ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            <div className="py-2">
              <div className="px-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-widest">Alat Konversi & Edit PDF</div>
              <div className="grid grid-cols-1 gap-1 mt-1 pl-2">
                {toolsList.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      currentTool === tool.id
                        ? 'text-brand-600 bg-brand-50 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => goHomeAndScroll('pasang-iklan')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pasang Iklan
            </button>

            <button
              onClick={() => goHomeAndScroll('pro')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Paket Pro
            </button>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <button
                onClick={() => goHomeAndScroll('pasang-iklan')}
                className="flex justify-center items-center space-x-1 text-sm text-slate-700 hover:text-brand-600 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 hover:border-brand-200 transition-colors bg-slate-50"
              >
                <Megaphone size={15} />
                <span>Pasang Iklan / Sponsor</span>
              </button>

              <button
                onClick={() => goHomeAndScroll('pro')}
                className="flex justify-center items-center space-x-1 text-sm bg-gradient-to-r from-brand-500 to-rose-500 text-white font-bold px-4 py-2.5 rounded-lg transition-all shadow-md"
              >
                <Sparkles size={15} />
                <span>Cobain Pro Gratis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
