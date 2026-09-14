/**
 * Internal dependencies
 */
import { hasRel, NEW_TAB_REL, toggleRel } from '../rel';

describe( 'hasRel', () => {
	it( 'finds a value among others', () => {
		expect( hasRel( 'noopener nofollow', 'nofollow' ) ).toBe( true );
		expect( hasRel( 'nofollow', 'sponsored' ) ).toBe( false );
	} );

	it( 'is false for nothing set', () => {
		expect( hasRel( undefined, 'nofollow' ) ).toBe( false );
		expect( hasRel( '', 'nofollow' ) ).toBe( false );
		expect( hasRel( '   ', 'nofollow' ) ).toBe( false );
	} );

	it( 'does not match a substring', () => {
		expect( hasRel( 'nofollowme', 'nofollow' ) ).toBe( false );
	} );
} );

describe( 'toggleRel', () => {
	it( 'adds to nothing', () => {
		expect( toggleRel( undefined, 'nofollow', true ) ).toBe( 'nofollow' );
	} );

	it( 'returns undefined rather than an empty string', () => {
		expect( toggleRel( 'nofollow', 'nofollow', false ) ).toBeUndefined();
		expect( toggleRel( undefined, 'nofollow', false ) ).toBeUndefined();
	} );

	it( 'keeps values the author set that we do not own', () => {
		expect( toggleRel( 'noopener me', 'nofollow', true ) ).toBe(
			'noopener me nofollow'
		);
		expect( toggleRel( 'noopener nofollow', 'nofollow', false ) ).toBe(
			'noopener'
		);
	} );

	it( 'preserves the original order when toggled twice', () => {
		const start = 'noopener me';
		const on = toggleRel( start, 'sponsored', true );

		expect( toggleRel( on, 'sponsored', false ) ).toBe( start );
	} );

	it( 'never duplicates', () => {
		expect( toggleRel( 'nofollow nofollow', 'nofollow', true ) ).toBe(
			'nofollow'
		);
		expect( toggleRel( 'nofollow', 'nofollow', true ) ).toBe( 'nofollow' );
	} );

	it( 'collapses duplicates the author left behind', () => {
		expect( toggleRel( 'me me noopener', 'nofollow', true ) ).toBe(
			'me noopener nofollow'
		);
	} );

	it( 'tolerates ragged whitespace', () => {
		expect( toggleRel( '  nofollow   me ', 'sponsored', true ) ).toBe(
			'nofollow me sponsored'
		);
	} );
} );

describe( 'new-tab rel', () => {
	it( 'is the value core writes, so our links match core/button', () => {
		expect( NEW_TAB_REL ).toBe( 'noopener' );
	} );

	it( "is added and stripped without disturbing the author's own values", () => {
		const withTab = toggleRel( 'nofollow', NEW_TAB_REL, true );

		expect( withTab ).toBe( 'nofollow noopener' );
		expect( toggleRel( withTab, NEW_TAB_REL, false ) ).toBe( 'nofollow' );
	} );
} );
