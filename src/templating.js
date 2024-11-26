/**
 * 
 * @param {*} name 
 * @returns 
 */

export const get_svg_object_by_name = ( name ) => {
	return svgObjects.find( ( obj ) => obj.name === name );
}

export const mergeInAttributes = ( view, atts ) => {
	// iterate through atts if atts[key] exists and view[key] exists then view[key].value = atts[key]
	const mergedView = { ...view };
	Object.keys( atts ).forEach( ( key ) => {
		if ( mergedView[ key ] ) {
			mergedView[ key ].value = atts[ key ];
		}
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

export const renderTemplate = ( template, data ) => {
	data = sanitizeView( data );
	return template.replace( /{{(.*?)}}/g, ( _, key ) => {
		const trimmedKey = key.trim();
		// TODO: check if data[trimmedKey] exists
		const prop = data[ trimmedKey ];

		if ( prop && prop.type === 'jsf' && prop.calc ) {
			const calcFunction = new Function( 'data', 'key', prop.calc );
			const returndata = calcFunction( data, key, prop.value );
			return returndata;
		}
		if ( prop && prop.type !== 'jsf' ) {
			return prop.value;
		}
		return 'no-render';
	} );
};
