<?php
/**
 * Test includes/class-ever-blocks-google-map-block.php
 *
 * @package ever-blocks
 */
class ever-blocks_Google_Map_Block_Tests extends WP_UnitTestCase {

	private $ever-blocks_google_map_block;

	public function setUp() {

		parent::setUp();

		set_current_screen( 'dashboard' );

		$this->ever-blocks_google_map_block = new ever-blocks_Google_Map_Block();

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

	}

	/**
	 * Test the register method
	 */
	public function test_register() {

		$reflection     = new ReflectionClass( $this->ever-blocks_google_map_block );
		$new_reflection = new ever-blocks_Google_Map_Block();

		$instance = $reflection->getProperty( 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );

		$new_reflection::register();

		$this->assertTrue( is_a( $instance->getValue( 'instance' ), 'ever-blocks_Google_Map_Block' ) );

	}

	/**
	 * Test the constructor constants
	 */
	public function test_construct_constants() {

		$reflection     = new ReflectionClass( $this->ever-blocks_google_map_block );
		$new_reflection = new ever-blocks_Google_Map_Block();

		$expected = [
			'slug'    => 'ever-blocks',
			'url'     => str_replace( '/.dev/tests/phpunit', '', untrailingslashit( plugins_url( '/', dirname( __FILE__ ) ) ) ), // Fix inconsistencies path between plugin and unit tests
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
	 * Test the constructor actions
	 */
	public function test_construct_actions() {

		$actions = [
			[ 'wp_enqueue_scripts', 'map_assets' ],
			[ 'the_post', 'map_assets' ],
			[ 'init', 'register_settings' ],
		];

		foreach ( $actions as $action_data ) {

			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], [ $this->ever-blocks_google_map_block, $action_data[1] ] ) ) {

				$this->fail( "$action_data[0] is not attached to ever-blocks:$action_data[1]. It might also have the wrong priority (validated priority: $priority)" );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the scripts enqueue correctly
	 */
	public function test_map_assets() {

		unset( $GLOBALS['current_screen'] );
		update_option( 'ever-blocks_google_maps_api_key', '123' );

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/map --><!-- /wp:ever-blocks/map -->',
				'post_title'   => 'ever-blocks Map',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_google_map_block->map_assets();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$enqueued = [
			'ever-blocks-google-maps',
			'ever-blocks-google-maps-api',
		];

		foreach ( $enqueued as $script ) {

			if ( ! array_key_exists( $script, $wp_scripts->registered ) ) {

				$this->fail( "$script was not enqueued." );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the scripts data is localized correctly
	 */
	public function test_map_assets_localized_Data() {

		update_option( 'ever-blocks_google_maps_api_key', '123' );

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/map --><!-- /wp:ever-blocks/map -->',
				'post_title'   => 'ever-blocks Map',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_google_map_block->map_assets();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$this->assertRegExp( '/var ever-blocksGoogleMaps = {"url":"http:\/\/example.org\/wp-content\/plugins/', stripslashes_deep( $wp_scripts->registered['ever-blocks-google-maps']->extra['data'] ) );

	}

	/**
	 * Test the settings are registered correctly
	 */
	public function test_register_settings() {

		$this->ever-blocks_google_map_block->register_settings();

		$this->assertArrayHasKey( 'ever-blocks_google_maps_api_key', get_registered_settings() );

	}
}
