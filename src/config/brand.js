// Konfigurasi brand terpusat - ubah di sini untuk rebrand seluruh aplikasi.

export const BRAND = {
  name: 'KONVERSI',
  tagline: 'Konversi JPG, PNG & PDF Online - Gratis, Cepat & Privat',
  domain: 'konversi.io',
  email: {
    sales: 'sales@konversi.io',
    ads: 'ads@konversi.io',
    support: 'support@konversi.io',
  },
  downloadPrefix: 'konversi',
};

export const PRO_PLAN = {
  price: 'Rp 49.000 / bulan',
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
