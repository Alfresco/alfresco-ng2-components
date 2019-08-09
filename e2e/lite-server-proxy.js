let fallback = require('connect-history-api-fallback');

module.exports = {
    ghostMode : false,
    'port': 4200,
    open: false,
    server: {
        middleware: {
            1: fallback({index: '/index.html', verbose: true})
        }
    }
};
