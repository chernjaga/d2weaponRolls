const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const browserSync = require('browser-sync').create();
const scripts = require('./scripts');
const styles = require('./styles');
var devMode = false;

gulp.task('sass', function() {
  gulp.src(styles)
      .pipe(sass())
      .pipe(concat('main.css'))
      .pipe(uglifycss())
      .pipe(gulp.dest('./public/css'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
gulp.task('js', function() {
  gulp.src(scripts)
      .pipe(concat('scipts.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./public/js'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
gulp.task('html', function() {
  gulp.src('./src/templates/**/*.html')
      .pipe(gulp.dest('./public/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
gulp.task('build', function() {
  gulp.start(['sass', 'js', 'html']);
});
gulp.task('browser-sync', function() {
  browserSync.init(null, {
    open: false,
    server: {
      baseDir: 'public'
    }
  });
});
gulp.task('start', function() {
  devMode = true;
  gulp.start(['build', 'browser-sync']);
  gulp.watch(['./src/scss/**/*.scss'], ['sass']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
//   gulp.watch(['./src/templates/**/*.html'], ['html']);
});