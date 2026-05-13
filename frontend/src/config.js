// Konfigurasi URL API
// Secara default akan menggunakan '/api' yang:
// - Saat local dev: di-proxy otomatis oleh Vite ke http://localhost:5000/api
// - Saat production (Vercel): di-rewrite otomatis ke backend/index.js
// Jika butuh nembak API eksternal tanpa proxy, bisa set VITE_API_URL di .env frontend
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
