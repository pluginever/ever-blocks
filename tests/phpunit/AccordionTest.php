<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Accordion and Accordion Item blocks, rendered from their built metadata.
 */
class AccordionTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/accordion-item' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * Renders an accordion with two items.
	 *
	 * @param string $accordion Accordion attributes as JSON.
	 * @param string $first     First item attributes as JSON.
	 * @return string Rendered HTML.
	 */
	private function render_accordion( string $accordion = '{}', string $first = '{"title":"One","open":true}' ): string {
		return $this->render(
			'<!-- wp:ever-blocks/accordion ' . $accordion . ' -->'
			. '<!-- wp:ever-blocks/accordion-item ' . $first . ' --><!-- wp:paragraph --><p>First answer.</p><!-- /wp:paragraph --><!-- /wp:ever-blocks/accordion-item -->'
			. '<!-- wp:ever-blocks/accordion-item {"title":"Two","level":2} --><!-- wp:paragraph --><p>Second answer.</p><!-- /wp:paragraph --><!-- /wp:ever-blocks/accordion-item -->'
			. '<!-- /wp:ever-blocks/accordion -->'
		);
	}

	/**
	 * Items are native details/summary with the author's heading level and a labelled region.
	 *
	 * @return void
	 */
	public function test_items_are_native_details(): void {
		$html = $this->render_accordion();

		$this->assertSame( 2, substr_count( $html, '<details' ) );
		$this->assertMatchesRegularExpression( '/<details[^>]*class="eb-accordion-item[^"]*"[^>]*open="open"/', $html );
		$this->assertStringContainsString( '<h3 class="eb-accordion-item__title">One</h3>', $html );
		$this->assertStringContainsString( '<h2 class="eb-accordion-item__title">Two</h2>', $html );
		$this->assertMatchesRegularExpression( '/<summary class="eb-accordion-item__summary" id="(eb-accordion-item-\d+)">.*?<div class="eb-accordion-item__panel" role="region" aria-labelledby="\1">/s', $html );
		$this->assertStringContainsString( '<span class="eb-accordion-item__icon eb-accordion-item__icon--closed" aria-hidden="true"><svg', $html );
	}

	/**
	 * Exclusive opening is expressed with one shared `name`, and dropped when several may open.
	 *
	 * @return void
	 */
	public function test_exclusive_opening_uses_the_native_name(): void {
		$this->assertSame( 1, preg_match_all( '/<details name="(eb-accordion-\d+)"/', $this->render_accordion(), $m ) === 2 ? 1 : 0 );
		$this->assertStringNotContainsString( '<details name=', $this->render_accordion( '{"allowMultiple":true}' ) );
	}

	/**
	 * FAQ schema is built from the titles and the rendered answers.
	 *
	 * @return void
	 */
	public function test_schema_is_built_from_the_items(): void {
		$html = $this->render_accordion( '{"schema":true}' );

		$this->assertSame( 1, preg_match( '/<script type="application\/ld\+json">(.+?)<\/script>/', $html, $m ) );

		$schema = json_decode( $m[1], true );

		$this->assertSame( 'FAQPage', $schema['@type'] );
		$this->assertSame( array( 'One', 'Two' ), array_column( $schema['mainEntity'], 'name' ) );
		$this->assertSame( 'Second answer.', $schema['mainEntity'][1]['acceptedAnswer']['text'] );
		$this->assertStringNotContainsString( 'application/ld+json', $this->render_accordion() );
	}

	/**
	 * Element styles and the open state reach the page through the engine.
	 *
	 * @return void
	 */
	public function test_element_styles_compile(): void {
		$html = $this->render_accordion( '{}', '{"title":"One","style":{"elements":{"icon":{"everBlocks":{"size":"32px"}},"summary":{":hover":{"color":{"background":"#eeeeee"}}}},"-open":{"elements":{"title":{"color":{"text":"#ff0000"}}}}}}' );

		$this->assertSame( 1, preg_match( '/<details[^>]*class="[^"]*\b(eb-[0-9a-f]{8})\b/', $html, $match ) );

		$class = '.' . $match[1] . '.' . $match[1];
		$css   = $this->plugin_css();

		$this->assertStringContainsString( $class . ' .eb-accordion-item__icon{--ever-blocks-accordion-item-icon-size:32px;}', $css );
		$this->assertStringContainsString( $class . ' .eb-accordion-item__summary:hover{background-color:#eeeeee;}', $css );
		$this->assertStringContainsString( $class . '[open] .eb-accordion-item__title{color:#ff0000;}', $css );
	}
}
