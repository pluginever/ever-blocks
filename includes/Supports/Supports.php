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
		add_action( 'enqueue_block_editor_assets', array( $this, 'add_editor_data' ), 20 );
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
	 * Tells the editor bundle which supports are on.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function add_editor_data(): void {
		$active = array();

		foreach ( $this->enabled() as $support ) {
			$active[ $support->name() ] = true;
		}

		wp_add_inline_script(
			'ever-blocks-editor',
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
