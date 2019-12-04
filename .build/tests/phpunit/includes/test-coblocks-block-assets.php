<?php
/**
 * Test includes/class-ever-blocks-block-assets.php
 *
 * @package ever-blocks
 */
class ever-blocks_Block_Assets_Tests extends WP_UnitTestCase {

	private $ever-blocks_block_assets;

	public function setUp() {

		parent::setUp();

		$this->ever-blocks_block_assets = new ever-blocks_Block_Assets();

		set_current_screen( 'dashboard' );

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

	}

	/**
	 * Test the register method
	 */
	public function test_register() {

		$reflection     = new ReflectionClass( $this->ever-blocks_block_assets );
		$new_reflection = new ever-blocks_Block_Assets();

		$instance = $reflection->getProperty( 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );

		$object = $new_reflection::register();

		$this->assertTrue( is_a( $instance->getValue( 'instance' ), 'ever-blocks_Block_Assets' ) );

	}

	/**
	 * Test the constructor constants are set correctly
	 */
	public function test_construct_constants() {

		$reflection     = new ReflectionClass( $this->ever-blocks_block_assets );
		$new_reflection = new ever-blocks_Block_Assets();

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
	 * Test the constructor actions
	 */
	public function test_construct_actions() {

		$reflection     = new ReflectionClass( $this->ever-blocks_block_assets );
		$new_reflection = new ever-blocks_Block_Assets();

		$actions = [
			[ 'enqueue_block_assets', 'block_assets' ],
			[ 'init', 'editor_assets' ],
			[ 'wp_enqueue_scripts', 'frontend_scripts' ],
			[ 'the_post', 'frontend_scripts' ],
		];

		foreach ( $actions as $action_data ) {

			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], [ $this->ever-blocks_block_assets, $action_data[1] ] ) ) {

				$this->fail( "$action_data[0] is not attached to ever-blocks:$action_data[1]. It might also have the wrong priority (validated priority: $priority)" );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the block assets enqueue correctly
	 */
	public function test_block_assets() {

		$this->ever-blocks_block_assets->block_assets();

		global $wp_styles;

		$this->assertTrue( array_key_exists( 'ever-blocks-editor', $wp_styles->registered ) );

	}

	/**
	 * Test the editor asset styles enqueue correctly
	 */
	public function test_editor_assets_styles() {

		$this->ever-blocks_block_assets->editor_assets();

		global $wp_styles;

		$this->assertTrue( array_key_exists( 'ever-blocks-editor', $wp_styles->registered ) );

	}

	/**
	 * Test the editor asset scripts enqueue correctly
	 */
	public function test_editor_assets_scripts() {

		$this->ever-blocks_block_assets->editor_assets();

		global $wp_scripts;

		$this->assertTrue( array_key_exists( 'ever-blocks-editor', $wp_scripts->registered ) );

	}

	/**
	 * Test the editor asset scripts localized data
	 */
	public function test_editor_assets_localized_data() {

		$this->ever-blocks_block_assets->editor_assets();

		global $wp_scripts;

		$this->assertRegExp( '/admin@example.org/', $wp_scripts->registered['ever-blocks-editor']->extra['data'] );

	}

	/**
	 * Test the frontend scripts masonry are enqueued correctly
	 */
	public function test_frontend_scripts_masonry() {

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/gallery-masonry --><!-- /wp:ever-blocks/gallery-masonry -->',
				'post_title'   => 'ever-blocks Masonry',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_block_assets->frontend_scripts();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$this->assertContains( 'ever-blocks-masonry', $wp_scripts->queue );

	}

	/**
	 * Test the frontend scripts carousel are enqueued correctly
	 */
	public function test_frontend_scripts_carousel() {

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/gallery-carousel --><!-- /wp:ever-blocks/gallery-carousel -->',
				'post_title'   => 'ever-blocks Carousel',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_block_assets->frontend_scripts();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$this->assertContains( 'ever-blocks-flickity', $wp_scripts->queue );

	}
}
