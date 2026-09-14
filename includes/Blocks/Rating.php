<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Rating block.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Rating extends Block {

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'ever-blocks/rating';


	/**
	 * Builds the block's markup: an empty row of icons with a filled row clipped over it.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string Block markup.
	 */
	public function markup( array $attributes ): string {
		$max   = min( 10, max( 1, (int) ( $attributes['max'] ?? 5 ) ) );
		$value = (float) min( $max, max( 0, (float) ( $attributes['value'] ?? $max ) ) );
		$icon  = is_string( $attributes['icon'] ?? null ) ? (string) wp_get_icon( $attributes['icon'], array( 'size' => null ) ) : '';
		$icon  = '' === $icon ? (string) wp_get_icon( 'core/star-filled', array( 'size' => null ) ) : $icon;
		$row   = str_repeat( $icon, $max );
		$text  = sprintf(
			/* translators: 1: rating value, 2: maximum rating. */
			__( '%1$s / %2$s', 'ever-blocks' ),
			number_format_i18n( $value, floor( $value ) === $value ? 0 : 1 ),
			number_format_i18n( $max )
		);
		$label = sprintf(
			/* translators: 1: rating value, 2: maximum rating. */
			__( 'Rated %1$s out of %2$s', 'ever-blocks' ),
			number_format_i18n( $value, floor( $value ) === $value ? 0 : 1 ),
			number_format_i18n( $max )
		);

		return sprintf(
			'<div %1$s><span class="eb-rating__icons" role="img" aria-label="%2$s"><span class="eb-rating__empty" aria-hidden="true">%3$s</span><span class="eb-rating__filled" aria-hidden="true" style="width:%4$s%%">%3$s</span></span>%5$s</div>',
			get_block_wrapper_attributes( array( 'class' => 'eb-rating' ) ),
			esc_attr( $label ),
			$row,
			esc_attr( rtrim( rtrim( number_format( $value / $max * 100, 2, '.', '' ), '0' ), '.' ) ),
			empty( $attributes['showLabel'] ) ? '' : '<span class="eb-rating__label" aria-hidden="true">' . esc_html( $text ) . '</span>'
		);
	}
}
