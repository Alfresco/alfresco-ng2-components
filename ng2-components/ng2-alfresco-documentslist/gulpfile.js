const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const tsconfig = require('tsconfig-glob');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});

// linting
gulp.task('tslint', function () {
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

gulp.task('build', ['tslint', 'clean', 'compile']);
gulp.task('default', ['build']);
