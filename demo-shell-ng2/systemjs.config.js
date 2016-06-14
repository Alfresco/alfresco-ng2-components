/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
    // map tells the System loader where to look for things
    var map = {
        'app':                        'app', // 'dist',
        '@angular':                   'node_modules/@angular',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        'rxjs':                       'node_modules/rxjs',

        'ng2-translate': 'node_modules/ng2-translate',
        'ng2-alfresco-core': 'node_modules/ng2-alfresco-core',
        'ng2-alfresco-datatable': 'node_modules/ng2-alfresco-datatable',
        'ng2-alfresco-documentlist': 'node_modules/ng2-alfresco-documentlist',
        'ng2-alfresco-login': 'node_modules/ng2-alfresco-login',
        'ng2-alfresco-search': 'node_modules/ng2-alfresco-search',
        'ng2-alfresco-upload': 'node_modules/ng2-alfresco-upload',
        'ng2-alfresco-viewer': 'node_modules/ng2-alfresco-viewer'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },

        'ng2-translate': { defaultExtension: 'js' },
        'ng2-alfresco-core': {defaultExtension: 'js'},
        'ng2-alfresco-datatable': {defaultExtension: 'js'},
        'ng2-alfresco-documentlist': {defaultExtension: 'js'},
        'ng2-alfresco-login': {defaultExtension: 'js'},
        'ng2-alfresco-search': {defaultExtension: 'js'},
        'ng2-alfresco-upload': {defaultExtension: 'js'},
        'ng2-alfresco-viewer': {defaultExtension: 'js'}
    };
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'router-deprecated',
        'upgrade'
    ];
    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/'+pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);
    var config = {
        map: map,
        packages: packages
    };
    System.config(config);
})(this);
