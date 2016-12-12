var helpers = require('./helpers');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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

const rootPath = helpers.root('node_modules');

module.exports = {
  devtool: 'inline-source-map',

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
