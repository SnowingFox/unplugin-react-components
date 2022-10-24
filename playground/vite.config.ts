import path from 'path'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vite'
import Components from '../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Components({
      rootDir: __dirname,
      dts: {
        rootPath: path.resolve(__dirname),
      },
    }),
    Inspect(),
  ],
})
