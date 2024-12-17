/**
 * 
 * @param {*} name 
 * @returns 
 */

export const get_svg_object_by_name = ( name ) => {
	return svgObjects.find( ( obj ) => obj.name === name );
}

export const mergeInAttributes = ( view, atts ) => {
	// iterate through atts if atts[key] exists and view.parameters[key] exists then view[key].value = atts[key]
	const mergedView = { ...view};
	Object.keys( atts ).forEach( ( key ) => {

		// if mergedView[key] does not exist, then create it. Not just ignore it!!
//		if ( mergedView[ key ] ) {
			if( typeof mergedView[key] === "undefined" ) {
				mergedView[key] = { value: {} };
			}
			if( typeof mergedView[key].value === "undefined" ) {
				mergedView[key].value = {};
			}
			if( typeof atts[key] === "object") {
				mergedView[key].value = mergeInAttributes ( mergedView[key].value,  atts[key] )

			} else {
				mergedView[key].value = atts[key];
			}
//		}
	} );
	//console.log( 'view: ', view, ' merged view: ', mergedView );
	return mergedView;
};

export const mergeDeep = (target, source) => {
	const output = { ...target };
  
	for (const key in source) {
	  if (source[key] instanceof Object && key in target) {
		output[key] = mergeDeep(target[key], source[key]);
	  } else {
		output[key] = source[key];
	  }
	}
  
	return output;
  };
/**
 * Make sure the properties of view all have a value. 
 */

const sanitizeView = ( view ) => {
	Object.keys( view ).forEach( ( key ) => {
		if (
			typeof view[ key ].value === 'undefined' &&
			typeof view[ key ].default !== 'undefined'
		) {
			view[ key ].value = view[ key ].default;
		}

		// if view[key]default is an object, than also sanitize it recursively
		if (
			typeof view[ key ].value !== 'undefined' &&
			typeof view[ key ].value === 'object'
		) {
			view[ key ].value = sanitizeView( view[ key ].value );
		}
	} );
	return view;
};

export const renderTemplate = ( template, data ) => {
	data.parameters = sanitizeView( data.parameters );
	return template.replace( /{{(.*?)}}/g, ( _, key ) => {
		const trimmedKey = key.trim();
		// Check if trimmedKey is in parameters, if so, return parameters[trimmedKey].value
		if( typeof data.parameters[trimmedKey] !== 'undefined' ) {
			return data.parameters[trimmedKey].value;
		}
		// If trimmedKey is in functions, than evaluate that function passing  data.parameters as argument
		if( typeof data.functions[trimmedKey] !== 'undefined' ) {
			const calcFunction = new Function( 'data', 'key', data.functions[trimmedKey] );
			const returndata = calcFunction( data.parameters, trimmedKey, data.functions[trimmedKey] );
			return returndata;
		}
		return 'no-render';
	} );
};
