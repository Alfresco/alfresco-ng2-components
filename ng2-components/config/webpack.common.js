const webpack = require('webpack');
const helpers = require('./helpers');
const fs = require('fs');
const path = require('path');

module.exports = {

    devtool: 'cheap-module-source-map',

    resolveLoader: {
        alias: {
            "file-multi-loader": path.resolve(__dirname, "./custom-loaders/file-loader-multi"),
            "license-check": path.resolve(__dirname, "./custom-loaders/license-check")
        }
    },

    // require those dependencies but don't bundle them
    externals: [
        /^\@angular\//,
        /^rxjs\//,
        'moment',
        'raphael',
        'ng2-charts',
        'alfresco-js-api',
        'ng2-alfresco-core',
        'ng2-alfresco-datatable',
        'ng2-activiti-analytics',
        'ng2-activiti-diagrams',
        'ng2-activiti-form',
        "ng2-activiti-tasklist",
        'ng2-alfresco-documentlist'
    ],

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
                use: 'source-map-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    configFile: path.resolve(__dirname, './assets/tslint.json')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.ts$/,
                use: ['ts-loader?' + JSON.stringify({
                    "compilerOptions": {
                        "typeRoots": [
                            "../node_modules/@types"
                        ]}
                }), 'angular2-template-loader'],
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
            }, {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'license-check',
                options: {
                    emitErrors: true,
                    licenseFile: path.resolve(__dirname, './assets/license_header.txt')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/, /rendering-queue.services.ts/],
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

    resolve: {
        alias: {
            "ng2-alfresco-core": path.resolve(__dirname, '../ng2-alfresco-core/index.ts'),
            "ng2-alfresco-datatable": path.resolve(__dirname, '../ng2-alfresco-datatable/index.ts'),
            "ng2-activiti-diagrams": path.resolve(__dirname, '../ng2-activiti-diagrams/index.ts'),
            "ng2-activiti-analytics":path.resolve(__dirname, '../ng2-activiti-analytics/index.ts'),
            "ng2-activiti-form":path.resolve(__dirname, '../ng2-activiti-form/index.ts'),
            "ng2-activiti-tasklist": path.resolve(__dirname, '../ng2-activiti-tasklist/index.ts'),
            "ng2-activiti-processlist": path.resolve(__dirname, '../ng2-activiti-processlist/index.ts'),
            "ng2-alfresco-documentlist": path.resolve(__dirname, '../ng2-alfresco-documentlist/index.ts'),
            "ng2-alfresco-login": path.resolve(__dirname, '../ng2-alfresco-login/index.ts'),
            "ng2-alfresco-search": path.resolve(__dirname, '../ng2-alfresco-search/index.ts'),
            "ng2-alfresco-social": path.resolve(__dirname, '../ng2-alfresco-social/index.ts'),
            "ng2-alfresco-tag": path.resolve(__dirname, '../ng2-alfresco-tag/index.ts'),
            "ng2-alfresco-upload": path.resolve(__dirname, '../ng2-alfresco-upload/index.ts'),
            "ng2-alfresco-viewer": path.resolve(__dirname, '../ng2-alfresco-viewer/index.ts'),
            "ng2-alfresco-webscript": path.resolve(__dirname, '../ng2-alfresco-webscript/index.ts'),
            "ng2-alfresco-userinfo": path.resolve(__dirname, '../ng2-alfresco-userinfo/index.ts')
        },
        extensions: ['.ts', '.js'],
            modules: [helpers.root('node_modules')]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.BannerPlugin(fs.readFileSync(path.resolve(__dirname, './assets/license_header_add.txt'), 'utf8')),

        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'),
            {}
        )
    ],

    node: {
        fs: 'empty',
        module: false
    }
};
