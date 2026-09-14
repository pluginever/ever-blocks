<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Rating block, rendered from its built metadata.
 */
class RatingTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/rating' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * A fractional value is announced, labelled and clipped to the exact width.
	 *
	 * @return void
	 */
	public function test_fraction_renders_label_and_fill(): void {
		$html = $this->render( '<!-- wp:ever-blocks/rating {"value":4.3,"showLabel":true} /-->' );

		$this->assertMatchesRegularExpression( '/<span class="eb-rating__icons" role="img" aria-label="Rated 4.3 out of 5">/', $html );
		$this->assertSame( 10, substr_count( $html, '<svg' ), 'Five icons in each row.' );
		$this->assertStringContainsString( '<span class="eb-rating__filled" aria-hidden="true" style="width:86%">', $html );
		$this->assertStringContainsString( '<span class="eb-rating__label" aria-hidden="true">4.3 / 5</span>', $html );
		$this->assertStringNotContainsString( 'eb-rating__label', $this->render( '<!-- wp:ever-blocks/rating {"value":7,"max":3} /-->' ) );
		$this->assertStringContainsString( 'aria-label="Rated 3 out of 3"', $this->render( '<!-- wp:ever-blocks/rating {"value":7,"max":3} /-->' ), 'The value is clamped to the maximum.' );
	}
}
