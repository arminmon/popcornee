require('dotenv').config()

export default {
  target: 'static',

  head: {
    titleTemplate: '%s | POPCORNEE',
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  components: true,

  loading: '~/components/layout/Progress.vue',

  css: ['~/assets/styles/overrides.scss'],

  plugins: ['~plugins/api', '~plugins/utils', '~plugins/vue-masonry-css'],

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/dotenv',
    'nuxt-webfontloader',
    '@nuxtjs/vuetify',
  ],

  modules: [],

  webfontloader: {
    google: {
      families: ['Dosis:200,300,400,700,800'],
    },
  },

  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/styles/vuetify-vars.scss'],
    defaultAssets: {
      font: {
        family: 'Dosis',
      },
      icons: 'mdi',
    },
    optionsPath: './vuetify.options.js',
  },
}
