import React from 'react';
import Reflux from 'reflux'
import {AppCanvas, AppBar, FlatButton, FontIcon} from 'material-ui'

import lodash from 'lodash'

import Body from '@crabapple/components/Body.jsx'
import Spinner from '@crabapple/components/Spinner.jsx'

import GameStore from '@crabapple/service/game-store'
import GameActions from '@crabapple/service/game-actions'

export default React.createClass({

    displayName: 'Homepage',

    mixins: [Reflux.ListenerMixin],

    getInitialState() {
        return {
            gameState: {}
        };
    },

    async componentDidMount(){
        this.listenTo(GameStore, this.onLoad)
        GameActions.load()
        // this.setState(gameState)
    },

    onLoad(gameState){
        this.setState({gameState})
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
        if (!lodash.isEmpty(gameState)) {
            content = <Body gameState={gameState}/>
        }

        return (
            <div>
                { /* <AppBar title="Crabapple Time" iconElementRight={githubIcon}/> */ }
                <AppCanvas className="wrapper">
                    {content}
                </AppCanvas>
            </div>
        );
    }

});