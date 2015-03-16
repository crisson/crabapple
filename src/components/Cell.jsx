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
        data: React.PropTypes.object
    },

    chooseColor(){

    },

    render() {
        let {data} = this.props

        let contentClasses = this.getClasses('cell-content', {
            'is-special': data.isSpecial,
            'special-tl': data.key === 'tl',
            'special-tw': data.key === 'tw',
            'special-dl': data.key === 'dl',
            'special-dw': data.key === 'dw',
            'is-empty': !data.tile
        })

        let cellClasses = this.getClasses('cell', {
            'is-empty': !data.tile,
            'is-special': data.isSpecial
        })

        var body = (<div>&nbsp;</div>)
        if (data.tile) {
            body = (<Paper zDepth={1}> {data.tile.letter} </Paper>)
        }

        return (
            <div className={cellClasses}>
                <span className={contentClasses} >
                    {body}
                </span>
            </div>
        );
    }

});