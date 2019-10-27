require('dotenv').config()
import colors from 'vuetify/es5/util/colors'

export default {
	head: {
		titleTemplate: '%s | Popcornee',
		title: '',
		meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
	},

	loading: '~/components/Progress.vue',

	// css: [],

	plugins: ['~plugins/axios', '~plugins/api', '~plugins/utils'],

	buildModules: ['@nuxtjs/dotenv', '@nuxtjs/vuetify'],

	modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],

	axios: {
		progress: true,
		https: true,
		proxyHeaders: false,
		baseURL: 'http://api.themoviedb.org/3/'
	},

	vuetify: {
		treeShake: true,
		customVariables: ['~/assets/vuetifyVariables.scss'],
		defaultAssets: {
			// font: true,
			icons: 'mdi'
		},
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: colors.orange.base,
					accent: colors.amber.darken3,
					secondary: colors.grey.darken3,
					info: colors.cyan.accent4,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent2
				},
				light: {
					primary: colors.orange.darken3,
					accent: colors.amber.darken4,
					secondary: colors.grey.lighten4,
					info: colors.cyan.accent4,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent2
				}
			}
		}
		// lang: {
		//   t: (key, ...params) => app.i18n.t(key, params)
		// }
	},

	build: {
		transpileDependencies: ['vuetify']
		// extend(config, ctx) {}
	}
}
