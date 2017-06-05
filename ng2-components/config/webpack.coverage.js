const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const testConfig = require('./webpack.test.js');
const helpers = require('./helpers');

module.exports = function (config) {
    return webpackMerge(testConfig, {

        devtool: 'inline-source-map',

        module: {
            rules: [
                {
                    enforce: 'post',
                    test: /^(?!(.*spec|index|.*mock|.*model|.*event)).*\.ts?$/,
                    loader: 'istanbul-instrumenter-loader',
                    include: [helpers.root(config.component + '/src')],
                    exclude: [
                        /node_modules/,
                        /test/
                    ]
                }
            ]
        }
    });
};
