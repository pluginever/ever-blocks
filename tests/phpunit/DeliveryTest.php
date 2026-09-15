<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Generated CSS reaches the printed page.
 *
 * A generator can be correct while its delivery is not, and a test that calls
 * the generator directly cannot tell the difference. These run the whole cycle.
 */
class DeliveryTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		register_block_type(
			'ever-blocks/test',
			array(
				'render_callback' => static fn(): string => '<div class="eb-test">x</div>',
				'supports'        => array( 'color' => array( 'background' => true ), 'everBlocks' => array( 'states' => array( ':hover' ) ) ),
			)
		);
	}

	/**
	 * Tears down the test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		unregister_block_type( 'ever-blocks/test' );

		parent::tear_down();
	}

	/**
	 * Renders a block with a hover style and returns the printed stylesheet markup.
	 *
	 * @param string $action Action that flushes the stores for this theme type.
	 * @return string Printed style tags.
	 */
	private function print_styles_after_render( string $action ): string {
		$attrs = wp_json_encode( array( 'style' => array( ':hover' => array( 'color' => array( 'background' => '#123456' ) ) ) ) );

		$this->render( '<!-- wp:ever-blocks/test ' . $attrs . ' /-->' );

		// The classic-theme flush prints during `wp_footer` itself; the block-theme
		// one only enqueues, and the head prints it afterwards.
		ob_start();
		do_action( $action );
		wp_print_styles( 'wp-style-engine-ever-blocks' );

		return (string) ob_get_clean();
	}

	/**
	 * Core registers a handle for the plugin's store without being asked.
	 *
	 * @return void
	 */
	public function test_core_owns_the_handle(): void {
		$this->render( '<!-- wp:ever-blocks/test {"style":{"everBlocks":{"gap":"1rem"}}} /-->' );

		$this->assertFalse( wp_style_is( 'wp-style-engine-ever-blocks', 'registered' ) );

		wp_enqueue_stored_styles();

		$this->assertTrue( wp_style_is( 'wp-style-engine-ever-blocks', 'enqueued' ) );
	}

	/**
	 * On a block theme the template renders before wp_head, so the head flush
	 * already has every rule.
	 *
	 * @return void
	 */
	public function test_css_is_printed_on_a_block_theme(): void {
		if ( ! wp_is_block_theme() ) {
			$this->markTestSkipped( 'The test theme is not a block theme.' );
		}

		$this->assertStringContainsString( 'background-color:#123456', $this->print_styles_after_render( 'wp_enqueue_scripts' ) );
	}

	/**
	 * On a classic theme blocks render after wp_head, so the flush happens at
	 * wp_footer instead.
	 *
	 * @return void
	 */
	public function test_css_is_printed_on_a_classic_theme(): void {
		if ( wp_is_block_theme() ) {
			$this->markTestSkipped( 'The test theme is a block theme.' );
		}

		// Core still hooks this deprecated function to wp_footer in 7.1.
		$this->setExpectedDeprecated( 'the_block_template_skip_link' );

		$this->assertStringContainsString( 'background-color:#123456', $this->print_styles_after_render( 'wp_footer' ) );
	}

	/**
	 * Nothing is printed when no block asked for anything.
	 *
	 * @return void
	 */
	public function test_nothing_is_printed_without_generated_css(): void {
		wp_enqueue_stored_styles();

		$this->assertFalse( wp_style_is( 'wp-style-engine-ever-blocks', 'enqueued' ) );
	}
}
