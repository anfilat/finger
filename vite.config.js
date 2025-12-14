import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Настройка для GitHub Pages
  // Замените 'finger' на имя вашего репозитория
  base: process.env.NODE_ENV === 'production' ? '/finger/' : '/',
})
