/*
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';

bootstrap(AppComponent);
*/

import {UpgradeAdapter} from 'angular2/upgrade';
import {AppComponent} from './app.component';
import {AppNavBar} from "./components/ng2/navbar.component";

const upgradeAdapter = new UpgradeAdapter();
declare var angular: any;

angular.module('myApp')
    .directive('myApp', upgradeAdapter.downgradeNg2Component(AppComponent))
    .directive('appNavbar', upgradeAdapter.downgradeNg2Component(AppNavBar))
;
upgradeAdapter.bootstrap(document.body, ['myApp'], {strictDi: true});
