<?php
/**
 * Accordion block, server render.
 *
 * @package EverBlocks
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Inner blocks.
 * @var \WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$eb_content = trim( (string) $content );

if ( '' === $eb_content ) {
	return;
}

// Exclusive opening is native: <details> elements sharing a name close each other.
if ( empty( $attributes['allowMultiple'] ) ) {
	$eb_group     = wp_unique_id( 'eb-accordion-' );
	$eb_processor = new WP_HTML_Tag_Processor( $eb_content );

	while ( $eb_processor->next_tag(
		array(
			'tag_name'   => 'details',
			'class_name' => 'eb-accordion-item',
		)
	) ) {
		$eb_processor->set_attribute( 'name', $eb_group );
	}

	$eb_content = $eb_processor->get_updated_html();
}

$eb_schema = '';

if ( ! empty( $attributes['schema'] ) ) {
	$eb_entities = array();

	foreach ( $block->parsed_block['innerBlocks'] ?? array() as $eb_item ) {
		$eb_question = wp_strip_all_tags( (string) ( $eb_item['attrs']['title'] ?? '' ) );
		$eb_answer   = trim( wp_strip_all_tags( implode( '', array_map( 'render_block', $eb_item['innerBlocks'] ?? array() ) ) ) );

		if ( '' === $eb_question || '' === $eb_answer ) {
			continue;
		}

		$eb_entities[] = array(
			'@type'          => 'Question',
			'name'           => $eb_question,
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $eb_answer,
			),
		);
	}

	if ( $eb_entities ) {
		$eb_schema = sprintf(
			'<script type="application/ld+json">%s</script>',
			wp_json_encode(
				array(
					'@context'   => 'https://schema.org',
					'@type'      => 'FAQPage',
					'mainEntity' => $eb_entities,
				)
			)
		);
	}
}

printf(
	'<div %s>%s</div>%s',
	get_block_wrapper_attributes( array( 'class' => 'eb-accordion eb-accordion--icon-' . ( 'left' === ( $attributes['iconPosition'] ?? '' ) ? 'left' : 'right' ) ) ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$eb_content, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$eb_schema // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);
