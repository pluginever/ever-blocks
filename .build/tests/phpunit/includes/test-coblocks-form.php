<?php
/**
 * Test includes/class-ever-blocks-form.php
 *
 * @package ever-blocks
 */
class ever-blocks_Form_Tests extends WP_UnitTestCase {

	private $ever-blocks_form;

	public function setUp() {

		parent::setUp();

		$this->ever-blocks_form = new ever-blocks_Form();

		set_current_screen( 'dashboard' );

	}

	public function tearDown() {

		parent::tearDown();

		unset( $GLOBALS['current_screen'] );

	}

	/**
	 * Test the class constants
	 */
	public function test_class_constants() {

		$reflection = new ReflectionClass( $this->ever-blocks_form );

		$expected = [
			'GCAPTCHA_VERIFY_URL',
		];

		foreach ( $expected as $constant ) {

			if ( ! array_key_exists( $constant, $reflection->getConstants() ) ) {

				$this->fail( "$constant is not defined." );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the constructor
	 */
	public function test_construct() {

		$actions = [
			[ 'init', 'register_settings' ],
			[ 'init', 'register_form_blocks' ],
			[ 'wp_enqueue_scripts', 'form_recaptcha_assets' ],
		];

		foreach ( $actions as $action_data ) {

			$priority = isset( $action_data[2] ) ? $action_data[2] : 10;

			if ( ! has_action( $action_data[0], [ $this->ever-blocks_form, $action_data[1] ] ) ) {

				$this->fail( "$action_data[0] is not attached to ever-blocks:$action_data[1]. It might also have the wrong priority (validated priority: $priority)" );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the settings are registered correctly
	 */
	public function test_register_settings() {

		$this->ever-blocks_form->register_settings();

		$settings = [
			'ever-blocks_google_recaptcha_site_key',
			'ever-blocks_google_recaptcha_secret_key',
		];

		foreach ( $settings as $registered_setting ) {

			if ( ! array_key_exists( $registered_setting, get_registered_settings() ) ) {

				$this->fail( "$registered_setting is not defined." );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the form block assets DO NOT load when no form block is present
	 */
	public function test_no_form_assets_load() {

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/gallery-masonry --><!-- /wp:ever-blocks/gallery-masonry -->',
				'post_title'   => 'ever-blocks No Form',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_form->form_recaptcha_assets();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$this->assertNotContains( 'google-recaptcha', $wp_scripts->queue );

	}

	/**
	 * Test the form block assets load when a form block is present
	 */
	public function test_form_assets_load() {

		update_option( 'ever-blocks_google_recaptcha_site_key', '123' );
		update_option( 'ever-blocks_google_recaptcha_secret_key', '123' );

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/form --><!-- /wp:ever-blocks/form -->',
				'post_title'   => 'ever-blocks Form',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_form->form_recaptcha_assets();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$form_block_assets = [
			'google-recaptcha',
			'ever-blocks-google-recaptcha',
		];

		foreach ( $form_block_assets as $form_block_asset ) {

			if ( ! in_array( $form_block_asset, $wp_scripts->queue, true ) ) {

				$this->fail( "$form_block_asset is not enqueued." );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the form block assets localized data is set correctly
	 */
	public function test_form_assets_localized_data() {

		update_option( 'ever-blocks_google_recaptcha_site_key', '123' );
		update_option( 'ever-blocks_google_recaptcha_secret_key', '123' );

		$post_id = wp_insert_post(
			[
				'post_author'  => 1,
				'post_content' => '<!-- wp:ever-blocks/form --><!-- /wp:ever-blocks/form -->',
				'post_title'   => 'ever-blocks Form',
				'post_status'  => 'publish',
			]
		);

		global $post;

		$post = get_post( $post_id );

		$this->ever-blocks_form->form_recaptcha_assets();

		do_action( 'wp_enqueue_scripts' );

		$wp_scripts = wp_scripts();

		$this->assertRegExp( '/"recaptchaSiteKey":"123"/', $wp_scripts->registered['ever-blocks-google-recaptcha']->extra['data'] );

	}

	/**
	 * Test the blocks are registered properly
	 *
	 * @expectedIncorrectUsage WP_Block_Type_Registry::register
	 */
	public function test_register_blocks() {

		$this->ever-blocks_form->register_form_blocks();

		$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

		$ever-blocks_blocks = [
			'ever-blocks/form',
			'ever-blocks/field-name',
			'ever-blocks/field-email',
			'ever-blocks/field-textarea',
		];

		foreach ( $ever-blocks_blocks as $registered_block ) {

			if ( ! array_key_exists( $registered_block, $registered_blocks ) ) {

				$this->fail( "$registered_block is not registered." );

			}
		}

		$this->assertTrue( true );

	}

	/**
	 * Test the form markup is as expected
	 */
	public function test_render_form() {

		update_option( 'ever-blocks_google_recaptcha_site_key', '123' );
		update_option( 'ever-blocks_google_recaptcha_secret_key', '123' );

		$this->expectOutputRegex( '/<div class="ever-blocks-form" id="(.*?)">/' );

		echo $this->ever-blocks_form->render_form( [], '<!-- wp:ever-blocks/form --><!-- wp:ever-blocks/field-name --><!-- /wp:ever-blocks/field-name --><!-- wp:ever-blocks/field-email --><!-- /wp:ever-blocks/field-email --><!-- wp:ever-blocks/field-textarea --><!-- /wp:ever-blocks/field-textarea --><!-- /wp:ever-blocks/form -->' );

	}

	/**
	 * Test the form markup is as expected when it is submitted
	 */
	public function test_render_form_submission() {

		$this->markTestSkipped( 'Todo: Figure out how to set the global $_POST to simulate a form submission.' );

		$_POST['form-hash'] = '99f3a3add5da5d0bb04ce41c7142688f64e73ab6';

		$ever-blocks_form = new ever-blocks_Form();

		$this->expectOutputRegex( '/<div class="ever-blocks-form__submitted">Your message was sent:/' );

		echo $ever-blocks_form->render_form( [], '<!-- wp:ever-blocks/form --><!-- /wp:ever-blocks/form -->' );

	}

	/**
	 * Test the name field markup is as expected, when it's a single field
	 */
	public function test_render_field_name() {

		$this->expectOutputRegex( '/<input type="text" id="name-2" name="field-name-2\[value\]" class="ever-blocks-field ever-blocks-field--name" required \/>/' );

		$atts = [
			'label'       => 'Name',
			'required'    => true,
			'hasLastName' => false,
		];

		echo $this->ever-blocks_form->render_field_name( $atts, '' );

	}

	/**
	 * Test the name field markup is as expected, when the last name is displayed
	 */
	public function test_render_field_name_has_last_name() {

		$this->expectOutputRegex( '/<div class="ever-blocks-form__inline-fields">/' );

		$atts = [
			'label'          => 'Name',
			'required'       => true,
			'hasLastName'    => true,
			'labelFirstName' => 'First Name',
			'labelLastName'  => 'Last Name',
		];

		echo $this->ever-blocks_form->render_field_name( $atts, '' );

	}

	/**
	 * Test the email field markup is as expected
	 */
	public function test_render_field_email() {

		$this->expectOutputRegex( '/<input type="email" id="email" name="field-email\[value\]" class="ever-blocks-field ever-blocks-field--email"  \/>/' );

		echo $this->ever-blocks_form->render_field_email( [], '' );

	}

	/**
	 * Test the message field markup is as expected
	 */
	public function test_render_field_textarea() {

		$this->expectOutputRegex( '/<textarea name="field-message-2\[value\]" id="message-2" class="ever-blocks-field ever-blocks-textarea" rows="20" ><\/textarea>/' );

		echo $this->ever-blocks_form->render_field_textarea( [], '' );

	}

	/**
	 * Test the datepicker script is enqueued
	 */
	public function test_field_date_scripts() {

		$this->ever-blocks_form->render_field_date( [], '' );

		global $wp_scripts;

		$this->assertArrayHasKey( 'ever-blocks-datepicker', $wp_scripts->registered );

	}

	/**
	 * Test the date field markup is as expected
	 */
	public function test_render_field_date() {

		$this->expectOutputRegex( '/<input type="text" id="date-2" name="field-date-2\[value\]" class="ever-blocks-field ever-blocks-field--date"  \/>/' );

		echo $this->ever-blocks_form->render_field_date( [], '' );

	}

	/**
	 * Test the phone field markup is as expected
	 */
	public function test_render_field_phone() {

		$this->expectOutputRegex( '/<input type="tel" id="phone" name="field-phone\[value\]" class="ever-blocks-field ever-blocks-field--telephone"  \/>/' );

		echo $this->ever-blocks_form->render_field_phone( [], '' );

	}

	/**
	 * Test the radio field markup is as expected, when no options are passed in
	 */
	public function test_render_field_radio_empty_options() {

		$this->assertEquals(
			$this->ever-blocks_form->render_field_radio(
				[
					'options' => [],
				],
				''
			),
			null
		);

	}

	/**
	 * Test the radio field markup is as expected
	 */
	public function test_render_field_radio() {

		$this->expectOutputRegex( '/<input type="radio" name="field-choose-one\[value\]" value="Option 2" class="radio"> Option 2/' );

		echo $this->ever-blocks_form->render_field_radio(
			[
				'options' => [
					'option-1' => 'Option 1',
					'option-2' => 'Option 2',
				],
			],
			''
		);

	}

	/**
	 * Test the inline radio field markup is as expected
	 */
	public function test_render_field_radio_inline() {

		$this->expectOutputRegex( '/<div class="ever-blocks--inline">/' );

		echo $this->ever-blocks_form->render_field_radio(
			[
				'options' => [
					'option-1' => 'Option 1',
					'option-2' => 'Option 2',
				],
				'isInline' => true,
			],
			''
		);

	}

	/**
	 * Test the select field markup is as expected, when no options are passed in
	 */
	public function test_render_field_select_empty_options() {

		$this->assertEquals(
			$this->ever-blocks_form->render_field_select(
				[
					'options' => [],
				],
				''
			),
			null
		);

	}

	/**
	 * Test the select field markup is as expected
	 */
	public function test_render_field_select() {

		$this->expectOutputRegex( '/<select class="select ever-blocks-field" name="field-select\[value\]"><option value="Option 1">Option 1<\/option><option value="Option 2">Option 2<\/option><\/select>/' );

		echo $this->ever-blocks_form->render_field_select(
			[
				'options' => [
					'option-1' => 'Option 1',
					'option-2' => 'Option 2',
				],
			],
			''
		);

	}

	/**
	 * Test the checkbox field markup is as expected, when no options are passed in
	 */
	public function test_render_field_checkbox_empty_options() {

		$this->assertEquals(
			$this->ever-blocks_form->render_field_checkbox(
				[
					'options' => [],
				],
				''
			),
			null
		);

	}

	/**
	 * Test the checkbox field markup is as expected
	 */
	public function test_render_field_checkbox() {

		$this->expectOutputRegex( '/<input type="checkbox" name="field-select\[value\]\[\]" value="Option 2" class="checkbox"> Option 2/' );

		echo $this->ever-blocks_form->render_field_checkbox(
			[
				'options' => [
					'option-1' => 'Option 1',
					'option-2' => 'Option 2',
				],
			],
			''
		);

	}

	/**
	 * Test the inline checkbox field markup is as expected
	 */
	public function test_render_field_checkbox_inline() {

		$this->expectOutputRegex( '/<div class="ever-blocks--inline">/' );

		echo $this->ever-blocks_form->render_field_checkbox(
			[
				'options' => [
					'option-1' => 'Option 1',
					'option-2' => 'Option 2',
				],
				'isInline' => true,
			],
			''
		);

	}

	/**
	 * Test the website field markup is as expected
	 */
	public function test_render_field_website() {

		$this->expectOutputRegex( '/<input type="url" id="website" name="field-website\[value\]" class="ever-blocks-field ever-blocks-field--website"  \/>/' );

		echo $this->ever-blocks_form->render_field_website( [], '' );

	}

	/**
	 * Test the hidden field markup is as expected
	 */
	public function test_render_field_hidden() {

		$this->expectOutputRegex( '/<input type="hidden" value="" id="hidden" name="field-hidden\[value\]" class="ever-blocks-field ever-blocks-field--hidden" \/>/' );

		echo $this->ever-blocks_form->render_field_hidden( [], '' );

	}

	/**
	 * Test the field label markup is as expected
	 */
	public function test_render_field_label() {

		$this->expectOutputRegex( '/<label for="field-label" class="ever-blocks-label">Field Label <span class="required">&#042;<\/span><\/label>/' );

		$atts = [
			'label'    => 'Field Label',
			'required' => true,
		];

		$object    = new ever-blocks_Form();
		$reflector = new ReflectionClass( 'ever-blocks_Form' );
		$method    = $reflector->getMethod( 'render_field_label' );

		$method->setAccessible( true );

		echo $method->invokeArgs( $object, [ $atts, '' ] );

	}

	/**
	 * Test the field label markup is as expected
	 */
	public function test_render_submit_button() {

		$this->expectOutputRegex( '/<button type="submit" class="wp-block-button__link custom-button-class" style="background-color: #B4D455;color: #333333;">Submit<\/button>/' );

		$atts = [
			'submitButtonClasses'         => 'custom-button-class',
			'customBackgroundButtonColor' => '#B4D455',
			'customTextButtonColor'       => '#333333',
		];

		$object    = new ever-blocks_Form();
		$reflector = new ReflectionClass( 'ever-blocks_Form' );
		$method    = $reflector->getMethod( 'render_submit_button' );

		$method->setAccessible( true );

		echo $method->invokeArgs( $object, [ $atts ] );

	}

	/**
	 * Test the form submission works as expected
	 */
	public function test_process_form_submission() {

		$this->markTestSkipped( 'Todo: Figure out how to set the global $_POST to simulate a form submission.' );

	}

	/**
	 * Test the html email headers return as expected
	 */
	public function test_enable_html_email() {

		$this->assertEquals( $this->ever-blocks_form->enable_html_email(), 'text/html' );

	}

	/**
	 * Test the success message markup returns as expected
	 */
	public function test_success_message() {

		$this->expectOutputRegex( '/<div class="ever-blocks-form__submitted">Your message was sent: <\/div>/' );

		$this->ever-blocks_form->success_message();

	}

	/**
	 * Test the recaptcha verifies
	 */
	public function test_verify_recaptcha() {

		$this->markTestSkipped( 'Todo: Figure out how to test the recaptcha verification checks.' );

	}
}
