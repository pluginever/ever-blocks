<?php
defined('ABSPATH') || exit();

/**
 * Load general assets for our blocks.
 *
 * @since 1.0.0
 */
class EverBlocks_Block_Assets {


	/**
	 * This plugin's instance.
	 *
	 * @var EverBlocks_Block_Assets
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new EverBlocks_Block_Assets();
		}
	}

	/**
	 * The base URL path (without trailing slash).
	 *
	 * @var string $url
	 */
	private $url;

	/**
	 * The plugin version.
	 *
	 * @var string $slug
	 */
	private $slug;

	/**
	 * The Constructor.
	 */
	public function __construct() {
		$this->slug = 'ever-blocks';
		$this->url  = untrailingslashit( plugins_url( '/', dirname( __FILE__ ) ) );

		add_action( 'enqueue_block_assets', array( $this, 'block_assets' ) );
		add_action( 'init', array( $this, 'editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_scripts' ) );
		add_action( 'the_post', array( $this, 'frontend_scripts' ) );
	}

	/**
	 * Enqueue block assets for use within Gutenberg.
	 *
	 * @access public
	 */
	public function block_assets() {

		// Styles.
		wp_enqueue_style(
			$this->slug . '-frontend',
			$this->url . '/dist/blocks.style.build.css',
			array(),
			time()
		);

	}

	/**
	 * Enqueue block assets for use within Gutenberg.
	 *
	 * @access public
	 */
	public function editor_assets() {

		// Styles.
		wp_register_style(
			$this->slug . '-editor',
			$this->url . '/dist/blocks.editor.build.css',
			array(),
			time()
		);

		// Scripts.
		wp_register_script(
			$this->slug . '-editor',
			$this->url . '/dist/blocks.build.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-plugins', 'wp-components', 'wp-edit-post', 'wp-api', 'wp-rich-text', 'wp-editor' ),
			EVER_BLOCKS_VERSION,
			false
		);


	}

	/**
	 * Enqueue front-end assets for blocks.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	public function frontend_scripts() {


		// Define where the asset is loaded from.
		$dir = ever_blocks()->asset_source( 'js' );

		// Define where the vendor asset is loaded from.
		$vendors_dir = ever_blocks()->asset_source( 'js', 'vendors' );

	}


}

EverBlocks_Block_Assets::register();
