const webpack = require('webpack');
const path = require('path');
const helpers = require('./helpers');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader', 'angular2-template-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                loader: 'html-loader'

            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null-loader'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src'),
                loader: 'null-loader'
            },
            {
                test: /\.css$/,
                include: helpers.root('src'),
                loader: 'raw-loader'
            },
            {
                test: /src\/.+\.ts$/,
                exclude: /(node_modules|\.spec\.ts$)/,
                loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true',
                enforce: 'post'
            }
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            path.join(__dirname, 'src'), // location of your src
            {} // a map of your routes
        )
    ],

    node: {
        fs: 'empty',
        module: false
    }
}
