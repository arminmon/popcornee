import colors from 'vuetify/es5/util/colors'

export default function ({ app }) {
	return {
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
		// 	t: (key, ...params) => app.i18n.t(key, params)
		// }
	}
}
