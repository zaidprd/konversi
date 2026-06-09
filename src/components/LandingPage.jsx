import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Image as ImageIcon, Layers, Layout, Sliders,
  HelpCircle, ChevronDown, ChevronUp, Search, Sparkles, Star,
  Award, Mail, Repeat2, Crown, Check, Shield, Zap,
  Globe, FileCheck, Clock, Megaphone, ArrowRight,
} from 'lucide-react';
import AdBanner from './AdBanner';
import { BRAND, PRO_PLAN, AD_SLOTS } from '../config/brand';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  const tools = [
    {
      path: '/jpg-to-pdf',
      name: 'JPG ke PDF',
      desc: 'Ubah banyak gambar JPG menjadi satu dokumen PDF rapi.',
      icon: <ImageIcon className="text-rose-500" size={26} />,
      category: 'convert',
      hot: true,
    },
    {
      path: '/png-to-pdf',
      name: 'PNG ke PDF',
      desc: 'Konversi PNG transparan jadi PDF resolusi tinggi.',
      icon: <FileText className="text-orange-500" size={26} />,
      category: 'convert',
      hot: false,
    },
    {
      path: '/merge-pdf',
      name: 'Gabungkan PDF',
      desc: 'Susun & gabung banyak PDF jadi satu file.',
      icon: <Layers className="text-indigo-500" size={26} />,
      category: 'edit',
      hot: true,
    },
    {
      path: '/split-pdf',
      name: 'Pecah PDF',
      desc: 'Ekstrak halaman tertentu dari PDF Anda.',
      icon: <Layout className="text-blue-500" size={26} />,
      category: 'edit',
      hot: false,
    },
    {
      path: '/pdf-to-jpg',
      name: 'PDF ke JPG',
      desc: 'Konversi setiap halaman PDF jadi gambar JPG.',
      icon: <ImageIcon className="text-emerald-500" size={26} />,
      category: 'convert',
      hot: true,
    },
    {
      path: '/convert-format',
      name: 'Konversi Format',
      desc: 'Ubah JPG <-> PNG <-> WebP dengan slider kualitas.',
      icon: <Repeat2 className="text-violet-500" size={26} />,
      category: 'convert',
      hot: false,
    },
    {
      path: '/compress-image',
      name: 'Kompres Gambar',
      desc: 'Kurangi ukuran JPG/PNG hingga 90% tanpa pecah.',
      icon: <Sliders className="text-amber-500" size={26} />,
      category: 'optimize',
      hot: false,
    },
  ];

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'convert', label: 'Konversi' },
    { id: 'edit', label: 'Edit PDF' },
    { id: 'optimize', label: 'Optimasi' },
  ];

  const features = [
    {
      icon: <Shield className="text-rose-500" size={22} />,
      title: 'Privasi Penuh',
      desc: 'File diproses 100% di browser Anda. Tidak ada upload ke server, tidak ada pihak ketiga yang bisa melihat data Anda.',
    },
    {
      icon: <Zap className="text-amber-500" size={22} />,
      title: 'Instan & Ringan',
      desc: 'Konversi selesai dalam hitungan detik. Tidak perlu install aplikasi atau plugin tambahan.',
    },
    {
      icon: <FileCheck className="text-emerald-500" size={22} />,
      title: 'Tanpa Batasan',
      desc: 'Gratis selamanya. Tidak ada watermark, tidak ada batas ukuran file, tidak perlu registrasi akun.',
    },
    {
      icon: <Globe className="text-indigo-500" size={22} />,
      title: 'Multi-Platform',
      desc: 'Berjalan di Chrome, Firefox, Safari, Edge - desktop maupun HP. Bahasa Indonesia default.',
    },
  ];

  const faqs = [
    {
      q: `Apakah ${BRAND.name} benar-benar gratis?`,
      a: `Ya, semua fitur dasar 100% gratis tanpa batas ukuran file, tanpa watermark, dan tanpa registrasi akun. Kami membiayai platform lewat iklan AdSense yang ramah dan paket Pro opsional.`,
    },
    {
      q: 'Apakah file saya aman dan privat?',
      a: `Sangat aman. Semua konversi dilakukan secara lokal di memori browser Anda. File tidak pernah meninggalkan perangkat Anda, sehingga tidak ada pihak ketiga yang bisa melihat isinya.`,
    },
    {
      q: 'Apakah saya perlu install aplikasi?',
      a: `Tidak. ${BRAND.name} berjalan langsung di browser modern (Chrome, Firefox, Safari, Edge) di desktop maupun HP. Tidak perlu download, install, atau plugin tambahan.`,
    },
    {
      q: `Apa itu ${BRAND.name} Pro?`,
      a: `Pro menghapus semua iklan, membuka batch processing sampai 100 file sekaligus, akses API, dan dukungan prioritas. Hanya ${PRO_PLAN.price} dan bisa dibatalkan kapan saja.`,
    },
    {
      q: 'Format file apa saja yang didukung?',
      a: 'JPG, PNG, WebP untuk gambar. PDF untuk dokumen. Anda bisa mengkonversi antar format gambar, menggabungkan beberapa PDF, memecah PDF, dan mengompres gambar - semua dalam satu platform.',
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="animate-fadeIn">

      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-white to-white -z-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                <Shield size={12} />
                <span>100% Privat - File Tidak Keluar dari Browser</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Konversi JPG, PNG & PDF <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                  dalam hitungan detik.
                </span>
              </h1>

              <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Platform konversi dokumen yang memproses file langsung di browser Anda.
                Lebih cepat, lebih privat, 100% gratis - tanpa upload ke server.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/jpg-to-pdf')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl text-sm inline-flex items-center justify-center space-x-2 group"
                >
                  <Zap size={16} />
                  <span>Mulai Konversi Gratis</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#kenapa-konversi"
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm inline-flex items-center justify-center space-x-2"
                >
                  <span>Kenapa KONVERSI?</span>
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 pt-2">
                <div className="flex items-center space-x-1.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Tanpa registrasi</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Tanpa watermark</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Mobile-friendly</span>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-rose-100/40 to-indigo-100/40 rounded-3xl blur-2xl -z-10" />
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Live Preview
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">5 file JPG</span>
                    <span className="font-mono text-slate-400">12.4 MB</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: '100%' }} />
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="bg-slate-900 rounded-full p-1.5">
                      <ArrowRight size={14} className="text-white rotate-90" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700">1 file PDF</span>
                    <span className="font-mono font-bold text-emerald-600">2.1 MB</span>
                  </div>
                  <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '17%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">Hemat ukuran file</span>
                    <span className="text-xs font-black text-rose-600">-83%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <Clock size={18} className="text-rose-500" />
              <p className="text-lg font-black text-slate-900">&lt; 3 dtk</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">Rata-rata proses</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Shield size={18} className="text-rose-500" />
              <p className="text-lg font-black text-slate-900">0% Upload</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">100% lokal</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <FileCheck size={18} className="text-rose-500" />
              <p className="text-lg font-black text-slate-900">7+ Alat</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">Siap pakai</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Globe size={18} className="text-rose-500" />
              <p className="text-lg font-black text-slate-900">ID-First</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">Bahasa Indonesia</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Semua Alat PDF & Gambar, dalam Satu Tempat
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            Pilih alat yang Anda butuhkan - semua prosesnya gratis, tanpa limit, dan berjalan langsung di browser.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 mb-8">
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-sm flex items-center focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
            <Search className="text-slate-400 ml-4 flex-shrink-0" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari alat, misal: gabung PDF..."
              className="w-full text-sm border-0 focus:ring-0 focus:outline-none px-3 py-3.5 text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-3 py-1 mr-2 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group bg-white border border-slate-200 rounded-2xl p-5 text-left transition-all duration-200 hover:border-slate-900 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-slate-900 group-hover:border-slate-900 transition-colors">
                    <div className="group-hover:[&>svg]:text-white transition-colors">
                      {tool.icon}
                    </div>
                  </div>
                  {tool.hot && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Populer
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tool.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-slate-400 group-hover:text-rose-600 transition-colors">
                  <span>Buka alat</span>
                  <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm">Alat tidak ditemukan.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 text-rose-500 text-xs font-semibold hover:underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Ad slot 1 */}
      <AdBanner slotId="header-leaderboard" type="horizontal" />

      {/* KENAPA KONVERSI - Value props (no competitor) */}
      <section id="kenapa-konversi" className="py-16 md:py-20 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full border border-rose-100">
              <Award size={12} />
              <span>Kenapa KONVERSI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dibuat untuk Privasi, Kecepatan, dan Kemudahan
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Empat pilar utama yang membuat KONVERSI berbeda dari utilitas konversi pada umumnya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat) => (
              <div key={feat.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
                <div className="inline-flex p-2.5 bg-slate-50 rounded-xl mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            3 Langkah Selesai
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Tanpa daftar akun, tanpa install software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: 1, title: 'Pilih Alat', desc: 'Pilih salah satu dari 7 alat konversi di atas.' },
            { n: 2, title: 'Upload File', desc: 'Drag & drop file Anda. Atur opsi jika perlu.' },
            { n: 3, title: 'Download Hasil', desc: 'File hasil otomatis terunduh. Privat, cepat, gratis.' },
          ].map((step) => (
            <div key={step.n} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-9 h-9 bg-slate-900 text-white rounded-full font-black text-sm flex items-center justify-center">
                  {step.n}
                </div>
                <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRO SECTION */}
      <section id="pro" className="py-16 md:py-20 bg-slate-900 border-y border-slate-800 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                <Crown size={12} />
                <span>{BRAND.name} Pro</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Bebas Iklan, Batch 100 File, Akses API.
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Untuk profesional, freelancer, dan tim kantor yang butuh workflow konversi tanpa gangguan.
              </p>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8">
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Paket Pro</p>
                    <p className="text-3xl md:text-4xl font-black text-white mt-1">{PRO_PLAN.price}</p>
                  </div>
                  <span className="hidden md:inline-block text-[10px] uppercase tracking-widest text-emerald-400 font-semibold bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded">
                    Batalkan kapan saja
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {PRO_PLAN.features.map((feat) => (
                    <li key={feat} className="flex items-start space-x-2 text-sm text-slate-300">
                      <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${BRAND.email.sales}?subject=Berlangganan%20${encodeURIComponent(BRAND.name)}%20Pro`}
                  className="block w-full text-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Coba Pro 7 Hari Gratis
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot 2 */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6 justify-center items-center">
        <AdBanner slotId="mid-square-left" type="square" />
        <div className="hidden md:block">
          <AdBanner slotId="mid-square-right" type="square" />
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full border border-rose-100">
            <HelpCircle size={12} />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Ditanya
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all hover:border-slate-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-5 py-4 font-semibold text-sm md:text-base text-slate-900 hover:text-rose-600 flex justify-between items-center transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp size={18} className="text-rose-500 flex-shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-4 pt-1 text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PASANG IKLAN - small dedicated section for advertisers */}
      <section id="pasang-iklan" className="py-12 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 flex items-start space-x-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <Megaphone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Ingin Beriklan di {BRAND.name}?</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Tersedia {AD_SLOTS.length} slot iklan strategis dengan audiens profesional & mahasiswa yang aktif.
                  Hubungi tim sales untuk paket AdSense atau banner sponsor khusus.
                </p>
              </div>
            </div>
            <a
              href={`mailto:${BRAND.email.sales}?subject=Pemasangan%20Iklan%20${encodeURIComponent(BRAND.name)}`}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm text-center inline-flex items-center justify-center space-x-2"
            >
              <Mail size={15} />
              <span>Hubungi Tim Sales</span>
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Sparkles size={28} className="text-rose-400 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Siap Konversi File Pertama Anda?
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            Gratis, tanpa registrasi, dan file Anda tidak pernah meninggalkan browser.
          </p>
          <button
            onClick={() => navigate('/jpg-to-pdf')}
            className="inline-flex items-center space-x-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg text-sm group"
          >
            <span>Mulai Konversi Sekarang</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer ad */}
      <AdBanner slotId="footer-leaderboard" type="horizontal" />

    </div>
  );
};

export default LandingPage;