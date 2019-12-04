<?php
/**
 * Test class-ever-blocks.php
 *
 * @package ever-blocks
 */
class ever-blocks_Tests extends WP_UnitTestCase {

	public function setUp() {

		parent::setUp();

		set_current_screen( 'dashboard' );

		$reflection = new ReflectionClass( new ever-blocks() );
		$instance   = $reflection->getProperty( 'instance' );

		$instance->setAccessible( true );
		$instance->setValue( null, null );
		$instance->setAccessible( false );

		do_action( 'plugins_loaded' );

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

	}

	public function test_ever-blocks() {

		$this->assertTrue( is_a( ever-blocks(), 'ever-blocks' ) );

	}

	/**
	 * Test the clone function
	 *
	 * @expectedIncorrectUsage __clone
	 */
	public function test_clone() {

		clone ever-blocks();

	}

	/**
	 * Test the wakeup function
	 *
	 * @expectedIncorrectUsage __wakeup
	 */
	public function test_wakeup() {

		unserialize( serialize( ever-blocks() ) );

	}

	/**
	 * Assert the plugin data returns what is expected
	 */
	public function test_constants() {

		$reflection_method = new ReflectionMethod( 'ever-blocks', 'instance' );

		$reflection_method->invoke( ever-blocks() );

		$expected = [
			'version' => '1.17.3',
			'plugin_dir'  => str_replace( '.dev/tests/phpunit/', '', plugin_dir_path( __FILE__ ) ),
			'plugin_url'  => str_replace( '.dev/tests/phpunit/', '', plugin_dir_url( __FILE__ ) ),
			'plugin_file' => str_replace( '.dev/tests/phpunit/test-class-ever-blocks.php', 'class-ever-blocks.php', __FILE__ ),
			'plugin_base' => str_replace( '.dev/tests/phpunit/test-class-ever-blocks.php', 'class-ever-blocks.php', plugin_basename( __FILE__ ) ),
			'review_url'  => 'https://wordpress.org/support/plugin/ever-blocks/reviews/?filter=5',
		];

		$check = [
			'version'     => ever-blocks_VERSION,
			'plugin_dir'  => ever-blocks_PLUGIN_DIR,
			'plugin_url'  => ever-blocks_PLUGIN_URL,
			'plugin_file' => ever-blocks_PLUGIN_FILE,
			'plugin_base' => ever-blocks_PLUGIN_BASE,
			'review_url'  => ever-blocks_REVIEW_URL,
		];

		$this->assertEquals( $expected, $check );

	}

	/**
	 * Test core plugin files were included
	 */
	public function test_included_files() {

		$check_files = [
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-block-assets.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-register-blocks.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-generated-styles.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-body-classes.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-form.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-font-loader.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-post-meta.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-google-map-block.php',
			ever-blocks_PLUGIN_DIR . 'includes/class-ever-blocks-accordion-ie-support.php',
			ever-blocks_PLUGIN_DIR . 'includes/get-dynamic-blocks.php',
			ever-blocks_PLUGIN_DIR . 'includes/admin/class-ever-blocks-action-links.php',
			ever-blocks_PLUGIN_DIR . 'includes/admin/class-ever-blocks-install.php',
		];

		$this->assertTrue( ! empty( array_intersect( $check_files, get_included_files() ) ) );

	}

	/**
	 * The the init actions are called
	 */
	public function test_init_actions() {

		$actions = [
			[ 'plugins_loaded', 'load_textdomain', 99 ],
			[ 'enqueue_block_editor_assets', 'block_localization' ],
		];

		foreach ( $actions as $action_data ) {

			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], [ ever-blocks(), $action_data[1] ] ) ) {

				$this->fail( "$action_data[0] is not attached to ever-blocks:$action_data[1]. It might also have the wrong priority (validated priority: $priority)" );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the asset suffix returns .min
	 */
	public function test_min_asset_suffix() {

		$this->assertEquals( ever-blocks_ASSET_SUFFIX, '.min' );

	}

	/**
	 * Test the asset source directory for js assets
	 */
	public function test_js_asset_source() {

		$this->assertRegexp( '/\/ever-blocks\/dist\/js\//', ever-blocks()->asset_source( 'js' ) );

	}

	/**
	 * Test the asset source directory for css assets
	 */
	public function test_css_asset_source() {

		$this->assertRegexp( '/\/ever-blocks\/dist\/css\//', ever-blocks()->asset_source( 'css' ) );

	}

	/**
	 * Test the asset source directory for css assets
	 */
	public function test_custom_css_asset_source() {

		$this->assertRegexp( '/\/ever-blocks\/dist\/css\/custom/', ever-blocks()->asset_source( 'css', 'custom' ) );

	}

	/**
	 * Test the text domain loads correctly
	 */
	public function test_text_domain() {

		$this->markTestSkipped( 'Todo: Write tests for text domain.' );

	}

	/**
	 * Test the block editor assets load correctly
	 */
	public function test_block_editor_assets() {

		do_action( 'enqueue_block_editor_assets' );

		global $wp_scripts;

		$this->assertTrue( array_key_exists( 'ever-blocks-editor', $wp_scripts->registered ) );

	}
}
