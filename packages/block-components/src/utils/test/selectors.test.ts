/**
 * Internal dependencies
 */
import {
	elementSelector,
	isCustomState,
	isPseudoState,
	scopeSelector,
} from '../selectors';

describe( 'scopeSelector', () => {
	it( 'drops the block root and keeps what follows', () => {
		expect( scopeSelector( '' ) ).toBe( '' );
		expect( scopeSelector( '.eb-test' ) ).toBe( '' );
		expect( scopeSelector( '.wp-block-ever-blocks-icon svg' ) ).toBe(
			' svg'
		);
		expect( scopeSelector( '.eb-test.is-open' ) ).toBe( '.is-open' );
		expect( scopeSelector( '#root .inner' ) ).toBe( ' .inner' );
		expect( scopeSelector( 'div > *' ) ).toBe( ' > *' );
		expect( scopeSelector( '[data-x].y[open]' ) ).toBe( '.y[open]' );
	} );
} );

describe( 'elementSelector', () => {
	it( 'descends unless & or a pseudo attaches to the instance', () => {
		expect( elementSelector( '' ) ).toBe( '' );
		expect( elementSelector( '.eb-test__input' ) ).toBe(
			' .eb-test__input'
		);
		expect( elementSelector( '&::backdrop' ) ).toBe( '::backdrop' );
		expect( elementSelector( '&.is-open .x' ) ).toBe( '.is-open .x' );
		expect( elementSelector( '::placeholder' ) ).toBe( '::placeholder' );
		expect( elementSelector( ' > *' ) ).toBe( '> *' );
	} );
} );

describe( 'state names', () => {
	it( 'tells pseudo-states, custom states and everything else apart', () => {
		expect( isPseudoState( ':hover' ) ).toBe( true );
		expect( isPseudoState( '::placeholder' ) ).toBe( true );
		expect( isPseudoState( ':focus-visible' ) ).toBe( true );
		expect( isPseudoState( '-open' ) ).toBe( false );
		expect( isPseudoState( 'hover' ) ).toBe( false );
		expect( isPseudoState( '@mobile' ) ).toBe( false );
		expect( isPseudoState( ':hover;x' ) ).toBe( false );
		expect( isCustomState( '-open' ) ).toBe( true );
		expect( isCustomState( '-is-current' ) ).toBe( true );
		expect( isCustomState( ':hover' ) ).toBe( false );
		expect( isCustomState( '-Open' ) ).toBe( false );
		expect( isCustomState( 1 ) ).toBe( false );
	} );
} );
