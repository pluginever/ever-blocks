<?php
/**
 * Test includes/class-ever-blocks-accordion-ie-support.php
 *
 * @package ever-blocks
 */
class ever-blocks_Accordion_IE_Support_Tests extends WP_UnitTestCase {

	public function setUp() {

		parent::setUp();

		set_current_screen( 'edit-post' );

	}

	public function tearDown() {

		parent::tearDown();

	}

	/**
	 * Test the class properties are what we expect
	 */
	public function test_properties() {

		$reflection = new ReflectionClass( new ever-blocks_Accordion_IE_Support() );

		$instance = $reflection->getProperty( 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );
		$instance->setAccessible( false );

		$new_reflection = new ever-blocks_Accordion_IE_Support();

		$new_reflection::register();

		$expected = [
			'slug' => 'ever-blocks',
			'url'  => str_replace( '/.dev/tests/phpunit', '', untrailingslashit( plugins_url( '/', dirname( __FILE__ ) ) ) ), // Fix inconsistencies path between plugin and unit tests
		];

		$slug = $reflection->getProperty( 'slug' );
		$url  = $reflection->getProperty( 'url' );

		$slug->setAccessible( true );
		$url->setAccessible( true );

		$check = [
			'slug' => $slug->getValue( $new_reflection ),
			'url'  => $url->getValue( $new_reflection ),
		];

		$this->assertEquals( $expected, $check );

	}

	/**
	 * Test the plugin does not load scripts when the global post is empty
	 */
	public function test_null_assets() {

		$reflection = new ReflectionClass( new ever-blocks_Accordion_IE_Support() );

		$instance = $reflection->getProperty( 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );
		$instance->setAccessible( false );

		$new_reflection = new ever-blocks_Accordion_IE_Support();

		$this->assertNull( $new_reflection->load_assets() );

	}

	/**
	 * Test the plugin scripts were loaded correctly
	 */
	public function test_assets() {

		$reflection = new ReflectionClass( new ever-blocks_Accordion_IE_Support() );

		$instance = $reflection->getProperty( 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );
		$instance->setAccessible( false );

		$new_reflection = new ever-blocks_Accordion_IE_Support();

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/accordion --><div class="wp-block-ever-blocks-accordion"><!-- wp:ever-blocks/accordion-item {"title":"Accordion Title 1"} --><div class="wp-block-ever-blocks-accordion-item"><details><summary class="wp-block-ever-blocks-accordion-item__title">Accordion Title 1</summary><div class="wp-block-ever-blocks-accordion-item__content"><!-- wp:paragraph {"placeholder":"Add content…"} --><p>Accordion Content 1</p><!-- /wp:paragraph --></div></details></div><!-- /wp:ever-blocks/accordion-item --></div><!-- /wp:ever-blocks/accordion -->',
				'post_title'   => 'ever-blocks Accordion',
				'post_status'  => 'publish',
			]
		);

		update_post_meta( $post_id, '_ever-blocks_accordion_ie_support', "'true'" );

		global $post;

		$post = get_post( $post_id );

		$new_reflection->load_assets();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$this->assertContains( 'ever-blocks-accordion-polyfill', $wp_scripts->queue );

	}
}
