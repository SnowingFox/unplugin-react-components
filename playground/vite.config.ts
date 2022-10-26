import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vite'
import Components from 'unplugin-react-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Components({
      dts: true,
      resolvers: [
        (name) => {
          if (name === 'Button')
            return { name: 'Button', from: '@mui/material', type: 'Export' }
        },
      ],
    }),
    Inspect(),
  ],
})
