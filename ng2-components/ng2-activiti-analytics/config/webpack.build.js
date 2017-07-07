const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    devtool: 'cheap-module-source-map',

    externals: [
        /^\@angular\//,
        /^rxjs\//,
        'moment',
        'raphael',
        'ng2-charts',
        'alfresco-js-api',
        'ng2-alfresco-core',
        'ng2-alfresco-datatable',
        'ng2-activiti-analytics',
        'ng2-activiti-diagrams',
        'ng2-activiti-form',
        "ng2-activiti-tasklist",
        'ng2-alfresco-documentlist'
    ],

    output: {
        filename: './bundles/[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        "ng2-activiti-analytics": "./index.ts"
    }
});
