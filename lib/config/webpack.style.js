const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractScss = new ExtractTextPlugin('./core/prebuilt-themes/[name].css');
var path = require("path");

module.exports = {

    mode: 'production',

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
        path: path.resolve(__dirname, '../dist/'),
        filename: '[name].js',
        publicPath: '/dist'
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: extractScss.extract([{
                loader: "raw-loader"
            }, {
                loader: "sass-loader"
            }])
        }]
    },
    plugins: [
        extractScss
    ]
};
