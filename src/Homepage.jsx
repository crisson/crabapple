import React from 'react';
import {AppCanvas, AppBar, FlatButton, FontIcon} from 'material-ui'

import Body from '@scrabble/components/Body.jsx'

export default React.createClass({

    displayName: 'App',

    render() {
        let githubIcon = (
            <FlatButton className="github-icon-button" linkButton={true} href="https://github.com/crisson/scrabble" secondary={true}>
              <FontIcon className="muidocs-icon-custom-github"/>
              <span className="mui-flat-button-label">Github</span>
            </FlatButton>
        )

        return (
            <div>
                <AppBar title="Crabapple Time" iconElementRight={githubIcon}/>
                <AppCanvas className="wrapper">
                    <Body />
                </AppCanvas>
                
            </div>
        );
    }

});