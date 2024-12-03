/* global svgObjects */

// i18n used later?
// import { __ } from '@wordpress/i18n';

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { get_svg_object_by_name, mergeInAttributes, renderTemplate } from './templating';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param  {Object}  root0 - The root parameter object.
 * @param  {Object}  root0.attributes - The attributes object.
 * @return {Element} Element to render.
 */

export default function Save( { attributes } ) {
	let blockProps = useBlockProps.save( {
		style: {},
	} );

	const svgTemplate = attributes.svgTemplate;
	if( get_svg_object_by_name( svgTemplate ) === undefined ) {
		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	}

	let myview = get_svg_object_by_name( svgTemplate ).view;

	myview.parameters = mergeInAttributes( myview.parameters, attributes.myview );

	const mytemplate = get_svg_object_by_name( svgTemplate ).template;
	const svgResult = renderTemplate( mytemplate, myview );
	const svgDataUri = `data:image/svg+xml,${ encodeURIComponent(
		svgResult
	) }`;

	blockProps = useBlockProps.save( {
		style: { backgroundImage: `url("${ svgDataUri }")`, backgroundPosition: '-10% -10%' },
		className: 'hs-svg-bg',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
