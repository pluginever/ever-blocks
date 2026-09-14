<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Blocks\Faq;

/**
 * FAQ: FAQPage schema collected from rendered accordions.
 */
class FaqTest extends TestCase {

	/**
	 * Builds an accordion block with the given items.
	 *
	 * @param array<int, array{0: string, 1: string}> $items  Question markup and answer block markup pairs.
	 * @param bool                                    $schema Whether the schema attribute is on.
	 * @return string Block markup.
	 */
	private function accordion( array $items, bool $schema = true ): string {
		$html = '<!-- wp:accordion ' . ( $schema ? '{"everBlocksSchema":true} ' : '' ) . '--><div class="wp-block-accordion">';

		foreach ( $items as [ $question, $answer ] ) {
			$html .= '<!-- wp:accordion-item --><div class="wp-block-accordion-item">'
				. '<!-- wp:accordion-heading --><h3 class="wp-block-accordion-heading"><button class="wp-block-accordion-heading__toggle"><span class="wp-block-accordion-heading__toggle-title">' . $question . '</span></button></h3><!-- /wp:accordion-heading -->'
				. '<!-- wp:accordion-panel --><div class="wp-block-accordion-panel">' . $answer . '</div><!-- /wp:accordion-panel -->'
				. '</div><!-- /wp:accordion-item -->';
		}

		return $html . '</div><!-- /wp:accordion -->';
	}

	/**
	 * Renders markup, then returns the schema the footer prints.
	 *
	 * @param string $html Block markup.
	 * @return array<string, mixed>|null Decoded FAQPage, or null when nothing printed.
	 */
	private function schema_for( string $html ): ?array {
		do_blocks( $html );

		$faq = $this->plugin->get( Faq::class );

		ob_start();
		$faq->print_schema();
		$out = (string) ob_get_clean();

		if ( '' === $out ) {
			return null;
		}

		$this->assertSame( 1, preg_match( '/<script type="application\/ld\+json">(.*?)<\/script>/s', $out, $match ), $out );

		return json_decode( trim( $match[1] ), true );
	}

	/**
	 * Questions and answers from every schema accordion on the page land in one FAQPage.
	 *
	 * @return void
	 */
	public function test_prints_one_faq_page_for_the_whole_page(): void {
		$schema = $this->schema_for(
			$this->accordion( array( array( 'Why <em>us</em>?', '<!-- wp:paragraph --><p>Because <a href="https://example.com/">reasons</a>.</p><!-- /wp:paragraph -->' ) ) )
			. $this->accordion( array( array( 'Second', '<!-- wp:list --><ul><!-- wp:list-item --><li>One</li><!-- /wp:list-item --></ul><!-- /wp:list -->' ) ) )
		);

		$this->assertSame( 'FAQPage', $schema['@type'] );
		$this->assertCount( 2, $schema['mainEntity'] );
		$this->assertSame( 'Why us?', $schema['mainEntity'][0]['name'] );
		$this->assertSame( '<p>Because <a href="https://example.com/">reasons</a>.</p>', $schema['mainEntity'][0]['acceptedAnswer']['text'] );
		$this->assertSame( 'Second', $schema['mainEntity'][1]['name'] );
		$this->assertStringContainsString( '<li>One</li>', $schema['mainEntity'][1]['acceptedAnswer']['text'] );
	}

	/**
	 * An answer keeps only the markup Google accepts.
	 *
	 * @return void
	 */
	public function test_answer_markup_is_limited_to_the_allow_list(): void {
		$schema = $this->schema_for(
			$this->accordion( array( array( 'Q', '<!-- wp:paragraph --><p class="x" style="color:red">Text <img src="a.png" alt=""> <strong>bold</strong></p><!-- /wp:paragraph -->' ) ) )
		);

		$this->assertSame( '<p>Text  <strong>bold</strong></p>', $schema['mainEntity'][0]['acceptedAnswer']['text'] );
	}

}
