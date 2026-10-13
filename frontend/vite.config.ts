import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,       // ← fixed port — never auto-increments
    strictPort: true, // ← if 5174 is busy, throw an error instead of silently switching
  },
})
