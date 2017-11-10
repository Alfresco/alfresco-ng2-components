const webpackMerge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const commonConfig = require('./webpack.common.js');
const fs = require('fs');
const webpack = require('webpack');
const path = require('path');

module.exports = webpackMerge(commonConfig, {

    // require those dependencies but don't bundle them
    externals: [
        /^\@angular\//,
        /^rxjs\//,
        /^\@ngx-translate\//,
        'moment',
        'minimatch',
        'raphael',
        'ng2-charts',
        'alfresco-js-api',
        /^\@adf\//,
        'content-services',
        'process-services',
        'core'
    ],

    output: {
        filename: '[name]/bundles/[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        "core": "./core/index.ts",
        "content-services": "./content-services/index.ts",
        "process-services": "./process-services/index.ts"
    },

    plugins: [

        // new UglifyJSPlugin({
        //     sourceMap: true,
        //     uglifyOptions: {
        //         ie8: false,
        //         ecma: 6,
        //         output: {
        //             comments: false,
        //             beautify: false
        //         },
        //         warnings: false
        //     }
        // }),

        new webpack.BannerPlugin({
            banner: fs.readFileSync(path.resolve(__dirname, './assets/license_header_add.txt'), 'utf8'),
            entryOnly: true
        })
    ]
});
