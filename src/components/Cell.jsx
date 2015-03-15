import lodash from 'lodash'

import React from 'react';

import {Paper, Mixins} from 'material-ui'

export default React.createClass({

    displayName: 'Cell',

    mixins: [Mixins.Classable],

    getDefaultProps() {
        return {};
    },

    getInitialState() {
        return {};
    },

    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        value: React.PropTypes.string
    },

    render() {
        let {value} = this.props
        let contentClasses = this.getClasses('cell-content', {})

        return (
            <div className="cell">
                <span className={contentClasses} >
                    <Paper zDepth={1}> {value} </Paper>
                </span>
            </div>
        );
    }

});