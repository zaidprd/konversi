// Tailwind v4 membaca konfigurasi tema dari `@theme {}` di CSS (src/index.css).
// File ini tetap ada untuk future extension (plugins, dark mode, custom screens, dll).
// Brand palette didefinisikan di CSS agar single source of truth.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}