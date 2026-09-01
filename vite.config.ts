import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/baby-shopping/',
  define: {
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(
      process.env.GITHUB_SHA || Date.now().toString(),
    ),
  },
})
