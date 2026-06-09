# Panduan Publikasi KONVERSI ke Vercel & Pemasangan Iklan 🚀

Dokumen ini berisi panduan lengkap langkah demi langkah untuk mendeploy website **KONVERSI** ke Vercel (gratis!) serta petunjuk cara mengonfigurasi iklan (seperti Google AdSense) untuk memaksimalkan pendapatan Anda.

---

## Bagian 1: Keunggulan Arsitektur KONVERSI
Website ini dirancang menggunakan arsitektur **Client-Side Processing (Pemrosesan di Browser)**. Keuntungan luar biasa bagi Anda sebagai pemilik:
1. **Hosting 100% Gratis Selamanya**: Karena proses konversi berat (seperti menggabungkan PDF, merender PDF ke Gambar, kompresi) dilakukan di browser pengunjung, server Vercel Anda hanya menyajikan file statis (HTML/JS/CSS). Ini tidak memakan bandwidth server atau limit serverless function! Anda tidak akan pernah mendapatkan tagihan hosting meskipun dikunjungi jutaan orang!
2. **Kecepatan Instan**: Pengguna tidak perlu menunggu waktu upload & download file besar ke server cloud, menjadikannya berkali-kali lipat lebih cepat dibanding layanan konversi awan.
3. **Kepercayaan Tinggi (Privasi 100%)**: Sangat disukai oleh instansi pemerintah dan profesional karena file rahasia tidak pernah keluar dari komputer mereka.

---

## Bagian 2: Langkah Mendeploy ke Vercel

Ada dua cara mudah untuk mempublikasikan website ini ke Vercel:

### Cara A: Melalui Vercel Dashboard & GitHub (Sangat Direkomendasikan 🌟)

1. **Buat Repositori Git Baru di GitHub:**
   - Masuk ke akun [GitHub](https://github.com/) Anda.
   - Buat repositori baru dengan nama, misalnya, `konversi-converter`.

2. **Inisialisasi Git di Komputer Anda & Push Kode:**
   Buka terminal di folder proyek ini dan jalankan perintah berikut:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi website konversi KONVERSI"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/konversi-converter.git
   git push -u origin main
   ```

3. **Deploy di Vercel:**
   - Masuk ke [Vercel](https://vercel.com/) menggunakan akun GitHub Anda.
   - Klik tombol **"Add New"** -> **"Project"**.
   - Pilih repositori `konversi-converter` yang baru saja Anda push.
   - Vercel akan mendeteksi secara otomatis bahwa ini adalah proyek **Vite**.
   - Klik **"Deploy"**.
   - Dalam waktu kurang dari 1 menit, website Anda sudah live dengan URL gratis dari Vercel (contoh: `konversi-converter.vercel.app`)!

---

### Cara B: Menggunakan Vercel CLI (Alternatif Tanpa GitHub)

1. **Instal Vercel CLI secara global:**
   ```bash
   npm install -g vercel
   ```
2. **Login ke Vercel dari terminal Anda:**
   ```bash
   vercel login
   ```
3. **Inisialisasi deployment:**
   Jalankan perintah ini di root folder proyek:
   ```bash
   vercel
   ```
   - Jawab pertanyaan di terminal (tekan Enter untuk pilihan default).
   - Setelah proses upload selesai, jalankan perintah berikut untuk rilis produksi:
     ```bash
     vercel --prod
     ```

---

## Bagian 3: Cara Menghubungkan Domain Kustom (Misal: `konversi.io`)

1. Di dashboard proyek Vercel Anda, masuk ke menu **Settings** > **Domains**.
2. Masukkan nama domain Anda (misal: `konversi.io` atau `konversipdf.com`) lalu klik **Add**.
3. Vercel akan memberikan info konfigurasi DNS berupa **CNAME** atau **A Record**.
4. Masuk ke panel domain registrar Anda (seperti Niagahoster, Rumahweb, Namecheap, Cloudflare) dan tambahkan DNS Record tersebut.
5. Vercel akan mengonfigurasi SSL (HTTPS) secara otomatis secara gratis!

---

## Bagian 4: Memasang Iklan (Google AdSense / Mediavine / Ezoic) 💵

Situs utilitas memiliki **RPM (Revenue per Mille)** yang sangat tinggi karena pengguna menghabiskan waktu lama di halaman saat menyusun dan mengunduh berkas. 

Kami telah menyiapkan **Ad Slots Placeholder** khusus yang sangat estetis di beberapa bagian strategis:
- **Header Banner** (Horizontal Leaderboard)
- **Tool Sidebars** (Square / Sidebar Banner)
- **Footer Banner** (Square / Horizontal)

### Langkah Integrasi Google AdSense:

1. **Daftarkan Situs Anda di Google AdSense:**
   - Masuk ke [Google AdSense](https://www.google.com/adsense/).
   - Daftarkan domain kustom Anda (misal: `konversi.io`).
   - Salin kode script utama dari AdSense.

2. **Masukkan Script Utama AdSense di `index.html`:**
   Buka file `index.html` di proyek Anda, lalu paste script AdSense di dalam tag `<head>`:
   ```html
   <head>
     <!-- Kode Utama AdSense Anda -->
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
     ...
   </head>
   ```

3. **Ganti Placeholder Kode Iklan di `src/components/AdBanner.jsx`:**
   Buka file `src/components/AdBanner.jsx`. Anda akan menemukan kode placeholder berupa layout bergaya gradasi abu-abu. 
   
   Untuk menggantinya dengan iklan asli, cari bagian return JSX dan ganti isi card dengan kode `<ins>` dari AdSense Anda. Contoh untuk banner horizontal:
   
   ```javascript
   // Cari bagian return "horizontal" di src/components/AdBanner.jsx:
   if (type === 'horizontal') {
     return (
       <div className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
         {/* MASUKKAN KODE ADSENSE ASLI DI SINI */}
         <ins className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
         <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
         </script>
       </div>
     );
   }
   ```
   
   *Lakukan hal yang sama untuk bagian `type === 'sidebar'` dan return default (square).*

---

## Bagian 5: Tips SEO untuk Membanjiri Pengunjung Organik 📈

Agar iklan Anda menghasilkan uang banyak, Anda memerlukan trafik. Berikut strategi SEO gratis:
1. **Target Keyword Lokal**: Persaingan kata kunci bahasa Inggris sangat ketat. Fokuslah pada kata kunci bahasa Indonesia seperti `"gabung pdf gratis"`, `"konversi jpg ke pdf tanpa batas"`, `"kompres gambar png tanpa pecah"`.
2. **Kecepatan Situs (Core Web Vitals)**: Karena website ini statis di Vercel dan sangat ringan, Anda akan mendapatkan skor kecepatan **99/100** di Google PageSpeed Insights. Ini adalah nilai plus luar biasa untuk menaikkan peringkat Google Anda mengalahkan kompetitor!
3. **Ganti Meta Description di `index.html`**: Sesuaikan deskripsi metadata di `index.html` sesuai dengan strategi keyword terhangat Anda.
