var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    // 'polyfills': './src/polyfills.ts',
    'polyfills': './app/polyfills.ts',
    // 'vendor': './src/vendor.ts',
    'vendor': './app/vendor.ts',
    // 'app': './src/main.ts'
    'app': './app/main.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js'],
    modules: [
      // helpers.root('src'),
      helpers.root('app'),
      helpers.root('node_modules')
    ]
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
          helpers.root('node_modules', 'angular2-webpack-lib')
        ],
        loader: 'angular2-template-loader',
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: [
          // helpers.root('src', 'app'),
          helpers.root('app'),
          helpers.root('node_modules', 'angular2-webpack-lib')
        ],
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: [
          // helpers.root('src', 'app'),
          helpers.root('app'),
          helpers.root('node_modules', 'angular2-webpack-lib')
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
      // template: 'src/index.html'
      template: 'index.html'
    })
  ],

  node: {
      fs: 'empty',
      module: false
  }
};
