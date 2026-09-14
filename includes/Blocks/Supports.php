<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Shared block support presets.
 *
 * A block names a preset in its `block.json` under `supports.everBlocks.preset`
 * instead of repeating the same forty lines. `block_type_metadata_settings` runs
 * before registration and the editor reads the registered type, so both halves
 * see the result — the block's own `supports` still wins where it declares one.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Supports {

	/**
	 * Support sets a block can name.
	 *
	 * @since 2.0.0
	 * @var array<string, array<string, mixed>>
	 */
	private const PRESETS = array(
		'layout'  => array(
			'align'                => array( 'wide', 'full' ),
			'anchor'               => true,
			'color'                => array(
				'background' => true,
				'text'       => true,
				'gradients'  => true,
			),
			'spacing'              => array(
				'padding' => true,
				'margin'  => true,
			),
			'typography'           => array(
				'fontSize'   => true,
				'lineHeight' => true,
			),
			'shadow'               => true,
			'dimensions'           => array( 'minHeight' => true ),
			'__experimentalBorder' => array(
				'color'  => true,
				'radius' => true,
				'style'  => true,
				'width'  => true,
			),
		),
		'content' => array(
			'anchor'               => true,
			'color'                => array(
				'background' => true,
				'text'       => true,
				'link'       => true,
			),
			'spacing'              => array(
				'padding' => true,
				'margin'  => true,
			),
			'typography'           => array(
				'fontSize'   => true,
				'lineHeight' => true,
				'textAlign'  => true,
			),
			'__experimentalBorder' => array(
				'color'  => true,
				'radius' => true,
				'style'  => true,
				'width'  => true,
			),
		),
		'child'   => array(
			'spacing'    => array( 'padding' => true ),
			'typography' => array( 'fontSize' => true ),
		),
		'icon'    => array(
			'anchor'               => true,
			'align'                => array( 'left', 'center', 'right' ),
			'html'                 => false,
			'ariaLabel'            => array( '__experimentalSkipSerialization' => true ),
			'color'                => array(
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls'   => array(
					'background' => true,
					'text'       => true,
				),
			),
			'spacing'              => array(
				'padding'                         => true,
				'margin'                          => true,
				'__experimentalSkipSerialization' => array( 'padding' ),
			),
			'dimensions'           => array(
				'width'                           => true,
				'__experimentalSkipSerialization' => array( 'width' ),
				'__experimentalDefaultControls'   => array( 'width' => true ),
			),
			'__experimentalBorder' => array(
				'color'                           => true,
				'radius'                          => true,
				'style'                           => true,
				'width'                           => true,
				'__experimentalSkipSerialization' => true,
			),
		),
	);

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_filter( 'block_type_metadata_settings', array( $this, 'apply_preset' ), 10, 2 );
	}

	/**
	 * Merges a named preset under the block's own supports.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $settings Settings determined from the metadata.
	 * @param array<string, mixed> $metadata Metadata read from block.json.
	 * @return array<string, mixed> Settings.
	 */
	public function apply_preset( array $settings, array $metadata ): array {
		$preset = $metadata['supports']['everBlocks']['preset'] ?? null;

		if ( ! is_string( $preset ) || ! isset( self::PRESETS[ $preset ] ) ) {
			return $settings;
		}

		$supports = isset( $settings['supports'] ) && is_array( $settings['supports'] )
			? $settings['supports']
			: array();

		$settings['supports'] = array_merge( self::PRESETS[ $preset ], $supports );

		return $settings;
	}
}
