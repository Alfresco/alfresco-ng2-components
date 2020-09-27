let fallback = require('connect-history-api-fallback');

module.exports = {
    injectChanges: false, // workaround for Angular 2 styleUrls loading
    files: ['./**/*.{html,htm,css,js}'],
    watchOptions: {
        ignoreInitial: true,
        ignored: '*'
    },
    ghostMode : false,
    'port': 4200,
    open: false,
    server: {
        middleware: {
            1: fallback({index: '/index.html', verbose: true})
        }
    }
};
