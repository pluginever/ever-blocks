<?php
/**
 * Title: Testimonial card
 * Slug: testimonial-card
 * Description: A quote with rating, photo, name and role in a card.
 * Block Types: ever-blocks/testimonial
 * Keywords: testimonial, review, card
 * Viewport Width: 600
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_js( __( 'We replaced three plugins with this one and the site got faster. Every block just works the way the editor already does.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_js( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_js( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>"} /-->
