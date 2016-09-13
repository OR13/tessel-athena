var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('./docs/tessel_status/1.0.0/**/*')
    .pipe(ghPages());
});