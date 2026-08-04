import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // allowedHosts: [
    //   '26fc-2401-4900-1f3f-66f5-4c50-e370-5b0b-906c.ngrok-free.app',
    // ],
  },
})