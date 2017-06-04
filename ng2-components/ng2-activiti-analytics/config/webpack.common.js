const webpack = require('webpack');
const helpers = require('./helpers');
const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {

    resolveLoader: {
        alias: {
            "file-multi-loader": path.resolve(__dirname, "./custom-loaders/file-loader-multi"),
            "license-check": path.resolve(__dirname, "./custom-loaders/license-check")
        }
    },

    resolve: {
        alias: {
            "ng2-alfresco-core": helpers.root('../ng2-alfresco-core/index.ts'),
            "ng2-activiti-diagrams": helpers.root('../ng2-activiti-diagrams/index.ts')
        },
        extensions: ['.ts', '.js'],
        symlinks: false,
        modules: [helpers.root('../../ng2-components'), helpers.root('node_modules')]
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader'],
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.css$/,
                loader: ['to-string-loader', 'css-loader'],
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.component.scss$/,
                use: ['to-string-loader', 'raw-loader', 'sass-loader'],
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'license-check',
                options: {
                    emitErrors: true,
                    licenseFile: path.resolve(__dirname, './assets/license_header.txt')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/, /rendering-queue.services.ts/ ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-multi-loader',
                query: {
                    name: '[name].[hash].[ext]',
                    outputPath: (url, resourcePath)=> {
                        return resourcePath.replace('src', 'bundles') + url;
                    },
                    publicPath: (url, resourcePath)=> {
                        var component = resourcePath.substring(0, resourcePath.indexOf('src'));
                        var path = resourcePath.replace(component, '').replace('src/', '');
                        return path + url;
                    }
                }
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: `src/i18n/`,
            to: `bundles/assets/ng2-alfresco-tag/i18n/`
        }]),

        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.BannerPlugin(fs.readFileSync(path.resolve(__dirname, './assets/license_header_add.txt'), 'utf8')),

        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'),
            {}
        ),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new webpack.LoaderOptionsPlugin({
                htmlLoader: {
                    minimize: false // workaround for ng2
                }
        })
    ],

    node: {
        fs: 'empty',
        module: false
    }
};
