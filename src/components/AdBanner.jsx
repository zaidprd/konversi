import React from 'react';
import { Sparkles, Mail, BarChart3 } from 'lucide-react';
import { BRAND, AD_SLOTS, ADSENSE } from '../config/brand';

/**
 * Slot iklan AdSense + banner sponsor.
 *
 * Untuk mengaktifkan iklan AdSense:
 * 1. Set VITE_ADSENSE_PUBLISHER_ID & VITE_ADSENSE_SLOT_* di Cloudflare Pages env vars.
 * 2. Block <ins className="adsbygoogle"> di bawah akan otomatis ter-render.
 * 3. Tanpa konfigurasi AdSense, fallback visual sponsor tetap tampil.
 */
const getSlotMeta = (slotId) => AD_SLOTS.find((s) => s.id === slotId);

const renderAdSense = (slotId, format = 'auto') => {
  if (!ADSENSE.publisherId) return null;
  const slot = ADSENSE.slots[slotId];
  if (!slot) return null;
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={ADSENSE.publisherId}
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
      <span className="inline-block bg-rose-100 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wider">
        {meta.label || 'Ad Space'} &middot; {meta.size || layout}
      </span>
      <p className="text-xs md:text-sm text-slate-600 font-medium leading-snug max-w-md">
        Pasang iklan bisnis Anda di slot ini. Visibilitas tinggi di setiap halaman konversi.
        <span className="text-rose-600 font-bold ml-1 cursor-pointer hover:underline">
          {BRAND.email.sales}
        </span>
      </p>
    </div>
  );
};

const AdBanner = ({ slotId, type = 'horizontal', className = '' }) => {
  if (type === 'horizontal') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-xl flex flex-col justify-center items-center h-28 md:h-24 shadow-sm group hover:border-rose-300 transition-colors">
          <div className="absolute top-1 left-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            SPONSOR / ADVERTISEMENT
          </div>
          <SponsorFallback slotId={slotId} layout="728x90" />
          {renderAdSense(slotId, 'auto')}
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className={`w-full max-w-[300px] h-[600px] bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 rounded-xl p-4 flex flex-col justify-between shadow-sm relative group hover:border-rose-300 transition-colors ${className}`}>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          SPONSOR / ADVERTISEMENT
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-full">
            <Sparkles size={32} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">Space Iklan Tersedia</h4>
            <p className="text-xs text-slate-500 mt-2 px-2">
              Slot sidebar 300x600, visibilitas penuh saat pengguna memproses file.
            </p>
          </div>
          <button className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm inline-flex items-center space-x-1">
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

  // square 300x250
  return (
    <div className={`w-[300px] h-[250px] mx-auto bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 rounded-xl p-4 flex flex-col justify-between shadow-sm relative group hover:border-rose-300 transition-colors ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          SPONSOR / ADVERTISEMENT
        </div>
        <div className="text-[9px] font-semibold text-rose-500 inline-flex items-center space-x-1">
          <BarChart3 size={10} />
          <span>{getSlotMeta(slotId)?.cpm || 'High CPM'}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-2">
        <span className="bg-rose-100 text-rose-600 text-[9px] font-semibold px-2 py-0.5 rounded">
          {getSlotMeta(slotId)?.label || 'AD SPACE'}
        </span>
        <p className="text-xs text-slate-600 font-medium px-2 leading-snug">
          Target audiens profesional, mahasiswa, dan desainer.
        </p>
        <p className="text-xs text-rose-500 font-bold hover:underline cursor-pointer">
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