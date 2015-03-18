(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function _interopRequire(obj) {
  return obj && obj.__esModule ? obj["default"] : obj;
};

var reactTapEventPlugin = _interopRequire(require("react-tap-event-plugin"));

var React = _interopRequire(require("react"));

reactTapEventPlugin();

var Homepage = _interopRequire(require("@crabapple/Homepage.jsx"));

React.render(React.createElement(Homepage, null), document.querySelector("#app"));

},{"@crabapple/Homepage.jsx":2,"react":"react","react-tap-event-plugin":"react-tap-event-plugin"}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var _materialUi = require("material-ui");

var AppCanvas = _materialUi.AppCanvas;
var AppBar = _materialUi.AppBar;
var FlatButton = _materialUi.FlatButton;
var FontIcon = _materialUi.FontIcon;

var Body = _interopRequire(require("@crabapple/components/Body.jsx"));

var Spinner = _interopRequire(require("@crabapple/components/Spinner.jsx"));

var Crabapple = _interopRequire(require("@crabapple/service"));

module.exports = React.createClass({

    displayName: "App",

    getInitialState: function getInitialState() {
        return {};
    },

    componentDidMount: function componentDidMount() {
        var _this = this;

        var gs = Crabapple.getOrCreateGame();
        gs.onValue(function (gameState) {
            return _this.setState({ gameState: gameState });
        });
    },

    render: function render() {
        var gameState = this.state.gameState;

        var githubIcon = React.createElement(
            FlatButton,
            { className: "github-icon-button", linkButton: true, href: "https://github.com/crisson/scrabble", secondary: true },
            React.createElement(FontIcon, { className: "muidocs-icon-custom-github" }),
            React.createElement(
                "span",
                { className: "mui-flat-button-label" },
                "Github"
            )
        );

        var content = React.createElement(Spinner, null);
        if (gameState) {
            content = React.createElement(Body, { gameState: gameState });
        }

        return React.createElement(
            "div",
            null,
            React.createElement(
                AppCanvas,
                { className: "wrapper" },
                content
            )
        );
    }

});
/* <AppBar title="Crabapple Time" iconElementRight={githubIcon}/> */

},{"@crabapple/components/Body.jsx":4,"@crabapple/components/Spinner.jsx":7,"@crabapple/service":8,"material-ui":"material-ui","react":"react"}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var lodash = _interopRequire(require("lodash"));

var React = _interopRequire(require("react"));

var BaconMixin = _interopRequire(require("react-bacon"));

var Paper = require("material-ui").Paper;

var DragDropMixin = require("react-dnd").DragDropMixin;

var Cell = _interopRequire(require("./Cell.jsx"));

var Crabapple = _interopRequire(require("@crabapple/service"));

var itemDropTarget = {
    acceptDrop: function acceptDrop(component, item) {
        return null;
    }
};

/**
 * Key used to register this component type as a drag n' drop item
 * @type {String}
 */
var DND_TILE = "tile";

module.exports = React.createClass({

    displayName: "Board",

    mixins: [BaconMixin, DragDropMixin],

    propTypes: {
        board: React.PropTypes.array
    },

    getInitialState: function getInitialState() {
        return {
            workingSet: Crabapple.getEmptyBoard()
        };
    },

    statics: {
        configureDragDrop: function configureDragDrop(register) {
            register(DND_TILE, {
                dropTarget: itemDropTarget
            });
        }
    },

    words: new Set(),

    componentDidMount: function componentDidMount() {
        var _this = this;

        var bus = Crabapple.retrieve();

        bus.onValue(function (words) {
            _this.words = words;
        });

        bus.onError(function (error) {
            _this.setState({ error: error.message });
        });
    },

    makeCells: function makeCells(isDragging, isHovering) {
        var _this = this;

        return this.props.board.map(function (row, y) {
            return row.map(function (cellData, x) {
                var key = "(" + y + "," + x + ")";
                // let value = letters[lodash.random(letters.length - 1)]
                var ws = _this.state.workingSet[y][x];
                var cd = cellData;
                if (ws) {
                    cd = lodash.assign({}, cellData, ws);
                }
                var cell = React.createElement(Cell, { key: key,
                    x: x,
                    y: y,
                    data: cd,
                    isDragging: isDragging,
                    isHovering: isHovering,
                    onDrop: _this.onDrop });
                return cell;
            });
        });
    },

    onDrop: function onDrop(item, y, x) {
        var workingSet = this.state.workingSet;
        var letter = item.letter;
        var points = item.points;

        workingSet[y][x] = { tile: { letter: letter, points: points } };
        this.setState({ workingSet: workingSet });
    },

    render: function render() {

        var dropState = this.getDropState(DND_TILE);

        // let cells = []
        var cells = this.makeCells(dropState.isDragging, dropState.isHovering);
        return React.createElement(
            Paper,
            _extends({ className: "board", zDepth: 1
            }, this.dropTargetFor(DND_TILE)),
            cells
        );
    }

});

},{"./Cell.jsx":5,"@crabapple/service":8,"lodash":"lodash","material-ui":"material-ui","react":"react","react-bacon":"react-bacon","react-dnd":"react-dnd"}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var BaconMixin = _interopRequire(require("react-bacon"));

var Deck = _interopRequire(require("./Deck.jsx"));

var Board = _interopRequire(require("./Board.jsx"));

module.exports = React.createClass({

    displayName: "Body",

    Mixins: [BaconMixin],

    propTypes: {
        gameState: React.PropTypes.object.isRequired
    },

    getInitialState: function getInitialState() {
        return {
            movedTiles: 0
        };
    },

    handleTileMove: function handleTileMove() {
        var movedTiles = this.state.movedTiles;
        this.setState({ movedTiles: movedTiles + 1 });
    },

    hasMinimumWokingSet: function hasMinimumWokingSet() {
        return this.state.movedTiles > 0;
    },

    render: function render() {
        var _props$gameState = this.props.gameState;
        var board = _props$gameState.board;
        var playerInfo = _props$gameState.playerInfo;

        return React.createElement(
            "div",
            { className: "content" },
            React.createElement(
                "div",
                { className: "top-content" },
                React.createElement(Deck, { players: playerInfo, enableCheck: this.hasMinimumWokingSet(),
                    handleTileMove: this.handleTileMove })
            ),
            React.createElement(
                "div",
                { className: "center-content" },
                React.createElement(
                    "div",
                    { className: "center-content-section center-content-middle" },
                    React.createElement(Board, { board: board })
                )
            ),
            React.createElement("div", { className: "bottom-content" })
        );
    }

});

},{"./Board.jsx":3,"./Deck.jsx":6,"react":"react","react-bacon":"react-bacon"}],5:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var lodash = _interopRequire(require("lodash"));

var React = _interopRequire(require("react"));

var DragDropMixin = require("react-dnd").DragDropMixin;

var _materialUi = require("material-ui");

var Paper = _materialUi.Paper;
var Mixins = _materialUi.Mixins;

/**
 * Key used to register this component type as a drag n' drop item
 * @type {String}
 */
var DND_TILE = "tile";

var itemDropTarget = {
    getDropEffect: function getDropEffect(cell, effectsAllowed) {
        if (!cell.isDroppable()) {
            return "other";
        }return effectsAllowed[0];
    },

    acceptDrop: function acceptDrop(cell, item, isHandled, effect) {
        if (!cell.isDroppable()) {
            return effect;
        }cell.onDrop(item);
    }
};

module.exports = React.createClass({

    displayName: "Cell",

    mixins: [Mixins.Classable, DragDropMixin],

    statics: {
        configureDragDrop: function configureDragDrop(register) {
            register(DND_TILE, {
                dropTarget: itemDropTarget
            });
        }
    },

    getDefaultProps: function getDefaultProps() {
        return {
            isDragging: false,
            isHovering: false
        };
    },

    getInitialState: function getInitialState() {
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

    isDroppable: function isDroppable() {
        return !this.props.data.tile;
    },

    chooseColor: function chooseColor() {},

    onDrop: function onDrop(item) {
        this.props.onDrop(item, this.props.y, this.props.x);
    },

    render: function render() {
        var _props = this.props;
        var data = _props.data;
        var isDragging = _props.isDragging;
        var isHovering = _props.isHovering;

        var dropState = this.getDropState(DND_TILE);

        var contentClasses = this.getClasses("cell-content", {
            "is-special": data.isSpecial,
            "special-tl": data.key === "tl",
            "special-tw": data.key === "tw",
            "special-dl": data.key === "dl",
            "special-dw": data.key === "dw",
            "is-empty": !data.tile,
            "tile-set": data.tile /*  Why are you doing this??? */
        });

        var cellClasses = this.getClasses("cell", {
            "is-empty": !data.tile,
            "is-not-drag-target": isDragging && data.tile,
            "is-drop-target": dropState.isHovering && !data.tile,
            "is-special": data.isSpecial
        });

        var body = React.createElement(
            "div",
            null,
            " "
        );
        if (data.tile || data.isSpecial) {
            var pointsDisplay;
            var letterDisplay;
            if (data.tile && data.isSpecial) {
                letterDisplay = data.tile.letter;
                pointsDisplay = "" + data.tile.points + " x " + data.multiple;
            } else if (data.isSpecial) {
                pointsDisplay = "x " + data.multiple;
            } else {
                letterDisplay = data.tile.letter;
                pointsDisplay = " " + data.tile.points;
            }

            body = React.createElement(
                Paper,
                { zDepth: 1 },
                React.createElement(
                    "div",
                    { className: "cell-letter" },
                    letterDisplay
                ),
                React.createElement(
                    "div",
                    { className: "cell-points" },
                    pointsDisplay
                )
            );
        }

        return React.createElement(
            "div",
            _extends({ className: cellClasses }, this.dropTargetFor(DND_TILE)),
            React.createElement(
                "span",
                { className: contentClasses },
                body
            )
        );
    }

});

},{"lodash":"lodash","material-ui":"material-ui","react":"react","react-dnd":"react-dnd"}],6:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var lodash = _interopRequire(require("lodash"));

var React = _interopRequire(require("react"));

var DragDropMixin = require("react-dnd").DragDropMixin;

var _materialUi = require("material-ui");

var Paper = _materialUi.Paper;
var Mixins = _materialUi.Mixins;
var RaisedButton = _materialUi.RaisedButton;

var Crabapple = _interopRequire(require("@crabapple/service"));

var PlayerData = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        color: React.PropTypes.string.isRequired
    },

    displayName: "PlayerData",

    render: function render() {
        var _props = this.props;
        var data = _props.data;
        var color = _props.color;
        var displayName = data.displayName;
        var points = data.points;

        var style = { color: color };

        return React.createElement(
            "div",
            { className: "player-data" },
            React.createElement(
                "span",
                { className: "player-name", style: style },
                displayName
            ),
            React.createElement(
                "span",
                { className: "player-points" },
                points
            )
        );
    }
});

var PlayerList = React.createClass({
    propTypes: {
        players: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    displayName: "PlayerList",

    colors: ["red", "orange", "blue", "brown"],

    chooseColor: function chooseColor(index) {
        return this.colors[index];
    },

    render: function render() {
        var _this = this;

        var players = this.props.players.map(function (pd, idx) {
            var key = "{$pd.displayName}-" + lodash.uniqueId();
            var color = _this.chooseColor(idx);
            return React.createElement(PlayerData, { key: key, data: pd, color: color });
        });

        return React.createElement(
            "div",
            { className: "player-lst" },
            players
        );
    }
});

/**
 * Key used to register this component type as a drag n' drop item
 * @type {String}
 */
var DND_TILE = "tile";

var itemDragSource = {
    beginDrag: function beginDrag(component) {

        return {
            item: {
                points: component.props.points,
                letter: component.props.letter
            },
            effectsAllowed: ["move", "other"]
        };
    },
    canDrag: function canDrag(component) {
        if (component.state.inWorkingSet) {
            return false;
        }return true;
    },
    endDrag: function endDrag(component, dropEffect) {
        if ("other" === dropEffect) {
            return;
        }component.setInWorkingSet();
    }
};

/**
 * A tile
 */

var Tile = React.createClass({

    mixins: [DragDropMixin, Mixins.Classable],

    displayName: "Tile",

    propTypes: {
        points: React.PropTypes.number.isRequired,
        letter: React.PropTypes.string.isRequired,
        handleTileMove: React.PropTypes.func },

    statics: {
        configureDragDrop: function configureDragDrop(register) {
            register(DND_TILE, {
                dragSource: itemDragSource
            });
        }
    },

    getInitialState: function getInitialState() {
        return {
            inWorkingSet: false
        };
    },

    setInWorkingSet: function setInWorkingSet() {
        var _this = this;

        this.setState({ inWorkingSet: true }, function () {
            _this.props.handleTileMove();
        });
    },

    render: function render() {
        var _props = this.props;
        var letter = _props.letter;
        var points = _props.points;
        var inWorkingSet = this.state.inWorkingSet;

        var _getDragState = this.getDragState(DND_TILE);

        var isDragging = _getDragState.isDragging;

        var opacity = isDragging ? 0.2 : 1;
        if (inWorkingSet) {
            opacity = 0.2;
        }

        var style = { opacity: opacity };

        var paperClasses = this.getClasses("tile", {
            "is-in-working-set": inWorkingSet
        });

        return React.createElement(
            "div",
            _extends({ className: "title-cnt"
            }, this.dragSourceFor(DND_TILE), {
                style: style }),
            React.createElement(
                Paper,
                { className: paperClasses, zDepth: 1 },
                React.createElement(
                    "span",
                    { className: "tile-letter" },
                    letter
                ),
                React.createElement(
                    "span",
                    { className: "tile-points" },
                    points
                )
            )
        );
    }
});

var TileList = React.createClass({

    displayName: "TileList",

    propTypes: {
        tiles: React.PropTypes.array.isRequired,
        handleTileMove: React.PropTypes.func
    },

    generateTiles: function generateTiles() {
        var _this = this;

        return this.props.tiles.map(function (t, idx) {
            var _t = _slicedToArray(t, 2);

            var letter = _t[0];
            var points = _t[1];

            return React.createElement(Tile, {
                key: idx,
                letter: letter,
                points: points,
                handleTileMove: _this.props.handleTileMove });
        });
    },

    render: function render() {

        var tiles = this.generateTiles();

        return React.createElement(
            "div",
            { className: "tile-lst" },
            React.createElement(
                "div",
                { className: "tile-lst-content" },
                tiles
            )
        );
    }
});

module.exports = React.createClass({

    displayName: "Deck",

    mixins: [Mixins.Classable],

    getDefaultProps: function getDefaultProps() {
        return {};
    },

    getInitialState: function getInitialState() {
        return {
            checkButtonEnabled: undefined
        };
    },

    propTypes: {
        players: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    handleCheckWord: function handleCheckWord() {},

    render: function render() {
        var _props = this.props;
        var players = _props.players;
        var enableCheck = _props.enableCheck;
        var handleTileMove = _props.handleTileMove;
        var checkButtonEnabled = this.state.checkButtonEnabled;

        var buttonDisabled = !enableCheck;
        if (typeof checkButtonEnabled !== "undefined") {
            buttonDisabled = checkButtonEnabled;
        }

        var classNames = this.getClasses("deck", {});
        var humanPlayerInfo = lodash.find(players, "isHuman");

        return React.createElement(
            "span",
            { className: classNames },
            React.createElement(
                "div",
                { className: "deck-column" },
                React.createElement(PlayerList, { players: players })
            ),
            React.createElement(
                "div",
                { className: "deck-column" },
                React.createElement(TileList, {
                    tiles: humanPlayerInfo.deck,
                    handleTileMove: handleTileMove })
            ),
            React.createElement(
                "div",
                { className: "deck-column" },
                React.createElement(RaisedButton, { label: "Check Words",
                    primary: true,
                    onClick: this.handleCheckWord,
                    disabled: buttonDisabled })
            )
        );
    }

});

},{"@crabapple/service":8,"lodash":"lodash","material-ui":"material-ui","react":"react","react-dnd":"react-dnd"}],7:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

module.exports = React.createClass({

    displayName: "Spinner",

    render: function render() {
        return React.createElement("div", { className: "content content-spinner" });
    }

});

},{"react":"react"}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var lodash = _interopRequire(require("lodash"));

var request = _interopRequire(require("superagent"));

var Bacon = _interopRequire(require("baconjs"));

var localforage = _interopRequire(require("localforage"));

var DEFAULT_FILE = "data/words.txt";

var WORD_LIST_KEY = "wordList";

var GAME_STATE_KEY = "gameState";

/**
 * A promise 
 * @volatile
 */
var gameStatePromise;

var getFromStorage = function () {
    return localforage.getItem(WORD_LIST_KEY);
};

var alphabet = lodash.toArray("abcdefghijklmnopqrstuvwxyz");

/**
 * Maximum base value for a letter
 * @type {Number}
 */
var MAX_ALPHA_VALUE = 20;

/**
 * Maximum size of the player's deck
 * @type {Nat}
 */
var DECK_SIZE = 8;

/**
 * Size of the board
 * @type {Number}
 */
var BOARD_SIZE = 15;

/**
 * Game values assigned to letters of the alphabet
 * @type {Map}
 * @key {Char} uppercase letter
 * @value {Nat} point value for uppercase letter
 * 
 * @return {[type]}        [description]
 */
var AlphabetValues = alphabet.reduce(function (map, l) {
    map.set(l, lodash.random(1, MAX_ALPHA_VALUE));
    return map;
}, new Map());

/**
 * Tuple of uppercase alphabet letter and its point value
 * @type {Tuple.<Char, Nat>}
 */
var AlphabetEntries = [];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = AlphabetValues.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var val = _step.value;

        AlphabetEntries.push(val);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

/**
 * Maximum number of available non-blank tiles for a game
 * @type {Number}
 */
var AVAILABLE_TILES = 98;

/**
 * All tiles available for a game
 * 
 * @type {Array.<Tuple.<Char, Nat>>}
 */
var GameTiles = lodash.range(AVAILABLE_TILES).map(function () {
    return lodash.sample(AlphabetEntries);
});

/**
 * Key for double-word bonus
 * @type {String}
 */
var DOUBLE_WORD_KEY = "dw";

/**
 * Array of Tuples of bonus cells and their multiples
 * @type {Array.<Triple.<String, Nat, Nat>>}
 */
var Bonuses = [["dl", 2, 24], ["tl", 3, 12],
/* 
    We subtract one to account for the center cell bonus accounted for
    elsewhere
*/
[DOUBLE_WORD_KEY, 2, 17 - 1], ["tw", 3, 8]];

module.exports = Object.defineProperties({
    /**
     * Retrieve list of words with each new word occupying its own line
     * @param  {String} file
     * @return {Bacon.Bus}
     */
    retrieve: function retrieve() {
        var file = arguments[0] === undefined ? DEFAULT_FILE : arguments[0];

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
        var req = request.get(file);
        var bus = Bacon.fromNodeCallback(req.end.bind(req)).map(function (req) {
            return req.text;
        })
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
        .map(function (words) {
            var filtered = words.split("\n");

            var wordSet = new Set(filtered);
            return wordSet;
        });
        return bus;
    },

    /**
     * Takes a tile from the total list of tiles available for the game
     * @return {Tuple.<Char, Nat>}
     */
    takeTile: function takeTile() {
        var n = arguments[0] === undefined ? 1 : arguments[0];

        if (!GameTiles.length) {
            return;
        }return GameTiles.splice(0, n);
    },

    /**
     * Retrieves a complete deck of tiles.  This will likely only be called at
     * the start of a game
     * @return {Array.<Tuple.<Char, Nat>>}
     */
    freshDeck: function freshDeck() {
        return this.takeTile(DECK_SIZE);
    },

    /**
     * Creates special tiles to a board 
     * @param {Matrix} board
     * @private
     * @return {Matrix} BOARD_SIZE X BOARD_SIZE matrix
     */
    applySpecialTiles: function applySpecialTiles(board) {
        var tiles = new Set();

        var maxIndex = BOARD_SIZE - 1;

        var s = function (y, x) {
            return "" + y + "," + x;
        };
        var randCoord = function () {
            return [lodash.random(maxIndex), lodash.random(maxIndex)];
        };

        var specialTiles = lodash(Bonuses).map(function (entry) {
            var _entry = _slicedToArray(entry, 3);

            var appearances = _entry[2];

            return lodash.fill(new Array(appearances), entry, 0, appearances);
        }).flatten().shuffle().value();

        /**
         * For Debug, should never be reached
         * @type {Nat}
         */
        var max_iter = specialTiles.length * 2;

        return specialTiles.reduce(function (b, entry) {
            var _entry = _slicedToArray(entry, 2);

            var key = _entry[0];
            var multiple = _entry[1];

            var combo;
            var i = 0;
            do {
                var _randCoord = randCoord();

                var _randCoord2 = _slicedToArray(_randCoord, 2);

                var x = _randCoord2[0];
                var y = _randCoord2[1];

                combo = s(y, x);

                var existing = b[y][x];
                b[y][x] = lodash.assign({}, existing, {
                    isSpecial: true,
                    key: key,
                    multiple: multiple
                });
                i++;
            } while (tiles.has(combo) || max_iter < i);

            return b;
        }, board.slice());
    },

    /**
     * Returns an empty board
     * @return {Matrix} BOARD_SIZE X BOARD_SIZE matrix
     */
    getBoard: function getBoard() {
        var pieces = lodash.fill(new Array(BOARD_SIZE), 1).map(function () {
            return lodash.range(BOARD_SIZE).map(function () {
                return {
                    tile: null
                };
            });
        });

        var midp = (BOARD_SIZE - 1) / 2;
        if (BOARD_SIZE % 2 === 0) {
            midp = BOARD_SIZE / 2;
        }
        var existing = pieces[midp][midp];

        pieces[midp][midp] = lodash.assign(existing, {
            isSpecial: true,
            isCenter: true
        });

        return pieces;
    },

    getEmptyBoard: function getEmptyBoard() {
        var pieces = lodash.fill(new Array(BOARD_SIZE), 1).map(function () {
            return lodash.fill(new Array(BOARD_SIZE), 1);
        });
        return pieces;
    },

    /**
     * Finds a game if it exists, otherwise creates a new one
     * @private
     * @return {Promise.<Error, GameState>}
     */
    getOrCreateGamePromise: function getOrCreateGamePromise() {
        var _this = this;

        gameStatePromise = localforage.getItem(GAME_STATE_KEY).then(function (s) {
            if (s) return s;
            var gameProto = _this.gameStatePrototype;
            return localforage.setItem(GAME_STATE_KEY, gameProto).then(function () {
                return gameProto;
            });
        });

        return gameStatePromise;
    },

    /**
     * Finds a game if it exists, otherwise creates a new one
     * @return {Bacon.<GameState>}
     */
    getOrCreateGame: function getOrCreateGame() {
        return Bacon.fromPromise(this.getOrCreateGamePromise());
    },

    /**
     * Resets the game to its initial state, clearing all info stored in 
     * localstorage except for the word list
     * @return {Bacon.<GameState>}
     */
    resetGame: function resetGame() {
        var _this = this;

        var p = localforage.deleteItem(GAME_STATE_KEY).then(function () {
            return _this.getOrCreateGamePromise();
        });

        return Bacon.fromPromise(p);
    },

    /**
     * Checks whether a potential word created by the application of certain
     * tiles to an existing board are acceptable
     * @return {Array.<Tuple.<Accepted, Failed>>}
     */
    checkWord: function checkWord() {},

    /**
     * Get possible players
     * @return {[type]} [description]
     */
    getPlayers: function getPlayers() {

        var player = {
            displayName: "You",
            points: 0,
            isHuman: true
        };

        var cpu = {
            displayName: "CPU",
            points: 0
        };

        return [player, cpu];
    }
}, {
    foundWordPrototype: {
        get: function () {
            return {
                word: null,
                points: 0
            };
        },
        configurable: true,
        enumerable: true
    },
    gameStatePrototype: {
        get: function () {
            var _this = this;

            var playerInfo = this.getPlayers().map(function (pd) {
                return lodash.assign(pd, {
                    foundWords: [],
                    deck: _this.freshDeck()
                });
            });

            return {
                board: this.applySpecialTiles(this.getBoard()),
                playerInfo: playerInfo
            };
        },
        configurable: true,
        enumerable: true
    }
});

/**
 * Prototype for this game's state
 * @return {Object}
 */

},{"baconjs":"baconjs","localforage":"localforage","lodash":"lodash","superagent":"superagent"}]},{},[1])


//# sourceMappingURL=app.js.map