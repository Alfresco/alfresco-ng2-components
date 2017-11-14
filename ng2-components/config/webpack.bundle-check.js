const webpackMerge = require('webpack-merge');
const webpackBuild = require('./webpack.build.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = webpackMerge(webpackBuild, {

    plugins: [
        new BundleAnalyzerPlugin()
    ]
});
