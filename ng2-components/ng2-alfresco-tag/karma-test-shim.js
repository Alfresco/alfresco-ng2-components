// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function() {};

var map = {
    'app': 'base/dist',
    'rxjs': 'base/node_modules/rxjs',
    '@angular': 'base/node_modules/@angular',
    'ng2-translate' : '/base/node_modules/ng2-translate',
    'ng2-alfresco-core': '/base/node_modules/ng2-alfresco-core/dist'
};

var packages = {
    'app': { main: 'main.js',  defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'ng2-translate': { defaultExtension: 'js' },
    'ng2-alfresco-core': { main: 'index.js', defaultExtension: 'js' }
};

var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade'
];

packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

packages['base/dist'] = {
    defaultExtension: 'js',
    format: 'register',
    map: Object.keys(window.__karma__.files).filter(onlyAppFiles).reduce(createPathRecords, {})
};

var config = {
    map: map,
    packages: packages
};

System.config(config);

System.import('@angular/platform-browser/src/browser/browser_adapter')
    .then(function(browser_adapter) { browser_adapter.BrowserDomAdapter.makeCurrent(); })
    .then(function () {
        return Promise.all([
            System.import('@angular/core/testing'),
            System.import('@angular/platform-browser-dynamic/testing')
        ])
    })
    .then(function (providers) {
        var testing = providers[0];
        var testingBrowser = providers[1];

        testing.setBaseTestProviders(
            testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
            testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

    })
    .then(function() { return Promise.all(resolveTestFiles()); })
    .then(
        function() {
            __karma__.start();
        },
        function(error) {
            if(typeof __karma__.error == 'function') {
                __karma__.error(error.stack || error);
            }else{
                console.error(error);
            }
        }
    );
function createPathRecords(pathsMapping, appPath) {
    var pathParts = appPath.split('/');
    var moduleName = './' + pathParts.slice(Math.max(pathParts.length - 2, 1)).join('/');
    moduleName = moduleName.replace(/\.js$/, '');
    pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath];
    return pathsMapping;
}

function onlyAppFiles(filePath) {
    return /\/base\/dist\/(?!.*\.spec\.js$).*\.js$/.test(filePath);
}

function onlySpecFiles(path) {
    return /\.spec\.js$/.test(path);
}

function resolveTestFiles() {
    return Object.keys(window.__karma__.files)  // All files served by Karma.
        .filter(onlySpecFiles)
        .map(function(moduleName) {
            // loads all spec files via their global module names (e.g.
            // 'base/dist/vg-player/vg-player.spec')
            return System.import(moduleName);
        });
}
