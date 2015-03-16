import lodash from 'lodash'

import React from 'react';

import {Paper, Mixins} from 'material-ui'

import Crabapple from '@scrabble/service'


const PlayerData = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        color: React.PropTypes.string.isRequired
    },

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
 * A tile
 */

const Tile = React.createClass({

    propTypes: {
        points: React.PropTypes.number.isRequired,
        letter: React.PropTypes.string.isRequired,
    },

    render(){
        let {letter, points} = this.props
        return (
            <div className="title-cnt">
                <Paper className="tile" zDepth={1}>
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
        tiles: React.PropTypes.array.isRequired
    },

    generateTiles(){
        return this.props.tiles.map(t => {
            let [letter, points] = t
            return (
                <Tile 
                    key={lodash.uniqueId()} 
                    letter={letter} 
                    points={points}/>
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
        return {
        };
    },

    propTypes: {
        players: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    getInitialState() {
        return {
        };
    },

    render() {
        let {players} = this.props
        let classNames = this.getClasses('deck', {})
        let humanPlayerInfo = lodash.find(players, 'isHuman')

        return (
            <span className={classNames}>
                <PlayerList players={players}/>
                <TileList tiles={humanPlayerInfo.deck}/>
            </span>
        );
    }

});