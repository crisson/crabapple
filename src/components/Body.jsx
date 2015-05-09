import React from 'react';

import GameStore from '../service/game-store'

import Deck from './Deck.jsx'
import Board from './Board.jsx'

export default React.createClass({

    displayName: 'Body',

    propTypes: {
        gameState: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            movedTiles: 0
        };
    },

    handleTileMove(){
        let movedTiles = this.state.movedTiles
        this.setState({movedTiles: movedTiles + 1})
    },

    hasMinimumWokingSet(){
        return this.state.movedTiles > 0
    },

    componentDidMount(){},

    render() {
        let {board, playerInfo} = this.props.gameState

        return (
            <div className="content">
                <div className="top-content">
                    <Deck players={playerInfo} enableCheck={this.hasMinimumWokingSet()} 
                        handleTileMove={this.handleTileMove}/>
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