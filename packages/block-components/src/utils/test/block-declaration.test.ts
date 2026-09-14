/**
 * Internal dependencies
 */
import { getDeclaration } from '../block-declaration';

describe( 'getDeclaration', () => {
	it( 'reads elements in the short and the long form', () => {
		expect(
			getDeclaration( {
				supports: {
					everBlocks: {
						elements: {
							input: {
								selector: '.x__input',
								states: [ ':focus', 'bogus', ':hover' ],
							},
							backdrop: '&::backdrop',
							'Bad-Name': '.no',
							empty: '',
							noSelector: { states: [ ':hover' ] },
						},
					},
				},
			} ).elements
		).toEqual( {
			input: { selector: '.x__input', states: [ ':focus', ':hover' ] },
			backdrop: { selector: '&::backdrop', states: [] },
		} );
	} );

	it( 'reads states from both declarations', () => {
		expect(
			getDeclaration( {
				selectors: {
					states: { '-open': '.x.is-open', bad: '.no', '-empty': '' },
				},
				supports: {
					everBlocks: {
						states: [
							':hover',
							':focus-visible',
							'-open',
							'hover',
							'@mobile',
						],
					},
				},
			} ).states
		).toEqual( {
			':hover': '',
			':focus-visible': '',
			'-open': '.x.is-open',
		} );
	} );

	it( 'keeps the feature selectors for routing state declarations', () => {
		expect(
			getDeclaration( { selectors: { root: '.x', color: '.x .c' } } )
				.selectors
		).toEqual( { root: '.x', color: '.x .c' } );
	} );

	it( 'is empty for a block that declares nothing', () => {
		expect( getDeclaration( undefined ) ).toEqual( {
			elements: {},
			states: {},
			selectors: {},
		} );
		expect(
			getDeclaration( { supports: { color: true } } ).states
		).toEqual( {} );
	} );
} );
