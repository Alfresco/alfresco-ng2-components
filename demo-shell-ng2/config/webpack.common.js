const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const helpers = require('./helpers');
const path = require('path');

module.exports = {
    entry: {
        'polyfills': './app/polyfills.ts',
        'vendor': './app/vendor.ts',
        'app': './app/main.ts'
    },

    resolveLoader: {
        alias: {
            "license-check": path.resolve(__dirname, "./loaders/license-check")
        }
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                loader: 'source-map-loader',
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                include: [helpers.root('app')],
                options: {
                    emitErrors: true,
                    fix: true
                },
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: 'source-map-loader',
                exclude: [/public/, /resources/, /dist/]
            },
            {
                test: /\.html$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                loader: 'html-loader',
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.css$/,
                exclude: [helpers.root('app'), helpers.root('../ng2-components')],
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                loader: 'raw-loader'
            },
            {
                test: /\.scss$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                use: [{
                    loader: "to-string-loader"
                }, {
                    loader: "raw-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core/styles')]
                    }
                }],
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'license-check',
                include: helpers.root('app'),
                options: {
                    emitErrors: true,
                    licenseFile: path.resolve(__dirname, '../assets/license_header.txt')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            }
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./app'), // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),

        new CopyWebpackPlugin([
            {
                context: 'resources/i18n',
                from: '**/*.json',
                to: 'resources/i18n'
            },
            {
                from: 'app.config-dev.json'
            },
            {
                from: 'app.config-prod.json'
            },
            {
                from: 'favicon-96x96.png'
            },
            {
                from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
                to: 'pdf.worker.js'
            },
            {
                context: 'public',
                from: '',
                to: ''
            },
            {
                from: 'versions.json'
            }
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        })
    ],

    devServer: {
        contentBase: helpers.root('dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        host: '0.0.0.0',
        inline: true,
        proxy: {
            '/ecm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 8080
                },
                pathRewrite: {
                    '^/ecm': ''
                }
            },
            '/bpm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 9999
                },
                pathRewrite: {
                    '^/bpm': ''
                }
            }
        }
    },

    node: {
        fs: 'empty'
    }
};
