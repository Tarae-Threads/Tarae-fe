import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@/domains': path.resolve(__dirname, 'src/domains'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@': path.resolve(__dirname, '.'),
    },
  },
})
