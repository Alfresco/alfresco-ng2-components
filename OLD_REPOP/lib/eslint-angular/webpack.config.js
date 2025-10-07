const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
    output: {
        path: join(__dirname, '../../dist/libs/eslint-angular')
    },
    devServer: {
        port: 4200
    },
    plugins: [
        new NxAppWebpackPlugin({
            main: './index.ts',
            tsConfig: './tsconfig.lib.json',
            index: './index.ts',
            outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
            optimization: process.env['NODE_ENV'] === 'production'
        })
    ]
};
