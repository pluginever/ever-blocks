<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Pricing column block: one plan inside a pricing table, plus the checklist style its feature lists use.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class PricingColumn extends Block {

	/**
	 * Context key the column provides to the blocks inside it.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const CONTEXT = 'ever-blocks/pricingFeatured';

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'ever-blocks/pricing-column';

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		parent::register();

		add_action( 'init', array( $this, 'register_style' ) );
		add_filter( 'block_type_metadata_settings', array( $this, 'add_context' ), 10, 2 );
		add_filter( 'render_block_core/list-item', array( $this, 'name_excluded_feature' ), 10, 3 );
	}

	/**
	 * Builds the column: a group labelled by its first heading, with the badge and the inner blocks.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Rendered inner blocks.
	 * @param \WP_Block            $block      Block instance.
	 * @return string Block markup, or an empty string without inner blocks.
	 */
	public function render( array $attributes, string $content, \WP_Block $block ): string {
		if ( '' === trim( $content ) ) {
			return '';
		}

		$wrapper = array(
			'class' => 'eb-pricing-column' . ( empty( $attributes['featured'] ) ? '' : ' is-featured' ),
			'role'  => 'group',
		);

		$option = is_string( $attributes['option'] ?? null ) ? $attributes['option'] : '';
		$slugs  = array_column( array_filter( (array) ( $block->context['ever-blocks/pricingOptions'] ?? array() ), 'is_array' ), 'slug' );

		if ( '' !== $option && in_array( $option, $slugs, true ) ) {
			$wrapper['data-wp-context']      = (string) wp_json_encode( array( 'option' => $option ) );
			$wrapper['data-wp-bind--hidden'] = 'state.hidden';
		}

		$processor = new \WP_HTML_Tag_Processor( $content );

		while ( $processor->next_tag() ) {
			if ( ! in_array( $processor->get_tag(), array( 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ), true ) ) {
				continue;
			}

			$id = $processor->get_attribute( 'id' );

			if ( ! is_string( $id ) || '' === $id ) {
				$id = wp_unique_id( 'eb-plan-' );
				$processor->set_attribute( 'id', $id );
			}

			$wrapper['aria-labelledby'] = $id;
			$content                    = $processor->get_updated_html();
			break;
		}

		$badge = is_string( $attributes['badge'] ?? null ) ? trim( wp_kses_post( $attributes['badge'] ) ) : '';

		return sprintf(
			'<div %1$s>%2$s<div class="eb-pricing-column__content">%3$s</div></div>',
			get_block_wrapper_attributes( $wrapper ),
			'' === $badge ? '' : '<span class="eb-pricing-column__badge">' . $badge . '</span>',
			$content
		);
	}

	/**
	 * Registers the Excluded style for list items.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_style(): void {
		register_block_style(
			'core/list-item',
			array(
				'name'  => 'excluded',
				'label' => __( 'Excluded', 'ever-blocks' ),
			)
		);
	}

	/**
	 * Lets list items know when they render inside a pricing column.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $settings Block type settings.
	 * @param array<string, mixed> $metadata Block metadata.
	 * @return array<string, mixed> Block type settings.
	 */
	public function add_context( array $settings, array $metadata ): array {
		if ( 'core/list-item' === ( $metadata['name'] ?? '' ) ) {
			$settings['uses_context'][] = self::CONTEXT;
		}

		return $settings;
	}

	/**
	 * Prefixes an excluded feature with text screen readers hear, since the dash alone carries the meaning visually.
	 *
	 * @since 2.0.0
	 * @param string               $content  Rendered list item.
	 * @param array<string, mixed> $block    Parsed block.
	 * @param \WP_Block            $instance Block instance.
	 * @return string Rendered list item.
	 */
	public function name_excluded_feature( string $content, array $block, \WP_Block $instance ): string {
		if ( ! array_key_exists( self::CONTEXT, $instance->context ) ) {
			return $content;
		}

		$processor = new \WP_HTML_Tag_Processor( $content );

		if ( ! $processor->next_tag( array( 'tag_name' => 'li' ) ) || ! $processor->has_class( 'is-style-excluded' ) ) {
			return $content;
		}

		return (string) preg_replace(
			'/^(\s*<li\b[^>]*>)/',
			'$1<span class="screen-reader-text">' . esc_html__( 'Not included:', 'ever-blocks' ) . ' </span>',
			$content,
			1
		);
	}
}
