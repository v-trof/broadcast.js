var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('build', function() {
  return gulp.src(['./src/*.js', './src/*/*.js'])
    .pipe(concat('broadcast.js'))
    .pipe(gulp.dest('./dist/'));
});
