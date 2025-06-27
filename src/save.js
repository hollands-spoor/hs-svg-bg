/* global svgObjects */

// i18n used later?
// import { __ } from '@wordpress/i18n';

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { get_svg_object_by_name, mergeInAttributes, maybe_recalculate_parameters, renderTemplate } from './templating';

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


//TODO: Find out what the extra style is doing here

export default function Save( { attributes } ) {
	let blockProps = useBlockProps.save( {
		style: {},
	} );

	const svgTemplateName = attributes.svgTemplateName;
	if( get_svg_object_by_name( svgTemplateName ) === undefined ) {
		// console.log( 'svgTemplate not found' );
		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	}
	const myObject = get_svg_object_by_name( svgTemplateName );
	
	let myParameters = myObject.parameters;

	myParameters = mergeInAttributes( myParameters, attributes.parameters );
	myObject.parameters = myParameters;
	maybe_recalculate_parameters( myObject );

	const mytemplate = myObject.template;
	const svgResult = renderTemplate( mytemplate, myObject);
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
