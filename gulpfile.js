var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
 
gulp.task('default', function () {
  gulp.src('./img/boards/*.jpg')
    .pipe(imageResize({ 
      width : 500
    }))
    .pipe(gulp.dest('./dist/img/boards/thumb'));
});