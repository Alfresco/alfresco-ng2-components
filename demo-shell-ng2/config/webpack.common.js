var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

const rootPath = helpers.root('node_modules');

let pattern = '+(alfresco-js-api|ng2-alfresco|ng2-activiti)*';
let options = {
    cwd: rootPath,
    realpath: true
};

let alfrescoLibs = glob.sync(pattern, options);
// console.dir(alfrescoLibs);

// Uncomment if you need all node_modules folders for Alfresco components
// let alfrescoLibsModules = alfrescoLibs.map(p => path.join(p, 'node_modules'));

module.exports = {
  entry: {
    'polyfills': './app/polyfills.ts',
    'vendor': './app/vendor.ts',
    'app': './app/main.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js'],
    modules: [
      helpers.root('app'),
      helpers.root('node_modules')
    ],
    root: rootPath,
    fallback: rootPath
  },

  resolveLoader: {
      alias: {
          'systemjs-loader': helpers.root('config', 'loaders', 'system.js'),
          'debug-loader': helpers.root('config', 'loaders', 'debug.js')
      },
      fallback: rootPath
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        include: [
          ...alfrescoLibs
        ],
        loaders: ['angular2-template-loader', 'source-map-loader', 'systemjs-loader']
      },
      {
        test: /\.html$/,
        exclude: alfrescoLibs,
        loader: 'html'
      },
      {
        test: /\.html$/,
        include: alfrescoLibs,
        loader: 'html',
        query: {
            interpolate: true
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: [
          helpers.root('app'),
          ...alfrescoLibs
        ],
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: [
          helpers.root('app'),
          ...alfrescoLibs
        ],
        loader: 'raw'
      }
    ]
  },

  plugins: [

    new webpack.ProvidePlugin({
      'dialogPolyfill': 'dialog-polyfill/dialog-polyfill'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],

  node: {
      fs: 'empty',
      module: false
  }
};
