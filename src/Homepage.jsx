import React from 'react';
import {AppCanvas, AppBar, FlatButton, FontIcon} from 'material-ui'

import Body from '@scrabble/components/Body.jsx'
import Spinner from '@scrabble/components/Spinner.jsx'

import Crabapple from '@scrabble/service'

export default React.createClass({

    displayName: 'App',

    getInitialState() {
        return {};
    },

    componentDidMount(){
        let gs = Crabapple.getOrCreateGame()
        gs.onValue(gameState => this.setState({gameState}))
    },

    render() {
        let {gameState} = this.state

        let githubIcon = (
            <FlatButton className="github-icon-button" linkButton={true} href="https://github.com/crisson/scrabble" secondary={true}>
              <FontIcon className="muidocs-icon-custom-github"/>
              <span className="mui-flat-button-label">Github</span>
            </FlatButton>
        )

        var content = (<Spinner />)
        if (gameState) {
            content = <Body gameState={gameState}/>
        }

        return (
            <div>
                <AppBar title="Crabapple Time" iconElementRight={githubIcon}/>
                <AppCanvas className="wrapper">
                    {content}
                </AppCanvas>
                
            </div>
        );
    }

});