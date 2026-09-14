<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * FAQ: a core accordion that emits FAQPage schema for its questions and answers.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Faq extends Block {

	/**
	 * Attribute on the accordion that turns the schema on.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const ATTRIBUTE = 'everBlocksSchema';

	/**
	 * Context key the accordion provides to its items.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const CONTEXT = 'ever-blocks/schema';

	/**
	 * Tags Google accepts inside an answer.
	 *
	 * @since 2.0.0
	 * @var array<string, array<string, bool>>
	 */
	private const ANSWER_TAGS = array(
		'h1'     => array(),
		'h2'     => array(),
		'h3'     => array(),
		'h4'     => array(),
		'h5'     => array(),
		'h6'     => array(),
		'br'     => array(),
		'ol'     => array(),
		'ul'     => array(),
		'li'     => array(),
		'a'      => array( 'href' => true ),
		'p'      => array(),
		'div'    => array(),
		'b'      => array(),
		'strong' => array(),
		'i'      => array(),
		'em'     => array(),
	);

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'core/accordion';

	/**
	 * Questions collected this request, in render order.
	 *
	 * @since 2.0.0
	 * @var array<int, array{name: string, text: string}>
	 */
	private array $questions = array();

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		parent::register();

		add_action( 'init', array( $this, 'register_style' ) );
		add_filter( 'block_type_metadata_settings', array( $this, 'add_attribute' ), 10, 2 );
		add_filter( 'render_block_core/accordion-heading', array( $this, 'collect_question' ), 10, 3 );
		add_filter( 'render_block_core/accordion-panel', array( $this, 'collect_answer' ), 10, 3 );
		add_action( 'wp_footer', array( $this, 'print_schema' ) );
	}

	/**
	 * Registers the Divided style and the stylesheet that draws it.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_style(): void {
		$path = EVER_BLOCKS_DIR . 'build/style-accordion.css';

		if ( ! is_readable( $path ) ) {
			return;
		}

		register_block_style(
			$this->name,
			array(
				'name'  => 'divided',
				'label' => __( 'Divided', 'ever-blocks' ),
			)
		);

		wp_enqueue_block_style(
			$this->name,
			array(
				'handle' => 'ever-blocks-accordion',
				'src'    => EVER_BLOCKS_URL . 'build/style-accordion.css',
				'deps'   => array( 'ever-blocks-common' ),
				'ver'    => (string) filemtime( $path ),
				'path'   => $path,
			)
		);
	}

	/**
	 * Adds the schema attribute to the accordion and hands it to the heading and panel as context.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $settings Block type settings.
	 * @param array<string, mixed> $metadata Block metadata.
	 * @return array<string, mixed> Block type settings.
	 */
	public function add_attribute( array $settings, array $metadata ): array {
		$name = $metadata['name'] ?? '';

		if ( $name === $this->name ) {
			$settings['attributes'][ self::ATTRIBUTE ]     = array(
				'type'    => 'boolean',
				'default' => false,
			);
			$settings['provides_context'][ self::CONTEXT ] = self::ATTRIBUTE;
		}

		if ( in_array( $name, array( 'core/accordion-heading', 'core/accordion-panel' ), true ) ) {
			$settings['uses_context'][] = self::CONTEXT;
		}

		return $settings;
	}

	/**
	 * Records a heading's text when its accordion emits schema.
	 *
	 * @since 2.0.0
	 * @param string               $content  Rendered heading.
	 * @param array<string, mixed> $block    Parsed block.
	 * @param \WP_Block            $instance Block instance.
	 * @return string Rendered heading.
	 */
	public function collect_question( string $content, array $block, \WP_Block $instance ): string {
		if ( ! empty( $instance->context[ self::CONTEXT ] ) ) {
			$this->questions[] = array(
				'name' => trim( wp_strip_all_tags( $this->inner_html( $content, 'wp-block-accordion-heading__toggle-title' ) ) ),
				'text' => '',
			);
		}

		return $content;
	}

	/**
	 * Records a panel's content as the answer to the last question.
	 *
	 * @since 2.0.0
	 * @param string               $content  Rendered panel.
	 * @param array<string, mixed> $block    Parsed block.
	 * @param \WP_Block            $instance Block instance.
	 * @return string Rendered panel.
	 */
	public function collect_answer( string $content, array $block, \WP_Block $instance ): string {
		$last = array_key_last( $this->questions );

		if ( null !== $last && ! empty( $instance->context[ self::CONTEXT ] ) && '' === $this->questions[ $last ]['text'] ) {
			$this->questions[ $last ]['text'] = trim( wp_kses( $this->inner_html( $content, 'wp-block-accordion-panel' ), self::ANSWER_TAGS ) );
		}

		return $content;
	}

	/**
	 * Prints one FAQPage graph for every question rendered on the page.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function print_schema(): void {
		$entities  = array();
		$questions = $this->questions;

		$this->questions = array();

		foreach ( $questions as $question ) {
			if ( '' === $question['name'] || '' === $question['text'] ) {
				continue;
			}

			$entities[] = array(
				'@type'          => 'Question',
				'name'           => $question['name'],
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => $question['text'],
				),
			);
		}

		/**
		 * Filters the FAQPage entities printed for the page.
		 *
		 * @since 2.0.0
		 * @param array<int, array<string, mixed>> $entities Question entities, in render order.
		 */
		$entities = apply_filters( 'ever_blocks_faq_schema', $entities );

		if ( empty( $entities ) ) {
			return;
		}

		wp_print_inline_script_tag(
			(string) wp_json_encode(
				array(
					'@context'   => 'https://schema.org',
					'@type'      => 'FAQPage',
					'mainEntity' => $entities,
				),
				JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
			),
			array( 'type' => 'application/ld+json' )
		);
	}

	/**
	 * Returns the markup inside the first element carrying a class.
	 *
	 * @since 2.0.0
	 * @param string $html       Rendered markup.
	 * @param string $class_name Class of the element to read.
	 * @return string Inner markup, or an empty string when the element is absent.
	 */
	private function inner_html( string $html, string $class_name ): string {
		$processor = \WP_HTML_Processor::create_fragment( $html );

		if ( null === $processor || ! $processor->next_tag( array( 'class_name' => $class_name ) ) ) {
			return '';
		}

		$depth = $processor->get_current_depth();
		$inner = '';

		while ( $processor->next_token() ) {
			if ( $processor->get_current_depth() < $depth && $processor->is_tag_closer() ) {
				break;
			}

			$inner .= $processor->serialize_token();
		}

		return $inner;
	}
}
