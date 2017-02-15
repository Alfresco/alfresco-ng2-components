const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                exclude: /node_modules/,
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: "source-map-loader"
            },
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                    'angular2-template-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
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
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        /*
        modules: [
            helpers.root('app'),
            helpers.root('node_modules')
        ]
        */
    },
    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./app'), // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),

        new CopyWebpackPlugin([
            ... alfrescoLibs.map(lib => {
                return {
                    context: `node_modules/${lib}/dist/assets`,
                    from: '**/*',
                    to: helpers.root('dist/assets')
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
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        })
    ]
};
