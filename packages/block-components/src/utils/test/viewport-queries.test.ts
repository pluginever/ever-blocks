/**
 * Internal dependencies
 */
import { getViewportQueries } from '../viewport-queries';

describe( 'getViewportQueries', () => {
	it( 'matches core for the default breakpoints', () => {
		expect( getViewportQueries() ).toEqual( {
			'@mobile': '@media (width <= 480px)',
			'@tablet': '@media (480px < width <= 782px)',
		} );
		expect( getViewportQueries( {} ) ).toEqual( getViewportQueries() );
	} );

	it( 'follows theme settings', () => {
		expect(
			getViewportQueries( { mobile: '600px', tablet: '900px' } )
		).toEqual( {
			'@mobile': '@media (width <= 600px)',
			'@tablet': '@media (600px < width <= 900px)',
		} );
	} );

	it( 'omits tablet when only mobile is declared', () => {
		expect( getViewportQueries( { mobile: '480px' } ) ).toEqual( {
			'@mobile': '@media (width <= 480px)',
		} );
	} );

	it( 'makes tablet an upper bound when only tablet is declared', () => {
		expect( getViewportQueries( { tablet: '782px' } ) ).toEqual( {
			'@tablet': '@media (width <= 782px)',
		} );
	} );
} );
