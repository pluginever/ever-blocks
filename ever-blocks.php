<?php
/**
 * Plugin Name:         Ever Blocks
 * Plugin URI:          https://github.com/pluginever/ever-blocks
 * Description:         A block library for the WordPress editor.
 * Version:             2.0.0
 * Requires at least:   6.9
 * Requires PHP:        7.4
 * Author:              ByteEver
 * Author URI:          https://byteever.com
 * License:             GPL v2 or later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         ever-blocks
 * Domain Path:         /languages
 *
 * @package             EverBlocks
 * @author              Sultan Nasir Uddin <manikdrmc@gmail.com>
 * @copyright           2026 ByteEver
 * @license             GPL-2.0+
 */

use EverBlocks\Plugin;

defined( 'ABSPATH' ) || exit;

spl_autoload_register(
	function ( $class_name ) {
		if ( 0 !== strpos( $class_name, 'EverBlocks\\' ) ) {
			return;
		}

		$path = __DIR__ . '/includes/' . str_replace( '\\', '/', substr( $class_name, 11 ) ) . '.php';

		if ( is_readable( $path ) ) {
			require_once $path;
		}
	}
);

/**
 * Returns the main plugin instance.
 *
 * @since 2.0.0
 * @return Plugin
 */
function ever_blocks(): Plugin {
	return Plugin::instance();
}

Plugin::create( __FILE__, '2.0.0' );

ever_blocks()->bootstrap();
