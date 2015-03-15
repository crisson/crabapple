import lodash from 'lodash'

import React from 'react';

import {Paper} from 'material-ui'

import Cell from './Cell.jsx'
import EmptyCell from './EmptyCell.jsx'

const pieces = lodash.fill(new Array(15), 1)
    .map(() => lodash.fill(new Array(15), 1))

export default React.createClass({

    displayName: 'Board',

    makeCells(){
        return pieces.map((row, y) => {
            return row.map((value, x) => {
                let key = `(${y},${x})`
                return (<Cell key={key} x={x} y={y}/>)
            })
        })
    },

    render() {

        // let cells = []
        let cells = this.makeCells()

        return (
            <Paper className="board" zDepth={1}>
                {cells}
            </Paper>
        );
    }

});