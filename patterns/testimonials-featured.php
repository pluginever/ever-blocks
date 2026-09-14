<?php
/**
 * Title: Featured testimonial with list
 * Slug: testimonials-featured
 * Description: One large quote beside a compact list of three more.
 * Block Types: ever-blocks/testimonial
 * Keywords: testimonials, featured, list
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:columns {"align":"wide","verticalAlignment":"center","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"55%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:55%"><!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_js( __( 'Our editors stopped asking for a page builder. That alone paid for it.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_js( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_js( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":4.5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"centered","className":"is-style-plain"} /--></div>
<!-- /wp:column -->
<!-- wp:column {"verticalAlignment":"center","width":"45%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:45%"><!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_js( __( 'We replaced three plugins with this one and the site got faster. Every block just works the way the editor already does.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_js( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_js( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"side","showRating":false,"className":"is-style-plain","style":{"everBlocks":{"avatarSize":"40px"}}} /-->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_js( __( 'Support answered in an hour and the fix shipped the next day.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_js( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_js( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"side","showRating":false,"className":"is-style-plain","style":{"everBlocks":{"avatarSize":"40px"}}} /-->
<!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_js( __( 'Clean markup, sane defaults, and it respects the theme. Rare.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_js( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_js( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"side","showRating":false,"className":"is-style-plain","style":{"everBlocks":{"avatarSize":"40px"}}} /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
