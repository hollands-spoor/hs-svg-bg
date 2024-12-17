<?php
/**
 * Plugin Name:       HS SVG Bg
 * Description:       Block with an SVG background that can be adjusted in block-editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.2.0
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
 