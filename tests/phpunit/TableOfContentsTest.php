<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Table of Contents block, rendered from a real post.
 */
class TableOfContentsTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/table-of-contents' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * Renders post content with the current post set, as the front end does.
	 *
	 * @param string $content Post content.
	 * @return string Rendered HTML.
	 */
	private function render_post( string $content ): string {
		$post_id = self::factory()->post->create( array( 'post_content' => $content ) );

		$GLOBALS['post'] = get_post( $post_id );
		setup_postdata( $GLOBALS['post'] );

		$html = apply_filters( 'the_content', $content );

		wp_reset_postdata();

		return $html;
	}

	/**
	 * Headings are listed by level, linked, and given matching ids when rendered.
	 *
	 * @return void
	 */
	public function test_lists_and_anchors_headings(): void {
		$html = $this->render_post(
			'<!-- wp:ever-blocks/table-of-contents {"title":"Contents"} /-->' .
			'<!-- wp:heading --><h2 class="wp-block-heading">Overview</h2><!-- /wp:heading -->' .
			'<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Install &amp; setup</h3><!-- /wp:heading -->' .
			'<!-- wp:heading {"level":3,"anchor":"custom-id"} --><h3 class="wp-block-heading" id="custom-id">Configure</h3><!-- /wp:heading -->' .
			'<!-- wp:heading --><h2 class="wp-block-heading">Overview</h2><!-- /wp:heading -->'
		);

		$this->assertMatchesRegularExpression( '/<nav[^>]*class="[^"]*\beb-table-of-contents\b[^"]*is-list-style-decimal[^>]*aria-labelledby="(eb-table-of-contents-\d+)"/', $html );
		$this->assertMatchesRegularExpression( '/<h2 class="eb-table-of-contents__title" id="eb-table-of-contents-\d+">Contents<\/h2>/', $html );
		$this->assertMatchesRegularExpression( '/<a class="eb-table-of-contents__link" href="#overview"[^>]*>Overview<\/a><ol class="eb-table-of-contents__list"><li[^>]*><a[^>]*href="#install-setup"[^>]*>Install &amp; setup<\/a><\/li><li[^>]*><a[^>]*href="#custom-id"/', $html, 'Level 3 headings nest under the level 2 before them.' );
		$this->assertStringContainsString( 'href="#overview-2"', $html, 'A repeated heading gets a numbered id.' );
		$this->assertStringContainsString( '<h2 id="overview" class="wp-block-heading">Overview</h2>', $html );
		$this->assertStringContainsString( '<h3 id="install-setup" class="wp-block-heading">', $html );
		$this->assertStringContainsString( '<h2 id="overview-2" class="wp-block-heading">Overview</h2>', $html );
		$this->assertSame( 1, substr_count( $html, 'id="custom-id"' ), 'An author anchor is kept, not doubled.' );
	}

	/**
	 * Excluded headings, levels outside the selection and the minimum are honoured.
	 *
	 * @return void
	 */
	public function test_respects_exclusion_levels_and_minimum(): void {
		$content = '<!-- wp:heading --><h2 class="wp-block-heading">Kept</h2><!-- /wp:heading -->' .
			'<!-- wp:heading {"everBlocksTocExcluded":true} --><h2 class="wp-block-heading">Skipped</h2><!-- /wp:heading -->' .
			'<!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Deep</h4><!-- /wp:heading -->';

		$html = $this->render_post( '<!-- wp:ever-blocks/table-of-contents {"minHeadings":1} /-->' . $content );

		$this->assertStringContainsString( '>Kept</a>', $html );
		$this->assertStringNotContainsString( '>Skipped</a>', $html );
		$this->assertStringNotContainsString( '>Deep</a>', $html );
		$this->assertStringContainsString( '<h2 id="skipped" class="wp-block-heading">', $html, 'An excluded heading still gets an anchor.' );
		$this->assertMatchesRegularExpression( '/<nav[^>]*aria-label="Table of contents"/', $html, 'No title means an aria-label.' );

		$this->assertStringNotContainsString( 'eb-table-of-contents', $this->render_post( '<!-- wp:ever-blocks/table-of-contents /-->' . $content ), 'Below the default minimum of two, nothing renders.' );
		$this->assertStringContainsString( '>Deep</a>', $this->render_post( '<!-- wp:ever-blocks/table-of-contents {"levels":[2,4],"minHeadings":1} /-->' . $content ) );
	}

	/**
	 * Collapsible tables are a native details element with the toggle icon.
	 *
	 * @return void
	 */
	public function test_collapsible_uses_details(): void {
		$content = '<!-- wp:heading --><h2 class="wp-block-heading">A</h2><!-- /wp:heading --><!-- wp:heading --><h2 class="wp-block-heading">B</h2><!-- /wp:heading -->';

		$html = $this->render_post( '<!-- wp:ever-blocks/table-of-contents {"collapsible":true} /-->' . $content );

		$this->assertMatchesRegularExpression( '/<details class="eb-table-of-contents__details" open><summary class="eb-table-of-contents__summary"><h2 class="eb-table-of-contents__title" id="eb-table-of-contents-\d+">Table of contents<\/h2><span class="eb-table-of-contents__toggle" aria-hidden="true"><svg/', $html );

		$closed = $this->render_post( '<!-- wp:ever-blocks/table-of-contents {"collapsible":true,"open":false} /-->' . $content );

		$this->assertStringContainsString( '<details class="eb-table-of-contents__details"><summary', $closed );
	}

	/**
	 * Headings inside synced patterns and on later pages are found and linked.
	 *
	 * @return void
	 */
	public function test_follows_synced_patterns_and_pagination(): void {
		$pattern = self::factory()->post->create(
			array(
				'post_type'    => 'wp_block',
				'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">From pattern</h2><!-- /wp:heading -->',
			)
		);

		$html = $this->render_post(
			'<!-- wp:ever-blocks/table-of-contents /-->' .
			'<!-- wp:block {"ref":' . $pattern . '} /-->' .
			'<!-- wp:nextpage --><!--nextpage--><!-- /wp:nextpage -->' .
			'<!-- wp:heading --><h2 class="wp-block-heading">Page two</h2><!-- /wp:heading -->'
		);

		$this->assertStringContainsString( 'href="#from-pattern"', $html );
		$this->assertStringContainsString( '<h2 id="from-pattern" class="wp-block-heading">', $html );
		$this->assertMatchesRegularExpression( '/href="http[^"]*page=2[^"]*#page-two"/', $html, 'A heading on page two links to that page.' );
	}

	/**
	 * A second content pass over the same post anchors the headings again.
	 *
	 * @return void
	 */
	public function test_anchors_survive_a_second_content_pass(): void {
		$content = '<!-- wp:ever-blocks/table-of-contents {"minHeadings":1} /--><!-- wp:heading --><h2 class="wp-block-heading">Twice</h2><!-- /wp:heading -->';
		$post_id = self::factory()->post->create( array( 'post_content' => $content ) );

		$GLOBALS['post'] = get_post( $post_id );
		setup_postdata( $GLOBALS['post'] );

		apply_filters( 'the_content', $content );
		$second = apply_filters( 'the_content', $content );

		wp_reset_postdata();

		$this->assertStringContainsString( '<h2 id="twice" class="wp-block-heading">', $second );
		$this->assertStringNotContainsString( 'id="twice"', do_blocks( '<!-- wp:heading --><h2 class="wp-block-heading">Twice</h2><!-- /wp:heading -->' ), 'Outside the_content a heading is left alone.' );
	}

	/**
	 * Own values and element states compile through the engine.
	 *
	 * @return void
	 */
	public function test_compiles_own_values_and_item_state(): void {
		$this->render_post(
			'<!-- wp:ever-blocks/table-of-contents {"minHeadings":1,"style":{"everBlocks":{"columns":"2"},"elements":{"item":{":hover":{"color":{"text":"#ff0000"}}}},"@mobile":{"everBlocks":{"columns":"1"}}}} /-->' .
			'<!-- wp:heading --><h2 class="wp-block-heading">A</h2><!-- /wp:heading -->'
		);

		$css = $this->plugin_css();

		$this->assertStringContainsString( '--ever-blocks-table-of-contents-columns:2', $css );
		$this->assertStringContainsString( '.eb-table-of-contents__item > .eb-table-of-contents__link:hover{color:#ff0000;}', $css );
		$this->assertMatchesRegularExpression( '/@media \(width <= 480px\)\{\.eb-[a-f0-9]+\.eb-[a-f0-9]+\{--ever-blocks-table-of-contents-columns:1;/', $css );
	}
}
