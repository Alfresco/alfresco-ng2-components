var NxAppWebpackPlugin = require('@nx/webpack/app-plugin').NxAppWebpackPlugin;
var join = require('path').join;

module.exports = {
    output: {
        path: join(__dirname, '../../dist/libs/testing')
    },
    devServer: {
        port: 4200
    },
    plugins: [
        new NxAppWebpackPlugin({
            main: './src/index.ts',
            tsConfig: './tsconfig.lib.json',
            index: './src/index.ts',
            outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
            optimization: process.env['NODE_ENV'] === 'production'
        })
    ]
};
