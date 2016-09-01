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

```sh
npm install --save ng2-alfresco-core ng2-alfresco-search
```

Components included:

- [Search control](#search-control)
- [Search results](#search-results)

### Search control

This component displays a search box on the page, which the user can use to enter a search query. It is decoupled from
the related [search results](#search-results) component which performs a query and displays results.

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

The following component needs to be added to your systemjs.config: 

- ng2-translate
- ng2-alfresco-core
- ng2-alfresco-search

Please refer to the following example to have an idea of how your systemjs.config should look like :

https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-search/demo/systemjs.config.js

#### Style
The style of this component is based on material design, so if you want to visualize it correctly you have to add the material
design dependency to your project:

```sh
npm install --save material-design-icons material-design-lite
```

Also make sure you include these dependencies in your .html page:

```html
<!-- Google Material Design Lite -->
<link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
<script src="node_modules/material-design-lite/material.min.js"></script>
<link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">
```

#### Basic usage

```html
<alfresco-search-control [searchTerm]="searchTerm"
                        inputType="search"
                        (searchChange)="customMethod($event);">
</alfresco-search-control>
```

Example of an component that uses the search control. In this example the search term is simply logged to the console
but instead the component could emit an event to be consumed upstream, or it could trigger a change inside a search
results component embedded inside the same component.

```ts
import { Component, OnInit } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';
import {
    ALFRESCO_SEARCH_DIRECTIVES
} from 'ng2-alfresco-search';

@Component({
    selector: 'alfresco-search-demo',
    template: `
        <alfresco-search-control *ngIf="authenticated" [searchTerm]="searchTerm" (searchChange)="searchTermChange($event);">
        </alfresco-search-control>
        <div *ngIf="!authenticated">
                Authentication failed to ip {{ host }}
        </div>
    `,
    directives: [ALFRESCO_SEARCH_DIRECTIVES]
})
class SearchDemo implements OnInit {

    public searchTerm: string = 'test';

    authenticated: boolean;

    host: string = 'http://myalfrescoip';

    constructor(
        private authService: AlfrescoAuthenticationService,
        settings: AlfrescoSettingsService,
        translation: AlfrescoTranslationService) {

        settings.host = this.host;
        translation.addTranslationFolder();
    }

    searchTermChange(event) {
        console.log('Search term changed', event);
        this.searchTerm = event.value;
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(token => {
            this.authenticated = true;
        });
    }

}

bootstrap(SearchDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
```
#### Events

**searchChange**: Emitted when the search term is changed and the form submitted, provided that the term is at least three characters in length<br />

#### Options

**searchTerm**: {string} (optional) default "". Search term to pre-populate the field with<br />
**inputType**: {string} (optional) default "text". Type of the input field to render, e.g. "search" or "text" (default)<br />
**expandable** {boolean} (optional) default true. Whether to use an expanding search control, if false then a regular input is used.
**autocomplete** {boolean} (optional) default true. Whether the browser should offer field auto-completion for the input field to the user.

### Search results

This component displays the results of a search to the user.

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/bundle.js"></script>
```

The following component needs to be added to your systemjs.config: 

- ng2-translate
- ng2-alfresco-core
- ng2-alfresco-search

Please refer to the following example to have an idea of how your systemjs.config should look like :

https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-search/demo/systemjs.config.js

#### Style
The style of this component is based on material design, so if you want to visualize it correctly you have to add the material
design dependency to your project:

```sh
npm install --save material-design-icons material-design-lite
```

Also make sure you include these dependencies in your .html page:

```html
<!-- Google Material Design Lite -->
<link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
<script src="node_modules/material-design-lite/material.min.js"></script>
<link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">
```

#### Basic usage

```html
<alfresco-search [searchTerm]="searchTerm"></alfresco-search>
```

Example of an component that displays search results, using the Angular2 router to supply a 'q' parameter containing the
search term. If no ruter is present pon the page of if the router does not provide such a parameter then an empty 
results page will be shown.

```ts
import { Component, OnInit } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';

import {
    ALFRESCO_SEARCH_DIRECTIVES
} from 'ng2-alfresco-search';

@Component({
    selector: 'alfresco-search-demo',
    template: `
        <alfresco-search *ngIf="authenticated"  [searchTerm]="searchTerm"></alfresco-search>
         <div *ngIf="!authenticated">
                Authentication failed to ip {{ host }}
        </div>
    `,
    directives: [ALFRESCO_SEARCH_DIRECTIVES]
})
class SearchDemo implements OnInit {

    public searchTerm: string = 'test';

    authenticated: boolean;

    host: string = 'http://192.168.99.101:8080';

    constructor(
        private authService: AlfrescoAuthenticationService,
        settings: AlfrescoSettingsService,
        translation: AlfrescoTranslationService) {

        settings.host = this.host;
        translation.addTranslationFolder();
    }

    searchTermChange(event) {
        console.log('Search term changed', event);
        this.searchTerm = event.value;
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(token => {
            this.authenticated = true;
        });
    }

}

bootstrap(SearchDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
```

Example of an component that displays search results, taking the search term from a `@Input` property provided by the container.

When the input is updated by the application, the search control will run a new search and display the results.

```ts
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS
} from 'ng2-alfresco-core';
import {
    ALFRESCO_SEARCH_DIRECTIVES
} from 'ng2-alfresco-search';

@Component({
    selector: 'alfresco-search-demo',
    template: `
        <alfresco-search [searchTerm]="searchTerm"></alfresco-search>
    `,
    directives: [ALFRESCO_SEARCH_DIRECTIVES]
})
class SearchDemo {
    @Input()
    searchTerm: string = '';
    constructor() {
    }
}

bootstrap(SearchDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
```

#### Events

None

#### Options

**searchTerm**: {string} (optional) default "". Search term to use when executing the search. Updating this value will
run a new search and update the results.<br />

## Build from sources

Alternatively you can build the component from source with the following commands:

```sh
npm install
npm run build
```

##Build the files and keep watching for changes

    ```sh
    $ npm run build:w
    ```
    
## Running unit tests

```sh
npm test
```

## Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools 
before performing unit testing. 

## Code coverage

```sh
npm run coverage
```

## Demo

The `demo` folder contains a complete app with both components running on a single page and linked together:

```sh
cd demo
npm install
npm start
```
