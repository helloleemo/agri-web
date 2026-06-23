import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/@mui/icons-material')) return 'mui-icons';
          if (id.includes('node_modules/@mui/material') || id.includes('node_modules/@emotion')) return 'mui-core';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'react-vendor';
        }
      }
    }
  }
})
