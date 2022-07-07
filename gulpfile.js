const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const {
  exec
} = require('child_process');

const webpackConfig = require('./webpack.config.js');

// Removes previous dist
gulp.task('start', () => {
  return gulp.src('./dist', {
      allowEmpty: true
    })
    .pipe(clean());
});

// Creates js bundle from several js files
gulp.task('build', () => {
  return webpack(webpackConfig)
    .pipe(gulp.dest('./dist/public'))
});

// Converts scss to css
gulp.task('scss', () => {
  return gulp.src('./src/public/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/public/css/'));
});

// Transfers index
gulp.task('index', () => {
  return gulp.src(['./src/public/*.html', './src/public/favicon.ico'])
    .pipe(gulp.dest('./dist/public'));
});

// Transfers views
gulp.task('views', () => {
  return gulp.src(['./src/views/**/*'])
    .pipe(gulp.dest('./dist/views'));
});


// Transfers index
gulp.task('img', () => {
  return gulp.src(['./src/public/img/**/*'])
    .pipe(gulp.dest('./dist/public/img'));
});

// Watch scss files
gulp.task('watch-scss', () => {
  return gulp.watch('./src/public/css/**/*.scss', gulp.series('scss'));
});

// Watch html files
gulp.task('watch-html', () => {
  return gulp.watch('./src/public/*.html', gulp.series('index'));
});

// Watch html files
gulp.task('watch-views', () => {
  return gulp.watch('./src/views/**/*', gulp.series('views'));
});

// Watch html files
gulp.task('watch-img', () => {
  return gulp.watch('./src/public/img/**/*', gulp.series('img'));
});

// Watch tsc files
gulp.task('watch-tsc', () => {
  return gulp.watch('./dist/public/js/**/*.js', gulp.series('build'));
});

// Initial ts compile
gulp.task('tsc', cb => {
  exec('tsc', (err, msg) => {
    cb();
  });
});

// Watch ts files and recompile
gulp.task('tsc-w', () => {
  exec('tsc -w');
});

// start nodemon
gulp.task('nodemon', () => {
  exec('nodemon dist/server.js');
  exec('google-chrome http://localhost:3000');
});

// Run all together
gulp.task('default', gulp.series(
  'start',
  'scss',
  'index',
  'views',
  'img',
  'tsc',
  'build',
  gulp.parallel(
    'watch-scss',
    'watch-html',
    'watch-views',
    'watch-img',
    'watch-tsc',
    'tsc-w',
    // 'nodemon',
  ),
));