import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Apenas variáveis com prefixo VITE_ (definidas no .env) chegam ao navegador.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Separa as bibliotecas em arquivos próprios (melhor cache no navegador).
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
