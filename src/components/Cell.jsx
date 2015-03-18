import lodash from 'lodash'

import React from 'react';
import {DragDropMixin} from 'react-dnd'

import {Paper, Mixins} from 'material-ui'

/**
 * Key used to register this component type as a drag n' drop item
 * @type {String}
 */
const DND_TILE = 'tile'


const itemDropTarget = {
  getDropEffect(cell, effectsAllowed){
    if (!cell.isDroppable()) return 'other'
    return effectsAllowed[0]
  },

  acceptDrop(cell, item, isHandled, effect) {
    if (!cell.isDroppable()) return effect;
    cell.onDrop(item)
  }
};



export default React.createClass({

    displayName: 'Cell',

    mixins: [Mixins.Classable, DragDropMixin],

    statics: {
      configureDragDrop(register) {
        register(DND_TILE, {
          dropTarget: itemDropTarget
        });
      }
    },

    getDefaultProps() {
        return {
            isDragging: false,
            isHovering: false
        };
    },

    getInitialState() {
        return {};
    },

    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        data: React.PropTypes.object,
        isDragging: React.PropTypes.bool,
        isHovering: React.PropTypes.bool,
        onDrop: React.PropTypes.func
    },

    isDroppable(){
        return !this.props.data.tile
    },

    chooseColor(){

    },

    onDrop(item){
        this.props.onDrop(item, this.props.y, this.props.x)
    },

    render() {
        let {data, isDragging, isHovering} = this.props

        const dropState = this.getDropState(DND_TILE);

        let contentClasses = this.getClasses('cell-content', {
            'is-special': data.isSpecial,
            'special-tl': data.key === 'tl',
            'special-tw': data.key === 'tw',
            'special-dl': data.key === 'dl',
            'special-dw': data.key === 'dw',
            'is-empty': !data.tile,
            'tile-set': data.tile /*  Why are you doing this??? */
        })

        let cellClasses = this.getClasses('cell', {
            'is-empty': !data.tile,
            'is-not-drag-target': isDragging && data.tile,
            'is-drop-target': dropState.isHovering && !data.tile,
            'is-special': data.isSpecial
        })

        var body = (<div>&nbsp;</div>)
        if (data.tile || data.isSpecial) {
            var pointsDisplay;
            var letterDisplay;
            if (data.tile && data.isSpecial) {
                letterDisplay = data.tile.letter
                pointsDisplay = `${data.tile.points} x ${data.multiple}`
            } else if (data.isSpecial) {
                pointsDisplay = `x ${data.multiple}`
            } else {
                letterDisplay = data.tile.letter
                pointsDisplay = ` ${data.tile.points}`
            }

            body = (
                <Paper zDepth={1}>
                    <div className="cell-letter">{letterDisplay}</div>
                    <div className="cell-points">{pointsDisplay}</div>
                </Paper>
            )
        }

        return (
            <div className={cellClasses} {...this.dropTargetFor(DND_TILE)}>
                <span className={contentClasses} >
                    {body}
                </span>
            </div>
        );
    }

});