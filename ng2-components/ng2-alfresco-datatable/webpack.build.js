const webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const commonConfig = require('../config/webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    output: {
        filename: './bundles/[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        "ng2-alfresco-datatable": "./index.ts"
    }
});
