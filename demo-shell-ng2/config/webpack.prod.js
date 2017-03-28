var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    // Define env variables to help with builds
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoErrorsPlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // Dedupe modules in the output
    new webpack.optimize.DedupePlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
     new webpack.optimize.UglifyJsPlugin({
       output:{
         comments: false
       },
       mangle: {
         keep_fnames: true
       },
       compressor: {
         screw_ie8: true,
         warnings: false
       }
     }),

    // Extract css files
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('[name].[hash].css'),

    // Copy assets from the public folder
    // Reference: https://github.com/kevlened/copy-webpack-plugin
    new CopyWebpackPlugin([
        {
            from: 'favicon-96x96.png'
        },
        {
            from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
            to: 'pdf.worker.js'
        },
        {
            context: 'resources/i18n',
            from: '**/*.json',
            to: 'resources/i18n'
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
            flatten : true
        },
        // Copy asstes folders for all modules with ng2-alfresco- prefix
        {
            context: 'node_modules',
            from: 'ng2-alfresco-*/src/assets/images/*.*',
            to: 'assets/images',
            flatten : true
        }
    ])
  ]
});
