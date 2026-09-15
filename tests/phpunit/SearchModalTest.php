<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Search Modal block, rendered from its built metadata.
 */
class SearchModalTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/search-modal' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * The markup is a native dialog wired to the Interactivity API, with the inner blocks inside it.
	 *
	 * @return void
	 */
	public function test_renders_a_dialog_with_inner_blocks(): void {
		$html = $this->render( '<!-- wp:ever-blocks/search-modal {"overlay":"center","shortcut":false} --><!-- wp:search {"showLabel":false,"buttonPosition":"button-inside","buttonUseIcon":true} /--><!-- wp:heading {"level":3} --><h3>Popular</h3><!-- /wp:heading --><!-- /wp:ever-blocks/search-modal -->' );

		$this->assertMatchesRegularExpression( '/class="[^"]*\beb-search-modal--center\b/', $html );
		$this->assertStringContainsString( 'data-wp-interactive="ever-blocks/search-modal"', $html );
		$this->assertStringContainsString( '&quot;shortcut&quot;:false', $html );
		$this->assertMatchesRegularExpression( '/<button[^>]*class="eb-search-modal__trigger"[^>]*aria-haspopup="dialog"/', $html );
		$this->assertStringNotContainsString( 'aria-expanded', $html );
		$this->assertMatchesRegularExpression( '/<dialog[^>]*class="eb-search-modal__dialog"[^>]*data-wp-watch="callbacks.sync"/', $html );
		$this->assertMatchesRegularExpression( '/<div class="eb-search-modal__content"><form[^>]*wp-block-search.*<h3[^>]*>Popular<\/h3><\/div>\s*<button[^>]*eb-search-modal__close/s', $html );
		$this->assertSame( 3, substr_count( $html, '<svg' ), 'Trigger, search button and close icons.' );
		$this->assertMatchesRegularExpression( '/<svg(?![^>]*width=)/', $html, 'Icons carry no fixed size; the stylesheet sizes them.' );
	}

	/**
	 * The block's assets are registered under the handles core derives.
	 *
	 * @return void
	 */
	public function test_assets_are_registered(): void {
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( 'ever-blocks/search-modal' );

		$this->assertContains( 'ever-blocks-common', $block_type->style_handles );
		$this->assertContains( 'ever-blocks-search-modal-view-script-module', $block_type->view_script_module_ids );
	}
}
