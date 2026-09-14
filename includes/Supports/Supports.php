<?php

namespace EverBlocks\Supports;

defined( 'ABSPATH' ) || exit;

/**
 * Registration of the plugin's block supports.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Supports {

	/**
	 * Editor bundle handle.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	private const HANDLE = 'ever-blocks-editor';

	/**
	 * Available supports.
	 *
	 * @since 2.0.0
	 * @var array<int, class-string<Support>>
	 */
	private array $supports = array(
		ZIndex::class,
	);

	/**
	 * Supports the site has enabled, once resolved.
	 *
	 * @since 2.0.0
	 * @var array<int, Support>|null
	 */
	private ?array $enabled = null;

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', array( $this, 'register_supports' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
	}

	/**
	 * Boots every enabled support.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_supports(): void {
		foreach ( $this->enabled() as $support ) {
			$support->register();
		}
	}

	/**
	 * Enqueues the editor half and tells it which supports are on.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function enqueue_editor_assets(): void {
		$asset = EVER_BLOCKS_DIR . 'build/editor.asset.php';

		if ( ! is_readable( $asset ) ) {
			return;
		}

		$meta = require $asset;

		wp_enqueue_script(
			self::HANDLE,
			EVER_BLOCKS_URL . 'build/editor.js',
			$meta['dependencies'] ?? array(),
			$meta['version'] ?? EVER_BLOCKS_VERSION,
			true
		);

		wp_set_script_translations( self::HANDLE, 'ever-blocks', EVER_BLOCKS_DIR . 'languages' );

		$active = array();

		foreach ( $this->enabled() as $support ) {
			$active[ $support->name() ] = true;
		}

		wp_add_inline_script(
			self::HANDLE,
			'window.everBlocksSupports = ' . wp_json_encode( $active ) . ';',
			'before'
		);
	}

	/**
	 * Returns the supports the site has enabled.
	 *
	 * @since 2.0.0
	 * @return array<int, Support> Enabled supports.
	 */
	private function enabled(): array {
		if ( null !== $this->enabled ) {
			return $this->enabled;
		}

		$disabled      = (array) get_option( 'ever_blocks_disabled_supports', array() );
		$this->enabled = array();

		foreach ( $this->supports as $class ) {
			$support = ever_blocks()->get( $class );

			if ( ! $support instanceof Support || in_array( $support->name(), $disabled, true ) ) {
				continue;
			}

			/**
			 * Filters whether a block support is enabled.
			 *
			 * @since 2.0.0
			 * @param bool   $enabled Whether the support is enabled.
			 * @param string $name    Support slug.
			 */
			if ( apply_filters( 'ever_blocks_is_support_enabled', true, $support->name() ) ) {
				$this->enabled[] = $support;
			}
		}

		return $this->enabled;
	}
}
