/**
 * Internal dependencies
 */
import {
	buildStateSelector,
	elementSelector,
	isCustomState,
	isPseudoState,
	scopeSelector,
	splitSelectorList,
} from '../selectors';

describe( 'splitSelectorList', () => {
	it( 'splits on top-level commas only', () => {
		expect( splitSelectorList( '.a' ) ).toEqual( [ '.a' ] );
		expect( splitSelectorList( '.a, .b' ) ).toEqual( [ '.a', ' .b' ] );
		expect( splitSelectorList( ':is(.a, .b) .c, .d' ) ).toEqual( [
			':is(.a, .b) .c',
			' .d',
		] );
	} );
} );

describe( 'buildStateSelector', () => {
	it( 'replaces the block root of every selector and appends the state', () => {
		expect( buildStateSelector( '&', '', ':hover' ) ).toBe( '&:hover' );
		expect( buildStateSelector( '&', '.eb-test', ':hover' ) ).toBe(
			'&:hover'
		);
		expect(
			buildStateSelector( '&', '.wp-block-ever-blocks-icon svg', '' )
		).toBe( '& svg' );
		expect( buildStateSelector( '&', '.eb-test.is-open', '' ) ).toBe(
			'&.is-open'
		);
		expect( buildStateSelector( '&', '#root .inner', ':hover' ) ).toBe(
			'& .inner:hover'
		);
		expect( buildStateSelector( '&', 'div > *', '' ) ).toBe( '& > *' );
		expect( buildStateSelector( '&', '[data-x].y[open]', '' ) ).toBe(
			'&.y[open]'
		);
		expect(
			buildStateSelector( '&', '.eb-test .a, .eb-test .b', ':hover' )
		).toBe( '& .a:hover, & .b:hover' );
	} );
} );

describe( 'scopeSelector', () => {
	it( 'nests one selector list inside another', () => {
		expect( scopeSelector( '&', '& .x' ) ).toBe( '& .x' );
		expect( scopeSelector( '&.is-open, &[open]', '& .x' ) ).toBe(
			'&.is-open .x, &[open] .x'
		);
		expect( scopeSelector( '&.is-open .x', '&:focus' ) ).toBe(
			'&.is-open .x:focus'
		);
	} );
} );

describe( 'elementSelector', () => {
	it( 'descends unless & or a pseudo attaches to the instance', () => {
		expect( elementSelector( '.eb-test__input' ) ).toBe(
			'& .eb-test__input'
		);
		expect( elementSelector( '&::backdrop' ) ).toBe( '&::backdrop' );
		expect( elementSelector( '&.is-open .x' ) ).toBe( '&.is-open .x' );
		expect( elementSelector( '::placeholder' ) ).toBe( '&::placeholder' );
		expect( elementSelector( ' > *' ) ).toBe( '&> *' );
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
