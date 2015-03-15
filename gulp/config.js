var ext = "{png,ico,jpeg,jpg,gif,svg,jade,woff,woff2,ttf,txt}";
var watchExt = '{' + ext.slice(1, ext.length - 1) + ',jade}';

// TODO: add BrowserSync, nodemon, etc
module.exports = {
    browserify: {
        entry: "./src/app.js",
        watch: "src/**/*.{js,jsx}",
        dest: './build/js',
        sourcemapsDest: './',
        destFilename: 'app.js',
        vendor: {
            dest: 'build/js/vendor.min.js',
            destmin: './',
            opts: {},
            requireFiles: [
                "react",
                'react-tap-event-plugin',
                "material-ui",
                "lodash"
            ]
        }
    },

    less: {
        src: 'assets/less/main.less',
        watch: 'assets/less/**/*.less',
        dest: 'build/css/',
        srcmapsDest: '.'
    },
    lessAlien: {
        src: 'assets/vendor/less/main.alien.less',
        watch: 'assets/vendor/less/**/*.less',
        dest: 'build/css/',
        srcmapsDest: '.'
    },
    copy: {
        src: [
            'assets/**/*.' + ext,
        ],
        dest: "build/",
        prefix: 1,
        watch: "assets/**/*." + watchExt
    },
    img: {

    },
    prepareDeploy: {

    }
}