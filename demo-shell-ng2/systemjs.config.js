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
            app: 'app',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // other libraries
            'rxjs': 'npm:rxjs',
            'ng2-translate': 'npm:ng2-translate',
            'ng2-alfresco-core': 'npm:ng2-alfresco-core/dist',
            'ng2-alfresco-datatable': 'npm:ng2-alfresco-datatable/dist',
            'ng2-alfresco-documentlist': 'npm:ng2-alfresco-documentlist/dist',
            'ng2-alfresco-login': 'npm:ng2-alfresco-login/dist',
            'ng2-alfresco-search': 'npm:ng2-alfresco-search/dist',
            'ng2-alfresco-upload': 'npm:ng2-alfresco-upload/dist',
            'ng2-activiti-form': 'npm:ng2-activiti-form/dist',
            'ng2-alfresco-viewer': 'npm:ng2-alfresco-viewer/dist',
            'ng2-alfresco-webscript': 'npm:ng2-alfresco-webscript/dist',
            'ng2-alfresco-tag': 'npm:ng2-alfresco-tag/dist',
            'ng2-activiti-tasklist': 'npm:ng2-activiti-tasklist/dist',
            'alfresco-js-api': 'npm:alfresco-js-api/dist',
            'ng2-activiti-processlist': 'npm:ng2-activiti-processlist/dist'
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

            'ng2-alfresco-core': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-datatable': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-documentlist': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-login': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-search': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-upload': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-viewer': { main: './index.js', defaultExtension: 'js'},
            'ng2-activiti-form': { main: './index.js', defaultExtension: 'js'},
            'ng2-activiti-processlist': { main: './index.js', defaultExtension: 'js'},
            'ng2-activiti-tasklist': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-webscript': { main: './index.js', defaultExtension: 'js'},
            'ng2-alfresco-tag': { main: './index.js', defaultExtension: 'js'},
            'alfresco-js-api': { main: './alfresco-js-api.js', defaultExtension: 'js'}
        }
    });
})(this);
