import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // vite config
    define: {
      __APP_ENV__: process.env.VITE_VERCEL_ENV,
    },
    plugins:   [react()],
  }
})



 
  
  