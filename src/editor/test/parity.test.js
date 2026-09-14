/**
 * External dependencies
 */
import { compileCSS } from '@wordpress/style-engine';

/**
 * Internal dependencies
 */
import fixtures from '../../../tests/data/styles.json';

const declarations = ( css ) => {
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

const entries = Object.entries( fixtures );

describe( 'style fixtures', () => {
	it( 'has fixtures to check', () => {
		expect( entries.length ).toBeGreaterThan( 15 );
	} );

	it.each( entries )(
		'%s compiles to its recorded declarations',
		( _name, fixture ) => {
			expect(
				declarations(
					compileCSS( fixture.style, { selector: '.eb-fixture' } )
				)
			).toEqual( fixture.expected );
		}
	);

	it( 'resolves preset references to custom properties', () => {
		for ( const [ name, fixture ] of entries ) {
			if ( ! JSON.stringify( fixture.style ).includes( 'var:preset|' ) ) {
				continue;
			}

			const css = compileCSS( fixture.style, {
				selector: '.eb-fixture',
			} );

			expect( [ name, css.includes( 'var(--wp--preset--' ) ] ).toEqual( [
				name,
				true,
			] );
			expect( [ name, css.includes( 'var:preset|' ) ] ).toEqual( [
				name,
				false,
			] );
		}
	} );

	it( 'emits nothing for an empty style object', () => {
		expect( compileCSS( {}, { selector: '.eb-fixture' } ) ).toBe( '' );
	} );

	it( 'emits nothing for unknown properties', () => {
		expect(
			compileCSS(
				{ nonsense: { whatever: 'red' } },
				{ selector: '.eb-fixture' }
			)
		).toBe( '' );
	} );
} );
