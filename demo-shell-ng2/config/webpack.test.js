const webpack = require('webpack');
const helpers= require('./helpers');
var HappyPack = require('happypack');

module.exports = {

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [helpers.root('../ng2-components'), helpers.root('node_modules')]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['happypack/loader?id=ts', 'angular2-template-loader'],
                exclude: [ /public/, /resources/, /dist/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: [ /public/, /resources/, /dist/]

            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null-loader'
            },
            {
                test: /\.css$/,
                loader: ['to-string-loader', 'css-loader'],
                exclude: [ /public/, /resources/, /dist/]
            }
        ]
    },

    plugins: [
        new HappyPack({
            id: 'ts',
            threads: 4,
            loaders: [
                {
                    path: 'ts-loader',
                    query: {happyPackMode: true}
                }
            ]
        }),

        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        )
    ]
}
