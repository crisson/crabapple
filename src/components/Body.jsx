import React from 'react';
import BaconMixin from 'react-bacon'

import Deck from './Deck.jsx'
import Board from './Board.jsx'

export default React.createClass({

    displayName: 'Body',

    Mixins: [BaconMixin],

    propTypes: {
        gameState: React.PropTypes.object.isRequired
    },

    render() {
        let {board, playerInfo} = this.props.gameState
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