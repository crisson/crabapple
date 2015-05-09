import lodash from 'lodash'
import Bluebird from 'bluebird'
import request from 'superagent'
import localforage from 'localforage'
import Reflux from 'reflux'
import Actions from './game-actions'

const DEFAULT_FILE = 'data/words.txt'

const WORD_LIST_KEY = 'wordList'

const GAME_STATE_KEY = "gameState"

/**
 * A promise
 * @volatile
 */
var gameStatePromise;




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

const alphabet = lodash.toArray('abcdefghijklmnopqrstuvwxyz')

/**
 * Game values assigned to letters of the alphabet
 * @return {Map.<Char, Nat>}
 */
const AlphabetMap = (function () {
  let max = MAX_ALPHA_VALUE
  let ab = alphabet
  let points = lodash.range(ab.length).map(() => lodash.random(1, max))
  let uppercase = ab.map(char => char.toUpperCase())
  let values = lodash.zip(uppercase, points)

  return new Map(values)
})()


/**
 * Tuple of uppercase alphabet letter and its point value
 * @type {Array.<Tuple.<Char, Nat>>}
 */
var AlphabetEntries = Array.from(AlphabetMap.entries())

/**
 * Maximum number of available non-blank tiles for a game
 * @type {Nat}
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
  ['dl', 2, 24], // dl = Double letter
  ['tl', 3, 12], // tl = Triple letter
  // Subtract one to account for the center cell bonus accounted for elsewhere
  [DOUBLE_WORD_KEY, 2, (17 - 1)],
  ['tw', 3, 8] // tw = Triple word
]

const GameStore = Reflux.createStore({
  listenables: Actions,
  init() {

    // this.getOrCreateGame()
    //   .then(gameState => {
    //     console.log(gameState)
    //     this.trigger(gameState)
    //   })

  },

  async onLoad() {
    let gameState = await this.getOrCreateGame()
    this.trigger(gameState)
  },


  /**
   * Retrieve list of words with each new word occupying its own line
   * @param  {String} file
   * @return {Promise.<Set.<String>>}
   */
  async retrieve(file = DEFAULT_FILE) {

    /**
     * Converts a string of words, one per line, into a set of the same words
     * @param  {String} rawText
     * @return {Set.<String>}
     */
    let processText = (rawText) => {
      if (!rawText) return new Set()
      return new Set(rawText.split('\n'))
    }

    try {
      let wordList = await localforage.getItem(WORD_LIST_KEY)

      if (wordList && !lodash.isEmpty(wordList)) {
        let wordSet = new Set(wordList)
        return wordSet
      }

      let response = await Bluebird.fromNode(cb => request.get(file, cb))

      let wordSet = processText(response.text);
      await localforage.setItem(WORD_LIST_KEY, Array.from(wordSet.values()))

      return wordSet

    } catch (error) {
      console.log('an error occurred while retrieving a word list', error)
    }
  },

  /**
   * Takes a tile from the total list of tiles available for the game
   * @return {Tuple.<Char, Nat>}
   */
  takeTile(n = 1) {
    if (!GameTiles.length) return [];
    return GameTiles.splice(0, n)
  },

  /**
   * Retrieves a complete deck of tiles.  This will likely only be called at
   * the start of a game
   * @return {Array.<Tuple.<Char, Nat>>}
   */
  freshDeck() {
    return this.takeTile(DECK_SIZE)
  },

  /**
   * Creates special tiles to a board
   * @param {Matrix} board
   * @private
   * @return {Matrix} BOARD_SIZE X BOARD_SIZE matrix
   */
  applySpecialTiles(board) {
    let tiles = new Set()

    let maxIndex = BOARD_SIZE - 1

    let s = (y, x) => `${y},${x}`
    let randCoord = () => [lodash.random(maxIndex), lodash.random(
      maxIndex)]

    let specialTiles = lodash(Bonuses).map(entry => {
        let [, , appearances] = entry
        return lodash.fill(new Array(appearances), entry, 0,
          appearances)
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
        combo = s(y, x)

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
  getBoard() {
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

  getEmptyBoard() {
    var pieces = lodash.fill(new Array(BOARD_SIZE), 1)
      .map(() => lodash.fill(new Array(BOARD_SIZE), 1))
    return pieces
  },

  get foundWordPrototype() {
    return {
      word: null,
      points: 0
    }
  },

  /**
   * Prototype for this game's state
   * @return {Object}
   */
  get gameStatePrototype() {
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
  async getOrCreateGame() {
    try {
      let gameState = await localforage.getItem(GAME_STATE_KEY)

      if (gameState) return gameState


      let gameProto = await localforage.setItem(GAME_STATE_KEY, gameProto)
      if (gameProto) return gameProto

      return this.gameStatePrototype
    } catch (error) {
      console.log("An error occurred while retrieving game state", error)
    }

  },

  /**
   * Resets the game to its initial state, clearing all info stored in
   * localstorage except for the word list
   * @return {void}
   */
  async resetGame() {
    await localforage.deleteItem(GAME_STATE_KEY)
    let gameState = await this.getOrCreateGame()

    this.trigger(gameState)
  },

  /**
   * Checks whether a potential word created by the application of certain
   * tiles to an existing board are acceptable
   * @return {Array.<Tuple.<Accepted, Failed>>}
   */
  checkWord() {

  },

  /**
   * Get possible players
   * @return {[type]} [description]
   */
  getPlayers() {

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
})

export default GameStore
