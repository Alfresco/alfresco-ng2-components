const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DisableOutputWebpackPlugin = require('./index');
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {

    mode: 'production',

    optimization: {
        minimizer: [new CssMinimizerPlugin({})],
    },

    entry: {
        'adf-blue-orange': './lib/core/src/lib/styles/prebuilt/adf-blue-orange.scss',
        'adf-blue-purple': './lib/core/src/lib/styles/prebuilt/adf-blue-purple.scss',
        'adf-cyan-orange': './lib/core/src/lib/styles/prebuilt/adf-cyan-orange.scss',
        'adf-cyan-purple': './lib/core/src/lib/styles/prebuilt/adf-cyan-purple.scss',
        'adf-green-purple': './lib/core/src/lib/styles/prebuilt/adf-green-purple.scss',
        'adf-green-orange': './lib/core/src/lib/styles/prebuilt/adf-green-orange.scss',
        'adf-pink-bluegrey': './lib/core/src/lib/styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-indigo-pink': './lib/core/src/lib/styles/prebuilt/adf-indigo-pink.scss',
        'adf-purple-green': './lib/core/src/lib/styles/prebuilt/adf-purple-green.scss'
    },

    output: {
        path: path.resolve(__dirname, '../../dist/libs/core/lib/prebuilt-themes/'),
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new DisableOutputWebpackPlugin({
            test: /\.js$/,
        })
    ]
};
