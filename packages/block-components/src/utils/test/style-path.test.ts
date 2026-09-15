/**
 * Internal dependencies
 */
import {
	clean,
	getStylePath,
	readStyle,
	stripStyle,
	writeStyle,
} from '../style-path';
import type { StyleState } from '../../types';

const state = (
	viewport: StyleState[ 'viewport' ],
	pseudo: StyleState[ 'pseudo' ]
): StyleState => ( {
	viewport,
	pseudo,
} );

describe( 'getStylePath', () => {
	it( 'is empty for the default state on the block root', () => {
		expect( getStylePath( state( 'default', 'default' ) ) ).toEqual( [] );
	} );

	it( 'puts the viewport first', () => {
		expect( getStylePath( state( '@mobile', 'default' ) ) ).toEqual( [
			'@mobile',
		] );
	} );

	it( 'puts a root pseudo-state directly under the viewport', () => {
		expect( getStylePath( state( '@mobile', ':hover' ) ) ).toEqual( [
			'@mobile',
			':hover',
		] );
	} );

	it( 'puts an element between the viewport and the pseudo-state', () => {
		expect( getStylePath( state( '@mobile', ':hover' ), 'link' ) ).toEqual(
			[ '@mobile', 'elements', 'link', ':hover' ]
		);
	} );

	it( 'puts a custom state before the element, as core does', () => {
		expect( getStylePath( state( 'default', '-open' ) ) ).toEqual( [
			'-open',
		] );
		expect( getStylePath( state( '@mobile', '-open' ), 'input' ) ).toEqual(
			[ '@mobile', '-open', 'elements', 'input' ]
		);
	} );

	it( 'reads an element in the default state', () => {
		expect(
			getStylePath( state( 'default', 'default' ), 'heading' )
		).toEqual( [ 'elements', 'heading' ] );
	} );
} );

describe( 'readStyle', () => {
	const style = {
		spacing: { padding: '2rem' },
		'@mobile': {
			elements: { link: { ':hover': { color: { text: '#f00' } } } },
		},
	};

	it( 'returns the whole object for an empty path', () => {
		expect( readStyle( style, [] ) ).toBe( style );
	} );

	it( 'reads a nested state', () => {
		expect(
			readStyle( style, [ '@mobile', 'elements', 'link', ':hover' ] )
		).toEqual( {
			color: { text: '#f00' },
		} );
	} );

	it( 'returns an empty object for a missing path', () => {
		expect( readStyle( style, [ '@tablet', 'spacing' ] ) ).toEqual( {} );
		expect( readStyle( undefined, [ 'spacing' ] ) ).toEqual( {} );
	} );

	it( 'does not treat a scalar as an object', () => {
		expect( readStyle( style, [ 'spacing', 'padding' ] ) ).toEqual( {} );
	} );
} );

describe( 'clean', () => {
	it( 'drops empty branches so an unset control reads as unset', () => {
		expect( clean( { typography: {} } ) ).toBeUndefined();
		expect( clean( { a: { b: undefined } } ) ).toBeUndefined();
	} );

	it( 'drops empty strings', () => {
		expect( clean( { color: { text: '' } } ) ).toBeUndefined();
	} );

	it( 'keeps real values', () => {
		expect( clean( { spacing: { padding: '2rem' } } ) ).toEqual( {
			spacing: { padding: '2rem' },
		} );
	} );

	it( 'keeps zero and false', () => {
		expect( clean( { a: 0, b: false } ) ).toEqual( { a: 0, b: false } );
	} );
} );

describe( 'writeStyle', () => {
	it( 'writes the root state', () => {
		expect(
			writeStyle( undefined, [], { spacing: { padding: '2rem' } } )
		).toEqual( {
			spacing: { padding: '2rem' },
		} );
	} );

	it( 'writes a nested state without disturbing siblings', () => {
		const style = { spacing: { padding: '2rem' } };

		expect(
			writeStyle( style, [ '@mobile' ], { spacing: { padding: '1rem' } } )
		).toEqual( {
			spacing: { padding: '2rem' },
			'@mobile': { spacing: { padding: '1rem' } },
		} );
	} );

	it( 'writes an element pseudo-state at the path core reads', () => {
		expect(
			writeStyle(
				undefined,
				[ '@mobile', 'elements', 'link', ':hover' ],
				{
					color: { text: '#0f0' },
				}
			)
		).toEqual( {
			'@mobile': {
				elements: { link: { ':hover': { color: { text: '#0f0' } } } },
			},
		} );
	} );

	it( 'removes the branch when a state is emptied', () => {
		const style = {
			spacing: { padding: '2rem' },
			'@mobile': { spacing: { padding: '1rem' } },
		};

		expect(
			writeStyle( style, [ '@mobile' ], {
				spacing: { padding: undefined },
			} )
		).toEqual( {
			spacing: { padding: '2rem' },
		} );
	} );

	it( 'returns undefined when the last value is removed', () => {
		expect(
			writeStyle( { spacing: { padding: '2rem' } }, [], { spacing: {} } )
		).toBeUndefined();
	} );

	it( 'does not mutate the input', () => {
		const style = { spacing: { padding: '2rem' } };
		const copy = JSON.parse( JSON.stringify( style ) );

		writeStyle( style, [ '@mobile' ], { spacing: { padding: '1rem' } } );

		expect( style ).toEqual( copy );
	} );

	it( 'round-trips through readStyle', () => {
		const path = getStylePath( state( '@tablet', ':hover' ) );
		const next = writeStyle( undefined, path, {
			color: { background: '#123' },
		} );

		expect( readStyle( next, path ) ).toEqual( {
			color: { background: '#123' },
		} );
	} );
} );

describe( 'stripStyle', () => {
	const style = {
		color: { text: '#f00' },
		everBlocks: { gap: '1rem' },
		':hover': { color: { text: '#0f0' }, everBlocks: { gap: '2rem' } },
		'-open': { elements: { input: { color: { text: '#fff' } } } },
		elements: {
			link: { color: { text: '#00f' } },
			input: { typography: { fontSize: '2rem' } },
		},
		'@mobile': {
			everBlocks: { gap: '0' },
			elements: { input: { everBlocks: { size: '1rem' } } },
			spacing: { padding: '1rem' },
		},
	};

	it( 'drops the root parts named, at every viewport and inside states', () => {
		expect(
			stripStyle( style, {
				namespace: 'everBlocks',
				states: [ ':hover' ],
			} )
		).toEqual( {
			color: { text: '#f00' },
			'-open': { elements: { input: { color: { text: '#fff' } } } },
			elements: {
				link: { color: { text: '#00f' } },
				input: { typography: { fontSize: '2rem' } },
			},
			'@mobile': {
				elements: { input: { everBlocks: { size: '1rem' } } },
				spacing: { padding: '1rem' },
			},
		} );
	} );

	it( 'drops one element everywhere it appears and nothing else', () => {
		expect( stripStyle( style, { elements: [ 'input' ] } ) ).toEqual( {
			color: { text: '#f00' },
			everBlocks: { gap: '1rem' },
			':hover': { color: { text: '#0f0' }, everBlocks: { gap: '2rem' } },
			elements: { link: { color: { text: '#00f' } } },
			'@mobile': {
				everBlocks: { gap: '0' },
				spacing: { padding: '1rem' },
			},
		} );
	} );

	it( 'returns undefined when nothing is left', () => {
		expect(
			stripStyle(
				{ everBlocks: { gap: '1rem' } },
				{ namespace: 'everBlocks' }
			)
		).toBeUndefined();
		expect( stripStyle( undefined, {} ) ).toBeUndefined();
	} );
} );
