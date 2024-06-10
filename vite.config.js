import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        })
      ]
    })
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://dbusiness.uz/",
        // target: "https://preprod-online.davrbank.uz",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api/"),
      },
      "/eimzo": {
        target: "https://dbusiness.uz/",
        // target: "https://preprod-online.davrbank.uz",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/eimzo/, "/eimzo/"),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
