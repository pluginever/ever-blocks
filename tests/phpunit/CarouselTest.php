<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Carousel block, rendered from its built metadata.
 */
class CarouselTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/carousel' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * Wraps slides in the given carousel attributes.
	 *
	 * @param string $attributes JSON attributes.
	 * @param int    $slides     Slide count.
	 * @return string Rendered HTML.
	 */
	private function carousel( string $attributes, int $slides = 3 ): string {
		$slide = static fn( int $i ): string => '<!-- wp:ever-blocks/carousel-slide --><!-- wp:paragraph --><p>Slide ' . $i . '</p><!-- /wp:paragraph --><!-- /wp:ever-blocks/carousel-slide -->';

		return $this->render( '<!-- wp:ever-blocks/carousel ' . $attributes . ' -->' . implode( '', array_map( $slide, range( 1, $slides ) ) ) . '<!-- /wp:ever-blocks/carousel -->' );
	}

	/**
	 * A slider carries the chrome the view script drives and every slide is a labelled group.
	 *
	 * @return void
	 */
	public function test_slider_renders_chrome_and_slides(): void {
		$html = $this->carousel( '{"autoplay":true,"speed":"fast"}' );

		$this->assertMatchesRegularExpression( '/<div class="eb-carousel is-layout-slider[^"]*"[^>]*data-wp-interactive="ever-blocks\/carousel"[^>]*role="region"/', $html );
		$this->assertStringContainsString( '&quot;autoplay&quot;:true', $html );
		$this->assertSame( 3, substr_count( $html, 'class="eb-carousel__slide' ) );
		$this->assertMatchesRegularExpression( '/<div aria-label="2 of 3" class="eb-carousel__slide[^"]*"[^>]*role="group" aria-roledescription="slide"/', $html, 'A slide is numbered before hydration.' );
		$this->assertStringContainsString( 'aria-label="Previous slide" disabled>', $this->carousel( '{"loop":false}' ), 'Without looping the first slide has no previous.' );
		$this->assertSame( 3, substr_count( $html, 'class="eb-carousel__dot"' ) );
		$this->assertStringContainsString( 'class="eb-carousel__arrow eb-carousel__arrow--next"', $html );
		$this->assertStringContainsString( 'aria-live="polite"', $html );
		$this->assertStringNotContainsString( 'eb-carousel__nav', $this->carousel( '{}', 1 ), 'One slide needs no chrome.' );
		$this->assertSame( '', $this->render( '<!-- wp:ever-blocks/carousel /-->' ), 'No slides, no wrapper.' );
	}

	/**
	 * Moving rows and columns duplicate their track once, hidden from assistive tech; still ones stay plain.
	 *
	 * @return void
	 */
	public function test_moving_layouts_duplicate_the_track(): void {
		$row = $this->carousel( '{"layout":"row","autoplay":true}' );

		$this->assertStringContainsString( 'is-layout-row is-moving', $row );
		$this->assertSame( 2, substr_count( $row, 'class="eb-carousel__run"' ) );
		$this->assertSame( 1, substr_count( $row, '<div class="eb-carousel__run" aria-hidden="true" inert>' ) );

		$columns = $this->carousel( '{"layout":"columns","columns":2,"autoplay":true}', 4 );

		$this->assertSame( 2, substr_count( $columns, 'class="eb-carousel__column"' ) );
		$this->assertSame( 4, substr_count( $columns, 'eb-carousel__run' ), 'Two runs per column.' );
		$this->assertStringContainsString( 'style="--columns:2"', $columns );
		$this->assertSame( 2, substr_count( $columns, 'Slide 1</p>' ), 'Slide 1 appears in its column twice: once live, once hidden.' );

		$still = $this->carousel( '{"layout":"columns"}' );

		$this->assertStringNotContainsString( 'data-wp-interactive', $still );
		$this->assertStringNotContainsString( 'eb-carousel__run', $still );
	}
}
