<?php
/**
 * Announcement Bar block template.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Rendered announcements.
 * @var \WP_Block            $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( $content ) ) {
	return;
}

$eb_now    = current_datetime();
$eb_zone   = wp_timezone();
$eb_starts = is_string( $attributes['startsAt'] ?? null ) && '' !== $attributes['startsAt'] ? date_create_immutable( $attributes['startsAt'], $eb_zone ) : false;
$eb_ends   = is_string( $attributes['endsAt'] ?? null ) && '' !== $attributes['endsAt'] ? date_create_immutable( $attributes['endsAt'], $eb_zone ) : false;

if ( ( $eb_starts && $eb_now < $eb_starts ) || ( $eb_ends && $eb_now > $eb_ends ) ) {
	return;
}

$eb_animations = array( 'static', 'ticker', 'rotate' );
$eb_animation  = in_array( $attributes['animation'] ?? '', $eb_animations, true ) ? $attributes['animation'] : 'static';
$eb_count      = count( $block->parsed_block['innerBlocks'] ?? array() );
$eb_moving     = 'static' !== $eb_animation && $eb_count > 0;
$eb_speeds     = array(
	'slow'   => array( 8, 30 ),
	'normal' => array( 5, 60 ),
	'fast'   => array( 3, 120 ),
);
$eb_speed      = $eb_speeds[ $attributes['speed'] ?? 'normal' ] ?? $eb_speeds['normal'];
$eb_direction  = in_array( $attributes['direction'] ?? '', array( 'left', 'right', 'up', 'down' ), true ) ? $attributes['direction'] : 'left';
$eb_dismiss    = ! empty( $attributes['dismissible'] );
$eb_separators = array( 'none', 'dot', 'line', 'slash', 'custom' );
$eb_separator  = 'ticker' === $eb_animation && in_array( $attributes['separator'] ?? '', $eb_separators, true ) ? $attributes['separator'] : 'none';
$eb_sep_text   = 'custom' === $eb_separator && is_string( $attributes['separatorText'] ?? null ) ? trim( $attributes['separatorText'] ) : '';
$eb_key        = 'eb-announcement-' . ( is_string( $attributes['anchor'] ?? null ) && '' !== $attributes['anchor'] ? sanitize_key( $attributes['anchor'] ) : substr( md5( wp_json_encode( $attributes ) . $content ), 0, 8 ) );

$eb_wrapper = array(
	'class'                => 'eb-announcement-bar is-animation-' . $eb_animation . ( $eb_moving ? ' is-moving' : '' ) . ( in_array( $eb_direction, array( 'right', 'down' ), true ) ? ' is-reverse' : '' ) . ( 'none' === $eb_separator ? '' : ' has-separator-' . $eb_separator ) . ( $eb_dismiss ? ' is-dismissible' : '' ),
	'style'                => '' === $eb_sep_text ? null : '--ever-blocks-announcement-bar-separator:' . wp_json_encode( $eb_sep_text ),
	'role'                 => 'region',
	'aria-label'           => __( 'Announcement', 'ever-blocks' ),
	'data-wp-interactive'  => 'ever-blocks/announcement-bar',
	'data-wp-context'      => (string) wp_json_encode(
		array(
			'animation' => $eb_animation,
			'interval'  => $eb_speed[0],
			'speed'     => $eb_speed[1],
			'reverse'   => in_array( $eb_direction, array( 'right', 'down' ), true ),
			'dismiss'   => $eb_dismiss ? $eb_key : '',
			'hidden'    => $eb_dismiss,
			'days'      => max( 0, (int) ( $attributes['rememberDays'] ?? 7 ) ),
			'index'     => 0,
			'count'     => $eb_count,
		)
	),
	'data-wp-bind--hidden' => 'context.hidden',
	'data-wp-init'         => 'callbacks.init',
);

if ( $eb_moving ) {
	$eb_wrapper['data-wp-on--mouseenter'] = 'actions.pause';
	$eb_wrapper['data-wp-on--mouseleave'] = 'actions.resume';
	$eb_wrapper['data-wp-on--focusin']    = 'actions.pause';
	$eb_wrapper['data-wp-on--focusout']   = 'actions.resume';
}

if ( 'ticker' === $eb_animation ) {
	$eb_track = sprintf(
		'<div class="eb-announcement-bar__track" data-wp-watch="callbacks.measure"><div class="eb-announcement-bar__run">%1$s</div><div class="eb-announcement-bar__run" aria-hidden="true" inert>%1$s</div></div>',
		$content
	);
} elseif ( 'rotate' === $eb_animation ) {
	$eb_track = sprintf(
		'<div class="eb-announcement-bar__track" aria-live="off"><div class="eb-announcement-bar__run" data-wp-watch="callbacks.rotate">%1$s</div></div>',
		$content
	);
} else {
	$eb_track = '<div class="eb-announcement-bar__track">' . $content . '</div>';
}

$eb_close = '';

if ( $eb_dismiss ) {
	$eb_icon  = is_string( $attributes['closeIcon'] ?? null ) && '' !== $attributes['closeIcon'] ? wp_get_icon( $attributes['closeIcon'], array( 'size' => null ) ) : '';
	$eb_icon  = '' === $eb_icon ? wp_get_icon( 'heroicons/x-mark', array( 'size' => null ) ) : $eb_icon;
	$eb_close = sprintf(
		'<button type="button" class="eb-announcement-bar__close" data-wp-on--click="actions.dismiss" aria-label="%1$s">%2$s</button>',
		esc_attr__( 'Dismiss', 'ever-blocks' ),
		$eb_icon
	);
}

printf(
	'<div %1$s>%2$s%3$s</div>',
	get_block_wrapper_attributes( $eb_wrapper ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$eb_track, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks.
	$eb_close // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from escaped parts above.
);
