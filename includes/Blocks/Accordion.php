<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Accordion block.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Accordion extends Block {

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'ever-blocks/accordion';

	/**
	 * Groups the items for exclusive opening and appends the FAQ schema.
	 *
	 * @since 2.0.0
	 * @param string               $content    Rendered block content.
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param array<string, mixed> $block      Parsed block.
	 * @return string Rendered block content.
	 */
	protected function content( string $content, array $attributes, array $block ): string {
		if ( empty( $attributes['allowMultiple'] ) ) {
			$content = $this->group_items( $content );
		}

		if ( ! empty( $attributes['schema'] ) ) {
			$content .= $this->schema( $block['innerBlocks'] ?? array() );
		}

		return $content;
	}

	/**
	 * Gives every item one shared name, so opening one closes the others natively.
	 *
	 * @since 2.0.0
	 * @param string $content Rendered block content.
	 * @return string Rendered block content.
	 */
	private function group_items( string $content ): string {
		$group     = wp_unique_id( 'eb-accordion-' );
		$processor = new \WP_HTML_Tag_Processor( $content );

		while ( $processor->next_tag(
			array(
				'tag_name'   => 'details',
				'class_name' => 'eb-accordion-item',
			)
		) ) {
			$processor->set_attribute( 'name', $group );
		}

		return $processor->get_updated_html();
	}

	/**
	 * Builds the FAQPage JSON-LD from the items' titles and rendered answers.
	 *
	 * @since 2.0.0
	 * @param array<int, array<string, mixed>> $items Parsed inner blocks.
	 * @return string Script tag, or an empty string when no item qualifies.
	 */
	private function schema( array $items ): string {
		$entities = array();

		foreach ( $items as $item ) {
			$question = wp_strip_all_tags( (string) ( $item['attrs']['title'] ?? '' ) );
			$answer   = trim( wp_strip_all_tags( implode( '', array_map( 'render_block', $item['innerBlocks'] ?? array() ) ) ) );

			if ( '' === $question || '' === $answer ) {
				continue;
			}

			$entities[] = array(
				'@type'          => 'Question',
				'name'           => $question,
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => $answer,
				),
			);
		}

		if ( ! $entities ) {
			return '';
		}

		return sprintf(
			'<script type="application/ld+json">%s</script>',
			wp_json_encode(
				array(
					'@context'   => 'https://schema.org',
					'@type'      => 'FAQPage',
					'mainEntity' => $entities,
				)
			)
		);
	}
}
