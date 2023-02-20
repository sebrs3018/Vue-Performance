module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{html,ico,js}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};