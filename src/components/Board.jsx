import lodash from 'lodash'

import React from 'react';
import BaconMixin from 'react-bacon'

import {Paper} from 'material-ui'

import Cell from './Cell.jsx'

import Crabapple from '@scrabble/service'

export default React.createClass({

    displayName: 'Board',

    mixins: [BaconMixin],

    propTypes:{
        board: React.PropTypes.array
    },

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
        return this.props.board.map((row, y) => {
            return row.map((cellData, x) => {
                let key = `(${y},${x})`
                // let value = letters[lodash.random(letters.length - 1)]
                var cell = (<Cell key={key} x={x} y={y} data={cellData}/>)
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