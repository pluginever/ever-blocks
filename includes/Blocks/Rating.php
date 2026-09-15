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
	 * Builds the block's markup: the icon rows and the optional text label.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string Block markup.
	 */
	public function render( array $attributes ): string {
		$max   = min( 10, max( 1, (int) ( $attributes['max'] ?? 5 ) ) );
		$value = (float) min( $max, max( 0, (float) ( $attributes['value'] ?? $max ) ) );
		$text  = sprintf(
			/* translators: 1: rating value, 2: maximum rating. */
			__( '%1$s / %2$s', 'ever-blocks' ),
			number_format_i18n( $value, floor( $value ) === $value ? 0 : 1 ),
			number_format_i18n( $max )
		);

		return sprintf(
			'<div %1$s>%2$s%3$s</div>',
			get_block_wrapper_attributes( array( 'class' => 'eb-rating' ) ),
			self::icons( $value, $max, $attributes['icon'] ?? null ),
			empty( $attributes['showLabel'] ) ? '' : '<span class="eb-rating__label" aria-hidden="true">' . esc_html( $text ) . '</span>'
		);
	}

	/**
	 * Draws a score as an empty icon row with a filled row clipped over it.
	 *
	 * @since 2.0.0
	 * @param float $value Score.
	 * @param int   $max   Highest score.
	 * @param mixed $icon  Registered icon name, or null for the default star.
	 * @return string Labelled icon rows.
	 */
	public static function icons( float $value, int $max = 5, $icon = null ): string {
		$max   = min( 10, max( 1, $max ) );
		$value = (float) min( $max, max( 0, $value ) );
		$svg   = is_string( $icon ) && '' !== $icon ? (string) wp_get_icon( $icon, array( 'size' => null ) ) : '';
		$svg   = '' === $svg ? (string) wp_get_icon( 'heroicons/star', array( 'size' => null ) ) : $svg;
		$row   = str_repeat( $svg, $max );
		$label = sprintf(
			/* translators: 1: rating value, 2: maximum rating. */
			__( 'Rated %1$s out of %2$s', 'ever-blocks' ),
			number_format_i18n( $value, floor( $value ) === $value ? 0 : 1 ),
			number_format_i18n( $max )
		);

		return sprintf(
			'<span class="eb-rating__icons" role="img" aria-label="%1$s"><span class="eb-rating__empty" aria-hidden="true">%2$s</span><span class="eb-rating__filled" aria-hidden="true" style="width:%3$s%%">%2$s</span></span>',
			esc_attr( $label ),
			$row,
			esc_attr( rtrim( rtrim( number_format( $value / $max * 100, 2, '.', '' ), '0' ), '.' ) )
		);
	}
}
