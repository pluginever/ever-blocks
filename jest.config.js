const path = require( 'path' );

const preset = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...preset,
	rootDir: __dirname,
	moduleFileExtensions: [
		'ts',
		'tsx',
		...( preset.moduleFileExtensions ?? [ 'js', 'jsx', 'json' ] ),
	],
	transformIgnorePatterns: [ 'node_modules/(?!\\.pnpm/uuid)' ],
	testPathIgnorePatterns: [
		...( preset.testPathIgnorePatterns ?? [] ),
		'/build/',
		'/build-types/',
		'/vendor/',
		'/sources/',
	],
	modulePathIgnorePatterns: [ '/build/', '/build-types/' ],
	moduleNameMapper: {
		...preset.moduleNameMapper,
		'^@byteever/block-components/utils$': path.resolve(
			__dirname,
			'packages/block-components/src/utils/index.ts'
		),
		'^@byteever/block-components$': path.resolve(
			__dirname,
			'packages/block-components/src/index.ts'
		),
	},
};
