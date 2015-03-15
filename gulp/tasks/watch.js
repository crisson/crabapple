var gulp = require('gulp');
var lessConfig = require('../config').less
var lessAlienConfig = require('../config').lessAlien
var config = require('../config').browserify
var copyConfig = require('../config').copy
var jadeConfig = require('../config').jade

gulp.task('watch', ['build'], function(){
    gulp.watch(lessConfig.watch, ['less'])
    gulp.watch(lessAlienConfig.watch, ['less-alien'])
    gulp.watch(copyConfig.watch, ['copy'])
	gulp.watch(jadeConfig.watch, ['jade'])
    return gulp.watch(config.watch, { interval: 500 }, ['browserify'])
})