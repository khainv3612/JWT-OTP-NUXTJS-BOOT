export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: process.env.LISTEN_PORT || 8080,
    host: '0.0.0.0'
  },
  head: {
    title: 'FE',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css',
    // '@/assets/scss/index.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/element-ui',
    '@/plugins/i18n.js'],

  // middleware route
  router: {
    middleware: [
      'i18n'
    ]
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
    '@nuxtjs/recaptcha'
  ],

  recaptcha: {
    hideBadge: false,
    language: 'vn',
    siteKey: process.env.KEY_CAPTCHA,
    version: 1,
    size: 'normal'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
    debug: process.env.DEBUG || false,
    proxyHeaders: false,
    credentials: false
  },

  auth: {
    strategies: {
      local: {
        token: {
          maxAge: 31536000
        },
        endpoints: {
          login: { url: process.env.API_URL + '/auth/verify-login', method: 'post', propertyName: 'data.access_token' },
          logout: { url: process.env.API_URL + '/auth/logout', method: 'post' },
          user: { url: process.env.API_URL + '/auth/me', method: 'get', propertyName: 'data' }
        }
      }
    },
    plugins: [
      '~/plugins/axios.js'
    ],
    redirect: {
      login: '/#login',
      logout: false,
      callback: '/#login',
      home: false
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
}
