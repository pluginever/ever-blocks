// Regenerates the shared PHP/JS style fixtures from the editor's style engine.
// The recorded output is what the editor produces; ParityTest asserts the server
// matches it. Run after changing tests/data/cases.cjs or upgrading the
// style-engine package, then run both suites.
const { compileCSS } = require( '@wordpress/style-engine' );
const cases = require( './cases.cjs' );

const normalise = ( css ) => {
	const open = css.indexOf( '{' );

	if ( open === -1 ) {
		return [];
	}

	return css
		.slice( open + 1, css.lastIndexOf( '}' ) )
		.split( ';' )
		.map( ( d ) => d.replace( /\s+/g, ' ' ).trim() )
		.filter( Boolean )
		.map( ( d ) => {
			const i = d.indexOf( ':' );
			return i === -1
				? d
				: `${ d.slice( 0, i ).trim() }:${ d.slice( i + 1 ).trim() }`;
		} )
		.map( ( d ) => d.replace( /\( /g, '(' ).replace( / \)/g, ')' ) )
		.sort();
};

const out = {};

for ( const [ name, style ] of Object.entries( cases ) ) {
	out[ name ] = {
		style,
		expected: normalise( compileCSS( style, { selector: '.eb-fixture' } ) ),
	};
}

process.stdout.write( JSON.stringify( out, null, '\t' ) + '\n' );
