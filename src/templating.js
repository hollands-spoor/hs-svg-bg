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
			if( typeof atts[key] === "object" && !Array.isArray( atts[key] ) ) {
				mergedView[key].value = mergeInAttributes ( mergedView[key].value,  atts[key] )

			} else {
				mergedView[key].value = atts[key];
			}
//		}
	} );
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

const recalc_changed = ( key, myParameters ) => {
	const prop = myParameters[ key ];
	const recalcparameters = prop.recalculate || [];

	// do this for all elements in recalcparameters
	let currentvalue = myParameters[recalcparameters[0].param].value; 
	let lastvalue = myParameters[recalcparameters[0].attribute].value;
	if( lastvalue !== currentvalue ) {
		console.log( 'recalculate: ', key, ' lastvalue: ', lastvalue, ' currentvalue: ', currentvalue );
		return true;
	}
	// end loop for all elements in recalcparameters
	
	return false;
	// rework: return ( lastvalue !== currentvalue );

}

const set_recalc_values = ( key, data ) => {
	const prop = data.parameters[ key ];
	const recalcparameters = prop.recalculate || [];

	recalcparameters.forEach( ( param ) => {
		// just do this: data.parameters[param.param].value = param.value;
		const currentValue = data.parameters[param.param].value;
		const lastValue = data.parameters[param.attribute].value;
		if (lastValue !== currentValue) {
			console.log('Updating value for:', param.param);
			data.parameters[param.attribute].value = currentValue;
		}
	});
	
}

export const maybe_recalculate_parameters = ( data ) => {
	let recalced = false;
	Object.keys( data.parameters ).map( ( key ) => {
		const prop = data.parameters[ key ];
		if ( prop.type === 'calculate' ) {
			if( recalc_changed( key, data.parameters ) ) {
				console.log( 'do recalc for changed key: ', key );
				const recalcfunction = new Function('data', data.functions[prop.function]);
				data.parameters[key].value = recalcfunction( data.parameters, data.functions[prop.function] );
				set_recalc_values( key, data );
				console.log( 'data after recalc: ', data.parameters)
				// set the value AND store the changed value to the attributes
				// renderTemplate receives data as argument which contains also the functions
				recalced = true;
			} else {
				console.log( 'no recalc for key: ', key );
			}
		} 
	} );
	return recalced;
}

export const renderTemplate = ( template, data ) => {
	data.parameters = sanitizeView( data.parameters );

	/**
	 * Some svg's use random numbers in parameters. However if random numbers are changed everytime the svg is rendered, edit and save results will differ and Gutenberg shows an error. So random numbers are calculated and stored in the parameters object when it has an paramater of type 'calculate' The calculation is done in the function parameter.function that also needs data. paramneter.recalculate is an array of other parameter names whose change will trigger a recalculation ( calling the parameter.function again. This way the random points are stored in the attributes ( as part of the parameters ) and in edit function the svg is rendered with the same random points as where used earlier ).
	 * 
	 * The recalculate values of the trigger-parameters need to be stored as well.
	 */

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
