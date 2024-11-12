/* global svgObjects */

/**
 * Retrieves the translation of text.
 *
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InspectorControls,
	useBlockProps,
	PanelColorSettings,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	RangeControl,
	BaseControl,
	ColorPicker,
	SelectControl,
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Edit an Save both use the rendering function
 */

import { renderTemplate } from './templating';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

export default function Edit( { attributes, setAttributes } ) {
	let blockProps = useBlockProps();

	const svgTemplate = attributes.svgTemplate;

	// if only editable properties are stored in attributes, then myview should be a merge of the view in svgObjects and the attributes

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

	const svgOptions = Object.keys( svgObjects ).map( ( key ) => ( {
		value: key,
		label: svgObjects[ key ].label,
	} ) );

	const getParamsFromView = ( view ) => {
		const newView = Object.fromEntries(
			Object.entries( view )
				.filter( ( [ value ] ) => value.type !== 'jsf' )
				.map( ( [ key, value ] ) => [
					key,
					value.value !== undefined ? value.value : value.default,
				] )
		);
		return newView;
	};
	
	const svgResult = renderTemplate( mytemplate, myview );

	const svgDataUri = `data:image/svg+xml,${ encodeURIComponent(
		svgResult
	) }`;

	blockProps = useBlockProps( {
		style: { backgroundImage: `url("${ svgDataUri }")` },
	} );

	return (
		<>
			<InspectorControls group="styles">
				<PanelBody title={ __( 'Settings', 'svg-background' ) }>
					<SelectControl
						label={ __( 'Select SVG', 'svg-background' ) }
						value={ svgTemplate } // Assuming you have a state variable for the selected option
						options={ svgOptions }
						onChange={ ( value ) => {
							//setAttributes( { svgTemplate: value } ); doing this gives error because myview is not updated yet. Do it all at once down below
							// Only store view properties in attributes that are changed in the editor
							myview = svgObjects[ value ].view;
							const newMyview = getParamsFromView( myview ); // Create a new object
							setAttributes( {
								svgTemplate: value,
								myview: newMyview,
							} );
						} }
					/>
					{ Object.keys( myview ).map( ( key ) => {
						const prop = myview[ key ];
						if ( prop.type === 'range' ) {
							return (
								<RangeControl
									key={ key }
									label={ prop.label }
									value={ prop.value || prop.default }
									onChange={ ( value ) => {
										const newMyview =
											getParamsFromView( myview ); // Create a new object
										newMyview[ key ] = value;
										setAttributes( { myview: newMyview } ); // Update with the new object
										// change it in svgObjects as well for keeping the current changes when template is switched
										svgObjects[ svgTemplate ].view[
											key
										].value = value;
									} }
									min={ prop.min }
									max={ prop.max }
									step={ prop.step }
								/>
							);
						} else if ( prop.type === 'string' ) {
							return (
								<TextControl
									key={ key }
									label={ prop.label }
									value={ myview[ key ].value }
									onChange={ ( value ) => {
										const newMyview =
											getParamsFromView( myview ); // Create a new object
										newMyview[ key ] = value;
										setAttributes( { myview: newMyview } ); // Update with the new object
										// change it in svgObjects as well for keeping the current changes when template is switched
										svgObjects[ svgTemplate ].view[
											key
										].value = value;
									} }
								/>
							);
						} else if ( prop.type === 'colorpicker' ) {
							return (
								<BaseControl
									key={ key }
									label={ prop.label }
									id={ `colorpicker-${ key }` }
								>
									<ColorPicker
										color={ myview[ key ].value }
										onChange={ ( value ) => {
											const newMyview =
												getParamsFromView( myview ); // Create a new object
											newMyview[ key ] = value;
											setAttributes( {
												myview: newMyview,
											} ); // Update with the new object
											// change it in svgObjects as well for keeping the current changes when template is switched
											svgObjects[ svgTemplate ].view[
												key
											].value = value;
										} }
										enableAlpha
										defaultValue={ '#000' }
									/>
								</BaseControl>
							);
						} else if ( prop.type === 'colorpanel' ) {
							// get colors from value, if value not set use default
							const colors = prop.value || prop.default;

							// Example of prop.value:
							/* "value" : { 
									"foreground": { "label" : "Foreground", "default" : "#000000", "value" :  },
									"background": { "label" : "Background", "default" : "#ff0000" },
									"stroke" : { "label" : "Color 3", "default" : "#00ff00" }
								},
							*/
							const colorSettings = Object.keys( colors ).map(
								( colorKey ) => ( {
									value:
										colors[ colorKey ].value !== undefined
											? colors[ colorKey ].value
											: colors[ colorKey ].default,
									onChange: ( value ) => {
										const newMyview =
											getParamsFromView( myview ); // Create a new object
										colors[ colorKey ].value = value;
										// now save colors to attributes
										newMyview[key] = colors;
										setAttributes( { myview: newMyview } ); 
										//change it in svgObjects as well for keeping the current changes when template is switched
										svgObjects[svgTemplate].view[key].value = value;
									},
									label: colors[ colorKey ].label,
								} )
							);

							return (
								<PanelColorSettings
									key={ key }
									title={ prop.label }
									colorSettings={ colorSettings }
								/>
							);
						}
						return null;
					} ) }
					{ }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					template={ [
						[ 'core/paragraph', { placeholder: 'Add text...' } ],
					] }
				/>

			</div>
		</>
	);
}
