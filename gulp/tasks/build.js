var gulp = require('gulp')

gulp.task('build', [
    'less-alien', 'less', 'copy', 'jade', 'browserify-vendor', 'browserify'
])