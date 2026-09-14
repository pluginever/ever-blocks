<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Testimonial block, rendered from its built metadata.
 */
class TestimonialTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/testimonial' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * Every field lands in its part, the rating is announced, and the Review schema names the item.
	 *
	 * @return void
	 */
	public function test_renders_fields_rating_and_schema(): void {
		$html = $this->render( '<!-- wp:ever-blocks/testimonial {"quote":"Solid <em>work</em>.","name":"Maya","role":"Lead","rating":4.5,"avatarUrl":"https://example.org/a.png","schema":true,"itemReviewed":"Ever Blocks","layout":"side"} /-->' );

		$this->assertMatchesRegularExpression( '/<figure class="eb-testimonial eb-testimonial--side[^"]*">.*<blockquote class="eb-testimonial__quote">Solid <em>work<\/em>\.<\/blockquote><figcaption class="eb-testimonial__author"><img class="eb-testimonial__avatar" src="https:\/\/example\.org\/a\.png"[^>]*><span class="eb-testimonial__who"><span class="eb-testimonial__name">Maya<\/span><span class="eb-testimonial__role">Lead<\/span><\/span><\/figcaption><\/figure>/s', $html );
		$this->assertStringContainsString( 'aria-label="Rated 4.5 out of 5"', $html );
		$this->assertStringContainsString( 'style="width:90%"', $html );
		$this->assertStringContainsString( '"@type":"Review","itemReviewed":{"@type":"Thing","name":"Ever Blocks"},"reviewBody":"Solid work."', $html );
		$this->assertStringNotContainsString( 'ld+json', $this->render( '<!-- wp:ever-blocks/testimonial {"quote":"Q","schema":true} /-->' ), 'No item reviewed, no schema.' );
		$this->assertSame( '', $this->render( '<!-- wp:ever-blocks/testimonial {"name":"Maya"} /-->' ), 'No quote, nothing rendered.' );
	}
}
