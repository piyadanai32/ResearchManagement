import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $lib: resolve('src/lib') // เพิ่ม alias สำหรับ $lib
    }
  }
};

export default config;
