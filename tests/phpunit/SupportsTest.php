<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Supports\ZIndex;

/**
 * Block supports apply on the front end and can be switched off per site.
 */
class SupportsTest extends TestCase {

	/**
	 * Tears down the test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		delete_option( 'ever_blocks_disabled_supports' );
		remove_all_filters( 'ever_blocks_is_support_enabled' );

		parent::tear_down();
	}

	/**
	 * Renders a paragraph carrying a z-index.
	 *
	 * @param array<string, mixed> $attrs Block attributes.
	 * @return string Rendered HTML.
	 */
	private function paragraph( array $attrs ): string {
		return do_blocks( '<!-- wp:paragraph ' . wp_json_encode( $attrs ) . ' --><p>Hi</p><!-- /wp:paragraph -->' );
	}

	/**
	 * The value lands inline, and the block is positioned so it takes effect.
	 *
	 * @return void
	 */
	public function test_z_index_is_written_inline(): void {
		$this->assertStringContainsString( 'style="position:relative;z-index:5;"', $this->paragraph( array( 'everBlocksZIndex' => 5 ) ) );
	}

	/**
	 * The option and the filter both switch a support off.
	 *
	 * @return void
	 */
	public function test_a_disabled_support_does_not_register(): void {
		$supports = new \EverBlocks\Supports\Supports();
		$z_index  = $this->plugin->get( ZIndex::class );

		update_option( 'ever_blocks_disabled_supports', array( 'z-index' ) );
		remove_filter( 'render_block', array( $z_index, 'render' ), 20 );
		$supports->register_supports();

		$this->assertFalse( has_filter( 'render_block', array( $z_index, 'render' ) ) );

		delete_option( 'ever_blocks_disabled_supports' );
		add_filter( 'ever_blocks_is_support_enabled', '__return_false' );
		( new \EverBlocks\Supports\Supports() )->register_supports();

		$this->assertFalse( has_filter( 'render_block', array( $z_index, 'render' ) ) );
	}
}
