## Simple game of Crabapple

Crabapple is a Scrabble-like game.  It follows many of Scrabble's rules, but makes some noteworthy changes.
- 8/9 letters in your deck.
- The value and distribution of bonus tiles differs from the official game

### Setup

If you do not already have node/io.js installed, do so now.  Once installed, use `npm` to install dependencies with `npm install`.

This app uses a symbolic link from the `node_modules` directory to permit nicer intra-app module paths.  From this repository's `node_modules` directory on Unix/Linux, enter `ln -s ../src @crabapple` to create the link.  On windows use `ln /J node_modules/@crabapple src`.  Note that there are [peculiarities](http://superuser.com/questions/124679/how-do-i-create-a-link-in-windows-7-home-premium-as-a-regular-user) with creating symbolic links in Windows 7 (and presumably 8/10).

### Development

The default `gulp` task is configured to copy binary static assets to the build folder, compile less & js files, and compile index.jade to index.html.  It will also automatically watch for changes and continually execute these steps.

I use `harp` (`npm install -g harp`) to serve the build directory.  Feel free to use whichever tool you prefer.

### Deployment 

TBD
