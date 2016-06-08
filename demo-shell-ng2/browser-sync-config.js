var browserSync = require("browser-sync").create();
var historyApiFallback = require('connect-history-api-fallback')

browserSync.init({

    server: {
        baseDir: './',
        middleware: [ historyApiFallback() ]
    },

    files: ['dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-core/dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-datatable/dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-documentlist/dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-login/dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-search/dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-upload/dist/**/*.{html,htm,css,js}',
        'node_modules/ng2-alfresco-viewer/dist/**/*.{html,htm,css,js}'],

    reloadDelay: 1000
});
