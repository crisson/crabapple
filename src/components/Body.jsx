import React from 'react';

import Deck from './Deck.jsx'
import Board from './Board.jsx'

export default React.createClass({

    displayName: 'Body',

    render() {
        return (
            <div className="content">
                <div className="top-content">
                    <Deck name="Player 1"/>
                </div>
                <div className="center-content">
                    {/*<div className="center-content-section center-content-left">
                        <Deck name="Player 1"/>
                    </div> */}
                    <div className="center-content-section center-content-middle">
                        <Board />
                    </div>
                    {/*<div className="center-content-section center-content-right">
                        <Deck name="Player 1"/>
                    </div> */}
                </div>
                <div className="bottom-content">
                    <Deck name="Player 1" />
                </div>
            </div>
        );
    }

});