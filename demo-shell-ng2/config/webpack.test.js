const webpack = require('webpack');
const helpers = require('./helpers');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js'],
        // Needed if webpack2-lib is symlinked
        modules: [
            helpers.root('src'),
            helpers.root('node_modules'),
            helpers.root('node_modules/webpack2-lib/dist')
        ]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader', 'angular2-template-loader'],
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
                exclude: helpers.root('app'),
                loader: 'null-loader'
            },
            {
                test: /\.css$/,
                include: helpers.root('app'),
                loader: 'raw-loader',
                exclude: [ /public/, /resources/, /dist/]
            }
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        )
    ]
}
