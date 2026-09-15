<?php

namespace EverBlocks\Supports;

defined( 'ABSPATH' ) || exit;

/**
 * Base class for a control that applies across many blocks.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
abstract class Support {

	/**
	 * Support slug, shared by the option and the editor module.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected string $name = '';

	/**
	 * Attribute this support reads from a block.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected string $attribute = '';

	/**
	 * Applies the support to a block's outermost tag.
	 *
	 * @since 2.0.0
	 * @param \WP_HTML_Tag_Processor $processor Positioned on the outermost tag.
	 * @param mixed                  $value     The block's value for this support.
	 * @param array<string, mixed>   $block     Parsed block.
	 * @return void
	 */
	abstract protected function apply( \WP_HTML_Tag_Processor $processor, $value, array $block ): void;

	/**
	 * Returns the support slug.
	 *
	 * @since 2.0.0
	 * @return string Support slug.
	 */
	public function name(): string {
		return $this->name;
	}

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_filter( 'render_block', array( $this, 'render' ), 20, 2 );
	}

	/**
	 * Applies the support to a rendered block.
	 *
	 * @since 2.0.0
	 * @param string               $content Rendered block content.
	 * @param array<string, mixed> $block   Parsed block.
	 * @return string Rendered block content.
	 */
	public function render( string $content, array $block ): string {
		$value = $block['attrs'][ $this->attribute ] ?? null;

		if ( null === $value || '' === $value || '' === trim( $content ) ) {
			return $content;
		}

		if ( ! $this->supports( (string) ( $block['blockName'] ?? '' ) ) ) {
			return $content;
		}

		$processor = new \WP_HTML_Tag_Processor( $content );

		if ( ! $processor->next_tag() ) {
			return $content;
		}

		$this->apply( $processor, $value, $block );

		return $processor->get_updated_html();
	}

	/**
	 * Determines whether the support applies to a block, riding core's
	 * `customClassName` support so a block opts out in its own `block.json`.
	 *
	 * @since 2.0.0
	 * @param string $block_name Registered block name.
	 * @return bool True when the support applies.
	 */
	protected function supports( string $block_name ): bool {
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );

		return $block_type instanceof \WP_Block_Type
			&& block_has_support( $block_type, 'customClassName', true );
	}
}
