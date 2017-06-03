const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const testConfig = require('./webpack.test.js');
const helpers = require('./helpers');

module.exports = webpackMerge(testConfig, {

    module: {
        rules: [
            {
                enforce: 'post',
                test: /^(?!.*spec).*\.ts?$/,
                include: [helpers.root('src')],
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /node_modules/,
                    /test/
                ]
            }
        ]
    }
});
