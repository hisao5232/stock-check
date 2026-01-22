import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // クライアント側が接続しにいくURLを明示
    hmr: {
      host: 'stock-check.go-pro-world.net',
      protocol: 'wss' // SSL（https）環境なので安全なwssを指定
    }
  }
})
