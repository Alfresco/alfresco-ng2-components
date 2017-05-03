const webpack = require('webpack');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader', 'angular2-template-loader']
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
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|pdf)$/,
                loader: 'file-loader',
                query: {
                    name: '[path][name].[ext]',
                    outputPath: (url)=> {
                        console.log
                        return url.replace('src', 'dist');
                    }
                }
            },
            {
                enforce: 'post',
                test: /\.ts$/,
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /node_modules/,
                    /test/,
                    /spec\.ts$/
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js'],
        symlinks: false,
        modules: [
            '../ng2-components', 'node_modules'
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

    devtool: 'inline-source-map',

    node: {
        fs: 'empty',
        module: false
    }
};
