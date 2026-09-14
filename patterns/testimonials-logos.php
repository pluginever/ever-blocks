<?php
/**
 * Title: Quote with logo strip
 * Slug: testimonials-logos
 * Description: A single large quote above a row of client logos.
 * Block Types: ever-blocks/testimonial
 * Keywords: testimonial, logos, clients
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide"><!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_js( __( 'We moved 40 client sites over in a month.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_js( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_js( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":4.5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"centered","className":"is-style-plain"} /-->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}} -->
<div class="wp-block-group"><!-- wp:image {"width":"96px","sizeSlug":"medium"} -->
<figure class="wp-block-image size-medium is-resized"><img src="<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/logo.svg' ); ?>" alt="" style="width:96px"/></figure>
<!-- /wp:image -->
<!-- wp:image {"width":"96px","sizeSlug":"medium"} -->
<figure class="wp-block-image size-medium is-resized"><img src="<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/logo.svg' ); ?>" alt="" style="width:96px"/></figure>
<!-- /wp:image -->
<!-- wp:image {"width":"96px","sizeSlug":"medium"} -->
<figure class="wp-block-image size-medium is-resized"><img src="<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/logo.svg' ); ?>" alt="" style="width:96px"/></figure>
<!-- /wp:image -->
<!-- wp:image {"width":"96px","sizeSlug":"medium"} -->
<figure class="wp-block-image size-medium is-resized"><img src="<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/logo.svg' ); ?>" alt="" style="width:96px"/></figure>
<!-- /wp:image -->
<!-- wp:image {"width":"96px","sizeSlug":"medium"} -->
<figure class="wp-block-image size-medium is-resized"><img src="<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/logo.svg' ); ?>" alt="" style="width:96px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
