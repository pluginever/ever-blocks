#!/bin/bash

set -e

DB_NAME=${1:-wordpress_test}
DB_USER=${2:-root}
DB_PASS=${3:-''}
DB_HOST=${4:-localhost}
WP_VERSION=${5:-trunk}

WP_TESTS_DIR=${WP_TESTS_DIR-/tmp/wordpress-tests-lib}
WP_CORE_DIR=${WP_CORE_DIR-/tmp/wordpress}

# prerequisites
for cmd in wp mysql; do
	if ! command -v "$cmd" >/dev/null 2>&1; then
		echo "$cmd is required but not installed."
		exit 1
	fi
done

echo "Setting up WordPress test environment..."
# Download WordPress.
if [ ! -f "$WP_CORE_DIR/wp-load.php" ]; then
	echo "Downloading WordPress..."
	wp core download --path="$WP_CORE_DIR" --version="$WP_VERSION" --force --allow-root || exit 1
fi

# Download test suite matching WordPress version.
if [ ! -d "$WP_TESTS_DIR/includes" ]; then
	echo "Downloading test suite..."
	rm -rf /tmp/wordpress-develop
	git clone --depth=1 --branch "$WP_VERSION" https://github.com/WordPress/wordpress-develop.git /tmp/wordpress-develop 2>/dev/null || exit 1
	mkdir -p "$WP_TESTS_DIR"
	cp -r /tmp/wordpress-develop/tests/phpunit/{includes,data} "$WP_TESTS_DIR/" || exit 1
	rm -rf /tmp/wordpress-develop
fi

# Create config file.
cat > "$WP_TESTS_DIR/wp-tests-config.php" << EOF
<?php
define( 'DB_NAME', '$DB_NAME' );
define( 'DB_USER', '$DB_USER' );
define( 'DB_PASSWORD', '$DB_PASS' );
define( 'DB_HOST', '$DB_HOST' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );
define( 'WP_TESTS_DOMAIN', 'example.org' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Test Blog' );
define( 'WP_PHP_BINARY', 'php' );
define( 'WPLANG', '' );
\$table_prefix = 'wptests_';
define( 'WP_DEBUG', true );
define( 'ABSPATH', '$WP_CORE_DIR/' );
EOF

# Create/reset database.
mysql --user="$DB_USER" --password="$DB_PASS" --host="$DB_HOST" -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;" 2>/dev/null || exit 1

# Import test database schema.
DUMP_FILE="$(dirname "$0")/../tests/Fixtures/schema.sql"
if [ -f "$DUMP_FILE" ]; then
	mysql --user="$DB_USER" --password="$DB_PASS" --host="$DB_HOST" "$DB_NAME" < "$DUMP_FILE" 2>/dev/null
fi

echo "✓ Setup complete!"
