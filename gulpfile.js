var destDir = "./public/";

var gulp = require('gulp');
var plumber = require( 'gulp-plumber' );
var compass = require('gulp-compass');
var jade = require('gulp-jade');
var watch = require("gulp-watch");
var webserver = require("gulp-webserver");
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

// $ gulp --develop でjsをminifyしない

if (gutil.env.develop) gulp.task('default',['watch', 'server', 'jade', 'js-dev', 'compass']);
else gulp.task('default',['watch', 'server', 'jade', 'js', 'compass']);


gulp.task('watch',function(){
  // gulp.watch(['./src/jade/*.jade','./src/jade/**/*.jade','./src/jade/**/_*.jade'],['jade']);
  watch(['./src/jade/*.jade','./src/jade/**/*.jade','./src/jade/**/_*.jade'],function(){
    gulp.start('jade');
  });
  watch(['./src/js/*.js','./src/js/**/*.js','./src/js/**/_*.js'],function(){
    if (gutil.env.develop) gulp.start('js-dev');
    else gulp.start('js');
  });
  watch(['./src/scss/*.scss','./src/scss/**/*.scss','./src/scss/**/_*.scss'],function(){
    gulp.start('compass');
  });
});

gulp.task('server',function(){
  gulp.src('public')
    .pipe(webserver({
      // directoryListing: true,
      host: '0.0.0.0',
      port: 6060,
    })
  );
});

gulp.task('jade',function(){
  gulp.src(['./src/jade/*.jade','./src/jade/**/*.jade','!src/jade/**/_*.jade'])
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(destDir));
});

gulp.task('js-dev',function(){
  // minifyしない
  gulp.src(['./src/js/*.js','./src/js/**/*.js','!src/js/**/_*.js'])
    .pipe(plumber())
    .pipe(gulp.dest(destDir+'js/'));
});

gulp.task('js',function(){
  // minifyする
  gulp.src(['./src/js/*.js','./src/js/**/*.js','!src/js/**/_*.js'])
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(gulp.dest(destDir+'js/'));
});

gulp.task('compass', function(){
  gulp.src(['./src/scss/*.scss','./src/scss/**/*.scss','!src/scss/**/_*.scss'])
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: destDir+'css/',
      sass: './src/scss/'
    }))
    .pipe(gulp.dest(destDir+'css/'));
});
