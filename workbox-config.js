module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{json,ico,html,PNG,txt,js,css,gif,png,svg}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};