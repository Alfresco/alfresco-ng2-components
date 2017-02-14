const webpack = require("webpack");
const helpers = require('./helpers');

module.exports = {
    entry: './index.ts',
    output: {
        filename: 'ng2-alfresco-search.js',
        path: helpers.root('dist'),
        library: 'ng2-alfresco-search',
        libraryTarget: 'umd'
    },

    // require those dependencies but don't bundle them
    externals: [
        /^\@angular\//,
        /^rxjs\//,
        'alfresco-js-api',
        'ng2-alfresco-core',
        'ng2-alfresco-datatable',
        'ng2-alfresco-documentlist'
    ],

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
                exclude: /node_modules/
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
        symlinks: false
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
