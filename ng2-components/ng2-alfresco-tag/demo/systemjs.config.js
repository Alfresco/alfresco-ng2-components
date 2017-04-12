/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'src',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            '@angular/material': 'npm:@angular/material/bundles/material.umd.js',

            // other libraries
            'rxjs': 'npm:rxjs',
            'ng2-translate': 'npm:ng2-translate',
            'alfresco-js-api': 'npm:alfresco-js-api/dist',
            'ng2-alfresco-core': 'npm:ng2-alfresco-core',
            'ng2-alfresco-tag': 'npm:ng2-alfresco-tag'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'ng2-translate': { defaultExtension: 'js' },
            'alfresco-js-api': { main: './alfresco-js-api.js', defaultExtension: 'js'},
            'ng2-alfresco-core': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-tag': { main: './index.js', defaultExtension: 'js'}
        }
    });
})(this);
