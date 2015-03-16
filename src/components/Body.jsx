import React from 'react';
import BaconMixin from 'react-bacon'

import Deck from './Deck.jsx'
import Board from './Board.jsx'

import Crabapple from '@scrabble/service'

export default React.createClass({

    displayName: 'Body',

    Mixins: [BaconMixin],

    getInitialState() {
        return {
            gameState: Crabapple.gameStatePrototype
        };
    },

    componentDidMount(){
        let gs = Crabapple.getOrCreateGame()
        gs.onValue(gameState => this.setState({gameState}))
    },

    render() {
        let {board, playerInfo} = this.state.gameState
        return (
            <div className="content">
                <div className="top-content">
                    <Deck players={playerInfo}/>
                </div>
                <div className="center-content">
                    <div className="center-content-section center-content-middle">
                        <Board board={board}/>
                    </div>
                </div>
                <div className="bottom-content"></div>
            </div>
        );
    }

});