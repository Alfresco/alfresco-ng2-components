const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const tsconfig = require('tsconfig-glob');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
    return gulp.src(['app/**/*',
                     'index.html',
                     'typings.json',
                     '!app/**/*.ts'], { base : './' })
        .pipe(gulp.dest('dist'))
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
    return gulp.src([
            'node_modules/**/*'
        ])
        .pipe(gulp.dest('dist/node_modules'))
});

// copy typings
gulp.task('copy:typings', ['clean'], function() {
    return gulp.src([
            'typings/**/*'
        ])
        .pipe(gulp.dest('dist/typings'))
});

// linting
gulp.task('tslint', function() {
    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});


// TypeScript compile
gulp.task('compile', ['clean'], function () {
    return gulp
        .src(tscConfig.files)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

// update the tsconfig files based on the glob pattern
gulp.task('tsconfig-glob', function () {
    return tsconfig({
        configPath: '.',
        indent: 2
    });
});

// Run browsersync for development
gulp.task('serve', ['build'], function() {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });

    gulp.watch(['app/**/*', 'index.html'], ['buildAndReload']);
});

gulp.task('build', ['tslint', 'copy:assets', 'copy:libs', 'copy:typings', 'compile']);
gulp.task('dev', ['build', 'serve'], reload);
gulp.task('default', ['build']);
