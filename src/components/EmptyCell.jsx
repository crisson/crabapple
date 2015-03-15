import React from 'react';

export default React.createClass({

    displayName: 'EmptyCell',

    render() {
        return (
            <div className="cell is-empty">
                <span className="cell-content">&nbsp;</span>
            </div>
        );
    }

});