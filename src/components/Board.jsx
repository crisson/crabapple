import React from 'react';

import {Paper} from 'material-ui'

export default React.createClass({

    displayName: 'Board',

    render() {
        return (
            <Paper className="board" zDepth={1}>
                board
            </Paper>
        );
    }

});