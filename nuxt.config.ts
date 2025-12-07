// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['shadcn-nuxt', '@nuxtjs/google-fonts', '@pinia/nuxt', '@nuxtjs/i18n'],
  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' }],
    },
  },
  googleFonts: {
    families: {
      'Noto+Kufi+Arabic': [400, 500, 700],
      'Open+Sans': [400, 600],
    },
  },

  // 🐛 FIX: Streamlined i18n Configuration

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ar', name: 'Arabic', file: 'ar.json' },
    ],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
