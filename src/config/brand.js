// Konfigurasi brand terpusat - ubah di sini untuk rebrand seluruh aplikasi.
const env = import.meta.env;

export const BRAND = {
  name: env.VITE_BRAND_NAME || 'KONVERSI',
  tagline: env.VITE_BRAND_TAGLINE || 'Konversi JPG, PNG & PDF Online - Gratis, Cepat & Privat',
  domain: env.VITE_BRAND_DOMAIN || 'konversi.io',
  url: env.VITE_BRAND_URL || 'https://konversi.io',
  email: {
    sales: env.VITE_BRAND_EMAIL_SALES || 'sales@konversi.io',
    ads: env.VITE_BRAND_EMAIL_ADS || 'ads@konversi.io',
    support: env.VITE_BRAND_EMAIL_SUPPORT || 'support@konversi.io',
  },
  downloadPrefix: env.VITE_BRAND_DOWNLOAD_PREFIX || 'konversi',
};

// AdSense - set di Cloudflare Pages env vars sebelum build.
export const ADSENSE = {
  publisherId: env.VITE_ADSENSE_PUBLISHER_ID || '',
  slots: {
    'header-leaderboard': env.VITE_ADSENSE_SLOT_HEADER || '',
    'mid-square-left': env.VITE_ADSENSE_SLOT_MID_LEFT || '',
    'mid-square-right': env.VITE_ADSENSE_SLOT_MID_RIGHT || '',
    'footer-leaderboard': env.VITE_ADSENSE_SLOT_FOOTER || '',
  },
};

export const PRO_PLAN = {
  price: env.VITE_PRO_PRICE || 'Rp 49.000 / bulan',
  highlight: 'Tanpa iklan, multi-file, batch processing',
  features: [
    'Hapus seluruh iklan AdSense & banner sponsor',
    'Proses batch sampai 100 file sekaligus',
    'Akses API konversi untuk integrasi internal',
    'Template nama file kustom (workflow kantor)',
    'Dukungan prioritas via WhatsApp & email',
  ],
};

export const AD_SLOTS = [
  {
    id: 'header-leaderboard',
    type: 'horizontal',
    label: 'Header Leaderboard',
    size: '728x90 / responsif',
    position: 'Di bawah hero, sebelum grid alat',
    cpm: 'High',
  },
  {
    id: 'mid-square-left',
    type: 'square',
    label: 'Square Kiri',
    size: '300x250',
    position: 'Antara Tools dan Stats',
    cpm: 'Medium-High',
  },
  {
    id: 'mid-square-right',
    type: 'square',
    label: 'Square Kanan',
    size: '300x250',
    position: 'Antara Tools dan Stats',
    cpm: 'Medium-High',
  },
  {
    id: 'footer-leaderboard',
    type: 'horizontal',
    label: 'Footer Leaderboard',
    size: '728x90 / responsif',
    position: 'Di atas footer, setelah CTA newsletter',
    cpm: 'High',
  },
];

export function buildDownloadName(tool, extension) {
  return `${BRAND.downloadPrefix}_${tool}_${Date.now()}.${extension}`;
}
