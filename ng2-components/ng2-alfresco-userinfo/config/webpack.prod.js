const webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    plugins: [

        // https://github.com/angular/angular/issues/10618
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: true
        })

    ]

});
