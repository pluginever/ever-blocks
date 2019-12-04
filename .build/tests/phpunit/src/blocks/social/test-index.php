<?php
/**
 * Test includes/admin/class-ever-blocks-url-generator.php
 *
 * @package ever-blocks
 */
class ever-blocks_Social_Index_Tests extends WP_UnitTestCase {

	private $thumbnail_id;

	public function setUp() {

		parent::setUp();

		include_once ever-blocks_PLUGIN_DIR . 'src/blocks/share/index.php';

		set_current_screen( 'edit-post' );

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

		if ( ! empty( $this->thumbnail_id ) ) {

			wp_delete_attachment( $this->thumbnail_id, true );

		}

	}

	/**
	 * Test the file actions are hooked properly
	 */
	public function test_file_actions() {

		$actions = [
			[ 'init', 'ever-blocks_register_share_block' ],
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
	 * Test the social block markup returns correctly
	 */
	public function test_ever-blocks_render_share_block() {

		$attributes = [
			'className' => 'test-class-name',
			'size'      => 'large',
			'hasColors' => true,
		];

		$this->assertEquals( '<div class="wp-block-ever-blocks-social test-class-name has-colors has-button-size-large" style=" "><ul></ul></div>', ever-blocks_render_share_block( $attributes ) );

	}

	/**
	 * Test the social block markup returns correctly with style mask enabled
	 */
	public function test_ever-blocks_render_share_block_style_mask() {

		$attributes = [
			'className' => 'test-class-name is-style-mask',
			'hasColors' => true,
		];

		$this->assertEquals( '<div class="wp-block-ever-blocks-social test-class-name is-style-mask has-colors" style=" "><ul></ul></div>', ever-blocks_render_share_block( $attributes ) );

	}

	/**
	 * Test the social block markup returns correctly when platforms are specified
	 */
	public function test_ever-blocks_render_share_block_platforms() {

		$attributes = [
			'twitter' => true,
		];

		$this->assertRegExp( '/<a href="http:\/\/twitter.com\/share\?text=&#038;url=" class="wp-block-button__link wp-block-ever-blocks-social__button wp-block-ever-blocks-social__button--twitter     " title="Share on Twitter" style="">/', ever-blocks_render_share_block( $attributes ) );

	}

	/**
	 * Test the social block markup returns correctly when platforms are specified
	 */
	public function test_ever-blocks_render_share_block_filter_twitter_share_url() {

		$attributes = [
			'twitter' => true,
		];

		add_filter(
			'ever-blocks_twitter_share_url',
			function( $share_url ) {
				return 'https://www.custom-share-url.com';
			}
		);

		$this->assertRegExp( '/<a href="https:\/\/www.custom-share-url.com" class="wp-block-button__link wp-block-ever-blocks-social__button wp-block-ever-blocks-social__button--twitter     " title="Share on Twitter" style="">/', ever-blocks_render_share_block( $attributes ) );

	}

	/**
	 * Test the social block markup when a thumbnail is set
	 */
	public function test_ever-blocks_render_share_block_with_thumbnail() {

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/social --><!-- /wp:ever-blocks/social -->',
				'post_title'   => 'ever-blocks Social',
				'post_status'  => 'publish',
			]
		);

		$this->thumbnail_id = media_sideload_image( 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=2&h=750&w=1260', $post_id, 'Test cat image.', 'id' );

		update_post_meta( $post_id, '_thumbnail_id', $this->thumbnail_id );

		global $post;

		$post = get_post( $post_id );

		$attributes = [
			'pinterest' => true,
		];

		$this->assertRegExp( '/<a href="https:\/\/pinterest.com\/pin\/create\/button\/\?&#038;url=http:\/\/example.org\/\?p=' . $post_id . '&#038;description=ever-blocks%20Social&#038;media=http:\/\/example.org\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[a-zA-Z0-9-]+.jpeg" class="wp-block-button__link wp-block-ever-blocks-social__button wp-block-ever-blocks-social__button--pinterest     " title="Share on Pinterest" style="">/', ever-blocks_render_share_block( $attributes ) );

	}

	/**
	 * Test the share block is registered
	 *
	 * @expectedIncorrectUsage WP_Block_Type_Registry::register
	 */
	public function test_ever-blocks_register_share_block() {

		ever-blocks_register_share_block();

		$expected_registered_blocks = [
			'ever-blocks/social',
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
