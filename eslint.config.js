module.exports = [
	{
		ignores: [
			'build/**',
			'packages/*/build/**',
			'packages/*/build-types/**',
			'vendor/**',
		],
	},
	...require( '@wordpress/scripts/config/eslint.config.cjs' ),
	{
		rules: {
			'@wordpress/i18n-text-domain': [
				'error',
				{ allowedTextDomain: 'ever-blocks' },
			],
		},
	},
];
