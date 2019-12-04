<?php
/**
 * Test includes/class-ever-blocks-body-classes.php
 *
 * @package ever-blocks
 */
class ever-blocks_Body_Classes_Tests extends WP_UnitTestCase {

	private $ever-blocks_body_classes;

	public function setUp() {

		parent::setUp();

		$this->ever-blocks_body_classes = new ever-blocks_Body_Classes();

		set_current_screen( 'dashboard' );

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

	}

	/**
	 * Test the constructor actions
	 */
	public function test_construct() {

		$actions = [
			[ 'body_class', 'body_class' ],
			[ 'admin_body_class', 'admin_body_class' ],
		];

		foreach ( $actions as $action_data ) {

			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], [ $this->ever-blocks_body_classes, $action_data[1] ] ) ) {

				$this->fail( "$action_data[0] is not attached to ever-blocks:$action_data[1]. It might also have the wrong priority (validated priority: $priority)" );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the active theme is correct
	 */
	public function test_is_active_theme() {

		$this->assertTrue( $this->ever-blocks_body_classes->is_active_theme( 'default' ) );

	}

	/**
	 * Test the themes array returns as expected
	 */
	public function test_themes() {

		$expected = [
			'twentytwenty',
			'twentynineteen',
			'twentyseventeen',
			'twentysixteen',
			'twentyfifteen',
			'twentyfourteen',
			'twentythirteen',
			'twentyeleven',
			'twentytwelve',
		];

		$this->assertEquals( $expected, $this->ever-blocks_body_classes->themes() );

	}

	/**
	 * Test the themes array returns as expected
	 */
	public function test_filtered_themes() {

		$expected = [
			'twentytwenty',
			'twentynineteen',
			'twentyseventeen',
			'twentysixteen',
			'twentyfifteen',
			'twentyfourteen',
			'twentythirteen',
			'twentyeleven',
			'twentytwelve',
			'test',
		];

		add_filter(
			'ever-blocks_theme_body_classes',
			function( $themes ) {
				$themes[] = 'test';
				return $themes;
			}
		);

		$this->assertEquals( $expected, $this->ever-blocks_body_classes->themes() );

	}

	/**
	 * Test the theme slug returns as expected
	 */
	public function test_theme_slug() {

		add_filter(
			'template',
			function( $theme ) {
				return 'twentynineteen';
			}
		);

		$this->assertEquals( 'twentynineteen', $this->ever-blocks_body_classes->theme_slug() );

	}

	/**
	 * Test the body class matches the theme
	 */
	public function test_body_class() {

		add_filter(
			'template',
			function( $theme ) {
				return 'twentynineteen';
			}
		);

		$this->assertEquals( $this->ever-blocks_body_classes->body_class( [ 'existing' ] ), [ 'existing', 'is-twentynineteen' ] );

	}

	/**
	 * Test the admin body class returns properly when not in the dashboard
	 */
	public function test_non_admin_body_class() {

		$this->assertEquals( $this->ever-blocks_body_classes->admin_body_class( [ 'existing' ] ), [ 'existing' ] );

	}

	/**
	 * Test the admin body class returns properly when in the dashboard
	 */
	public function test_admin_body_class() {

		global $pagenow;

		$pagenow = 'post.php';

		add_filter(
			'template',
			function( $theme ) {
				return 'twentynineteen';
			}
		);

		$this->assertEquals( $this->ever-blocks_body_classes->admin_body_class( 'existing' ), 'existing is-twentynineteen' );

	}
}
