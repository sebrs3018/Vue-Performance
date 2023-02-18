module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{ico,html}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};