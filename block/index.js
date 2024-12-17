/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");
/* harmony import */ var _templating__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./templating */ "./src/templating.js");

/* global svgObjects */

/**
 * Retrieves the translation of text.
 *
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */



/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Edit an Save both use the rendering function
 */



/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

function Edit({
  attributes,
  setAttributes
}) {
  let blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
  const svgTemplate = attributes.svgTemplate;
  // TODO: improve name of myObject
  // TODO: svgTemplate should be called svgTemplateName
  // TODO: whene svgTemplate is not changed, its name is not saved in the attributes. Not breakingm but not nice
  // TODO: Remove stroke_width param from diamonds template
  let myObject = (0,_templating__WEBPACK_IMPORTED_MODULE_5__.get_svg_object_by_name)(svgTemplate);

  // if only editable properties are stored in attributes, then myview should be a merge of the view in svgObjects and the attributes

  let myview = myObject.view;
  // Check this view???
  myview.parameters = (0,_templating__WEBPACK_IMPORTED_MODULE_5__.mergeInAttributes)(myview.parameters, attributes.myview);

  // Before going on, check if a preset is set, if so, merge the preset also into myview
  // Nonono!! Now preset is loaded on every render. Do this only if selected preset changes
  const has_presets = typeof myObject.presets !== 'undefined';
  let myPreset = typeof attributes.myPreset !== 'undefined' ? attributes.myPreset : 0;
  let myPresets = typeof myObject.presets !== 'undefined' ? myObject.presets : [];
  const mytemplate = myObject.template;
  const svgOptions = Object.keys(svgObjects).map(key => ({
    value: svgObjects[key].name,
    label: svgObjects[key].label
  }));
  const getParamsFromView = view => {
    const processValue = value => {
      if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, processValue(val.value !== undefined ? val.value : val.default)]));
      }
      return value;
    };
    const newView = Object.fromEntries(Object.entries(view.parameters).map(([key, value]) => [key, processValue(value.value !== undefined ? value.value : value.default)]));
    return newView;
  };
  const svgResult = (0,_templating__WEBPACK_IMPORTED_MODULE_5__.renderTemplate)(mytemplate, myview);
  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(svgResult)}`;
  blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    style: {
      backgroundImage: `url("${svgDataUri}")`,
      backgroundPosition: '-10% -10%'
    }
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    group: "styles"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'svg-background')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select SVG', 'svg-background'),
    value: svgTemplate // Assuming you have a state variable for the selected option
    ,
    options: svgOptions,
    onChange: value => {
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

      const myview = (0,_templating__WEBPACK_IMPORTED_MODULE_5__.get_svg_object_by_name)(value).view;
      /**
       * We could just use view.parameters. But getParamsFromView creates a new object.
       * I understood from somewhere that creating a new object is needed for react to 
       * recognize the change and rerender. Not sure if this is true. 
       * TODO check this
       * For now I adjusted getParamasFromView 
       */
      const newMyview = getParamsFromView(myview); // Create a new object
      setAttributes({
        svgTemplate: value,
        myview: newMyview
      });
    }
  }), has_presets && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Presets', 'svg-background'),
    value: myPreset,
    options: [{
      value: 0,
      label: 'None'
    }, ...myPresets.map((preset, index) => ({
      value: index + 1,
      label: preset.label
    }))],
    onChange: value => {
      // Merge the preset into myview and save the myview attribute
      if (value > 0) {
        //console.log( 'previeous view: ', myObject.view );
        let newMyview2 = getParamsFromView(myObject.view);
        //console.log( 'parameters view: ', newMyview2 );
        // Merge myPresets[myPreset - 1].view into myview recursively
        newMyview2 = (0,_templating__WEBPACK_IMPORTED_MODULE_5__.mergeDeep)(newMyview2, myPresets[value - 1].view);
        setAttributes({
          myPreset: parseInt(value, 10),
          myview: newMyview2
        });
        //console.log( 'new view: ', newMyview2 );
      } else {
        // No preset selected, just save the preset index. Maybe switch to default values of view?
        setAttributes({
          myPreset: parseInt(value, 10)
        });
      }
    }
  }), Object.keys(myview.parameters).map(key => {
    const prop = myview.parameters[key];
    if (prop.type === 'range') {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
        key: key,
        label: prop.label,
        value: prop.value || prop.default,
        onChange: value => {
          const newMyview = getParamsFromView(myview); // Create a new object
          newMyview[key] = value;
          setAttributes({
            myview: newMyview
          }); // Update with the new object
          // change it in svgObjects as well for keeping the current changes when template is switched
          (0,_templating__WEBPACK_IMPORTED_MODULE_5__.get_svg_object_by_name)(svgTemplate).view.parameters[key].value = value;
        },
        min: prop.min,
        max: prop.max,
        step: prop.step
      });
    } else if (prop.type === 'string') {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
        key: key,
        label: prop.label,
        value: prop.value,
        onChange: value => {
          const newMyview = getParamsFromView(myview); // Create a new object
          newMyview[key] = value;
          setAttributes({
            myview: newMyview
          }); // Update with the new object
          // change it in svgObjects as well for keeping the current changes when template is switched
          (0,_templating__WEBPACK_IMPORTED_MODULE_5__.get_svg_object_by_name)(svgTemplate).view.parameters[key].value = value;
        }
      });
    } else if (prop.type === 'select') {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
        key: prop.key,
        label: prop.label,
        value: prop.value,
        options: Object.entries(prop.options).map(([key, value]) => ({
          value: key,
          label: value
        })),
        onChange: value => {
          console.log('change figure to: ', value);
          const newMyview = getParamsFromView(myview); // Create a new object
          newMyview[key] = value;
          setAttributes({
            myview: newMyview
          }); // Update with the new 
        }
      });
    } else if (prop.type === 'colorpanel') {
      // get colors from value, if value not set use default
      const colors = prop.value || prop.default;

      // Example of prop.value:
      /* "value" : { 
      		"foreground": { "label" : "Foreground", "default" : "#000000", "value" :  },
      		"background": { "label" : "Background", "default" : "#ff0000" },
      		"stroke" : { "label" : "Color 3", "default" : "#00ff00" }
      	},
      */
      const colorSettings = Object.keys(colors).map(colorKey => ({
        value: colors[colorKey].value !== undefined ? colors[colorKey].value : colors[colorKey].default,
        onChange: value => {
          const newMyview = getParamsFromView(myview); // Create a new object
          colors[colorKey].value = value;
          // now save color to attributes
          newMyview[key][colorKey] = value;
          setAttributes({
            myview: newMyview
          });
          //change it in svgObjects as well for keeping the current changes when template is switched
          // Fix: if you switch between 2 instances of the same svg_template, the colors are mixed up in the newly selected one, probably because the colors are stored in the svgObjects array
          // Fix: this remains problematic, see to it:
          (0,_templating__WEBPACK_IMPORTED_MODULE_5__.get_svg_object_by_name)(svgTemplate).view.parameters[key].value = colors;
        },
        label: colors[colorKey].label
      }));
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
        key: key,
        title: prop.label,
        colorSettings: colorSettings
      });
    }
    return null;
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
    template: [['core/paragraph', {
      placeholder: 'Add text...'
    }]]
  })));
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/block.json");

/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

const svgIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V7h15v12zM9 10H7v2h2v-2zm0 4H7v2h2v-2zm4-4h-2v2h2v-2zm4 0h-2v2h2v-2zm-4 4h-2v2h2v-2zm4 0h-2v2h2v-2z"
}));
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  icon: svgIcon,
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Save; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _templating__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templating */ "./src/templating.js");

/* global svgObjects */

// i18n used later?
// import { __ } from '@wordpress/i18n';




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

function Save({
  attributes
}) {
  let blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    style: {}
  });
  const svgTemplate = attributes.svgTemplate;
  if ((0,_templating__WEBPACK_IMPORTED_MODULE_2__.get_svg_object_by_name)(svgTemplate) === undefined) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
  }
  let myview = (0,_templating__WEBPACK_IMPORTED_MODULE_2__.get_svg_object_by_name)(svgTemplate).view;
  myview.parameters = (0,_templating__WEBPACK_IMPORTED_MODULE_2__.mergeInAttributes)(myview.parameters, attributes.myview);
  const mytemplate = (0,_templating__WEBPACK_IMPORTED_MODULE_2__.get_svg_object_by_name)(svgTemplate).template;
  const svgResult = (0,_templating__WEBPACK_IMPORTED_MODULE_2__.renderTemplate)(mytemplate, myview);
  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(svgResult)}`;
  blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    style: {
      backgroundImage: `url("${svgDataUri}")`,
      backgroundPosition: '-10% -10%'
    },
    className: 'hs-svg-bg'
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
}

/***/ }),

/***/ "./src/templating.js":
/*!***************************!*\
  !*** ./src/templating.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get_svg_object_by_name: function() { return /* binding */ get_svg_object_by_name; },
/* harmony export */   mergeDeep: function() { return /* binding */ mergeDeep; },
/* harmony export */   mergeInAttributes: function() { return /* binding */ mergeInAttributes; },
/* harmony export */   renderTemplate: function() { return /* binding */ renderTemplate; }
/* harmony export */ });
/**
 * 
 * @param {*} name 
 * @returns 
 */

const get_svg_object_by_name = name => {
  return svgObjects.find(obj => obj.name === name);
};
const mergeInAttributes = (view, atts) => {
  // iterate through atts if atts[key] exists and view.parameters[key] exists then view[key].value = atts[key]
  const mergedView = {
    ...view
  };
  Object.keys(atts).forEach(key => {
    // if mergedView[key] does not exist, then create it. Not just ignore it!!
    //		if ( mergedView[ key ] ) {
    if (typeof mergedView[key] === "undefined") {
      mergedView[key] = {
        value: {}
      };
    }
    if (typeof mergedView[key].value === "undefined") {
      mergedView[key].value = {};
    }
    if (typeof atts[key] === "object") {
      mergedView[key].value = mergeInAttributes(mergedView[key].value, atts[key]);
    } else {
      mergedView[key].value = atts[key];
    }
    //		}
  });
  //console.log( 'view: ', view, ' merged view: ', mergedView );
  return mergedView;
};
const mergeDeep = (target, source) => {
  const output = {
    ...target
  };
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

const sanitizeView = view => {
  Object.keys(view).forEach(key => {
    if (typeof view[key].value === 'undefined' && typeof view[key].default !== 'undefined') {
      view[key].value = view[key].default;
    }

    // if view[key]default is an object, than also sanitize it recursively
    if (typeof view[key].value !== 'undefined' && typeof view[key].value === 'object') {
      view[key].value = sanitizeView(view[key].value);
    }
  });
  return view;
};
const renderTemplate = (template, data) => {
  data.parameters = sanitizeView(data.parameters);
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    // Check if trimmedKey is in parameters, if so, return parameters[trimmedKey].value
    if (typeof data.parameters[trimmedKey] !== 'undefined') {
      return data.parameters[trimmedKey].value;
    }
    // If trimmedKey is in functions, than evaluate that function passing  data.parameters as argument
    if (typeof data.functions[trimmedKey] !== 'undefined') {
      const calcFunction = new Function('data', 'key', data.functions[trimmedKey]);
      const returndata = calcFunction(data.parameters, trimmedKey, data.functions[trimmedKey]);
      return returndata;
    }
    return 'no-render';
  });
};

/***/ }),

/***/ "./src/editor.scss":
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ (function(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"hollands-spoor/svg-bg","version":"0.1.0","title":"SVG Background","category":"widgets","icon":"smiley","description":"Provides a block with an adjustable SVG background.","example":{},"attributes":{"svgTemplate":{"type":"string","default":"asanoha"},"myview":{"type":"object","default":{}},"mytemplate":{"type":"string","default":""},"myPreset":{"type":"integer","default":0}},"supports":{"html":false,"layout":true,"align":true,"background":{"backgroundImage":true,"backgroundSize":true},"spacing":{"padding":true,"margin":true}},"textdomain":"hs-svg-bg","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkhs_svg_bg"] = self["webpackChunkhs_svg_bg"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], function() { return __webpack_require__("./src/index.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map