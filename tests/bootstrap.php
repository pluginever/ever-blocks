<?php
//phpcs:ignoreFile

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' ) ?: '/tmp/wordpress-tests-lib';

if ( ! file_exists( "{$_tests_dir}/includes/functions.php" ) ) {
	echo "Could not find {$_tests_dir}/includes/functions.php\n";
	echo "Run: composer test:setup\n";
	exit( 1 );
}

require_once "{$_tests_dir}/includes/functions.php";

/**
 * Loads the plugin under test.
 *
 * @return void
 */
function _manually_load_plugin() {
	require_once dirname( __DIR__ ) . '/ever-blocks.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

require_once "{$_tests_dir}/includes/bootstrap.php";
