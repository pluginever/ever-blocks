<?php
/**
 * Title: Testimonials in tabs
 * Slug: testimonials-tabs
 * Description: One quote at a time; the names are the tabs.
 * Block Types: ever-blocks/testimonial
 * Keywords: testimonials, tabs
 * Viewport Width: 900
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:tabs -->
<div class="wp-block-tabs"><!-- wp:tab-list -->
<div role="tablist" class="wp-block-tab-list"><button type="button" role="tab"><?php echo esc_html__( 'Name 1', 'ever-blocks' ); ?></button><button type="button" role="tab"><?php echo esc_html__( 'Name 2', 'ever-blocks' ); ?></button><button type="button" role="tab"><?php echo esc_html__( 'Name 3', 'ever-blocks' ); ?></button></div>
<!-- /wp:tab-list -->
<!-- wp:tab-panels -->
<div class="wp-block-tab-panels"><!-- wp:tab-panel {"label":"<?php echo esc_html( __( 'Name 1', 'ever-blocks' ) ); ?>"} -->
<section role="tabpanel" tabindex="0" class="wp-block-tab-panel"><!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'We replaced three plugins with this one and the site got faster. Every block just works the way the editor already does.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"centered","style":{"border":{"width":"0"},"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}}} /--></section>
<!-- /wp:tab-panel -->
<!-- wp:tab-panel {"label":"<?php echo esc_html( __( 'Name 2', 'ever-blocks' ) ); ?>"} -->
<section role="tabpanel" tabindex="0" class="wp-block-tab-panel"><!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'The controls are where I expect them. I spent an afternoon and rebuilt our pricing page without touching CSS.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":4.5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"centered","style":{"border":{"width":"0"},"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}}} /--></section>
<!-- /wp:tab-panel -->
<!-- wp:tab-panel {"label":"<?php echo esc_html( __( 'Name 3', 'ever-blocks' ) ); ?>"} -->
<section role="tabpanel" tabindex="0" class="wp-block-tab-panel"><!-- wp:ever-blocks/testimonial {"quote":"<?php echo esc_html( __( 'Support answered in an hour and the fix shipped the next day.', 'ever-blocks' ) ); ?>","name":"<?php echo esc_html( __( 'Name', 'ever-blocks' ) ); ?>","role":"<?php echo esc_html( __( 'Role, Company', 'ever-blocks' ) ); ?>","rating":5,"avatarUrl":"<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/avatar.svg' ); ?>","layout":"centered","style":{"border":{"width":"0"},"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}}} /--></section>
<!-- /wp:tab-panel --></div>
<!-- /wp:tab-panels --></div>
<!-- /wp:tabs -->
