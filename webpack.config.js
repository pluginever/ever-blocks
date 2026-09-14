/**
 * External dependencies
 */
const path = require( 'path' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const alias = {
	'@byteever/block-components/utils': path.resolve(
		__dirname,
		'packages/block-components/src/utils'
	),
	'@byteever/block-components': path.resolve(
		__dirname,
		'packages/block-components/src'
	),
};

// Entries outside src/blocks/. These are classic scripts, so they must not be
// added to the ES-module config, which cannot import @wordpress/* script handles.
const entries = {
	common: path.resolve( __dirname, 'src/common/index.js' ),
	editor: path.resolve( __dirname, 'src/editor/index.js' ),
};

const extend = ( config ) => {
	const isModule = Boolean( config.experiments?.outputModule );

	return {
		...config,
		entry: () => ( {
			...( typeof config.entry === 'function'
				? config.entry()
				: config.entry ),
			...( isModule ? {} : entries ),
		} ),
		resolve: {
			...config.resolve,
			extensions: [
				'.ts',
				'.tsx',
				...( config.resolve?.extensions ?? [] ),
			],
			alias: { ...config.resolve?.alias, ...alias },
		},
	};
};

module.exports = Array.isArray( defaultConfig )
	? defaultConfig.map( extend )
	: extend( defaultConfig );
