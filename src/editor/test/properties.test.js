/**
 * Internal dependencies
 */
import { getNamespace, getProperty } from '@byteever/block-components/utils';
import properties from '../../../tests/data/properties.json';
import namespaces from '../../../tests/data/namespaces.json';

describe( 'custom property names', () => {
	it.each( properties )(
		'derives $expected from $block $key',
		( { block, key, expected } ) => {
			expect( getProperty( block, key ) ).toBe( expected );
		}
	);
} );

describe( 'style namespaces', () => {
	it.each( namespaces )(
		'derives $expected from $block',
		( { block, expected } ) => {
			expect( getNamespace( block ) ).toBe( expected );
		}
	);
} );
