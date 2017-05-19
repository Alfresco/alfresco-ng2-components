const webpack = require('webpack');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js'],
        symlinks: false,
        modules: [helpers.root('../ng2-components'), helpers.root('node_modules')]
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
                test: /\.ts$/,
                loaders: ['ts-loader?' + JSON.stringify({ transpileOnly: true}), 'angular2-template-loader'],
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
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|pdf)$/,
                loader: 'file-loader',
                query: {
                    name: '[path][name].[ext]',
                    outputPath: (url)=> {
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
                    /test/
                ]
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

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
