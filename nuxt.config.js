export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */

  telemetry: true,
  target: 'server',
  server: {
    host: '0.0.0.0', // default: localhost
    port: process.env.PORT || '5000',
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    // }
  },
  // ssr: false,
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      //{href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap', rel: 'stylesheet'}
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/main.scss',
    // '@/assets/fonts/poppins.css',
    // '@/assets/fonts/montserrat.css',
    // '@/assets/fonts/rubrik.css',
    // '@/assets/fonts/opensans.css',
    '@/assets/fonts/roboto.css',
    '@/assets/fonts/inter.css',
    // '@/assets/fonts/exo2.css',
    // '@/assets/fonts/ubuntu.css',
    // '@/assets/fonts/titilliumweb.css',
    // '@/assets/fonts/publicsans.css',
    //'@/assets/css/icons.css',
    'bootstrap-vue/dist/bootstrap-vue.css',
  ],
  styleResources: {
    scss: [
      '@/assets/scss/variables.scss',
    ],
  },
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    {src: '~/plugins/filters'},
    {src: '~plugins/bootstrap-vue.js'},
    {src: '~plugins/vue-touch-events.js'},
    {src: '~/plugins/toasted', ssr: false},
    {src: '~plugins/vue-clipboard.js'},
    {src: '~plugins/vue-select.js'},
    {src: '~plugins/portal-vue.js'},
    {src: '~plugins/axios.js'}
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/color-mode'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/svg',
    'portal-vue/nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // credentials: true,
    baseURL: 'http://localhost:5000',
    debug: false
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: 'http://localhost:' + (process.env.PORT || '5000')
    }
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: 'http://localhost:' + (process.env.PORT || '5000')
    }
  },



  serverMiddleware: ['~/server/index'],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },
}
