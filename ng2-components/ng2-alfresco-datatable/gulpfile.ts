import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as rimraf from 'rimraf';
import { join } from 'path';
import * as Builder from 'systemjs-builder';
var autoprefixer = require('autoprefixer');
import * as cssnano from 'cssnano';
import * as filter from 'gulp-filter';
import * as sourcemaps from 'gulp-sourcemaps';

var APP_SRC = `.`;
var CSS_PROD_BUNDLE = 'main.css';
var JS_PROD_SHIMS_BUNDLE = 'shims.js';
var NG_FACTORY_FILE = 'main-prod';

const BUILD_TYPES = {
    DEVELOPMENT: 'dev',
    PRODUCTION: 'prod'
};

function normalizeDependencies(deps) {
    deps
        .filter((d) => !/\*/.test(d.src)) // Skip globs
        .forEach((d) => d.src = require.resolve(d.src));
    return deps;
}

function filterDependency(type: string, d): boolean {
    const t = d.buildType || d.env;
    d.buildType = t;
    if (!t) {
        d.buildType = Object.keys(BUILD_TYPES).map(k => BUILD_TYPES[k]);
    }
    if (!(d.buildType instanceof Array)) {
        (<any>d).env = [d.buildType];
    }
    return d.buildType.indexOf(type) >= 0;
}

function getInjectableDependency() {
    var APP_ASSETS = [
        {src: `src/css/main.css`, inject: true, vendor: false},
    ];

    var NPM_DEPENDENCIES = [
        {src: 'zone.js/dist/zone.js', inject: 'libs'},
        {src: 'core-js/client/shim.min.js', inject: 'shims'},
        {src: 'systemjs/dist/system.src.js', inject: 'shims', buildType:'dev'}
    ];

    return normalizeDependencies(NPM_DEPENDENCIES.filter(filterDependency.bind(null, 'dev')))
        .concat(APP_ASSETS.filter(filterDependency.bind(null, 'dev')));
}

const plugins = <any>gulpLoadPlugins();

let tsProjects: any = {};

function makeTsProject(options: Object = {}) {
    let optionsHash = JSON.stringify(options);
    if (!tsProjects[optionsHash]) {
        let config = Object.assign({
            typescript: require('typescript')
        }, options);
        tsProjects[optionsHash] =
            plugins.typescript.createProject('tsconfig.json', config);
    }
    return tsProjects[optionsHash];
}

gulp.task('build.html_css', () => {
    const gulpConcatCssConfig = {
        targetFile: CSS_PROD_BUNDLE,
        options: {
            rebaseUrls: false
        }
    };

    const processors = [
        autoprefixer({
            browsers: [
                'ie >= 10',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 7',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.4',
                'bb >= 10'
            ]
        })
    ];

    const reportPostCssError = (e: any) => util.log(util.colors.red(e.message));

    processors.push(
        cssnano({
            discardComments: {removeAll: true},
            discardUnused: false, // unsafe, see http://goo.gl/RtrzwF
            zindex: false, // unsafe, see http://goo.gl/vZ4gbQ
            reduceIdents: false // unsafe, see http://goo.gl/tNOPv0
        })
    );

    /**
     * Processes the CSS files within `src/client` excluding those in `src/client/assets` using `postcss` with the
     * configured processors
     * Execute the appropriate component-stylesheet processing method based on user stylesheet preference.
     */
    function processComponentStylesheets() {
        return gulp.src(join('src/**', '*.css'))
            .pipe(plugins.cached('process-component-css'))
            .pipe(plugins.postcss(processors))
            .on('error', reportPostCssError);
    }


    /**
     * Get a stream of external css files for subsequent processing.
     */
    function getExternalCssStream() {
        return gulp.src(getExternalCss())
            .pipe(plugins.cached('process-external-css'));
    }

    /**
     * Get an array of filenames referring to all external css stylesheets.
     */
    function getExternalCss() {
        return getInjectableDependency().filter(dep => /\.css$/.test(dep.src)).map(dep => dep.src);
    }

    /**
     * Processes the external CSS files using `postcss` with the configured processors.
     */
    function processExternalCss() {
        return getExternalCssStream()
            .pipe(plugins.postcss(processors))
            .pipe(plugins.concatCss(gulpConcatCssConfig.targetFile, gulpConcatCssConfig.options))
            .on('error', reportPostCssError);
    }

    return merge(processComponentStylesheets(), processExternalCss());

});

gulp.task('build.bundles.app', (done) => {
    var BUNDLER_OPTIONS = {
        format: 'umd',
        minify: false,
        mangle: false,
        sourceMaps: true
    };
    var CONFIG_TYPESCRIPT = {
        baseURL: '.',
        transpiler: 'typescript',
        typescriptOptions: {
            module: 'cjs'
        },
        map: {
            typescript: 'node_modules/typescript/lib/typescript.js',
            '@angular': 'node_modules/@angular',
            rxjs: 'node_modules/rxjs',
            'ng2-translate': 'node_modules/ng2-translate',
            'alfresco-js-api': 'node_modules/alfresco-js-api/dist/alfresco-js-api',
            'ng2-alfresco-core': 'node_modules/ng2-alfresco-core/',
            'ng2-activiti-diagrams': 'node_modules/ng2-activiti-diagrams/',
            'ng2-activiti-analytics': 'node_modules/ng2-activiti-analytics/',
            'ng2-alfresco-datatable': 'node_modules/ng2-alfresco-datatable/',
            'ng2-alfresco-documentlist': 'node_modules/ng2-alfresco-documentlist/',
            'ng2-activiti-form': 'node_modules/ng2-activiti-form/',
            'ng2-alfresco-login': 'node_modules/ng2-alfresco-login/',
            'ng2-activiti-processlist': 'node_modules/ng2-activiti-processlist/',
            'ng2-alfresco-search': 'node_modules/ng2-alfresco-search/',
            'ng2-activiti-tasklist': 'node_modules/ng2-activiti-tasklist/',
            'ng2-alfresco-tag': 'node_modules/ng2-alfresco-tag/',
            'ng2-alfresco-upload': 'node_modules/ng2-alfresco-upload/',
            'ng2-alfresco-userinfo': 'node_modules/ng2-alfresco-userinfo/',
            'ng2-alfresco-viewer': 'node_modules/ng2-alfresco-viewer/',
            'ng2-alfresco-webscript': 'node_modules/ng2-alfresco-webscript/',
        },
        paths: {
            '*': '*.js'
        },
        meta: {
            'node_modules/@angular/*': {build: false},
            'node_modules/rxjs/*': {build: false},
            'node_modules/ng2-translate/*': {build: false},
            'node_modules/ng2-alfresco-core/*': {build: false},
            'node_modules/ng2-activiti-diagrams/*': {build: false},
            'node_modules/ng2-activiti-analytics/*': {build: false},
            'node_modules/ng2-alfresco-datatable/*': {build: false},
            'node_modules/ng2-alfresco-documentlist/*': {build: false},
            'node_modules/ng2-activiti-form/*': {build: false},
            'node_modules/ng2-alfresco-login/*': {build: false},
            'node_modules/ng2-activiti-processlist/*': {build: false},
            'node_modules/ng2-alfresco-search/*': {build: false},
            'node_modules/ng2-activiti-tasklist/*': {build: false},
            'node_modules/ng2-alfresco-tag/*': {build: false},
            'node_modules/ng2-alfresco-upload/*': {build: false},
            'node_modules/ng2-alfresco-userinfo/*': {build: false},
            'node_modules/ng2-alfresco-viewer/*': {build: false},
            'node_modules/ng2-alfresco-webscript/*': {build: false}
        }
    };

    var pkg = require('./package.json');
    var namePkg = pkg.name;

    var builder = new Builder(CONFIG_TYPESCRIPT);
    builder
        .buildStatic(APP_SRC + "/index", 'bundles/' + namePkg + '.js', BUNDLER_OPTIONS)
        .then(function () {
            return done();
        })
        .catch(function (err) {
            return done(err);
        });
});

gulp.task('build.assets.prod', () => {
    return gulp.src([
        join('src/**', '*.ts'),
        'index.ts',
        join('src/**', '*.css'),
        join('src/**', '*.html'),
        '!'+join('*/**', '*.d.ts'),
        '!'+join('*/**', '*.spec.ts'),
        '!gulpfile.ts'])

});

gulp.task('build.bundles', () => {
    merge(bundleShims());

    /**
     * Returns the shim files to be injected.
     */
    function getShims() {
        let libs = getInjectableDependency()
            .filter(d => /\.js$/.test(d.src));

        return libs.filter(l => l.inject === 'shims')
            .concat(libs.filter(l => l.inject === 'libs'))
            .concat(libs.filter(l => l.inject === true))
            .map(l => l.src);
    }

    /**
     * Bundles the shim files.
     */
    function bundleShims() {
        return gulp.src(getShims())
            .pipe(plugins.concat(JS_PROD_SHIMS_BUNDLE))
            // Strip the first (global) 'use strict' added by reflect-metadata, but don't strip any others to avoid unintended scope leaks.
            .pipe(plugins.replace(/('|")use strict\1;var Reflect;/, 'var Reflect;'))
            .pipe(gulp.dest('bundles'));
    }

});

gulp.task('build.js.prod', () => {
    const INLINE_OPTIONS = {
        base: APP_SRC,
        target: 'es5',
        useRelativePaths: true,
        removeLineBreaks: true
    };

    let tsProject = makeTsProject();
    let src = [
        join('src/**/*.ts'),
        join('!src/**/*.d.ts'),
        join('!src/**/*.spec.ts'),
        `!src/**/${NG_FACTORY_FILE}.ts`
    ];

    let result = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once('error', function (e: any) {
            this.once('finish', () => process.exit(1));
        });

    return result.js
        .pipe(plugins.template())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src'))
        .on('error', (e: any) => {
            console.log(e);
        });
});

gulp.task('build.prod', (done: any) =>
    runSequence(
        'build.assets.prod',
        'build.html_css',
        'build.js.prod',
        'build.bundles',
        'build.bundles.app',
        done));
