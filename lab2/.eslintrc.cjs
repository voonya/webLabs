module.exports = {
	parserOptions: {
		"ecmaVersion": 2021,
	  },
	  root: true,
	  env: {
		es6: true,
		node: true,
	  },
	  extends: [
		"eslint:recommended",
		"google",
	  ],
	  rules: {
		quotes: ["error", "double"],
	  },
};
