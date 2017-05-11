const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const helpers = require('./helpers');
const path = require('path');

const alfrescoLibs = [
    'ng2-activiti-analytics',
    'ng2-activiti-diagrams',
    'ng2-activiti-form',
    'ng2-activiti-processlist',
    'ng2-activiti-tasklist',
    'ng2-alfresco-core',
    'ng2-alfresco-datatable',
    'ng2-alfresco-documentlist',
    'ng2-alfresco-login',
    'ng2-alfresco-search',
    'ng2-alfresco-tag',
    'ng2-alfresco-upload',
    'ng2-alfresco-userinfo',
    'ng2-alfresco-viewer',
    'ng2-alfresco-webscript'
];

module.exports = {
    entry: {
        'polyfills': './app/polyfills.ts',
        'vendor': './app/vendor.ts',
        'app': './app/main.ts'
    },

    resolveLoader: {
        alias: {
            "license-check": path.resolve(__dirname, "./loaders/license-check")
        }
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                loader: 'source-map-loader',
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                include: [helpers.root('app')],
                options: {
                    emitErrors: true
                },
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: 'source-map-loader',
                exclude: [ /public/, /resources/, /dist/]
            },
            {
                test: /\.ts$/,
                include: [helpers.root('app')],
                loader: [
                    'ts-loader',
                    'angular2-template-loader'
                ],
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.css$/,
                exclude: helpers.root('app'),
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                include: helpers.root('app'),
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'license-check',
                include: helpers.root('app'),
                options: {
                    emitErrors: true,
                    licenseFile: path.resolve(__dirname, '../assets/license_header.txt')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/],
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./app'), // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),

        new CopyWebpackPlugin([
            ... alfrescoLibs.map(lib => {
                return {
                    context: `../ng2-components/${lib}/bundles/assets/` ,
                    from: '**/*',
                    to: `bundles/assets/`
                }
            }),
            {
                context: 'resources/i18n',
                from: '**/*.json',
                to: 'resources/i18n'
            },
            ... alfrescoLibs.map(lib => {
                return {
                    context: 'node_modules',
                    from: `${lib}/src/i18n/*.json`,
                    to: 'node_modules'
                }
            }),
            {
                from: 'favicon-96x96.png'
            },
            {
                from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
                to: 'pdf.worker.js'
            },
            {
                context: 'public',
                from: '',
                to: ''
            }
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        })
    ],

    node: {
        fs: 'empty'
    }
};
