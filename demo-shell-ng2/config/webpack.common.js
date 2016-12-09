var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');
var fs = require('fs');

var alfrescoLibs = [
    helpers.root('node_modules', 'alfresco-js-api'),
    helpers.root('node_modules', 'ng2-activiti-analytics'),
    helpers.root('node_modules', 'ng2-activiti-diagrams'),
    helpers.root('node_modules', 'ng2-activiti-form'),
    helpers.root('node_modules', 'ng2-activiti-processlist'),
    helpers.root('node_modules', 'ng2-activiti-tasklist'),
    helpers.root('node_modules', 'ng2-alfresco-core'),
    helpers.root('node_modules', 'ng2-alfresco-datatable'),
    helpers.root('node_modules', 'ng2-alfresco-documentlist'),
    helpers.root('node_modules', 'ng2-alfresco-login'),
    helpers.root('node_modules', 'ng2-alfresco-search'),
    helpers.root('node_modules', 'ng2-alfresco-tag'),
    helpers.root('node_modules', 'ng2-alfresco-upload'),
    helpers.root('node_modules', 'ng2-alfresco-userinfo'),
    helpers.root('node_modules', 'ng2-alfresco-viewer'),
    helpers.root('node_modules', 'ng2-alfresco-webscript')
].map((entry) => fs.realpathSync(entry));

// console.dir(alfrescoLibs);

const rootPath = helpers.root('node_modules');

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
    alias: {
        'alfresco-js-api': helpers.root('node_modules', 'alfresco-js-api', 'dist', 'alfresco-js-api.js')
    },
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
