import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Определяем режим Tauri (через переменную окружения)
  const isTauri = process.env.TAURI_DEV === 'true' || process.env.TAURI_BUILD === 'true';
  
  return {
    plugins: [react()],
    // Для Tauri - относительный путь, для GitHub Pages - абсолютный, для локальной разработки - корень
    base: isTauri ? './' : (mode === 'production' ? '/norvoter-react/' : '/'),
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
      },
    },
    define: {
      'import.meta.env.VITE_IS_GITHUB_PAGES': JSON.stringify(mode === 'production'),
    },
  }
})