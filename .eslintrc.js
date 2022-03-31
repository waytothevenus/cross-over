module.exports = {
    // extends: "xo",
	// parser: "@babel/eslint-parser",
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 13,
        // sourceType: "module",
        ecmaFeatures: {
            jsx: true
        },
        requireConfigFile: false
    },
    rules: {
        "array-bracket-spacing": [
            "error",
            "always"
        ],
		"padded-blocks": [
			"error",
			{
				"blocks": "always",
				"switches": "always",
				"classes": "always"
			}
		],
		"padding-line-between-statements": [
			"error",
			{
				"blankLine": "always",
				"prev": "multiline-block-like",
				"next": "*"
			},
			{
				"blankLine": "always",
				"prev": "*",
				"next": "return"
			}
		],
		"object-curly-spacing": [
			"error",
			"always"
		],
		"semi": [
			2,
			"never"
		],
		"space-in-parens": [
			"error",
			"always"
		]
    }
}
