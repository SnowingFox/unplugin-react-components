import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vite'
import Components from 'unplugin-react-components/vite'
import { MuiResolver } from '../src/core/resolvers/mui'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Components({
      dts: true,
      resolvers: [
        MuiResolver({
          suffix: false,
        }),
      ],
    }),
    Inspect(),
  ],
})
