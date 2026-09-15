<?php
/**
 * Title: Pricing table with billing switch
 * Slug: pricing-table-switch
 * Description: Three plans, the middle one featured, with a monthly and yearly switch.
 * Block Types: ever-blocks/pricing-table
 * Keywords: pricing, plans, monthly, yearly
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:ever-blocks/pricing-table {"layout": "card", "align": "wide", "options": [{"slug": "monthly", "label": "<?php echo esc_html( __( 'Monthly', 'ever-blocks' ) ); ?>"}, {"slug": "yearly", "label": "<?php echo esc_html( __( 'Yearly', 'ever-blocks' ) ); ?>", "badge": "<?php echo esc_html( __( 'Save 20%', 'ever-blocks' ) ); ?>"}], "active": "yearly"} -->
<!-- wp:ever-blocks/pricing-column -->
<!-- wp:icon {"icon":"core/home"} /-->
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading"><?php esc_html_e( 'Starter', 'ever-blocks' ); ?></h3><!-- /wp:heading -->
<!-- wp:paragraph --><p><?php esc_html_e( 'For one site and one person.', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- wp:ever-blocks/pricing-price {"perOption":true,"prices": {"monthly": {"currency": "$", "amount": "9", "period": "<?php echo esc_html( __( '/ month', 'ever-blocks' ) ); ?>", "note": "<?php echo esc_html( __( 'Billed monthly', 'ever-blocks' ) ); ?>"}, "yearly": {"currency": "$", "amount": "7", "period": "<?php echo esc_html( __( '/ month', 'ever-blocks' ) ); ?>", "note": "<?php echo esc_html( __( '$84 billed yearly', 'ever-blocks' ) ); ?>"}}} /-->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"width": 100, "className": "is-style-outline"} --><div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-outline"><a class="wp-block-button__link wp-element-button" href="#"><?php esc_html_e( 'Start free trial', 'ever-blocks' ); ?></a></div><!-- /wp:button --></div><!-- /wp:buttons -->
<!-- wp:paragraph --><p><a href="#"><?php esc_html_e( 'Compare all features', 'ever-blocks' ); ?></a></p><!-- /wp:paragraph -->
<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item --><li><?php esc_html_e( '1 site', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'All blocks', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'Email support', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item {"className":"is-style-excluded"} --><li class="is-style-excluded"><?php esc_html_e( 'Priority support', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item {"className":"is-style-excluded"} --><li class="is-style-excluded"><?php esc_html_e( 'White label', 'ever-blocks' ); ?></li><!-- /wp:list-item --></ul><!-- /wp:list -->
<!-- /wp:ever-blocks/pricing-column -->
<!-- wp:ever-blocks/pricing-column {"featured": true, "badge": "<?php echo esc_html( __( 'Most popular', 'ever-blocks' ) ); ?>"} -->
<!-- wp:icon {"icon":"core/people"} /-->
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading"><?php esc_html_e( 'Team', 'ever-blocks' ); ?></h3><!-- /wp:heading -->
<!-- wp:paragraph --><p><?php esc_html_e( 'For agencies with a handful of clients.', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- wp:ever-blocks/pricing-price {"perOption":true,"prices": {"monthly": {"currency": "$", "amount": "29", "period": "<?php echo esc_html( __( '/ month', 'ever-blocks' ) ); ?>", "note": "<?php echo esc_html( __( 'Billed monthly', 'ever-blocks' ) ); ?>"}, "yearly": {"currency": "$", "amount": "24", "period": "<?php echo esc_html( __( '/ month', 'ever-blocks' ) ); ?>", "note": "<?php echo esc_html( __( '$288 billed yearly', 'ever-blocks' ) ); ?>"}}} /-->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"width": 100} --><div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link wp-element-button" href="#"><?php esc_html_e( 'Start free trial', 'ever-blocks' ); ?></a></div><!-- /wp:button --></div><!-- /wp:buttons -->
<!-- wp:paragraph --><p><a href="#"><?php esc_html_e( 'Compare all features', 'ever-blocks' ); ?></a></p><!-- /wp:paragraph -->
<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item --><li><?php esc_html_e( '5 sites', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'All blocks', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'Priority support', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'Pattern library', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item {"className":"is-style-excluded"} --><li class="is-style-excluded"><?php esc_html_e( 'White label', 'ever-blocks' ); ?></li><!-- /wp:list-item --></ul><!-- /wp:list -->
<!-- /wp:ever-blocks/pricing-column -->
<!-- wp:ever-blocks/pricing-column -->
<!-- wp:icon {"icon":"core/store"} /-->
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading"><?php esc_html_e( 'Business', 'ever-blocks' ); ?></h3><!-- /wp:heading -->
<!-- wp:paragraph --><p><?php esc_html_e( 'For studios shipping every week.', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- wp:ever-blocks/pricing-price {"perOption":true,"prices": {"monthly": {"currency": "$", "amount": "79", "period": "<?php echo esc_html( __( '/ month', 'ever-blocks' ) ); ?>", "note": "<?php echo esc_html( __( 'Billed monthly', 'ever-blocks' ) ); ?>"}, "yearly": {"currency": "$", "amount": "65", "period": "<?php echo esc_html( __( '/ month', 'ever-blocks' ) ); ?>", "note": "<?php echo esc_html( __( '$780 billed yearly', 'ever-blocks' ) ); ?>"}}} /-->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"width": 100, "className": "is-style-outline"} --><div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-outline"><a class="wp-block-button__link wp-element-button" href="#"><?php esc_html_e( 'Start free trial', 'ever-blocks' ); ?></a></div><!-- /wp:button --></div><!-- /wp:buttons -->
<!-- wp:paragraph --><p><a href="#"><?php esc_html_e( 'Compare all features', 'ever-blocks' ); ?></a></p><!-- /wp:paragraph -->
<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item --><li><?php esc_html_e( '25 sites', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'All blocks', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'Priority support', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'Pattern library', 'ever-blocks' ); ?></li><!-- /wp:list-item --><!-- wp:list-item --><li><?php esc_html_e( 'White label', 'ever-blocks' ); ?></li><!-- /wp:list-item --></ul><!-- /wp:list -->
<!-- /wp:ever-blocks/pricing-column -->
<!-- /wp:ever-blocks/pricing-table -->
