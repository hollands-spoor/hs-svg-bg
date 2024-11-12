/* global svgObjects */

// i18n used later?
// import { __ } from '@wordpress/i18n';

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { renderTemplate } from './templating';

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

	let myview = svgObjects[ svgTemplate ].view;

	const mergeInAttributes = ( view, atts ) => {
		// iterate through atts if atts[key] exists and view[key] exists then view[key].value = atts[key]
		const mergedView = { ...view };
		Object.keys( atts ).forEach( ( key ) => {
			if ( mergedView[ key ] ) {
				mergedView[ key ].value = atts[ key ];
			}
		} );
		return mergedView;
	};

	myview = mergeInAttributes( myview, attributes.myview );

	const mytemplate = svgObjects[ svgTemplate ].template;
	const svgResult = renderTemplate( mytemplate, myview );
	const svgDataUri = `data:image/svg+xml,${ encodeURIComponent(
		svgResult
	) }`;

	blockProps = useBlockProps.save( {
		style: { backgroundImage: `url("${ svgDataUri }")` },
		className: 'hs-svg-bg',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
