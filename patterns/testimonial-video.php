<?php
/**
 * Title: Video testimonial
 * Slug: testimonial-video
 * Description: A video above the quote and the person who said it.
 * Block Types: ever-blocks/testimonial
 * Keywords: testimonial, video
 * Viewport Width: 720
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"constrained","contentSize":"640px"}} -->
<div class="wp-block-group"><!-- wp:video -->
<figure class="wp-block-video"></figure>
<!-- /wp:video -->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'Clean markup, sane defaults, and it respects the theme. Rare.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","showRating":false,"style":{"border":{"radius":"0px","top":{"width":"0px"},"right":{"width":"0px"},"bottom":{"width":"0px"},"left":{"width":"2px"}},"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"1em"}}}} /--></div>
<!-- /wp:group -->
