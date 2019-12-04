<?php
/**
 * Test includes/class-ever-blocks-font-loader.php
 *
 * @package ever-blocks
 */
class ever-blocks_Font_Loader_Tests extends WP_UnitTestCase {

	private $ever-blocks_font_loader;

	public function setUp() {

		parent::setUp();

		$this->ever-blocks_font_loader = new ever-blocks_Font_Loader();

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

		$reflection     = new ReflectionClass( $this->ever-blocks_font_loader );
		$new_reflection = new ever-blocks_Font_Loader();

		$instance = $reflection->getProperty( 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );

		$new_reflection::register();

		$this->assertTrue( is_a( $instance->getValue( 'instance' ), 'ever-blocks_Font_Loader' ) );

	}

	/**
	 * Test the constructor actions
	 */
	public function test_construct_actions() {

		$actions = [
			[ 'wp_enqueue_scripts', 'fonts_loader' ],
			[ 'admin_enqueue_scripts', 'fonts_loader' ],
		];

		foreach ( $actions as $action_data ) {

			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], [ $this->ever-blocks_font_loader, $action_data[1] ] ) ) {

				$this->fail( "$action_data[0] is not attached to ever-blocks:$action_data[1]. It might also have the wrong priority (validated priority: $priority)" );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the font loader
	 */
	public function test_font_loader() {

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => 'Font Loader Test',
				'post_title'   => 'Font Loader Test',
				'post_status'  => 'publish',
			]
		);

		update_post_meta( $post_id, '_ever-blocks_attr', 'Roboto,Lato' );

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_font_loader->fonts_loader();

		global $wp_styles;

		$this->assertTrue( array_key_exists( 'ever-blocks-block-fonts', $wp_styles->registered ) );

	}
}
