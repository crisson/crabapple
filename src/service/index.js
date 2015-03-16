import lodash from 'lodash'
import request from 'superagent'
import Bacon from 'baconjs'
import localforage from 'localforage'

const DEFAULT_FILE = 'data/words.txt'

const WORD_LIST_KEY = 'wordList'

const GAME_STATE_KEY = "gameState"

/**
 * A promise 
 * @volatile
 */
var gameStatePromise;


const getFromStorage = () => {
    return localforage.getItem(WORD_LIST_KEY)
}

const alphabet = lodash.toArray('abcdefghijklmnopqrstuvwxyz')


/**
 * Maximum base value for a letter
 * @type {Number}
 */
const MAX_ALPHA_VALUE = 20


/**
 * Maximum size of the player's deck
 * @type {Nat}
 */
const DECK_SIZE = 8

/**
 * Size of the board
 * @type {Number}
 */
const BOARD_SIZE = 15

/**
 * Game values assigned to letters of the alphabet
 * @type {Map}
 * @key {Char} uppercase letter
 * @value {Nat} point value for uppercase letter
 * 
 * @return {[type]}        [description]
 */
const AlphabetValues = alphabet.reduce((map, l) => {
    map.set(l, lodash.random(1, MAX_ALPHA_VALUE))
    return map
}, new Map())


/**
 * Tuple of uppercase alphabet letter and its point value
 * @type {Tuple.<Char, Nat>}
 */
var AlphabetEntries = []

for (let val of AlphabetValues.entries()) {
    AlphabetEntries.push(val);
} 

/**
 * Maximum number of available non-blank tiles for a game
 * @type {Number}
 */
const AVAILABLE_TILES = 98

/**
 * All tiles available for a game
 * 
 * @type {Array.<Tuple.<Char, Nat>>}
 */
var GameTiles = lodash.range(AVAILABLE_TILES).map(() => {
    return lodash.sample(AlphabetEntries)
})

/**
 * Key for double-word bonus
 * @type {String}
 */
const DOUBLE_WORD_KEY = 'dw'

/**
 * Array of Tuples of bonus cells and their multiples
 * @type {Array.<Triple.<String, Nat, Nat>>}
 */
const Bonuses = [
    ['dl', 2, 24],
    ['tl', 3, 12],
    /* 
        We subtract one to account for the center cell bonus accounted for
        elsewhere
    */
    [DOUBLE_WORD_KEY, 2, (17 - 1)],
    ['tw', 3, 8],
]

export default {
    /**
     * Retrieve list of words with each new word occupying its own line
     * @param  {String} file
     * @return {Bacon.Bus}
     */
    retrieve(file = DEFAULT_FILE){

        // let bus = Bacon.fromPromise(getFromStorage)
        //     .map(words => {
        //         if (words) return {text: words};
        //         return new Bacon.Error("Wordlist not found")
        //     })
        //     .flatMapError(()=> {
        //         let req = request.get(file)
        //         return Bacon.fromNodeCallback(req.end.bind(req))
        //     })
        //     .map(req => req.text)
        let req = request.get(file)
        let bus =  Bacon.fromNodeCallback(req.end.bind(req))
            .map(req => req.text)
            // .flatMap(words => {
            //     console.log(words)
            //     let p = getFromStorage()
            //         .then(wl => {
            //             if (wl) return wl
            //             return localforage
            //                 .setItem(WORD_LIST_KEY, words)
            //         })
            //         .then(() => {
            //             return words
            //         })

            //     return Bacon.fromPromise(p)
            // })
            .map(words => {
                let filtered = words
                    .split('\n')

                let wordSet = new Set(filtered)
                return wordSet
            })
        return bus    
    },

    /**
     * Takes a tile from the total list of tiles available for the game
     * @return {Tuple.<Char, Nat>}
     */
    takeTile(n = 1){
        if (!GameTiles.length) return;
        return GameTiles.splice(0, n)
    },

    /**
     * Retrieves a complete deck of tiles.  This will likely only be called at
     * the start of a game
     * @return {Array.<Tuple.<Char, Nat>>}
     */
    freshDeck(){
        return this.takeTile(DECK_SIZE)
    },

    /**
     * Creates special tiles to a board 
     * @param {Matrix} board
     * @private
     * @return {Matrix} BOARD_SIZE X BOARD_SIZE matrix
     */
    applySpecialTiles(board){
        let tiles = new Set()

        let maxIndex = BOARD_SIZE - 1

        let s = (x, y) => `${x},${y}`
        let randCoord = () => 
            [lodash.random(maxIndex), lodash.random(maxIndex)]

        let specialTiles = lodash(Bonuses).map(entry => {
                let [,, appearances] = entry
                return lodash.fill(new Array(appearances), entry, 0, appearances) 
            })
            .flatten()
            .shuffle()
            .value()

        /**
         * For Debug, should never be reached
         * @type {Nat}
         */
        let max_iter = specialTiles.length * 2

        return specialTiles.reduce((b, entry) => {
            let [key, multiple] = entry

            var combo;
            var i = 0
            do {
                var [x, y] = randCoord()
                combo = s(x, y)

                let existing = b[y][x]
                b[y][x] = lodash.assign({}, existing, {
                    isSpecial: true,
                    key,
                    multiple
                })
                i++
            } while (tiles.has(combo) || max_iter < i)

            return b
        }, board.slice())
    },

    /**
     * Returns an empty board
     * @return {Matrix} BOARD_SIZE X BOARD_SIZE matrix
     */
    getBoard(){
        var pieces = lodash.fill(new Array(BOARD_SIZE), 1)
            .map(() =>
                lodash.range(BOARD_SIZE).map(() => {
                    return {
                        tile: null
                    }
                })
            )

        var midp = (BOARD_SIZE - 1) / 2
        if (BOARD_SIZE % 2 === 0) {
            midp = BOARD_SIZE / 2
        }
        let existing = pieces[midp][midp]

        pieces[midp][midp] = lodash.assign(existing, {
            isSpecial: true,
            isCenter: true
        })

        return pieces
    },

    get foundWordPrototype(){
        return {
            word: null,
            points: 0
        }
    },

    /**
     * Prototype for this game's state
     * @return {Object}
     */
    get gameStatePrototype(){
        let playerInfo = this.getPlayers()
            .map(pd => lodash.assign(pd, {
                foundWords: [],
                deck: this.freshDeck()
            }))

        return {
            board: this.applySpecialTiles(this.getBoard()),
            playerInfo: playerInfo
        }
    },

    /**
     * Finds a game if it exists, otherwise creates a new one
     * @private
     * @return {Promise.<Error, GameState>}
     */
    getOrCreateGamePromise(){
        gameStatePromise = localforage.getItem(GAME_STATE_KEY)
            .then(s => {
                if (s) return s
                let gameProto = this.gameStatePrototype
                return localforage.setItem(GAME_STATE_KEY, gameProto)
                    .then(() => {
                        return gameProto
                    })
            })

        return gameStatePromise
    },

    /**
     * Finds a game if it exists, otherwise creates a new one
     * @return {Bacon.<GameState>}
     */
    getOrCreateGame(){
        return Bacon.fromPromise(this.getOrCreateGamePromise())
    },

    /**
     * Resets the game to its initial state, clearing all info stored in 
     * localstorage except for the word list
     * @return {Bacon.<GameState>}
     */
    resetGame(){
        let p = localforage.deleteItem(GAME_STATE_KEY)
            .then(() => {
                return this.getOrCreateGamePromise()
            })

        return Bacon.fromPromise(p)
    },

    /**
     * Get possible players
     * @return {[type]} [description]
     */
    getPlayers(){

        let player = {
            displayName: "You",
            points: 0,
            isHuman: true
        }

        let cpu = {
            displayName: "CPU",
            points: 0
        }

        return [player, cpu]
    }
}