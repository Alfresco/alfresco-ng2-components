const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const path = require('path');

module.exports = webpackMerge(commonConfig, {

    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        alias: {
            "ng2-alfresco-core$": path.resolve(__dirname, '../../ng2-alfresco-core/index.ts'),
            "ng2-alfresco-datatable$": path.resolve(__dirname, '../../ng2-alfresco-datatable/index.ts'),
            "ng2-alfresco-documentlist$": path.resolve(__dirname, '../../ng2-alfresco-documentlist/index.ts'),
            "ng2-alfresco-search$": path.resolve(__dirname, '../../ng2-alfresco-search/index.ts')
        },
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ]
});
