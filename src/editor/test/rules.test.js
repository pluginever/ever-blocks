/**
 * Internal dependencies
 */
import { compileStyle, getDeclaration } from '@byteever/block-components/utils';
import oracle from '../../../tests/data/rules.json';

const queries = {
	'@mobile': '@media (width <= 480px)',
	'@tablet': '@media (480px < width <= 782px)',
};

const normalize = ( rules ) =>
	rules
		.map( ( rule ) => ( {
			selector: rule.selector,
			declarations: Object.fromEntries(
				Object.entries( rule.declarations ).sort( ( [ a ], [ b ] ) =>
					a.localeCompare( b )
				)
			),
			query: rule.query,
			important: rule.important,
		} ) )
		.sort( ( a, b ) =>
			`${ a.query }|${ a.selector }|${ Number(
				a.important
			) }`.localeCompare(
				`${ b.query }|${ b.selector }|${ Number( b.important ) }`
			)
		);

const declaration = getDeclaration( oracle.block );
const cases = Object.entries( oracle.cases );

describe( 'compiled rules', () => {
	it( 'has cases to check', () => {
		expect( cases.length ).toBeGreaterThan( 15 );
	} );

	it.each( cases )( '%s matches the oracle', ( _name, { style, rules } ) => {
		expect(
			normalize(
				compileStyle( style, oracle.block.name, declaration, queries )
			)
		).toEqual( normalize( rules ) );
	} );
} );
