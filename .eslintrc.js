module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'@nuxtjs',
		'prettier',
		'prettier/vue',
		'plugin:prettier/recommended',
		'plugin:nuxt/recommended',
		'plugin:css-modules/recommended'
	],
	plugins: ['vue', 'pug', 'css-modules', 'prettier'],

	rules: {
		'comma-dangle': ['error', 'never'],
		eqeqeq: ['error', 'smart'],
		'global-require': 'off',
		'no-tabs': 0,
		'no-console': 'off',
		strict: 'off',
		'prettier/prettier': [
			'error',
			{},
			{
				usePrettierrc: true
			}
		]
	},
	globals: {
		use: true
	}
}
