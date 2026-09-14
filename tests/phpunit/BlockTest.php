<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Blocks\Block;

/**
 * The base block binds both seams on construction, and `register()` for anything else.
 */
class BlockTest extends TestCase {

	/**
	 * A subclass overriding nothing still joins both filters.
	 *
	 * @return void
	 */
	public function test_a_block_without_overrides_still_adds_both_filters(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';
		};

		$this->assertNotFalse( has_filter( 'render_block_ever-blocks/plain', array( $block, 'render' ) ) );
		$this->assertNotFalse( has_filter( 'ever_blocks_block_styles_ever-blocks/plain', array( $block, 'style' ) ) );
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
	 * `register()` runs once the seams are bound.
	 *
	 * @return void
	 */
	public function test_register_runs_on_construction(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';
			public bool $registered = false;

			public function register(): void {
				$this->registered = true;
			}
		};

		$this->assertTrue( $block->registered );
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
	 * Overriding `css()` contributes rules through this block's own filter, and no other block's.
	 *
	 * @return void
	 */
	public function test_styles_reach_the_shared_pass_for_this_block_only(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';

			protected function css( array $attributes ): array {
				return array( array( 'declarations' => array( 'grid-auto-rows' => '1fr' ) ) );
			}
		};

		$this->assertNotFalse( has_filter( 'ever_blocks_block_styles_ever-blocks/plain', array( $block, 'style' ) ) );
		$this->assertFalse( has_filter( 'ever_blocks_block_styles_ever-blocks/other' ) );
		$this->assertCount( 2, $block->style( array( array( 'declarations' => array( 'gap' => '1rem' ) ) ), array() ) );
	}

	/**
	 * A block with no name hooks nothing at all.
	 *
	 * @return void
	 */
	public function test_a_nameless_block_hooks_nothing(): void {
		new class() extends Block {};

		$this->assertFalse( has_filter( 'render_block_' ) );
		$this->assertFalse( has_filter( 'ever_blocks_block_styles_' ) );
	}

	/**
	 * A preset reference resolves the way core resolves it; anything else passes through.
	 *
	 * @return void
	 */
	public function test_css_value_resolves_presets(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';

			public function value( $value ): string {
				return $this->css_value( $value );
			}
		};

		$this->assertSame( 'var(--wp--preset--color--contrast)', $block->value( 'var:preset|color|contrast' ) );
		$this->assertSame( '#fff', $block->value( '#fff' ) );
		$this->assertSame( '', $block->value( null ) );
		$this->assertSame( '', $block->value( array( 'x' ) ) );
	}
}
