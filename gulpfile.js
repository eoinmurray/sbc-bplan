

var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    react = require('gulp-react'),
    connect = require('connect'),
    gutil = require('gulp-util'),
    http = require('http'),
    path = require('path')
    spawn = require('child_process').spawn;


/*
    Stream Error handling.
    Ref: https://github.com/gulpjs/gulp/issues/75
    These two utility functions are to handle errors that arise in the stream in a user specified way.
    It should be used in this way.

        source.pipe(continueOnError(plugin()))
            .on('error', handleErr)

    A better solution should come up soon through the gulp.js eco system.

    EM
*/

var cleaner = function(stream) {
    stream.listeners('error').forEach(function(item) {
        if(item.name == 'onerror') this.removeListener('error', item);
    }, stream);
};

var continueOnError = function(stream) {
    return stream
        .on('error', function(){})
        .on('pipe', function(src) {
            cleaner(src);
        })
        .on('newListener', function() {
            cleaner(this);
        });
};

/*
    BUILD TASKS
*/

var build_paths = {
  scripts: ['app/scripts/**/*.js', '!app/scripts/vendor/**', '!app/scripts/templates/**'],
  images: 'app/images/**/*',
  templates: 'app/scripts/templates/*',
  meta  : ['app/*', '!app/scripts', '!app/images', '!app/styles', '!app/bower_components', '!app/index.html']
};

gulp.task('usemin', function(){
    return gulp
        .src('./app/*.html')
        .pipe(usemin({ cssmin: true, htmlmin: true, jsmin: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {
    return gulp
        .src(build_paths.images)
        .pipe(imagemin({optimizationLevel: 3}))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('copy', function() {
    return gulp
        .src(build_paths.meta)
        .pipe(gulp.dest('dist/'))
});

gulp.task('templates', function() {
    return gulp
        .src(build_paths.templates)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/scripts/templates'))
});

gulp.task('clean', function() {
    return gulp
        .src(['dist/*'], {read: false})
        .pipe(clean());
});

gulp.task('build', function() {
    gulp.start('clean', 'images', 'templates', 'usemin', 'copy');
});

/*
    DEV SERVER TASKS
*/

gulp.task('jsx', function(){
    return gulp
        .src('./app/scripts/views/*.jsx')
        // See #Stream Error handling# above.
        .pipe(continueOnError(react()))
            .on('error', function(err){return
                gutil.log(gutil.colors.red(err)
            )})
        .pipe(gulp.dest('./app/scripts/views/'))
})

gulp.task('connect', function() {
  var
    base = path.resolve('.'),
    directory = path.resolve('.'),
    app = connect()
        .use(connect["static"](base))
        .use(connect.directory(directory));

  return http.createServer(app).listen(9000, null);
});

gulp.task('server', function() {
  gulp.start('connect');

  gulp.watch('./app/scripts/views/*.jsx', ['jsx']);
});