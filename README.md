## Simple game of Crabapple (WIP)

Crabapple is a Scrabble-like game.  It follows many of Scrabble's rules, but makes some noteworthy changes.
- 8/9 letters in your deck.
- The value and distribution of bonus tiles differs from the official game
- more to come!

### Goal 

Once this game's basic mechanics are in-place, I'll move on to integrating WebRTC to permit individuals to host games in their browser, with a lightweight server responsible for the protocol's handshake.  This will primarily be a learning experience for me.


### Setup

If you do not already have node/io.js installed, do so now.  Once installed, use `npm` to install dependencies with `npm install`.

This app uses a symbolic link from the `node_modules` directory to permit prettier intra-app module paths.  From this repository's `node_modules` directory on Unix/Linux, enter `ln -s ../src @crabapple` to create the link.  On windows use `mklink /J "node_modules/@crabapple" src`.  Note that there are [peculiarities](http://superuser.com/questions/124679/how-do-i-create-a-link-in-windows-7-home-premium-as-a-regular-user) with creating symbolic links in Windows 7 (and presumably 8/10).

### Development

The default `gulp` task is configured to copy binary static assets to the build folder, compile less & js files, and compile index.jade to index.html.  It will also automatically watch for changes and continually execute these steps.

Run this task with the command `npm run develop`.

I use `harp` (`npm install -g harp`) to serve the build directory with `harp server build/`.  Feel free to use whichever tool you prefer.

the `develop` script also starts the static file server `harp`.


### Deployment 

TBD
