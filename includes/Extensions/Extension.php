<?php

namespace EverBlocks\Extensions;

defined( 'ABSPATH' ) || exit;

/**
 * Base class for a control that applies across many blocks.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
abstract class Extension {

	/**
	 * Extension slug, shared by the option, the handle and the editor module.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected string $name = '';

	/**
	 * Attribute this extension reads from a block.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected string $attribute = '';

	/**
	 * Block names this extension never applies to.
	 *
	 * @since 2.0.0
	 * @var array<int, string>
	 */
	protected array $exclude = array();

	/**
	 * Whether a block on this page used the extension.
	 *
	 * @since 2.0.0
	 * @var bool
	 */
	private bool $needed = false;

	/**
	 * Applies the extension to a block's outermost tag.
	 *
	 * @since 2.0.0
	 * @param \WP_HTML_Tag_Processor $processor Positioned on the outermost tag.
	 * @param mixed                  $value     The block's value for this extension.
	 * @param array<string, mixed>   $block     Parsed block.
	 * @return void
	 */
	abstract protected function apply( \WP_HTML_Tag_Processor $processor, $value, array $block ): void;

	/**
	 * Returns the extension slug.
	 *
	 * @since 2.0.0
	 * @return string Extension slug.
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
		add_action( 'wp_footer', array( $this, 'enqueue' ) );
	}

	/**
	 * Applies the extension to a rendered block.
	 *
	 * Guards run cheapest first: the attribute lookup rejects almost every block
	 * on the page before any support or exclusion check runs.
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

		$this->needed = true;

		return $processor->get_updated_html();
	}

	/**
	 * Enqueues the extension's frontend assets, only when a block used it.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function enqueue(): void {
		if ( $this->needed ) {
			$this->assets();
		}
	}

	/**
	 * Enqueues frontend assets. Most extensions need none.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	protected function assets(): void {}

	/**
	 * Determines whether the extension applies to a block.
	 *
	 * Scope rides core's own `customClassName` support rather than a maintained
	 * allow-list, so a block opts out by declaring `supports.customClassName:
	 * false` and no list has to be kept in step across two languages.
	 *
	 * @since 2.0.0
	 * @param string $block_name Registered block name.
	 * @return bool True when the extension applies.
	 */
	protected function supports( string $block_name ): bool {
		if ( '' === $block_name || in_array( $block_name, $this->exclude, true ) ) {
			return false;
		}

		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );

		return $block_type instanceof \WP_Block_Type
			&& block_has_support( $block_type, 'customClassName', true );
	}
}
