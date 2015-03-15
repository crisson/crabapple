var gulp = require('gulp')

gulp.task('build', ['less-alien', 'less', 'copy', 'browserify'])