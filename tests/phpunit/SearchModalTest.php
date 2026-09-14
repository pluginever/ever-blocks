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
		$html = $this->render( '<!-- wp:ever-blocks/search-modal {"placeholder":"Type here","layout":"center","shortcut":false} --><!-- wp:heading {"level":3} --><h3>Popular</h3><!-- /wp:heading --><!-- /wp:ever-blocks/search-modal -->' );

		$this->assertStringContainsString( 'class="eb-search-modal eb-search-modal--center wp-block-ever-blocks-search-modal"', $html );
		$this->assertStringContainsString( 'data-wp-interactive="ever-blocks/search-modal"', $html );
		$this->assertStringContainsString( '&quot;shortcut&quot;:false', $html );
		$this->assertMatchesRegularExpression( '/<button[^>]*class="eb-search-modal__trigger"[^>]*aria-haspopup="dialog"/', $html );
		$this->assertMatchesRegularExpression( '/<dialog[^>]*class="eb-search-modal__dialog"[^>]*data-wp-watch="callbacks.sync"/', $html );
		$this->assertStringContainsString( 'placeholder="Type here"', $html );
		$this->assertMatchesRegularExpression( '/<div class="eb-search-modal__content"><h3[^>]*>Popular<\/h3><\/div>/', $html );
		$this->assertGreaterThanOrEqual( 3, substr_count( $html, '<svg' ), 'Trigger, close and submit icons are rendered.' );
	}

	/**
	 * Every part styled in the inspector reaches the page through the engine.
	 *
	 * @return void
	 */
	public function test_element_styles_compile(): void {
		$html = $this->render( '<!-- wp:ever-blocks/search-modal {"style":{"elements":{"trigger":{"everBlocks":{"iconSize":"32px"},":hover":{"color":{"text":"#ff0000"}}},"backdrop":{"color":{"background":"#000000"}}},"-open":{"elements":{"trigger":{"color":{"text":"#00ff00"}}}}}} /-->' );

		$this->assertSame( 1, preg_match( '/class="[^"]*\b(eb-[0-9a-f]{8})\b/', $html, $match ) );

		$class = '.' . $match[1] . '.' . $match[1];
		$css   = $this->plugin_css();

		$this->assertStringContainsString( $class . ' .eb-search-modal__trigger{--ever-blocks-search-modal-trigger-icon-size:32px;}', $css );
		$this->assertStringContainsString( $class . ' .eb-search-modal__trigger:hover{color:#ff0000;}', $css );
		$this->assertStringContainsString( $class . ' .eb-search-modal__dialog::backdrop{background-color:#000000;}', $css );
		$this->assertStringContainsString( $class . '.is-open .eb-search-modal__trigger{color:#00ff00;}', $css );
	}

	/**
	 * The inner blocks area is omitted when there is nothing in it.
	 *
	 * @return void
	 */
	public function test_empty_content_area_is_omitted(): void {
		$html = $this->render( '<!-- wp:ever-blocks/search-modal /-->' );

		$this->assertStringNotContainsString( 'eb-search-modal__content', $html );
		$this->assertStringContainsString( 'eb-search-modal--full', $html );
	}
}
