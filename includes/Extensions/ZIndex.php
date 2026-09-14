<?php

namespace EverBlocks\Extensions;

defined( 'ABSPATH' ) || exit;

/**
 * Stacking order control.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class ZIndex extends Extension {

	/**
	 * Extension slug.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected string $name = 'z-index';

	/**
	 * Attribute this extension reads from a block.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected string $attribute = 'everBlocksZIndex';

	/**
	 * Applies the stacking order to a block's outermost tag.
	 *
	 * @since 2.0.0
	 * @param \WP_HTML_Tag_Processor $processor Positioned on the outermost tag.
	 * @param mixed                  $value     Requested stacking order.
	 * @param array<string, mixed>   $block     Parsed block.
	 * @return void
	 */
	protected function apply( \WP_HTML_Tag_Processor $processor, $value, array $block ): void {
		if ( ! is_numeric( $value ) ) {
			return;
		}

		$style = $processor->get_attribute( 'style' );
		$style = is_string( $style ) ? rtrim( trim( $style ), ';' ) : '';
		$style = '' === $style ? '' : $style . ';';

		$processor->set_attribute( 'style', $style . 'z-index:' . (int) $value . ';' );
		$processor->add_class( 'eb-has-z-index' );
	}
}
