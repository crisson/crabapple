import lodash from 'lodash'

import React from 'react';
import {DragDropMixin} from 'react-dnd'

import {Paper, Mixins, RaisedButton} from 'material-ui'

import GameStore from '@crabapple/service/game-store'


const PlayerData = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        color: React.PropTypes.string.isRequired
    },

    displayName: 'PlayerData',

    render(){
        let {data, color} = this.props
        let {displayName, points} = data

        let style = {color: color}

        return (
            <div className="player-data">    
                <span className="player-name" style={style}>{displayName}</span>
                <span className="player-points">{points}</span>
            </div>
        )
    }
})

const PlayerList = React.createClass({
    propTypes: {
        players: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    displayName: 'PlayerList',

    colors: [
        'red',
        'orange',
        'blue',
        'brown'
    ],

    chooseColor(index){
        return this.colors[index]
    },

    render(){

        let players = this.props.players.map((pd, idx) => {
            let key = `{$pd.displayName}-${lodash.uniqueId()}`
            let color = this.chooseColor(idx)
            return (<PlayerData key={key} data={pd} color={color}/>)
        })

        return (
            <div className="player-lst">
                {players}
            </div>
        )
    }
})


/**
 * Key used to register this component type as a drag n' drop item
 * @type {String}
 */
const DND_TILE = 'tile'

const itemDragSource = {
  beginDrag(component) {

    return {
      item: {
        points: component.props.points,
        letter: component.props.letter
      },
      effectsAllowed: ['move', 'other']
    };
  },
  canDrag(component){
    if (component.state.inWorkingSet) return false
    return true
  },
  endDrag(component, dropEffect){
    if ('other' === dropEffect) return;
    component.setInWorkingSet()
  }
};

/**
 * A tile
 */

const Tile = React.createClass({

    mixins: [DragDropMixin, Mixins.Classable],

    displayName: 'Tile',

    propTypes: {
        points: React.PropTypes.number.isRequired,
        letter: React.PropTypes.string.isRequired,
        handleTileMove: React.PropTypes.func,
    },

    statics: {
      configureDragDrop(register) {
        register(DND_TILE, {
          dragSource: itemDragSource
        });
      }
    },

    getInitialState() {
        return {
            inWorkingSet: false
        };
    },


    setInWorkingSet(){
        this.setState({inWorkingSet: true}, () => {
            this.props.handleTileMove()
        })
    },

    render(){
        let {letter, points} = this.props
        let {inWorkingSet} = this.state
        const { isDragging } = this.getDragState(DND_TILE);

        let opacity = isDragging? 0.2 : 1
        if (inWorkingSet) {
            opacity = 0.2
        }

        let style = {opacity}

        let paperClasses = this.getClasses('tile', {
            'is-in-working-set': inWorkingSet
        })

        return (
            <div className="title-cnt" 
                {...this.dragSourceFor(DND_TILE)} 
                style={style} >

                <Paper className={paperClasses} zDepth={1}>
                    <span className="tile-letter">{letter}</span>
                    <span className="tile-points">{points}</span>
                </Paper>
            </div>
        )
    }
})

const TileList = React.createClass({

    displayName: 'TileList',

    propTypes: {
        tiles: React.PropTypes.array.isRequired,
        handleTileMove: React.PropTypes.func
    },

    generateTiles(){
        return this.props.tiles.map((t, idx) => {
            let [letter, points] = t
            return (
                <Tile 
                    key={idx} 
                    letter={letter} 
                    points={points}
                    handleTileMove={this.props.handleTileMove}/>
            )
        })
    },

    render(){

        let tiles = this.generateTiles()

        return (
            <div className="tile-lst">
                <div className="tile-lst-content">
                    {tiles}
                </div>
            </div>
        )
    }
})


export default React.createClass({

    displayName: 'Deck',

    mixins: [Mixins.Classable],

    getDefaultProps() {
        return {};
    },

    getInitialState() {
        return {
            checkButtonEnabled: undefined
        };
    },

    propTypes: {
        players: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    handleCheckWord(){

    },

    render() {
        let {players, enableCheck, handleTileMove} = this.props
        let {checkButtonEnabled} = this.state

        var buttonDisabled = !enableCheck
        if (typeof checkButtonEnabled !== 'undefined') {
             buttonDisabled = checkButtonEnabled
        }

        let classNames = this.getClasses('deck', {})
        let humanPlayerInfo = lodash.find(players, 'isHuman')

        return (
            <span className={classNames}>
                <div className="deck-column">
                    <PlayerList players={players}/>
                </div>
                <div className="deck-column">
                    <TileList 
                        tiles={humanPlayerInfo.deck}
                        handleTileMove={handleTileMove}/>
                </div>
                <div className="deck-column">
                    
                    <RaisedButton label="Check Words" 
                        primary={true} 
                        onClick={this.handleCheckWord}
                        disabled={buttonDisabled}/>
                </div>
            </span>
        );
    }

});