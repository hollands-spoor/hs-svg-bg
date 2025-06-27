<?php
/**
 * Plugin Name:       Good SVG Background
 * Description:       Block with an SVG background that can be adjusted in block-editor.
 * Requires at least: 6.7
 * Requires PHP:      7.0
 * Version:           0.3.0
 * Author:            Hollands Spoor
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hs-svg-bg
 *
 * @package hs-svg-bg
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block Initializer.
 */
function hollands_spoor_svg_bg_block_init() {
	register_block_type( __DIR__ . '/block' );
}
add_action( 'init', 'hollands_spoor_svg_bg_block_init' );

/**
 * scan the svg-tpl folder for svg json files and return an array of the json objects
 */
function svg_bg_get_svgs(){
	$svgs = array();

	
	$dir = plugin_dir_path( __FILE__ ) . 'svg-tpl';
  
	$files = scandir( $dir );
	foreach( $files as $file ){
		if( $file == '.' || $file == '..' ) continue;
		if ( is_dir( $dir . '/' . $file ) ) continue;

		$file_info = pathinfo($file);
    	if ($file_info['extension'] !== 'json') continue;
	
		$svg_json = json_decode( file_get_contents( $dir . '/' . $file ) );
		
		if( $svg_json->template === "file") {
			$svg_json->template = file_get_contents( $dir . '/' . $svg_json->name . '.svg' );
		} 
		$svgs[] = $svg_json;
	}
	return $svgs;
}


function get_emojis() {
	$emojis = array();
	$dir = plugin_dir_path( __FILE__ ) . 'svg-tpl/emoji';
	$files = scandir( $dir );
	$file_count = 0;
	foreach( $files as $file ){
		if( $file == '.' || $file == '..' ) continue;
		if ( is_dir( $dir . '/' . $file ) ) continue;

		$file_info = pathinfo($file);
		if ($file_info['extension'] !== 'svg') continue;
	
		$emoji = file_get_contents( $dir . '/' . $file );
		$emojis[ $file_info['filename'] ] = $emoji;
		$file_count++;
		if( $file_count > 100 ) break; // limit to 100 emojis for performance reasons
	}
	return $emojis;
}

 /**
  *  Make the SVG JSON objects available in the block editor
  *
  * I Used to do it this way but wp_add_inline_script() seems to be preferred to pass data to the script see: 
 *  https://stackoverflow.com/questions/73220504/passing-data-from-php-to-javascript-for-gutenberg-block-with-editor-script-regis
 * 
 */
function wp_svg_bg_enqueue_block_editor_assets() {
	$svgs = svg_bg_get_svgs();
    wp_localize_script( 'hollands-spoor-svg-bg-editor-script', 'svgObjects', $svgs );
	$emojis = get_emojis();
	wp_localize_script( 'hollands-spoor-svg-bg-editor-script', 'emojiOptions', $emojis );
}

add_action( 'enqueue_block_editor_assets', 'wp_svg_bg_enqueue_block_editor_assets' );




/**
 * temporarily Switched on
 * 
 * There can be good reasons to disallow SVG uploads in WordPress, also for users that want this SVG backgrounds.
 * 
 * I chose to inline the svg instead of uploading it to the media library, i left this here for debug / reference.
 * 
 * To temporarily allow svg upload in WP:
 */
function add_svg_to_uploads($file_types){
  	$file_types['svg'] = 'image/svg+xml';
  	return $file_types;
}
 
add_filter( 'upload_mimes', 'add_svg_to_uploads' );

/**
 * Optionally insert some template files in the db
 * 
 * 
 */

function insert_svg_bg_template_once() {
    // Get the current theme's stylesheet (slug)
    $theme = wp_get_theme();
    $theme_slug = $theme->get_stylesheet();

	$template_contents = '<!-- wp:hollands-spoor/svg-bg {"svgTemplateName":"beach","parameters":{"scale1":0.6,"ratio":4.2,"ratio2":1,"colorpanel":{"color_1":"#FFFFFF","color_2":"#FF9090"}},"preset":1,"layout":{"type":"constrained"}} -->
<div style="background-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%0D%0A%20%20%20%20width%3D%2260%22%20%0D%0A%20%20%20%20height%3D%2260%22%20%0D%0A%20%20%20%20viewBox%3D%220%200%2060%2060%22%3E%0D%0A%20%20%20%20%3Cg%20style%3D%22transform%3A%20scale(0.6)%22%3E%0D%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%224.2%22%20%20height%3D%22100%22%20x%3D%220%22%20y%3D%220%22%20%20fill%3D%22%23FFFFFF%22%20%2F%3E%0D%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%224.2%22%20%20height%3D%22100%22%20x%3D%224.2%22%20y%3D%220%22%20%20fill%3D%22%23FF9090%22%20%2F%3E%0D%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%2250%22%20height%3D%22100%22%20x%3D%228.4%22%20y%3D%220%22%20%20fill%3D%22%23FFFFFF%22%20%2F%3E%0D%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%224.2%22%20%20height%3D%22100%22%20x%3D%2250%22%20y%3D%220%22%20fill%3D%22%23FF9090%22%20%2F%3E%0D%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%224.2%22%20%20height%3D%22100%22%20x%3D%2254.2%22%20y%3D%220%22%20fill%3D%22%23FFFFFF%22%20%2F%3E%0D%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%2250%22%20height%3D%22100%22%20x%3D%2258.4%22%20y%3D%220%22%20fill%3D%22%23FF9090%22%20%2F%3E%0D%0A%20%20%20%20%3C%2Fg%3E%0D%0A%3C%2Fsvg%3E&quot;);background-position:-10% -10%;min-height:100vh" class="wp-block-hollands-spoor-svg-bg hs-svg-bg"><!-- wp:template-part {"slug":"header","theme":"' . $theme_slug . '"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"margin":{"top":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="margin-top:var(--wp--preset--spacing--60)"><!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:post-featured-image {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|60"}}}} /-->

<!-- wp:post-title {"level":1} /-->

<!-- wp:post-content {"align":"full","layout":{"type":"constrained"}} /--></div>
<!-- /wp:group --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","theme":"' . $theme_slug . '"} /--></div>
<!-- /wp:hollands-spoor/svg-bg -->';

    // Check if a template with this slug and theme already exists
    $existing = get_posts( array(
        'post_type'      => 'wp_template',
        'name'           => 'svg-background', // slug
        'tax_query'      => array(
            array(
                'taxonomy' => 'wp_theme',
                'field'    => 'slug',
                'terms'    => $theme_slug,
            ),
        ),
        'post_status'    => 'any',
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ) );

    if ( empty( $existing ) ) {
        // Insert the template
        $template_id = wp_insert_post( array(
            'post_type'    => 'wp_template',
            'post_name'    => 'svg-background',
            'post_status'  => 'publish',
            'post_content' => $template_contents,
            'post_title'   => 'SVG Background',
        ) );

        // Assign to current theme
        if ( $template_id && ! is_wp_error( $template_id ) ) {
            wp_set_object_terms( $template_id, $theme_slug, 'wp_theme' );
        }
    }
}

//add_action( 'after_setup_theme', 'insert_svg_bg_template_once' );

add_action( 'admin_menu', function() {
    add_management_page(
        __( 'SVG BG Tools', 'hs-svg-bg' ),
        __( 'SVG BG Tools', 'hs-svg-bg' ),
        'manage_options',
        'svg-bg-tools',
        'svg_bg_tools_page_callback'
    );
} );

function svg_bg_tools_page_callback() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'SVG Background Tools', 'hs-svg-bg' ); ?></h1>
        <button id="insert-svg-bg-template" class="button button-primary">
            <?php esc_html_e( 'Insert SVG Background Template', 'hs-svg-bg' ); ?>
        </button>
        <div id="svg-bg-template-result" style="margin-top:1em;"></div>
        <script>
        document.getElementById('insert-svg-bg-template').addEventListener('click', function() {
            var btn = this;
            btn.disabled = true;
            btn.textContent = 'Processing...';
            fetch(ajaxurl + '?action=insert_svg_bg_template_once', { method: 'POST', credentials: 'same-origin' })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('svg-bg-template-result').textContent = data.message;
                    btn.disabled = false;
                    btn.textContent = '<?php echo esc_js( __( 'Insert SVG Background Template', 'hs-svg-bg' ) ); ?>';
                });
        });
        </script>
    </div>
    <?php
}

add_action( 'wp_ajax_insert_svg_bg_template_once', function() {
    ob_start();
    insert_svg_bg_template_once();
    $output = ob_get_clean();
    wp_send_json_success( [ 'message' => 'SVG Background template inserted (if it did not already exist).' ] );
} );
