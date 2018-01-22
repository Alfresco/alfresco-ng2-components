const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

module.exports = function (config) {
    return webpackMerge(commonConfig, {

        devtool: 'inline-source-map',

        module: {
            rules: [
                {
                    test: /\.(txt|pdf)$/,
                    loader: 'file-loader',
                    query: {
                        name: '[path][name].[ext]',
                        outputPath: (url)=> {
                        return url.replace('src', 'dist');
                        }
                    }
                },
                {
                    enforce: 'post',
                    test: /^(?!(.*spec|index|.*mock|.*model|.*event)).*\.ts?$/,
                    loader: 'istanbul-instrumenter-loader',
                    include: [helpers.root(config.component)],
                    exclude: [
                        /node_modules/,
                        /test/
                    ]
                }
            ]
        }
    });
};
