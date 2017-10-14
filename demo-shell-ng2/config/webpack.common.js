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
                exclude: [/theme-picker/]
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
                from: 'favicon-96x96.png'
            },
            {
                from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
                to: 'pdf.worker.js'
            },
            {
                from: 'node_modules/web-animations-js/web-animations.min.js',
                to: 'js/web-animations.min.js'
            },
            {
                from: 'node_modules/core-js/client/core.min.js',
                to: 'js/core.min.js'
            },
            {
                from: 'node_modules/custom-event-polyfill/custom-event-polyfill.js',
                to: 'js/custom-event-polyfill.js'
            },
            {
                from: 'node_modules/intl/dist/Intl.min.js',
                to: 'js/Intl.min.js'
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
                target: 'http://adfdev.lab.alfresco.me/',
                pathRewrite: {
                    '^/ecm': ''
                },
                secure: false,
                changeOrigin: true,
                // workaround for REPO-2260
                onProxyRes: function (proxyRes, req, res) {
                    const header = proxyRes.headers['www-authenticate'];
                    if (header && header.startsWith('Basic')) {
                        proxyRes.headers['www-authenticate'] = 'x' + header;
                    }
                }
            },
            '/bpm': {
                target: 'http://adfdev.lab.alfresco.me/',
                pathRewrite: {
                    '^/bpm': ''
                },
                secure: false,
                changeOrigin: true,
                // workaround
                onProxyRes: function (proxyRes, req, res) {
                    const header = proxyRes.headers['www-authenticate'];
                    if (header && header.startsWith('Basic')) {
                        proxyRes.headers['www-authenticate'] = 'x' + header;
                    }
                }
            }
        }
    },

    node: {
        fs: 'empty'
    }
};
