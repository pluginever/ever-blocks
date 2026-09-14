<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Blocks\Block;

/**
 * The base block binds the render seam on construction; `register()` is the plugin's call.
 */
class BlockTest extends TestCase {

	/**
	 * A subclass overriding nothing still joins the render filter.
	 *
	 * @return void
	 */
	public function test_a_block_without_overrides_still_adds_the_render_filter(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';
		};

		$this->assertNotFalse( has_filter( 'render_block_ever-blocks/plain', array( $block, 'render' ) ) );
	}

	/**
	 * The name is the full block name, so a block outside this plugin binds directly.
	 *
	 * @return void
	 */
	public function test_a_foreign_block_binds_to_its_own_name(): void {
		$block = new class() extends Block {
			public string $name = 'core/loginout';
		};

		$this->assertNotFalse( has_filter( 'render_block_core/loginout', array( $block, 'render' ) ) );
	}

	/**
	 * `register()` is left to the plugin, so construction alone hooks nothing else.
	 *
	 * @return void
	 */
	public function test_register_is_not_run_on_construction(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';
			public bool $registered = false;

			public function register(): void {
				$this->registered = true;
			}
		};

		$this->assertFalse( $block->registered );
	}

	/**
	 * Overriding `content()` alters what the render seam returns.
	 *
	 * @return void
	 */
	public function test_overriding_content_changes_the_rendered_content(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';

			protected function content( string $content, array $attributes, array $block ): string {
				return '<b>' . $content . ( $attributes['x'] ?? '' ) . '</b>';
			}
		};

		$this->assertSame( '<b>hi1</b>', $block->render( 'hi', array( 'attrs' => array( 'x' => '1' ) ) ) );
	}

	/**
	 * A block with no name hooks nothing at all.
	 *
	 * @return void
	 */
	public function test_a_nameless_block_hooks_nothing(): void {
		new class() extends Block {};

		$this->assertFalse( has_filter( 'render_block_' ) );
	}
}
