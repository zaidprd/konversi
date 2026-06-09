import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, Menu, X, ArrowLeft, Heart, Sparkles, Megaphone, ChevronDown } from 'lucide-react';
import { BRAND } from '../config/brand';

const TOOLS = [
  { path: '/jpg-to-pdf', name: 'JPG ke PDF' },
  { path: '/png-to-pdf', name: 'PNG ke PDF' },
  { path: '/merge-pdf', name: 'Gabung PDF' },
  { path: '/split-pdf', name: 'Pecah PDF' },
  { path: '/pdf-to-jpg', name: 'PDF ke JPG' },
  { path: '/compress-image', name: 'Kompres Gambar' },
  { path: '/convert-format', name: 'Konversi Format' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isToolPage = !isHome;

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  // Scroll to anchor di home (untuk link "Pro" & "Pasang Iklan")
  const goToAnchor = (anchor) => {
    closeMenu();
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } else {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="bg-gradient-to-tr from-rose-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-rose-200">
              <RefreshCw size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isHome ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </Link>

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
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={closeMenu}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition-colors flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => goToAnchor('pro')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pro
            </button>

            <button
              onClick={() => goToAnchor('pasang-iklan')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1"
            >
              <Megaphone size={14} />
              <span>Pasang Iklan</span>
            </button>

            <button
              onClick={() => goToAnchor('faq')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isToolPage && (
              <Link
                to="/"
                className="flex items-center text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Kembali
              </Link>
            )}

            <a
              href={`mailto:${BRAND.email.ads}?subject=Pasang%20Iklan%20${encodeURIComponent(BRAND.name)}`}
              className="flex items-center space-x-1 text-sm text-slate-700 hover:text-rose-600 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors bg-slate-50"
            >
              <Megaphone size={15} />
              <span>Pasang Iklan</span>
            </a>

            <button
              onClick={() => goToAnchor('pro')}
              className="flex items-center space-x-1 text-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-rose-100 transform active:scale-95"
            >
              <Sparkles size={15} />
              <span>Pro (Gratis)</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isToolPage && (
              <Link
                to="/"
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle menu"
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
            <Link
              to="/"
              onClick={closeMenu}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
                isHome ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>

            <div className="py-2">
              <div className="px-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Alat Konversi & Edit PDF
              </div>
              <div className="grid grid-cols-1 gap-1 mt-1 pl-2">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={closeMenu}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      location.pathname === tool.path
                        ? 'text-rose-600 bg-rose-50 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={() => goToAnchor('pasang-iklan')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pasang Iklan
            </button>

            <button
              onClick={() => goToAnchor('pro')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Paket Pro
            </button>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <a
                href={`mailto:${BRAND.email.ads}?subject=Pasang%20Iklan%20${encodeURIComponent(BRAND.name)}`}
                onClick={closeMenu}
                className="flex justify-center items-center space-x-1 text-sm text-slate-700 hover:text-rose-600 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors bg-slate-50"
              >
                <Megaphone size={15} />
                <span>Pasang Iklan / Sponsor</span>
              </a>

              <button
                onClick={() => goToAnchor('pro')}
                className="flex justify-center items-center space-x-1 text-sm bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold px-4 py-2.5 rounded-lg transition-all shadow-md"
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