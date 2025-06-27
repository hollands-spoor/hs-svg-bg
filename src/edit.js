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

import { get_svg_object_by_name, mergeInAttributes, renderTemplate, mergeDeep, maybe_recalculate_parameters } from './templating';

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

	let svgTemplateName = attributes.svgTemplateName;

	if( svgTemplateName=== undefined || svgTemplateName === '' ) {
		svgTemplateName = svgObjects[0].name;
		setAttributes( {
			svgTemplateName: svgTemplateName,
		} );
	}

	const getParamsFromSVGObject = (SVGObject) => {
		const processValue = (value) => {
		// js returns also 'object' when type is really an array. So first check if type of value is array
			if (value !== null && Array.isArray(value)) {
				return value;
			}
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
			  
		maybe_recalculate_parameters( SVGObject );
		const newParameters = Object.fromEntries(
		  Object.entries(SVGObject.parameters).map(([key, value]) => [
			key,
			processValue(value.value !== undefined ? value.value : value.default),
		  ])
		);

	  
		return newParameters;
	  };

	// TODO: improve name of myObject
	// DONE: svgTemplate should be called svgTemplateName
	// DONE: whene svgTemplate is not changed, its name is not saved in the attributes. Not breakingm but not nice <-- Yes, this is a problem.
	// TODO: Remove stroke_width param from diamonds template
	// DONE: svgObject.view.parameters => svgObject.parameters <- bit of rework needed here
	let myObject = get_svg_object_by_name( svgTemplateName );

	// if only editable properties are stored in attributes, then myview should be a merge of the view in svgObjects and the attributes

	let myParameters = myObject.parameters;


	// Check this view???
	myParameters = mergeInAttributes( myParameters, attributes.parameters );

	// Before going on, check if a preset is set, if so, merge the preset also into myview
	// Nonono!! Now preset is loaded on every render. Do this only if selected preset changes
	const has_presets = ( typeof myObject.presets !== 'undefined' );
	let myPreset = typeof( attributes.preset ) !== 'undefined' ? attributes.preset : 0;
	let myPresets = typeof( myObject.presets ) !== 'undefined' ? myObject.presets : [];

	const mytemplate = myObject.template;

	// For selectbox that choses background svg
	const svgOptions = Object.keys( svgObjects ).map( ( key ) => ( {
		value: svgObjects[ key ].name,
		label: svgObjects[ key ].label,
	} ) );


	if( attributes.parameters === undefined || attributes.parameters.length == 0 ) {
		let newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
		// is creating a new object neccesary here?  otherwise just use setAttributs ( { myview : myview.parameters } )	
		setAttributes( {
			svgTemplateName: svgTemplateName,
			parameters: newMyParameters,
		} );
	}


  
	// TODO: To prevent changes all the time let's only re-render when the parameters change
	// Well, i've done it somewhat different now. We calculate the ranndom numbers here and add them to the attributes
	// So: iterate througe the parameters and if type = calculate, we calculate then here
	// i did this in templating function, for save function needs it as well. Or does it?

	const svgResult = renderTemplate( mytemplate, myObject );

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
						value={ svgTemplateName } // Assuming you have a state variable for the selected option
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
							
							const myObject = get_svg_object_by_name( value );
							/**
							 * We could just use view.parameters. But getParamsFromView creates a new object.
							 * I understood from somewhere that creating a new object is needed for react to 
							 * recognize the change and rerender. Not sure if this is true. 
							 * TODO: check this
							 * For now I adjusted getParamasFromView 
							 */
							const newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
							setAttributes( {
								svgTemplateName: value,
								parameters: newMyParameters,
							} );
						} }
						__nextHasNoMarginBottom={ true }
						__next40pxDefaultSize={ true }
					/>
					{ has_presets && (
						<SelectControl 
							label={ __( 'Presets Nieuws', 'svg-background' ) }
							value={ myPreset }
							options={ [ { value: 0, label : 'None'}, ...myPresets.map( ( preset, index ) => ( {
								value: index + 1,
								label: preset.label,
							} ) ) ] }
							onChange = { ( value ) => {
								// Merge the preset into myview and save the myview attribute
								if ( value > 0 ) {
									//console.log( 'previeous view: ', myObject.view );
									let newMyParameters = getParamsFromSVGObject( myObject ); 
									//console.log( 'parameters view: ', newMyview2 );
								// Merge myPresets[myPreset - 1].view into myview recursively
									newMyParameters = mergeDeep(newMyParameters, myPresets[value - 1].parameters);
									setAttributes( { preset: parseInt( value, 10 ), parameters: newMyParameters } );
									//console.log( 'new view: ', newMyview2 );
								} else {
								// No preset selected, just save the preset index. Maybe switch to default values of view?
									setAttributes( { preset: parseInt( value, 10 ) } );
								
								}
							} }
							__nextHasNoMarginBottom={ true }
							__next40pxDefaultSize={ true }
						/>

					)}
					{ Object.keys( myParameters ).map( ( key ) => {
						const prop = myParameters[ key ];
						if ( prop.type === 'range' ) {
							return (
								<RangeControl
									key={ key }
									label={ prop.label }
									value={ prop.value || prop.default }
									onChange={ ( value ) => {
										myObject.parameters[ key ].value = value; // Update the object directly

										const newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
										// newMyParameters[ key ] = value;




										setAttributes( { parameters: newMyParameters } ); // Update with the new object
										// change it in svgObjects as well for keeping the current changes when template is switched
										get_svg_object_by_name( svgTemplateName ).parameters[key].value = value;
									} }
									min={ prop.min }
									max={ prop.max }
									step={ prop.step }
									__next40pxDefaultSize={ true }
									__nextHasNoMarginBottom={ true }
								/>
							);
						} else if ( prop.type === 'string' ) {
							return (
								<TextControl
									key={ key }
									label={ prop.label }
									value={ prop.value }
									onChange={ ( value ) => {
										const newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
										newMyParameters[ key ] = value;
										setAttributes( { parameters: newMyParameters } ); // Update with the new object
										// change it in svgObjects as well for keeping the current changes when template is switched
										get_svg_object_by_name( svgTemplateName ).parameters[
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
										const newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
										newMyParameters[ key ] = value;
										setAttributes( { parameters: newMyParameters } ); // Update with the new 


									} } 
									__nextHasNoMarginBottom={ true }
									__next40pxDefaultSize={ true }
								/>
							);	
						} else if ( prop.type === 'emojiselect' ) {
								prop.options = emojiOptions;
								return (
									<SelectControl
										key={ prop.key }
										label={ prop.label }
										value={ prop.value }
										
										options={ 
											Object.entries(prop.options).map(([key, value]) => ({
												value: value,
												label: key,
											  }))
										 }
										onChange = { ( value ) => {
											console.log( 'change figure to: ', value );
											const newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
											newMyParameters[ key ] = value;
											setAttributes( { parameters: newMyParameters } ); 
	
	
										} } 
										__nextHasNoMarginBottom={ true }
										__next40pxDefaultSize={ true }
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
										const newMyParameters = getParamsFromSVGObject( myObject ); // Create a new object
										colors[ colorKey ].value = value;
										// now save color to attributes
										newMyParameters[key][colorKey] = value;
										setAttributes( { parameters: newMyParameters } ); 
										//change it in svgObjects as well for keeping the current changes when template is switched
										// Fix: if you switch between 2 instances of the same svg_template, the colors are mixed up in the newly selected one, probably because the colors are stored in the svgObjects array
										// Fix: this remains problematic, see to it:
										get_svg_object_by_name( svgTemplateName ).parameters[key].value = colors;
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
						} else if ( prop.type === 'calculate') {
							// here parameter value is filled with a function. But this does nt add an inspector control. So this should be handled before the return statement
							// TODO: but maybe we want some kind of dice/recalculate control (button?) here to force/trigger the calculate function.
							<button 
								onClick={ () => { console.log('recalc button');/* Trigger calculate function here */ } }>
									Recalculate Now!
							</button>
							

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
