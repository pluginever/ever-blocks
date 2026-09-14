<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Blocks\Block;

/**
 * The block base class.
 */
class BlockTest extends TestCase {

	/**
	 * A subclass with `markup()` becomes its block's render callback; one without leaves the block alone.
	 *
	 * @return void
	 */
	public function test_markup_becomes_the_render_callback(): void {
		$renders = new class() extends Block {
			public string $name = 'ever-blocks/test-renders';

			public function markup(): string {
				return 'rendered';
			}
		};
		$listens = new class() extends Block {
			public string $name = 'ever-blocks/test-listens';
		};

		$renders->register();
		$listens->register();

		$settings = apply_filters( 'block_type_metadata_settings', array(), array( 'name' => 'ever-blocks/test-renders' ) );
		$this->assertSame( array( $renders, 'markup' ), $settings['render_callback'] );

		$settings = apply_filters( 'block_type_metadata_settings', array(), array( 'name' => 'ever-blocks/test-listens' ) );
		$this->assertArrayNotHasKey( 'render_callback', $settings );

		remove_filter( 'block_type_metadata_settings', array( $renders, 'add_render_callback' ) );
		remove_filter( 'block_type_metadata_settings', array( $listens, 'add_render_callback' ) );
	}
}
