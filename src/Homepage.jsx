import React from 'react';
import {AppCanvas, AppBar} from 'material-ui'

import Body from '@scrabble/components/Body.jsx'

export default React.createClass({

    displayName: 'App',

    render() {
        return (
            <div>
                <AppBar title="Scrabble"/>
                <AppCanvas className="wrapper">
                    <Body />
                </AppCanvas>
                
            </div>
        );
    }

});