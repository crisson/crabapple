var gulp = require('gulp'),
    copy = require('gulp-copy')

var config = require('../config').copy

gulp.task('copy', function () {
    return gulp.src(config.src)
        .pipe(copy(config.dest, {prefix: config.prefix}))
})