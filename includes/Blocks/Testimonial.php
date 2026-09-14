<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Testimonial block.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Testimonial extends Block {

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'ever-blocks/testimonial';

	/**
	 * Builds the block's markup: a figure holding the quote and its attribution.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string Block markup, or an empty string without a quote.
	 */
	public function render( array $attributes ): string {
		$quote = $this->text( $attributes['quote'] ?? '' );

		if ( '' === trim( wp_strip_all_tags( $quote ) ) ) {
			return '';
		}

		$layouts = array( 'stacked', 'side', 'centered' );
		$layout  = in_array( $attributes['layout'] ?? '', $layouts, true ) ? $attributes['layout'] : 'stacked';
		$person  = $this->text( $attributes['name'] ?? '' );
		$role    = $this->text( $attributes['role'] ?? '' );
		$rating  = (float) min( 5, max( 0, (float) ( $attributes['rating'] ?? 5 ) ) );
		$avatar  = $this->image( $attributes['avatarUrl'] ?? '', $attributes['avatarAlt'] ?? '', 'eb-testimonial__avatar' );
		$logo    = empty( $attributes['showLogo'] ) ? '' : $this->image( $attributes['logoUrl'] ?? '', $attributes['logoAlt'] ?? '', 'eb-testimonial__logo' );
		$stars   = empty( $attributes['showRating'] ) ? '' : '<div class="eb-testimonial__rating eb-rating">' . Rating::icons( $rating ) . '</div>';
		$who     = '';

		if ( '' !== $person ) {
			$who .= '<span class="eb-testimonial__name">' . $person . '</span>';
		}

		if ( '' !== $role ) {
			$who .= '<span class="eb-testimonial__role">' . $role . '</span>';
		}

		$author = '';

		if ( '' !== $avatar || '' !== $who || '' !== $logo ) {
			$author = sprintf(
				'<figcaption class="eb-testimonial__author">%1$s%2$s%3$s</figcaption>',
				$avatar,
				'' === $who ? '' : '<span class="eb-testimonial__who">' . $who . '</span>',
				$logo
			);
		}

		$wrapper = get_block_wrapper_attributes( array( 'class' => 'eb-testimonial eb-testimonial--' . $layout ) );

		return sprintf(
			'<figure %1$s>%2$s%3$s<blockquote class="eb-testimonial__quote">%4$s</blockquote>%5$s</figure>%6$s',
			$wrapper,
			empty( $attributes['quoteMark'] ) ? '' : '<span class="eb-testimonial__mark" aria-hidden="true">&ldquo;</span>',
			$stars,
			$quote,
			$author,
			$this->schema( $attributes, $quote, $person, $rating )
		);
	}

	/**
	 * Returns a Review JSON-LD script when the block asks for one and names what it reviews.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $quote      Quote markup.
	 * @param string               $person     Author name markup.
	 * @param float                $rating     Score out of five.
	 * @return string Script tag, or an empty string.
	 */
	private function schema( array $attributes, string $quote, string $person, float $rating ): string {
		$item = is_string( $attributes['itemReviewed'] ?? null ) ? trim( $attributes['itemReviewed'] ) : '';

		if ( empty( $attributes['schema'] ) || '' === $item ) {
			return '';
		}

		$review = array(
			'@context'     => 'https://schema.org',
			'@type'        => 'Review',
			'itemReviewed' => array(
				'@type' => 'Thing',
				'name'  => $item,
			),
			'reviewBody'   => trim( wp_strip_all_tags( $quote ) ),
		);

		if ( '' !== $person ) {
			$review['author'] = array(
				'@type' => 'Person',
				'name'  => trim( wp_strip_all_tags( $person ) ),
			);
		}

		if ( ! empty( $attributes['showRating'] ) ) {
			$review['reviewRating'] = array(
				'@type'       => 'Rating',
				'ratingValue' => $rating,
				'bestRating'  => 5,
			);
		}

		return wp_get_inline_script_tag(
			(string) wp_json_encode( $review, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ),
			array( 'type' => 'application/ld+json' )
		);
	}

	/**
	 * Returns a rich-text attribute as safe inline markup.
	 *
	 * @since 2.0.0
	 * @param mixed $value Attribute value.
	 * @return string Filtered markup.
	 */
	private function text( $value ): string {
		return is_string( $value ) ? wp_kses_post( $value ) : '';
	}

	/**
	 * Returns an image tag for a URL, or nothing without one.
	 *
	 * @since 2.0.0
	 * @param mixed  $url        Image URL.
	 * @param mixed  $alt        Alternative text.
	 * @param string $class_name Class of the image.
	 * @return string Image markup, or an empty string.
	 */
	private function image( $url, $alt, string $class_name ): string {
		if ( ! is_string( $url ) || '' === $url ) {
			return '';
		}

		return sprintf(
			'<img class="%1$s" src="%2$s" alt="%3$s" loading="lazy" decoding="async">',
			esc_attr( $class_name ),
			esc_url( $url ),
			esc_attr( is_string( $alt ) ? $alt : '' )
		);
	}
}
