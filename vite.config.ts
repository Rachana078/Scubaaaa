import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const streamUrl = env.VITE_STREAM_URL

  const proxy = streamUrl
    ? {
        '/stream-proxy': {
          target: new URL(streamUrl).origin,
          changeOrigin: true,
          rewrite: () => new URL(streamUrl).pathname,
        },
      }
    : undefined

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'DeepRun Mission Control',
          short_name: 'DeepRun',
          description: 'Physical surface vessel mission control dashboard',
          theme_color: '#080D12',
          background_color: '#080D12',
          display: 'standalone',
          orientation: 'landscape',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    ],
    server: { proxy },
  }
})
