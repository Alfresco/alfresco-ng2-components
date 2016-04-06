/*
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';

bootstrap(AppComponent);
*/
System.register(['angular2/upgrade', './app.component', "./components/ng2/navbar.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var upgrade_1, app_component_1, navbar_component_1;
    var upgradeAdapter;
    return {
        setters:[
            function (upgrade_1_1) {
                upgrade_1 = upgrade_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (navbar_component_1_1) {
                navbar_component_1 = navbar_component_1_1;
            }],
        execute: function() {
            upgradeAdapter = new upgrade_1.UpgradeAdapter();
            angular.module('myApp')
                .directive('myApp', upgradeAdapter.downgradeNg2Component(app_component_1.AppComponent))
                .directive('appNavbar', upgradeAdapter.downgradeNg2Component(navbar_component_1.AppNavBar));
            upgradeAdapter.bootstrap(document.body, ['myApp'], { strictDi: true });
        }
    }
});
//# sourceMappingURL=main.js.map