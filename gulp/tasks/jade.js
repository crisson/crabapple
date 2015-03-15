var gulp = require('gulp'),
    jade = require('gulp-jade')

var config = require('../config').jade


gulp.task('jade', function(){
    gulp.src(config.src)
        .pipe(jade())
        .pipe(gulp.dest(config.dest))
})