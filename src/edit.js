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

import { get_svg_object_by_name, mergeInAttributes, renderTemplate, mergeDeep } from './templating';

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
	// TODO: improve name of myObject
	// TODO: svgTemplate should be called svgTemplateName
	// TODO: whene svgTemplate is not changed, its name is not saved in the attributes. Not breakingm but not nice
	// TODO: Remove stroke_width param from diamonds template
	let myObject = get_svg_object_by_name( svgTemplate );

	// if only editable properties are stored in attributes, then myview should be a merge of the view in svgObjects and the attributes

	let myview = myObject.view;
	// Check this view???
	myview.parameters = mergeInAttributes( myview.parameters, attributes.myview );

	// Before going on, check if a preset is set, if so, merge the preset also into myview
	// Nonono!! Now preset is loaded on every render. Do this only if selected preset changes
	const has_presets = ( typeof myObject.presets !== 'undefined' );
	let myPreset = typeof( attributes.myPreset ) !== 'undefined' ? attributes.myPreset : 0;
	let myPresets = typeof( myObject.presets ) !== 'undefined' ? myObject.presets : [];

	const mytemplate = myObject.template;

	const svgOptions = Object.keys( svgObjects ).map( ( key ) => ( {
		value: svgObjects[ key ].name,
		label: svgObjects[ key ].label,
	} ) );

	const getParamsFromView = (view) => {
		const processValue = (value) => {
		  if (value !== null && typeof value === 'object') {
			return Object.fromEntries(
			  Object.entries(value).map(([key, val]) => [
				key,
				processValue(val.value !== undefined ? val.value : val.default),
			  ])
			);
		  }
		  return value;
		};
	  
		const newView = Object.fromEntries(
		  Object.entries(view.parameters).map(([key, value]) => [
			key,
			processValue(value.value !== undefined ? value.value : value.default),
		  ])
		);
	  
		return newView;
	  };

	const svgResult = renderTemplate( mytemplate, myview );

	const svgDataUri = `data:image/svg+xml,${ encodeURIComponent(
		svgResult
	) }`;

	blockProps = useBlockProps( {
		style: { backgroundImage: `url("${ svgDataUri }")`,  backgroundPosition: '-10% -10%'},
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
							/**
							 * setAttributes( { svgTemplate: value } ) <-- doing this gives an error because myview is not updated yet. 
							 * Do both updates at once down below.
							 * 
							 * btw: Only store view properties in attributes that are changed in the editor
							 *
							 * FIX: don't use index immediately, adding / removing templates can change the index
							 * Use the name of the json/svg file instead as value
							 * And use that value to get the index in the svgObjects array
							 * 
							 * mview = get_svg_object_by_name( value ).view
							 * 
							 * FIX: if you switch between 2 instances of the same svg_template, the colors are mixed up in the newly selected one, probably because the colors are stored in the svgObjects array. Same goes for the preset nr. Better set preset to 0 when switching templates
							 */
							
							const myview = get_svg_object_by_name( value ).view;
							/**
							 * We could just use view.parameters. But getParamsFromView creates a new object.
							 * I understood from somewhere that creating a new object is needed for react to 
							 * recognize the change and rerender. Not sure if this is true. 
							 * TODO check this
							 * For now I adjusted getParamasFromView 
							 */
							const newMyview = getParamsFromView( myview ); // Create a new object
							setAttributes( {
								svgTemplate: value,
								myview: newMyview,
							} );
						} }
					/>
					{ has_presets && (
						<SelectControl 
							label={ __( 'Presets', 'svg-background' ) }
							value={ myPreset }
							options={ [ { value: 0, label : 'None'}, ...myPresets.map( ( preset, index ) => ( {
								value: index + 1,
								label: preset.label,
							} ) ) ] }
							onChange = { ( value ) => {
								// Merge the preset into myview and save the myview attribute
								if ( value > 0 ) {
									//console.log( 'previeous view: ', myObject.view );
									let newMyview2 = getParamsFromView( myObject.view ); 
									//console.log( 'parameters view: ', newMyview2 );
								// Merge myPresets[myPreset - 1].view into myview recursively
									newMyview2 = mergeDeep(newMyview2, myPresets[value - 1].view);
									setAttributes( { myPreset: parseInt( value, 10 ), myview: newMyview2 } );
									//console.log( 'new view: ', newMyview2 );
								} else {
								// No preset selected, just save the preset index. Maybe switch to default values of view?
									setAttributes( { myPreset: parseInt( value, 10 ) } );
								
								}
							} } />

					)}
					{ Object.keys( myview.parameters ).map( ( key ) => {
						const prop = myview.parameters[ key ];
						if ( prop.type === 'range' ) {
							return (
								<RangeControl
									key={ key }
									label={ prop.label }
									value={ prop.value || prop.default }
									onChange={ ( value ) => {
										const newMyview = getParamsFromView( myview ); // Create a new object
										newMyview[ key ] = value;
										setAttributes( { myview: newMyview } ); // Update with the new object
										// change it in svgObjects as well for keeping the current changes when template is switched
										get_svg_object_by_name( svgTemplate ).view.parameters[
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
									value={ prop.value }
									onChange={ ( value ) => {
										const newMyview = getParamsFromView( myview ); // Create a new object
										newMyview[ key ] = value;
										setAttributes( { myview: newMyview } ); // Update with the new object
										// change it in svgObjects as well for keeping the current changes when template is switched
										get_svg_object_by_name( svgTemplate ).view.parameters[
											key
										].value = value;
									} }
								/>
							);
						} else if ( prop.type === 'select' ) {
							return (
								<SelectControl 
									key = { prop.key }
									label={ prop.label }
									value={ prop.value }
									
									options={ 
										Object.entries(prop.options).map(([key, value]) => ({
											value: key,
											label: value,
										  }))
									 }
									onChange = { ( value ) => {
										console.log( 'change figure to: ', value );
										const newMyview = getParamsFromView( myview ); // Create a new object
										newMyview[ key ] = value;
										setAttributes( { myview: newMyview } ); // Update with the new 


									} } 
								/>
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
										const newMyview = getParamsFromView( myview ); // Create a new object
										colors[ colorKey ].value = value;
										// now save color to attributes
										newMyview[key][colorKey] = value;
										setAttributes( { myview: newMyview } ); 
										//change it in svgObjects as well for keeping the current changes when template is switched
										// Fix: if you switch between 2 instances of the same svg_template, the colors are mixed up in the newly selected one, probably because the colors are stored in the svgObjects array
										// Fix: this remains problematic, see to it:
										get_svg_object_by_name( svgTemplate ).view.parameters[key].value = colors;
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
