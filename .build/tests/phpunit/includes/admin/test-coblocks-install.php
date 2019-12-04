<?php
/**
 * Test includes/admin/class-ever-blocks-install.php
 *
 * @package ever-blocks
 */
class ever-blocks_Install_Tests extends WP_UnitTestCase {

	private $ever-blocks_install;

	public function setUp() {

		parent::setUp();

		include_once ever-blocks_PLUGIN_DIR . 'includes/admin/class-ever-blocks-install.php';

		$this->ever-blocks_install = new ever-blocks_Install();

		set_current_screen( 'edit-post' );

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

	}

	/**
	 * Test that the default options are registered when the plugin is activated
	 */
	public function test_register_defaults() {

		delete_option( 'ever-blocks_date_installed' );

		$this->ever-blocks_install->register_defaults();

		$this->assertTrue( ! empty( get_option( 'ever-blocks_date_installed' ) ) );

	}
}
