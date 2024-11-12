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
