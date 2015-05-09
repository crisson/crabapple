import lodash from 'lodash'

import React from 'react';

import {Paper} from 'material-ui'
import {DragDropMixin} from 'react-dnd'

import Cell from './Cell.jsx'

import GameStore from '@crabapple/service/game-store'

const itemDropTarget = {
  acceptDrop(component, item) {
    return null
  }
};

/**
 * Key used to register this component type as a drag n' drop item
 * @type {String}
 */
const DND_TILE = 'tile'

export default React.createClass({

    displayName: 'Board',

    mixins: [DragDropMixin],

    propTypes:{
        board: React.PropTypes.array
    },

    getInitialState() {
        return {
            workingSet: GameStore.getEmptyBoard(),
            words: new Set()
        };
    },

    statics: {
      configureDragDrop(register) {
        register(DND_TILE, {
          dropTarget: itemDropTarget
        });
      }
    },

    words: new Set(),

    async componentDidMount(){
        let words = await GameStore.retrieve()
        this.setState({words});
    },

    makeCells(isDragging, isHovering){
        return this.props.board.map((row, y) => {
            return row.map((cellData, x) => {
                let key = `(${y},${x})`
                // let value = letters[lodash.random(letters.length - 1)]
                let ws = this.state.workingSet[y][x]
                var cd = cellData
                if (ws) {
                    cd = lodash.assign({}, cellData, ws)
                }
                var cell = (
                    <Cell key={key}
                        x={x}
                        y={y}
                        data={cd}
                        isDragging={isDragging}
                        isHovering={isHovering}
                        onDrop={this.onDrop} />
                )
                return cell;
            })
        })
    },

    onDrop(item, y, x){
        let {workingSet} = this.state
        let {letter, points} = item
        workingSet[y][x] = {tile: {letter, points}}
        this.setState({workingSet})
    },

    render() {

        const dropState = this.getDropState(DND_TILE);

        // let cells = []
        let cells = this.makeCells(dropState.isDragging, dropState.isHovering)
        return (
            <Paper className="board" zDepth={1} 
                {...this.dropTargetFor(DND_TILE)}>
                {cells}
            </Paper>
        );
    }

});