const webpack = require("webpack");
const helpers = require('./helpers');

module.exports = {
    entry: './index.ts',
    output: {
        filename: 'ng2-alfresco-core.js',
        path: helpers.root('dist'),
        library: 'ng2-alfresco-core',
        libraryTarget: 'umd'
    },

    // require those dependencies but don't bundle them
    externals: [/^\@angular\//, /^rxjs\//, 'alfresco-js-api'],

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                exclude: [helpers.root('node_modules')]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: "source-map-loader"
            },
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                include: helpers.root('src'),
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [
            helpers.root('src'),
            helpers.root('node_modules'),
            helpers.root('node_modules/alfresco-js-api/dist')
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('src'), // location of your src
            {} // a map of your routes
        ),

        // Breaks because of alfresco-js-api problem
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: true
        }),

        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })

    ],

    devtool: 'source-map',

    node: {
        fs: 'empty',
        module: false
    }
};
