const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {

    mode: 'production',

    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
    },

    entry: {
        'adf-blue-orange': './lib/core/styles/prebuilt/adf-blue-orange.scss',
        'adf-blue-purple': './lib/core/styles/prebuilt/adf-blue-purple.scss',
        'adf-cyan-orange': './lib/core/styles/prebuilt/adf-cyan-orange.scss',
        'adf-cyan-purple': './lib/core/styles/prebuilt/adf-cyan-purple.scss',
        'adf-green-purple': './lib/core/styles/prebuilt/adf-green-purple.scss',
        'adf-green-orange': './lib/core/styles/prebuilt/adf-green-orange.scss',
        'adf-pink-bluegrey': './lib/core/styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-indigo-pink': './lib/core/styles/prebuilt/adf-indigo-pink.scss',
        'adf-purple-green': './lib/core/styles/prebuilt/adf-purple-green.scss'
    },

    output: {
        path: path.resolve(__dirname, '../dist/core/prebuilt-themes/'),
        filename: '[name].js',
        publicPath: '/dist'
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        }]
    },
    plugins: [new MiniCssExtractPlugin()]
};
