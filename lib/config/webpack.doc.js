const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const webpackBuild = require('./webpack.build');
const path = require('path');

module.exports = webpackMerge(webpackBuild, {

    resolveLoader: {
        alias: {
            "generate-list-component-loader": path.resolve(__dirname, "./custom-loaders/generateListComponent")
        }
    },

    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'generate-list-component-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            }
        ]
    }
});
