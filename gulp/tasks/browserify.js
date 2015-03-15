var gulp = require('gulp')
var browserify = require("browserify");
var babelify = require("babelify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var bufferify = require('vinyl-buffer')
var source = require('vinyl-source-stream');

var config = require('../config'),
    handleError = require('../util/handleError')

gulp.task('browserify-vendor', function(){
    var bundler = browserify(config.browserify.vendor.opts)

    config.browserify.vendor.requireFiles.map(function(file){
        bundler.require(file)
    })

    return bundler
      .bundle()
      .pipe(source(config.browserify.vendor.dest))
      .pipe(bufferify())
      .pipe(uglify())
      .pipe(gulp.dest(config.browserify.vendor.destmin))
      .on("error", handleError)
})

gulp.task('browserify', function(){
    var bundler = browserify({ debug: true })

    config.browserify.vendor.requireFiles.forEach(function(file){
        bundler.external(file)
    })

    return bundler
      .transform(babelify)
      .require(config.browserify.entry, { entry: true })
      .bundle()
      .on("error", handleError)
      .pipe(source(config.browserify.destFilename))
      .pipe(bufferify())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write(config.browserify.sourcemapsDest))
      .pipe(gulp.dest(config.browserify.dest));
})