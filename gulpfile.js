const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const {
  exec,
  execSync,
  execFile
} = require('child_process');

const webpackConfig = require('./webpack.config.js');
const {
  task
} = require('gulp');

// Removes previous dist
gulp.task('start', () => {
  return gulp.src('./dist', {
      allowEmpty: true
    })
    .pipe(clean());
});

// Creates js bundle from several js files
gulp.task('webpack', () => {
  return webpack(webpackConfig)
    .pipe(gulp.dest('./dist/public'))
});

// Converts scss to css
gulp.task('scss', () => {
  return gulp.src('./src/public/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/public/css/'));
});

// Transfers static files
gulp.task('static', () => {
  return gulp.src(['src/**/*', '!src/**/*.ts', '!src/**/*.scss'])
    .pipe(gulp.dest('./dist/'));
});

// Watch scss files
gulp.task('watch-scss', () => {
  return gulp.watch('./src/public/css/**/*.scss', gulp.series('scss'));
});


// Watch static files
gulp.task('watch-static', () => {
  return gulp.watch(['src/**/*', '!src/**/*.ts', '!src/**/*.scss'], gulp.series('static'));
});

// Watch tsc files
gulp.task('watch-js', () => {
  return gulp.watch('./dist/public/js/**/*.js', gulp.series('webpack'));
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

gulp.task('build', gulp.series(
  'start',
  'scss',
  'static',
  'tsc',
  'webpack',
))

// Run all together
gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch-scss',
    'watch-static',
    'watch-js',
    'tsc-w',
    // 'nodemon',
  ),
));


gulp.task('clean-deploy', () => {
  return gulp.src(['./deploy/'], {
      allowEmpty: true
    })
    .pipe(clean());
});

gulp.task('copy-dist-to-deploy', () => {
  return gulp.src(['./dist/**/*'])
    .pipe(gulp.dest('./deploy'));
});

gulp.task('copy-node-to-deploy', () => {
  return gulp.src([
      './package.json',
      './package-lock.json',
      './Procfile'
    ])
    .pipe(gulp.dest('./deploy'));
});

task('deploy-heruku', (cb) => {
  execSync('chmod +x deploy.sh');
  execFile('./deploy.sh', (err) => {
    console.log(err);
    cb()
  })
})

gulp.task('deploy', gulp.series(
  'build',
  'clean-deploy',
  'copy-dist-to-deploy',
  'copy-node-to-deploy',
  'deploy-heruku'
));