var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const rootPath = helpers.root('node_modules');

var pattern = '+(alfresco-js-api|ng2-alfresco|ng2-activiti)*';
var options = {
    cwd: rootPath,
    realpath: true
};

var alfrescoLibs = glob.sync(pattern, options);
// console.dir(alfrescoLibs);

module.exports = {
    entry: {
        'polyfills': './app/polyfills.ts',
        'vendor': './app/vendor.ts',
        'app': './app/main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js'],
        modules: [
            helpers.root('app'),
            helpers.root('node_modules')
        ],
        root: rootPath,
        fallback: rootPath
    },

    resolveLoader: {
        alias: {
            'systemjs-loader': helpers.root('config', 'loaders', 'system.js'),
            'debug-loader': helpers.root('config', 'loaders', 'debug.js')
        },
        fallback: rootPath
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                include: [
                    ...alfrescoLibs
                ],
                loader: 'source-map-loader'
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader', 'systemjs-loader'],
                exclude: ['node_modules','public']
            },
            {
                test: /\.js$/,
                include: [
                    ...alfrescoLibs
                ],
                loaders: ['angular2-template-loader', 'source-map-loader', 'systemjs-loader']
            },
            {
                test: /\.html$/,
                exclude: alfrescoLibs,
                loader: 'html'
            },
            {
                test: /\.html$/,
                include: alfrescoLibs,
                loader: 'html',
                query: {
                    interpolate: true
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: [
                    helpers.root('app'),
                    ...alfrescoLibs
                ],
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: [
                    helpers.root('app'),
                    ...alfrescoLibs
                ],
                loader: 'raw'
            }
        ]
    },

    plugins: [

        new webpack.WatchIgnorePlugin([ new RegExp('^((?!(ng2-activiti|ng2-alfresco|demo-shell-ng2)).)((?!(src|app)).)*$')]),

        new CopyWebpackPlugin([
            {
                from: 'versions.json'
            },{
                context: 'node_modules',
                from: 'element.scrollintoviewifneeded-polyfill/index.js',
                to: 'js/element.scrollintoviewifneeded-polyfill.js',
                flatten: true
            },{
                context: 'node_modules',
                from: 'classlist-polyfill/src/index.js',
                to: 'js/classlist-polyfill.js',
                flatten: true
            }, {
                context: 'node_modules',
                from: 'intl/dist/Intl.min.js',
                to: 'js/Intl.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from: 'web-animations-js/web-animations.min.js',
                to: 'js/web-animations.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from: 'core-js/client/shim.min.js',
                to: 'js/shim.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from:  'es6-shim/es6-shim.min.js',
                to: 'js/es6-shim.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from:  'es5-shim/es5-shim.min.js',
                to: 'js/es5-shim.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from:  'systemjs/dist/system-polyfills.js',
                to: 'js/system-polyfills.js',
                flatten: true
            }, {
                context: 'node_modules',
                from:  'material-design-lite/material.min.js',
                to: 'js/material.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from:  'material-design-lite/material.min.js',
                to: 'js/material.min.js',
                flatten: true
            }, {
                context: 'node_modules',
                from: 'material-design-icons/iconfont/',
                to: 'css/iconfont/',
                flatten: true
            }, {
                context: 'public',
                from: '',
                to: ''
            }
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],

    node: {
        fs: 'empty',
        module: false
    }
};
