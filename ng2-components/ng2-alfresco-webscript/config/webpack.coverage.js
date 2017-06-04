const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const testConfig = require('./webpack.test.js');
const helpers = require('./helpers');

module.exports = webpackMerge(testConfig, {

    module: {
        rules: [
            {
                enforce: 'post',
<<<<<<< HEAD
                test: /^(?!(.*spec|index|.*mock|.*model|.*event)).*\.ts?$/,
=======
                test: /^?!(.*spec|index|.*mock|.*model|.*event).*\.ts?$/,
>>>>>>> Source Mapping is not working on test debugging (#1931)
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
