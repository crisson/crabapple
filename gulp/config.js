var root = '.'

// TODO: add BrowserSync, nodemon, etc
module.exports = {
    browserify: {
        dest: 'build/assets/js/app.js',
        entry: "./src/web-client/index.js",
        vendor: {
            dest: 'build/assets/js/vendor.min.js',
            destmin: './',
            opts: {},
            requireFiles: [
                "react",
                "material-ui",
                "lodash"
            ]
        }
    },

    less: {
        src: 'assets/less/main.less',
        watch: 'assets/less/**/*.less',
        dest: 'build/css/',
        srcmapsDest: 'build/css/'
    },
    lessAlien: {
        src: 'assets/vendor/less/main.alien.less',
        watch: 'assets/vendor/less/**/*.less',
        dest: 'build/css/',
        srcmapsDest: 'build/css/'
    },
    copy: {
        src: [
            'assets/img/**/*.{png,ico,jpeg,jpg,gif,svg}',
            'assets/vendor/img/**/*.{png,ico,jpeg,jpg,gif,svg}'
        ]
    },
    img: {

    },
    prepareDeploy: {

    }
}