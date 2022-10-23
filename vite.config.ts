import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import { UnpluginReactComponents } from './plugin/index';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspect(),
    UnpluginReactComponents()
  ],
})
