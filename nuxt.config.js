import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
	mode: 'universal',
	head: {
		titleTemplate: '%s | POPCORNEE',
		title: '',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
	},

	loading: '~/components/layout/Progress.vue',

	// css: [],

	plugins: ['~plugins/api', '~plugins/utils', '~plugins/vue-masonry-css'],

	buildModules: [
		'@nuxtjs/eslint-module',
		'@nuxtjs/stylelint-module',
		'@nuxtjs/dotenv',
		'nuxt-webfontloader',
		'@nuxtjs/vuetify'
	],

	modules: [],

	webfontloader: {
		google: {
			families: ['Dosis:200,300,400,700,800']
		}
	},

	vuetify: {
		treeShake: true,
		customVariables: ['~/assets/vuetify/vars.scss'],
		defaultAssets: {
			font: {
				family: 'Dosis'
			},
			icons: 'mdi'
		},
		theme: {
			dark: false,
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
