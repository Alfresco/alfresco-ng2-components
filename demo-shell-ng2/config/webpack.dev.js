var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = webpackMerge(commonConfig, {

    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:3000/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new CopyWebpackPlugin([
            {
                from: 'favicon-96x96.png'
            },
            {
                from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
                to: 'pdf.worker.js'
            },
            {
                context: 'custom-translation',
                from: '**/*.json',
                to: 'i18n/custom-translation'
            },
            // Copy i18n folders for all modules with ng2-alfresco- prefix
            {
                context: 'node_modules',
                from: 'ng2-alfresco-*/src/i18n/*.json',
                to: 'node_modules'
            },
            // Copy i18n folders for all modules with ng2-activiti- prefix
            {
                context: 'node_modules',
                from: 'ng2-activiti-*/src/i18n/*.json',
                to: 'node_modules'
            },
            // Copy asstes folders for all modules with ng2-activiti- prefix
            {
                context: 'node_modules',
                from: 'ng2-activiti-*/src/assets/images/*.*',
                to: 'assets/images',
                flatten: true
            },
            // Copy asstes folders for all modules with ng2-alfresco- prefix
            {
                context: 'node_modules',
                from: 'ng2-alfresco-*/src/assets/images/*.*',
                to: 'assets/images',
                flatten: true
            }
        ])
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
