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

		return apply_filters( 'the_content', $content );
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
		$this->assertMatchesRegularExpression( '/<li class="eb-table-of-contents__item" data-index="1\.2"><a[^>]*href="#custom-id"/', $html, 'Items carry their outline index.' );
		$this->assertStringContainsString( '<h2 id="overview" class="wp-block-heading">Overview</h2>', $html );
		$this->assertStringContainsString( '<h3 id="install-setup" class="wp-block-heading">', $html );
		$this->assertStringContainsString( '<h2 id="overview-2" class="wp-block-heading">Overview</h2>', $html );
		$this->assertSame( 1, substr_count( $html, 'id="custom-id"' ), 'An author anchor is kept, not doubled.' );

		$this->assertStringContainsString( '<h2 id="overview" class="wp-block-heading">', apply_filters( 'the_content', $GLOBALS['post']->post_content ), 'A second content pass anchors again.' );
		$this->assertStringNotContainsString( 'id="overview"', do_blocks( '<!-- wp:heading --><h2 class="wp-block-heading">Overview</h2><!-- /wp:heading -->' ), 'Outside the_content a heading is left alone.' );
	}

	/**
	 * Headings inside synced patterns and on later pages are linked; excluded ones are not listed.
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
			'<!-- wp:heading {"everBlocksTocExcluded":true} --><h2 class="wp-block-heading">Skipped</h2><!-- /wp:heading -->' .
			'<!-- wp:nextpage --><!--nextpage--><!-- /wp:nextpage -->' .
			'<!-- wp:heading --><h2 class="wp-block-heading">Page two</h2><!-- /wp:heading -->'
		);

		$this->assertStringNotContainsString( '>Skipped</a>', $html );
		$this->assertStringContainsString( 'href="#from-pattern"', $html );
		$this->assertStringContainsString( '<h2 id="from-pattern" class="wp-block-heading">', $html );
		$this->assertMatchesRegularExpression( '/href="http[^"]*page=2[^"]*#page-two"/', $html, 'A heading on page two links to that page.' );
	}

}
