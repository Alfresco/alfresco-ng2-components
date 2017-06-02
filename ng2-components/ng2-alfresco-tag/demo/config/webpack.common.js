const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const helpers = require('./helpers');
const path = require('path');

const alfrescoLibs = [
    'ng2-alfresco-tag'
];

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'dist': './src/main.ts'
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [helpers.root('src'), helpers.root('../ng2-components')],
                loader: 'source-map-loader',
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.ts$/,
                include: [helpers.root('src'), helpers.root('..')],
                loader: [
                    'ts-loader',
                    'angular2-template-loader'
                ],
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                include: [helpers.root('src')],
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
                test: /\.html$/,
                loader: 'html-loader',
                exclude: [ /node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.css$/,
                exclude: [helpers.root('src'), helpers.root('../ng2-components')],
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                include: [helpers.root('src'), helpers.root('../ng2-components')],
                loader: 'raw-loader'
            },
            {
                test: /\.component.scss$/,
                use: ['to-string-loader', 'raw-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'), // location of your src
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
                    to: `assets/`
                }
            }),
            {
                context: 'resources/i18n',
                from: '**/*.json',
                to: 'resources/i18n'
            }
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['src', 'vendor', 'polyfills']
        })
    ],

    devServer: {
        contentBase: helpers.root('dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        host: '0.0.0.0',
        inline: true
    },

    node: {
        fs: 'empty'
    }
};
