import lodash from 'lodash'

import React from 'react';
import BaconMixin from 'react-bacon'

import {Paper} from 'material-ui'

import Cell from './Cell.jsx'
import EmptyCell from './EmptyCell.jsx'
import SpecialCell from './SpecialCell.jsx'

import Crabapple from '@scrabble/service/crabapple'

const pieces = lodash.fill(new Array(15), 1)
    .map(() => lodash.fill(new Array(15), 1))

const letters = lodash.toArray('abcdefghijklmnopqrstuvwxyz')
    .map(_ => _.toUpperCase())

export default React.createClass({

    displayName: 'Board',

    mixins: [BaconMixin],

    words: new Set(),

    componentDidMount(){
        let bus = Crabapple.retrieve()

        bus.onValue(words => {
            this.words = words
        })

        bus.onError((error) => {
            this.setState({error: error.message})
        })

    },

    makeCells(){
        return pieces.map((row, y) => {
            return row.map((celltype, x) => {
                let key = `(${y},${x})`
                // let value = letters[lodash.random(letters.length - 1)]
                let value = letters[lodash.random(100)]
                var cell;
                if (value) {
                    cell = (<Cell key={key} x={x} y={y} value={value}/>)
                } else {
                    cell = (<EmptyCell />)
                }
                return cell;
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