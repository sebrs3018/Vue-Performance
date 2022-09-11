module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{ico,html,js}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};