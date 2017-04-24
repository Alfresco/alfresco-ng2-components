const webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    plugins: [

        //new webpack.optimize.UglifyJsPlugin({
        //    mangle: {
        //        keep_fnames: true
        //    },
        //    compress: {
        //        warnings: false
        //    },
        //    output: {
        //        comments: false
        //    },
        //    sourceMap: true
        //})

    ]
});
