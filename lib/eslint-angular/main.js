require('ts-node').register({
    compilerOptions: {
        module: 'commonjs',
        target: 'es2019'
    }
});

module.exports = require('./index.ts');
