<?php
/**
 * Plugin Name: Ever Blocks
 * Plugin URI:  https://www.pluginever.com/plugins/ever-blocks/
 * Description: Ever Blocks is a professional page building blocks for the WordPress Gutenberg block editor.
 * Version:     1.0.1
 * Author:      pluginever
 * Author URI:  http://pluginever.com
 * Donate link: https://pluginever.com/contact
 * License:     GPLv2+
 * Text Domain: ever-blocks
 * Domain Path: /i18n/languages/
 * Tested up to: 5.7.2
 */

/**
 * Copyright (c) 2019 pluginever (email : support@pluginever.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

defined( 'ABSPATH' ) || exit();

final class EverBlocks {
    /**
     * The single instance of the class.
     *
     * @var self
     * @since  1.0.0
     */
    private static $instance = null;


    /**
     * Main EverBlocks Instance.
     *
     * Ensures only one instance of EverBlocks is loaded or can be loaded.
     *
     * @return EverBlocks
     * @see EverBlocks()
     * @since  1.0.0
     * @static
     */
    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
            self::$instance->define_constants();
            self::$instance->init();
            self::$instance->includes();
        }

        return self::$instance;
    }


    /**
     * Cloning is forbidden.
     *
     * @return void
     * @since 1.0.0
     */
    public function __clone() {
        _doing_it_wrong( __FUNCTION__, __( 'Cloning is forbidden.', 'wp-job-listings' ), '1.0.0' );
    }

    /**
     * Universalizing instances of this class is forbidden.
     *
     * @return void
     * @since 1.0.0
     */
    public function __wakeup() {
        _doing_it_wrong( __FUNCTION__, __( 'Unserializing instances of this class is forbidden.', 'wp-job-listings' ), '1.0.0' );
    }

    /**
     *  Define constants.
     *
     * since 1.0.0
     *
     * @return void
     */
    private function define_constants() {
        define( 'EVER_BLOCKS_VERSION', '1.0.1' );
        define( 'EVER_BLOCKS_FILE', __FILE__ );
        define( 'EVER_BLOCKS_ABSPATH', dirname( EVER_BLOCKS_FILE ) );
        define( 'EVER_BLOCKS_BASENAME', plugin_basename( __FILE__ ) );
        define( 'EVER_BLOCKS_INCLUDES', EVER_BLOCKS_ABSPATH . '/includes' );
        define( 'EVER_BLOCKS_URL', plugins_url( '', EVER_BLOCKS_FILE ) );
        define( 'EVER_BLOCKS_ASSETS_URL', EVER_BLOCKS_URL . '/assets' );
        define( 'EVER_BLOCKS_ASSETS_SUFFIX', SCRIPT_DEBUG ? null : '.min' );
    }

    /**
     * Includes.
     *
     * since 1.0.0
     * @return void
     */
    protected function includes() {
	    require_once EVER_BLOCKS_ABSPATH . '/includes/class-everblocks-block-assets.php';
	    require_once EVER_BLOCKS_ABSPATH . '/includes/class-everblocks-register-blocks.php';
    }

    /**
     * Load actions
     *
     * @return void
     */
    private function init() {
        add_action( 'plugins_loaded', array( $this, 'load_textdomain' ), 99 );
        add_action( 'enqueue_block_editor_assets', array( $this, 'block_localization' ) );
    }

    /**
     * If debug is on, serve unminified source assets.
     *
     * @since 1.0.0
     * @param string $type
     * @param null $directory
     *
     * @return string
     */
    public function asset_source( $type = 'js', $directory = null ) {

        if ( 'js' === $type ) {
            return SCRIPT_DEBUG ? EVER_BLOCKS_URL . 'src/' . $type . '/' . $directory : EVER_BLOCKS_URL . 'dist/' . $type . '/' . $directory;
        } else {
            return EVER_BLOCKS_URL . 'dist/css/' . $directory;
        }
    }

    /**
     * Loads the plugin language files.
     *
     * @access public
     * @return void
     * @since 1.0.0
     */
    public function load_textdomain() {
        load_plugin_textdomain( 'ever-blocks', false, basename( EVER_BLOCKS_ABSPATH ) . '/languages' );
    }

    /**
     * Enqueue localization data for our blocks.
     *
     * @access public
     */
    public function block_localization() {
        if ( function_exists( 'wp_set_script_translations' ) ) {
            wp_set_script_translations( 'ever-blocks-editor', 'ever-blocks', EVER_BLOCKS_ABSPATH . '/languages' );
        }
    }

}

/**
 * Main instance of Ever Blocks.
 *
 * Returns the main instance of Ever Blocks to prevent the need to use globals.
 *
 * @return EverBlocks|boolean
 * @since  1.0.0
 */
function ever_blocks() {
    if ( ! is_multisite() ) {
        return EverBlocks::instance();
    }

    return false;
}

//do magic
ever_blocks();
