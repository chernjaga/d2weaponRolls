const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const browserSync = require('browser-sync').create();
const scripts = require('./scripts');
const styles = require('./styles');

var devMode = false;

gulp.task('sass', function () {
    return gulp.src(styles)
        .pipe(sass())
        .pipe(concat('main.css'))
        // .pipe(uglifycss())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('js', function () {
    return gulp.src(scripts)
        .pipe(concat('scipts.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('html', function () {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./public/html'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('build', function () {
    return gulp.start(['sass', 'js', 'html']);
});

gulp.task('browser-sync', function () {
    return browserSync.init(null, {
        open: false,
        server: {
            baseDir: 'public'
        }
    });
});
gulp.task('start', function () {
    devMode = true;
    gulp.start(['build', 'browser-sync']);
    gulp.watch(['./src/**/*.scss'], ['sass']);
    gulp.watch(['./src/**/*.html'], ['html']);
    gulp.watch(['./src/**/*.js'], ['js']);
});