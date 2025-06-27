

import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';


function PluginDocumentSettingPanelDemo () { 
    const [ metaValue, setMetaValue ] = useState( 'svg1' );
    console.log( 'function called, metavalue: ', metaValue );


    return (
    
    <PluginDocumentSettingPanel
        name="custom-panel"
        title="Custom Panel"
        className="custom-panel"
    >
        <SelectControl
            label={ __( 'Select SVG', 'svg-background' ) }
            value={ metaValue } 
            options={ [
                { label: __( 'SVG Option 1', 'svg-background' ), value: 'svg1' },
                { label: __( 'SVG Option 2', 'svg-background' ), value: 'svg2' },
            ] }
            onChange={ ( value ) => {
                // set a meta or something like that
                console.log( 'Selected SVG:', value );
                setMetaValue(value);
            } }
        />
    </PluginDocumentSettingPanel>
)}




export default function registerDocSettings() {

    console.log('Register a plugin for document settings sidebar.');

    registerPlugin( 'plugin-document-setting-panel-demo', {
        render: PluginDocumentSettingPanelDemo,
        icon: 'palmtree',
    } );
    console.log('Plugin registered.');
}