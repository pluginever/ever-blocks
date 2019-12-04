<?php
/**
 * Test includes/src/blocks/posts/test-index.php
 *
 * @package ever-blocks
 */
class ever-blocks_Posts_Index_Tests extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();

		include_once ever-blocks_PLUGIN_DIR . 'src/blocks/posts/index.php';

		set_current_screen( 'edit-post' );
	}

	public function tearDown() {
		parent::tearDown();

		unset( $GLOBALS['current_screen'] );
	}

	/**
	 * Test the file actions are hooked properly
	 */
	public function test_file_actions() {
		$actions = [
			[ 'init', 'ever-blocks_register_posts_block' ],
		];

		foreach ( $actions as $action_data ) {
			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], $action_data[1] ) ) {
				$this->fail( "$action_data[0] is not attached to $action_data[1]." );
			}
		}

		$this->assertTrue( true );
	}

	/**
	 * Test the posts block markup returns correctly
	 */
	public function test_ever-blocks_render_posts_block() {
		$attributes = [
			'className' => 'test-class-name',
			'postsToShow' => 4,
			'order' => 'date',
			'orderBy' => 'desc',
			'postFeedType' => 'internal',
		];

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '',
				'post_title'   => 'ever-blocks Posts Block',
				'post_status'  => 'publish',
			]
		);

		global $post;
		$post = get_post( $post_id );

		$this->assertEquals( '<div class="wp-block-ever-blocks-posts test-class-name"><div class="list-none ml-0 pl-0 pt-3"></div></div>', ever-blocks_render_posts_block( $attributes ) );
	}

	/**
	 * Test the posts block is registered
	 *
	 * @expectedIncorrectUsage WP_Block_Type_Registry::register
	 */
	public function test_ever-blocks_register_posts_block() {
		ever-blocks_register_posts_block();

		$expected_registered_blocks = [
			'ever-blocks/posts',
		];

		$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

		foreach ( $expected_registered_blocks as $ever-blocks_block ) {

			if ( ! array_key_exists( $ever-blocks_block, $registered_blocks ) ) {
				$this->fail( "$ever-blocks_block is not registered." );
			}
		}

		$this->assertTrue( true );
	}
}
