/**
 * Internal dependencies
 */
import {
	compileStyle,
	getProperty,
	getCustomProperties,
	toCSS,
} from '../style-css';
import { getDeclaration } from '../block-declaration';

const queries = {
	'@mobile': '@media (width <= 480px)',
	'@tablet': '@media (480px < width <= 782px)',
};

const name = 'ever-blocks/row';

describe( 'getProperty', () => {
	it( 'derives from the prefix, the block slug and the value name', () => {
		expect( getProperty( name, 'columns' ) ).toBe(
			'--ever-blocks-row-columns'
		);
		expect( getProperty( 'other/row-column', 'width' ) ).toBe(
			'--other-row-column-width'
		);
	} );

	it( 'splits a camelCase value name', () => {
		expect( getProperty( name, 'minHeight' ) ).toBe(
			'--ever-blocks-row-min-height'
		);
	} );

	it( 'refuses a key that could break out of the declaration', () => {
		for ( const key of [
			'a;color:red',
			'a:b',
			'a}',
			'--x',
			'',
			'a b',
			'1x',
			'a-b',
		] ) {
			expect( getProperty( name, key ) ).toBe( '' );
		}
	} );

	it( 'refuses a block name that is not a plain slug', () => {
		expect( getProperty( 'ever-blocks/Row', 'gap' ) ).toBe( '' );
	} );
} );

describe( 'getCustomProperties', () => {
	it( 'writes set values to their derived properties', () => {
		expect(
			getCustomProperties( { columns: 3, gap: '2rem' }, name )
		).toEqual( {
			'--ever-blocks-row-columns': '3',
			'--ever-blocks-row-gap': '2rem',
		} );
	} );

	it( 'returns undefined when nothing is set', () => {
		expect( getCustomProperties( {}, name ) ).toBeUndefined();
	} );

	it( 'skips undefined, null and empty values rather than emitting empty declarations', () => {
		expect(
			getCustomProperties( { columns: undefined, gap: null }, name )
		).toBeUndefined();
		expect(
			getCustomProperties( { columns: '', gap: '1rem' }, name )
		).toEqual( {
			'--ever-blocks-row-gap': '1rem',
		} );
	} );

	it( 'keeps zero, which is a legitimate value', () => {
		expect( getCustomProperties( { gap: 0 }, name ) ).toEqual( {
			'--ever-blocks-row-gap': '0',
		} );
	} );

	it( 'skips a nested object rather than stringifying it', () => {
		expect(
			getCustomProperties( { gap: { top: '1rem' }, columns: 2 }, name )
		).toEqual( {
			'--ever-blocks-row-columns': '2',
		} );
	} );

	it( 'drops a key that does not derive a usable property', () => {
		expect(
			getCustomProperties( { 'a;color:red': 'x', gap: '1rem' }, name )
		).toEqual( {
			'--ever-blocks-row-gap': '1rem',
		} );
	} );
} );

describe( 'getProperty with an element', () => {
	it( 'puts the element between the slug and the key', () => {
		expect( getProperty( name, 'size', 'input' ) ).toBe(
			'--ever-blocks-row-input-size'
		);
		expect( getProperty( name, 'fontSize', 'closeButton' ) ).toBe(
			'--ever-blocks-row-close-button-font-size'
		);
	} );

	it( 'refuses an element that is not an identifier', () => {
		expect( getProperty( name, 'size', 'Bad' ) ).toBe( '' );
		expect( getProperty( name, 'size', 'a b' ) ).toBe( '' );
	} );
} );

const declaration = getDeclaration( {
	selectors: { root: '.eb-row', states: { '-open': '.eb-row.is-open' } },
	supports: {
		everBlocks: {
			states: [ ':hover' ],
			elements: {
				input: { selector: '.eb-row__input', states: [ ':focus' ] },
			},
		},
	},
} );

describe( 'compileStyle', () => {
	it( 'emits nothing for an empty or missing style', () => {
		expect( compileStyle( {}, name, declaration, queries ) ).toEqual( [] );
		expect( compileStyle( undefined, name, declaration, queries ) ).toEqual(
			[]
		);
	} );

	it( 'emits nothing when only core supports are set, because core owns those', () => {
		expect(
			compileStyle(
				{ spacing: { padding: '2rem' } },
				name,
				declaration,
				queries
			)
		).toEqual( [] );
	} );

	it( 'emits nothing for a block that declares nothing', () => {
		expect(
			compileStyle(
				{ ':hover': { color: { text: '#f00' } } },
				name,
				getDeclaration( {} ),
				queries
			)
		).toEqual( [] );
	} );

	it( 'ignores a state or viewport whose value is not an object', () => {
		expect(
			compileStyle(
				{ ':hover': 'red', '@mobile': 'red' } as never,
				name,
				declaration,
				queries
			)
		).toEqual( [] );
	} );

	it( 'ignores a state that compiles to nothing', () => {
		expect(
			compileStyle(
				{ ':hover': { nonsense: { a: 'b' } } } as never,
				name,
				declaration,
				queries
			)
		).toEqual( [] );
	} );

	it( 'skips a viewport the theme does not declare', () => {
		expect(
			compileStyle(
				{ '@mobile': { ':hover': { color: { text: '#f00' } } } },
				name,
				declaration,
				{}
			)
		).toEqual( [] );
	} );

	it( 'orders base rules before responsive ones', () => {
		const rules = compileStyle(
			{
				':hover': { color: { text: '#aaa' } },
				'@mobile': { ':hover': { color: { text: '#bbb' } } },
			},
			name,
			declaration,
			queries
		);

		expect( rules.map( ( rule ) => rule.query ) ).toEqual( [
			'',
			'@media (width <= 480px)',
		] );
	} );
} );

describe( 'toCSS', () => {
	it( 'puts the instance selector wherever & stands', () => {
		expect(
			toCSS(
				[
					{
						selector: '&',
						declarations: { '--x': '1' },
						query: '',
						important: false,
					},
					{
						selector: '& .inner, &::after',
						declarations: { color: 'red' },
						query: '@media (width <= 480px)',
						important: false,
					},
				],
				'.eb-1.eb-1'
			)
		).toBe(
			'.eb-1.eb-1{--x:1;}@media (width <= 480px){.eb-1.eb-1 .inner, .eb-1.eb-1::after{color:red;}}'
		);
	} );

	it( 'marks state declarations important and adds the resets core adds', () => {
		expect(
			toCSS(
				[
					{
						selector: '&:hover',
						declarations: {
							'background-color': '#f00',
							'border-color': '#000',
						},
						query: '',
						important: true,
					},
				],
				'.eb-1'
			)
		).toBe(
			'.eb-1:hover{background-color:#f00 !important;border-color:#000 !important;background-image:unset !important;border-style:solid;}'
		);
	} );

	it( 'does not reset the background image when the state sets one', () => {
		expect(
			toCSS(
				[
					{
						selector: '&:hover',
						declarations: {
							'background-color': '#f00',
							'background-image': 'url(x.png)',
						},
						query: '',
						important: true,
					},
				],
				'.eb-1'
			)
		).not.toContain( 'unset' );
	} );

	it( 'drops a rule with no declarations', () => {
		expect(
			toCSS(
				[
					{
						selector: '',
						declarations: {},
						query: '',
						important: false,
					},
				],
				'.eb-1'
			)
		).toBe( '' );
	} );
} );
