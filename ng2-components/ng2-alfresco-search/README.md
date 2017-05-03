# Search Component for Angular 2

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
  <a href='https://www.npmjs.com/package/ng2-alfresco-search'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-search.svg' alt='npm downloads' />
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
    npm install ng2-alfresco-search --save
    ```

2. Html

    Include these dependencies in your index.html page:

    ```html

    <!-- Google Material Design Lite -->
    <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
    <script src="node_modules/material-design-lite/material.min.js"></script>
    <link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">

    <!-- Load the Angular Material 2 stylesheet -->
    <link href="node_modules/@angular/material/core/theming/prebuilt/deeppurple-amber.css" rel="stylesheet">

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

    - ng2-translate
    - ng2-alfresco-core
    - alfresco-js-api
    - ng2-alfresco-search
    - ng2-alfresco-documentlist

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .


#### Basic usage

```html
<alfresco-search-control [searchTerm]="searchTerm"
                        inputType="search"
                        (searchChange)="onSearchChange($event);"
                        (searchSubmit)="onSearchSubmit($event);"
                        (fileSelect)="onSearchResultSelect($event);">
</alfresco-search-control>
```

Example of an component that uses the search control. In this example the search term is simply logged to the console
but instead the component could emit an event to be consumed upstream, or it could trigger a change inside a search
results component embedded inside the same component.

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from 'ng2-alfresco-core';
import { SearchModule } from 'ng2-alfresco-search';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-app-demo',
    template: `<alfresco-search-control [searchTerm]="'test'"></alfresco-search-control>`
})
class SearchDemo {

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';

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
        SearchModule
    ],
    declarations: [SearchDemo],
    bootstrap: [SearchDemo]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
```
#### Events

| Name | Description |
| --- | --- |
| `searchChange` | Emitted when the search term is changed. The search term is provided in the 'value' property of the returned object.  If the term is at less than three characters in length then the term is truncated to an empty string. |
| `searchSubmit` | Emitted when the search form is submitted. The search term is provided in the 'value' property of the returned object. |
| `fileSelect` | Emitted when a file item from the list of find-as-you-type results is selected |
| `expand` | Emitted when the expanded state of the control changes based on focus events and the content of the input control |

#### Options

| Name | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| `searchTerm` | {string}  | (optional)  |  ""  |  Search term to pre-populate the field with |
| `inputType` | {string}  | (optional) |   "text" |  Type of the input field to render, e.g. "search" or "text" (default) |
| `expandable` | {boolean} |  (optional) | true  |  Whether to use an expanding search control, if false then a regular input is used. |
| `autocomplete` | {boolean} |  (optional) | true  |  Whether the browser should offer field auto-completion for the input field to the   user. |
| `liveSearchEnabled` | {boolean} |  (optional) |  true  |  Whether find-as-you-type suggestions should be offered for matching  content  items. Set to false to disable. |
| `liveSearchRoot` | {boolean} |  (optional) |  "-root-"  |  NodeRef or node name where the search should start. |
| `liveSearchResultType` | {boolean} |  (optional) |   (none)  |  Node type to filter live search results by, e.g. 'cm:content'. |
| `liveSearchMaxResults` | {boolean} |  (optional) |   5  |  Maximum number of results to show in the live search. |
| `iveSearchResultSort` | {boolean} |  (optional) |   (none) |  Criteria to sort live search results by, must be one of "name" ,  "modifiedAt" or "createdAt" |

#### Basic usage Search results

```html
<alfresco-search [searchTerm]="searchTerm"></alfresco-search>
```

Example of an component that displays search results, using the Angular2 router to supply a 'q' parameter containing the
search term. If no router is present on the page of if the router does not provide such a parameter then an empty 
results page will be shown.

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from 'ng2-alfresco-core';
import { SearchModule } from 'ng2-alfresco-search';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-app-demo',
    template: `<alfresco-search [searchTerm]="'test'"></alfresco-search>`
})
class SearchDemo {

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';

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
        SearchModule
    ],
    declarations: [SearchDemo],
    bootstrap: [SearchDemo]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
```

#### Events

| Name | Description |
| --- | --- |
| `preview` | emitted when user acts upon files with either single or double click (depends on `navigation-mode`), recommended for Viewer components integration  |
| `resultsLoad` | Emitted when search results have fully loaded |

#### Options

| Name | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| `searchTerm` | {string}  | (optional)  | ""  | Search term to use when executing the search. Updating this value will run a new  search and update the results  |
| `rootNodeId` | {boolean}  | (optional)  | "-root-" | NodeRef or node name where the search should start. |
| `resultType` | {boolean}  | (optional)  | (none) | Node type to filter search results by, e.g. 'cm:content'. |
| `maxResults` | {boolean}  | (optional)  |  20  | Maximum number of results to show in the search. |
| `resultSort` | {boolean}  | (optional)  | (none) | Criteria to sort search results by, must be one of "name" , "modifiedAt" or   "createdAt" |
| `navigationMode` | {string}  | (optional)  | "dblclick" | Event used to initiate a navigation action to a specific result, one of "click" or "dblclick" |

### Build from sources

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

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

 ## License

 [Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)