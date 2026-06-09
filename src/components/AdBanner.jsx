import React from 'react';
import { Sparkles, Mail, BarChart3 } from 'lucide-react';
import { BRAND, AD_SLOTS } from '../config/brand';

/**
 * Slot iklan AdSense + banner sponsor.
 *
 * Untuk mengaktifkan iklan AdSense, isi variabel di bawah dengan
 * publisher ID & slot ID dari dashboard AdSense Anda, lalu hapus
 * komentar blok `<ins className="adsbygoogle">` di return JSX yang
 * sesuai. Placeholder visual otomatis hilang saat slot terisi.
 */
const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX';
// Override per-slot, contoh: { 'header-leaderboard': '1234567890' }
const ADSENSE_SLOT_OVERRIDES = {};

const getSlotMeta = (slotId) => AD_SLOTS.find((s) => s.id === slotId);

const renderAdSense = (slotId, format = 'auto') => {
  const slot = ADSENSE_SLOT_OVERRIDES[slotId] || 'XXXXXXXXXX';
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
};

const SponsorFallback = ({ slotId, layout = 'horizontal' }) => {
  const meta = getSlotMeta(slotId) || {};
  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-center px-5">
      <span className="inline-block bg-brand-100 text-brand-700 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wider">
        {meta.label || 'Ad Space'} &middot; {meta.size || layout}
      </span>
      <p className="text-xs md:text-sm text-slate-600 font-medium leading-snug max-w-md">
        Pasang iklan bisnis Anda di slot ini. Visibilitas tinggi di setiap halaman konversi.
        <span className="text-brand-600 font-bold ml-1 cursor-pointer hover:underline">
          {BRAND.email.sales}
        </span>
      </p>
    </div>
  );
};

const AdBanner = ({ slotId, type = 'horizontal', className = '' }) => {
  const isVertical = type === 'sidebar';

  if (type === 'horizontal') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-xl flex flex-col justify-center items-center h-28 md:h-24 shadow-sm group hover:border-brand-300 transition-colors">
          <div className="absolute top-1 left-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            SPONSOR / ADVERTISEMENT
          </div>
          <SponsorFallback slotId={slotId} layout="728x90" />
          {renderAdSense(slotId, 'auto')}
        </div>
      </div>
    );
  }

  if (isVertical) {
    return (
      <div className={`w-full max-w-[300px] h-[600px] bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 rounded-xl p-4 flex flex-col justify-between shadow-sm relative group hover:border-brand-300 transition-colors ${className}`}>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          SPONSOR / ADVERTISEMENT
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-3 bg-brand-50 text-brand-500 rounded-full">
            <Sparkles size={32} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">Space Iklan Tersedia</h4>
            <p className="text-xs text-slate-500 mt-2 px-2">
              Slot sidebar 300x600, visibilitas penuh saat pengguna memproses file.
            </p>
          </div>
          <button className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm inline-flex items-center space-x-1">
            <Mail size={12} />
            <span>Pasang Iklan</span>
          </button>
        </div>
        <div className="text-[10px] text-center text-slate-400">
          {BRAND.email.ads}
        </div>
        {renderAdSense(slotId, 'vertical')}
      </div>
    );
  }

  // default: square 300x250
  return (
    <div className={`w-[300px] h-[250px] mx-auto bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 rounded-xl p-4 flex flex-col justify-between shadow-sm relative group hover:border-brand-300 transition-colors ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          SPONSOR / ADVERTISEMENT
        </div>
        <div className="text-[9px] font-semibold text-brand-500 inline-flex items-center space-x-1">
          <BarChart3 size={10} />
          <span>{getSlotMeta(slotId)?.cpm || 'High CPM'}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-2">
        <span className="bg-brand-100 text-brand-600 text-[9px] font-semibold px-2 py-0.5 rounded">
          {getSlotMeta(slotId)?.label || 'AD SPACE'}
        </span>
        <p className="text-xs text-slate-600 font-medium px-2 leading-snug">
          Target audiens profesional, mahasiswa, dan desainer. CTR rata-rata 2.4% - 4.1%.
        </p>
        <p className="text-xs text-brand-500 font-bold hover:underline cursor-pointer">
          {BRAND.email.sales}
        </p>
      </div>
      <div className="text-[8px] text-right text-slate-400">
        Google AdSense Slot
      </div>
      {renderAdSense(slotId, 'rectangle')}
    </div>
  );
};

export default AdBanner;
