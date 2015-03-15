var gulp = require('gulp'),
    less = require('gulp-less'),
    authprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps')

var handleError = require('../util/handleError')

var config = require('../config').less

gulp.task('less', function(){
    return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', handleError)
        .pipe(authprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(sourcemaps.write(config.srcmapsDest))
        .pipe(gulp.dest(config.dest))
})