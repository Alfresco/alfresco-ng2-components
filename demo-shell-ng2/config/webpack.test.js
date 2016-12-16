var helpers = require('./helpers');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');

const rootPath = helpers.root('node_modules');

let pattern = '+(alfresco-js-api|ng2-alfresco|ng2-activiti)*';
let options = {
    cwd: rootPath,
    realpath: true
};

let alfrescoLibs = glob.sync(pattern, options);

module.exports = {
  devtool: 'inline-source-map',

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
          'systemjs-loader': helpers.root('config', 'loaders', 'system.js')
      },
      fallback: rootPath
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
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
        loader: 'html'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null'
      },
      {
          test: /\.css$/,
          loader: 'raw'
      }
    ]
  },

  node: {
      fs: 'empty',
      module: false
  }
}
