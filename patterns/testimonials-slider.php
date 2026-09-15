<?php
/**
 * Title: Testimonials slider
 * Slug: testimonials-slider
 * Description: Testimonial cards that slide, three at a time.
 * Block Types: ever-blocks/carousel, ever-blocks/testimonial
 * Keywords: testimonials, slider, carousel
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:ever-blocks/carousel {"align":"wide"} -->
<!-- wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'We replaced three plugins with this one and the site got faster. Every block just works the way the editor already does.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>"} /-->
<!-- /wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'The controls are where I expect them. I spent an afternoon and rebuilt our pricing page without touching CSS.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":4.5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>"} /-->
<!-- /wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'Support answered in an hour and the fix shipped the next day.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>"} /-->
<!-- /wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/carousel-slide -->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'Our editors stopped asking for a page builder. That alone paid for it.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":4.5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>"} /-->
<!-- /wp:ever-blocks/carousel-slide -->
<!-- /wp:ever-blocks/carousel -->
