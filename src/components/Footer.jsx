import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Heart, Shield, Zap, Lock, Megaphone } from 'lucide-react';
import { BRAND } from '../config/brand';

const TOOLS_CONVERT = [
  { path: '/jpg-to-pdf', name: 'Konversi JPG ke PDF' },
  { path: '/png-to-pdf', name: 'Konversi PNG ke PDF' },
  { path: '/convert-format', name: 'Konversi Format Gambar' },
  { path: '/compress-image', name: 'Kompres Gambar' },
];

const TOOLS_EDIT = [
  { path: '/merge-pdf', name: 'Gabungkan PDF' },
  { path: '/split-pdf', name: 'Pecahkan PDF' },
  { path: '/pdf-to-jpg', name: 'Konversi PDF ke Gambar' },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-slate-800">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl mt-1"><Lock size={20} /></div>
            <div>
              <h4 className="text-white font-semibold text-base">Privasi 100% Terjamin</h4>
              <p className="text-sm text-slate-500 mt-1">Semua dokumen diproses sepenuhnya di browser Anda. Tidak ada file yang di-upload ke server. Data Anda aman.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mt-1"><Zap size={20} /></div>
            <div>
              <h4 className="text-white font-semibold text-base">Instan & Tanpa Batas</h4>
              <p className="text-sm text-slate-500 mt-1">Konversi file dalam hitungan detik. Tanpa batas ukuran file, tanpa watermark, dan 100% gratis selamanya.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mt-1"><RefreshCw size={20} /></div>
            <div>
              <h4 className="text-white font-semibold text-base">Multi-Format & Kompatibel</h4>
              <p className="text-sm text-slate-500 mt-1">JPG, PNG, WebP, dan format gambar lainnya ke PDF berkualitas tinggi. Kompatibel dengan semua sistem operasi & browser.</p>
            </div>
          </div>
        </div>

        {/* Links and Brand Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-rose-600 p-1.5 rounded-lg text-white"><RefreshCw size={18} /></div>
              <span className="text-lg font-bold text-white tracking-tight">{BRAND.name}</span>
            </Link>
            <p className="text-xs text-slate-500">
              {BRAND.name} adalah platform konversi dokumen online yang 100% gratis, tanpa watermark, dan tidak pernah meng-upload file Anda ke server cloud.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link to="/#faq" className="text-slate-500 hover:text-white transition-colors text-xs">FAQ</Link>
              <a href={`mailto:${BRAND.email.support}`} className="text-slate-500 hover:text-white transition-colors flex items-center space-x-1">
                <Heart size={14} className="text-rose-500 fill-rose-500" />
                <span className="text-xs">Dukung</span>
              </a>
            </div>
          </div>

          {/* Tools 1 */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Alat Konversi</h4>
            <ul className="space-y-2 text-sm">
              {TOOLS_CONVERT.map((t) => (
                <li key={t.path}>
                  <Link to={t.path} className="hover:text-white transition-colors text-slate-500">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools 2 */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Alat Edit PDF</h4>
            <ul className="space-y-2 text-sm">
              {TOOLS_EDIT.map((t) => (
                <li key={t.path}>
                  <Link to={t.path} className="hover:text-white transition-colors text-slate-500">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Advertiser & Legal */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center space-x-1">
              <Megaphone size={12} className="text-rose-400" />
              <span>Untuk Advertiser</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href={`mailto:${BRAND.email.ads}?subject=Pasang%20Iklan%20${encodeURIComponent(BRAND.name)}`} className="hover:text-white cursor-pointer transition-colors">Pasang Iklan / Sponsor</a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email.sales}?subject=Kerja%20Sama%20${encodeURIComponent(BRAND.name)}`} className="hover:text-white cursor-pointer transition-colors">Kerja Sama B2B</a>
              </li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Hubungi Kami</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Kebijakan Privasi</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Syarat & Ketentuan</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:items-center">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex justify-center space-x-6 text-xs text-slate-500">
            <div className="flex items-center space-x-1"><Shield size={12} className="text-emerald-500" /><span>Situs Terenkripsi 256-bit SSL</span></div>
            <span>Dibuat dengan cinta di Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;