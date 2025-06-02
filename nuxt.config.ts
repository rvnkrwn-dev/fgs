// nuxt.config.js
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // PENTING: Pastikan SSR aktif untuk dynamic
  ssr: true,

  nitro: {
    preset: 'node-server',
    storage: {
      data: {
        driver: 'vercelKV'
        /* Vercel KV driver options */
      }
    }
  },

  runtimeConfig: {
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,

    // Public runtime config (tersedia di client-side)
    public: {
      apiBase: process.env.API_BASE_URL || 'https://fgslamet.com',
      appUrl: 'https://fgslamet.com'
    }
  },

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  app: {
    head: {
      title: 'Festival Gunung Slamet - Menjelajah Tinggi, Melestarikan Bumi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Festival Gunung Slamet adalah acara tahunan yang memadukan petualangan pendakian dengan pelestarian alam di kaki Gunung Slamet, puncak tertinggi Jawa Tengah. Bergabunglah dengan komunitas pecinta alam untuk pengalaman tak terlupakan!'
        },
        { name: 'keywords', content: 'Festival Gunung Slamet, FGS, pendakian gunung, wisata alam, Jawa Tengah, pelestarian alam, outdoor festival, hiking, camping, registrasi pendaki, absen festival' },
        { name: 'author', content: 'rvnkrwn' },
        { name: 'developer', content: 'rvnkrwn' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph Meta Tags
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Festival Gunung Slamet - Menjelajah Tinggi, Melestarikan Bumi' },
        { property: 'og:description', content: 'Festival Gunung Slamet adalah acara tahunan yang memadukan petualangan pendakian dengan pelestarian alam di kaki Gunung Slamet, puncak tertinggi Jawa Tengah. Bergabunglah dengan komunitas pecinta alam!' },
        { property: 'og:image', content: '/images/fgs-og-image.jpg' },
        { property: 'og:url', content: 'https://festivalgunungslamet.com' },
        { property: 'og:site_name', content: 'Festival Gunung Slamet' },
        { property: 'og:locale', content: 'id_ID' },

        // Twitter Card Meta Tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Festival Gunung Slamet - Menjelajah Tinggi, Melestarikan Bumi' },
        { name: 'twitter:description', content: 'Festival Gunung Slamet adalah acara tahunan yang memadukan petualangan pendakian dengan pelestarian alam di kaki Gunung Slamet, puncak tertinggi Jawa Tengah.' },
        { name: 'twitter:image', content: '/images/fgs-twitter-card.jpg' },

        // Additional Meta Tags
        { name: 'theme-color', content: '#2B5530' },
        { name: 'msapplication-TileColor', content: '#2B5530' },
        { name: 'geo.region', content: 'ID-33' },
        { name: 'geo.placename', content: 'Gunung Slamet, Jawa Tengah' },
        { name: 'geo.position', content: '-7.2425;109.2086' },
        { name: 'ICBM', content: '-7.2425, 109.2086' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://festivalgunungslamet.com' }
      ]
    }
  }
})