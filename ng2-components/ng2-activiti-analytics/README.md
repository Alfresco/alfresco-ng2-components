# Activiti Analytics Component for Angular 2
<p>
  <a title='Build Status Travis' href="https://travis-ci.org/Alfresco/alfresco-ng2-components">
    <img src='https://travis-ci.org/Alfresco/alfresco-ng2-components.svg?branch=master'  alt='travis
    Status' />
  </a>
  <a title='Build Status AppVeyor' href="https://ci.appveyor.com/project/alfresco/alfresco-ng2-components">
    <img src='https://ci.appveyor.com/api/projects/status/github/Alfresco/alfresco-ng2-components'  alt='travis
    Status' />
  </a>
  <a href='https://codecov.io/gh/Alfresco/alfresco-ng2-components'>
    <img src='https://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://www.npmjs.com/package/ng2-activiti-analytics'>
    <img src='https://img.shields.io/npm/dt/ng2-activiti-analytics.svg' alt='npm downloads' />
  </a>
  <a href='https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://angular.io/'>
     <img src='https://img.shields.io/badge/style-2-red.svg?label=angular' alt='angular 2' />
  </a>
  <a href='https://www.typescriptlang.org/docs/tutorial.html'>
     <img src='https://img.shields.io/badge/style-lang-blue.svg?label=typescript' alt='typescript' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
</p>

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-activiti-analytics --save
    ```

2. Html

    Include these dependencies in your index.html page:

    ```html

    <!-- Charts -->
    <script src="node_modules/chart.js/dist/Chart.bundle.min.js"></script>
    <script src="node_modules/raphael/raphael.min.js"></script>

    <!-- Moment js -->
    <script src="node_modules/moment/min/moment.min.js"></script>

    <!-- Date picker -->
    <script src="node_modules/md-date-time-picker/dist/js/mdDateTimePicker.min.js"></script>
    <script src="node_modules/md-date-time-picker/dist/js/draggabilly.pkgd.min.js"></script>
    <link rel="stylesheet" href="node_modules/md-date-time-picker/dist/css/mdDateTimePicker.css" media="all">

    <!-- Google Material Design Lite -->
    <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
    <script src="node_modules/material-design-lite/material.min.js"></script>
    <link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">

    <!-- Polyfill(s) for Safari (pre-10.x) -->
    <script src="node_modules/intl/dist/Intl.min.js"></script>
    <script src="node_modules/intl/locale-data/jsonp/en.js"></script>

    <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js"></script>
    <script src="node_modules/element.scrollintoviewifneeded-polyfill/index.js"></script>

    <!-- Polyfill(s) for dialogs -->
    <script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
    <link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
    <style>._dialog_overlay { position: static !important; } </style>

    <!-- Modules  -->
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    ```

3. SystemJs

    Add the following components to your systemjs.config.js file:

    - moment
    - ng2-charts
    - ng2-translate
    - alfresco-js-api
    - ng2-alfresco-core
    - ng2-activiti-diagrams
    - ng2-activiti-analytics

    Please refer to the following example file: [systemjs.config.js](demo/systemjs
    .config.js) .

## Basic usage example Activiti Analytics List

The component shows the list of all the available reports

```html
<analytics-report-list></analytics-report-list>
```

Example of an App that use Activiti Analytics List component :

**main.ts**
```ts

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { AnalyticsModule } from 'ng2-activiti-analytics';

@Component({
    selector: 'activiti-analytics-demo',
    template: `
    <div class="page-content">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--8-col task-column mdl-shadow--2dp">
                <analytics-report-list></analytics-report-list>
            </div>
        </div>
    </div>`
})

export class AnalyticsDemoComponent {

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.bpmHost = 'http://localhost:9999';

        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
            },
            error => {
                console.log(error);
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        AnalyticsModule
    ],
    declarations: [ AnalyticsDemoComponent ],
    bootstrap:    [ AnalyticsDemoComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);


```

#### Events

| Name | Description |
| --- | --- |
|`onSuccess`| The event is emitted when the report list are loaded |
|`onError`| The event is emitted when an error occur during the loading |
|`reportClick`| The event is emitted when the report in the list is selected |

#### Options

No options.

## Basic usage example Activiti Analytics

The component shows the charts related to the reportId passed as input

```html
<activiti-analytics [appId]="appId" [reportId]="reportId"></activiti-analytics>
```

Example of an App that use Activiti Analytics component :

**main.ts**
```ts

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { AnalyticsModule } from 'ng2-activiti-analytics';

@Component({
    selector: 'activiti-analytics-demo',
    template: `
    <div class="page-content">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--8-col task-column mdl-shadow--2dp">
                <activiti-analytics [appId]="1001" [reportId]="2006"></activiti-analytics>
            </div>
        </div>
    </div>`
})

export class AnalyticsDemoComponent {

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.bpmHost = 'http://localhost:9999';

        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
            },
            error => {
                console.log(error);
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        AnalyticsModule
    ],
    declarations: [ AnalyticsDemoComponent ],
    bootstrap:    [ AnalyticsDemoComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);


```

#### Events

| Name | Description |
| --- | --- |
|`onSuccess` | The event is emitted when the report parameters are loaded |
|`onError` | The event is emitted when an error occur during the loading |

#### Options

| Name | Description |
| --- | --- |
|`appId` | The application id |
|`reportId` | The report id |
|`debug` | Flag to enable or disable the Form values in the console log |

## Build from sources

Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
```

### Build the files and keep watching for changes

```sh
$ npm run build:w
```

## Running unit tests

```sh
npm test
```

### Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools
before performing unit testing.

### Code coverage

```sh
npm run coverage
```

## Demo

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
