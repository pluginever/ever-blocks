<?php
defined('ABSPATH') || exit();

/**
 * Load registration for our blocks.
 *
 * @since 1.6.0
 */
class EverBlocks_Register_Blocks {


	/**
	 * This plugin's instance.
	 *
	 * @var EverBlocks_Register_Blocks
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new EverBlocks_Register_Blocks();
		}
	}

	/**
	 * The Plugin slug.
	 *
	 * @var string $slug
	 */
	private $slug;

	/**
	 * The Constructor.
	 */
	public function __construct() {
		$this->slug = 'ever-blocks';

		add_action( 'init', array( $this, 'register_blocks' ), 99 );
		add_filter( 'block_categories', array( $this, 'register_category' ), 10, 2 );
	}

	/**
	 * Add actions to enqueue assets.
	 *
	 * @access public
	 */
	public function register_blocks() {

		// Return early if this function does not exist.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		// Shortcut for the slug.
		$slug = $this->slug;
		register_block_type(
			$slug . '/alert',
			array(
				'editor_script' => $slug . '-editor',
				'editor_style'  => $slug . '-editor',
				'style'         => $slug . '-frontend',
			)
		);

		//author block
		register_block_type(
			$slug . '/testimonial',
			array(
				'editor_script' => $slug . '-editor',
				'editor_style'  => $slug . '-editor',
				'style'         => $slug . '-frontend',
			)
		);

		//card block
		register_block_type(
			$slug . '/card',
			array(
				'editor_script' => $slug . '-editor',
				'editor_style'  => $slug . '-editor',
				'style'         => $slug . '-frontend',
			)
		);
		//card block
		register_block_type(
			$slug . '/team',
			array(
				'editor_script' => $slug . '-editor',
				'editor_style'  => $slug . '-editor',
				'style'         => $slug . '-frontend',
			)
		);
	}


	/**
	 * since 1.0.0
	 * @param $categories
	 * @param $post
	 *
	 * @return array
	 */
	public function register_category($categories, $post){
		if ( $post->post_type !== 'post' ) {
			return $categories;
		}

		return array_merge(
			$categories,
			array(
				array(
					'slug' => 'ever-blocks',
					'title' => __( 'Ever Blocks', 'ever-blocks' )
				),
			)
		);
	}
}

EverBlocks_Register_Blocks::register();
