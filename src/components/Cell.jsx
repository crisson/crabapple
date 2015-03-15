import lodash from 'lodash'

import React from 'react';

import {Paper} from 'material-ui'

const letters = lodash.toArray('abcdefghijklmnopqrstuvwxyz').map(_ => _.toUpperCase())

export default React.createClass({

    displayName: 'Cell',

    getDefaultProps() {
        return {};
    },

    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        value: React.PropTypes.string
    },

    render() {
        let value = letters[lodash.random(letters.length - 1)]

        return (
            <div className="cell">
                <span className="cell-content">
                    <Paper zDepth={1}> {value} </Paper>
                </span>
            </div>
        );
    }

});