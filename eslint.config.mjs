import globals from 'globals';
import js from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.js'],
		ignores: ['umd/**/*.js'],
		...js.configs.recommended,
	},
	{
		files: ['**/*.js'],
		ignores: ['umd/**/*.js'],
		languageOptions: {
			ecmaVersion: 2018,
			sourceType: 'module'
		},
		rules: {
			'indent': [
				'error',
				'tab',
				{
					'SwitchCase': 1
				}
			],
			'linebreak-style': [
				'error',
				'unix'
			],
			'quotes': [
				'error',
				'single'
			],
			'semi': [
				'error',
				'always'
			],
			'no-use-before-define': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-spread': 'error',
			'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
			'prefer-arrow-callback': 'error',
			'prefer-destructuring': ['error', {'object': true, 'array': true}],
			'one-var': ['error', 'never'],
			'padding-line-between-statements': [
				'error',
				{ 'blankLine': 'always', 'prev': '*', 'next': 'return' },
				{ 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*'},
				{ 'blankLine': 'any',    'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var']}
			]
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.mocha,
			}
		}
	},
];
