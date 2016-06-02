# Search Component for Angular 2

<p>
  <a href='https://raw.githubusercontent.com/Alfresco/dev-platform-webcomponents/master/ng2-components/ng2-alfresco-search/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='my blog' />
  </a>
</p>

## Install

```sh
npm set registry http://devproducts.alfresco.me:4873
npm install --save ng2-alfresco-core ng2-alfresco-search
```

Components included:

- [Search control](#search-control)
- [Search results](#search-results)

### Search control

This component displays a search box on the page, which the user can use to enter a search query. It is decoupled from
the related [search results](#search-results) component which performs a query and displays results.

#### Dependencies

Make sure your `systemjs.config` has the following configuration:

```javascript
    System.config({
                defaultJSExtensions: true,
                map: {
                    'ng2-alfresco-core': 'node_modules/ng2-alfresco-core',
                    'ng2-alfresco-upload': 'node_modules/ng2-alfresco-search',
                    'rxjs': 'node_modules/rxjs',
                    'angular2' : 'node_modules/angular2',
                    'ng2-translate': 'node_modules/ng2-translate',
                    'app': 'dist/src'
                },
                packages: {
                    'app': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-core': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-search': {
                        defaultExtension: 'js'
                    },
                    'rxjs': {
                        defaultExtension: 'js'
                    },
                    'angular2': {
                        defaultExtension: 'js'
                    }
                }
            });
```

#### Style
The style of this component is based on Google Material Design, so if you want to visualize it correctly you have to add 
the material-design-lite dependency to your project:

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
import { Component, OnInit } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core/dist/ng2-alfresco-core';

import {
    ALFRESCO_SEARCH_DIRECTIVES
} from 'ng2-alfresco-search/dist/ng2-alfresco-search';

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

    host: string = 'http://192.168.99.100:8080';

    constructor(
        private authService: AlfrescoAuthenticationService,
        settings: AlfrescoSettingsService,
        translation: AlfrescoTranslationService) {

        settings.host = this.host;
        translation.translationInit();
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

### Search results

This component displays the results of a search to the user.

#### Dependencies

Make sure your `systemjs.config` has the following configuration:

```javascript
    System.config({
                defaultJSExtensions: true,
                map: {
                    'ng2-alfresco-core': 'node_modules/ng2-alfresco-core',
                    'ng2-alfresco-upload': 'node_modules/ng2-alfresco-search',
                    'rxjs': 'node_modules/rxjs',
                    'angular2' : 'node_modules/angular2',
                    'ng2-translate': 'node_modules/ng2-translate',
                    'app': 'dist/src'
                },
                packages: {
                    'app': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-core': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-search': {
                        defaultExtension: 'js'
                    },
                    'rxjs': {
                        defaultExtension: 'js'
                    },
                    'angular2': {
                        defaultExtension: 'js'
                    }
                }
            });
```

You must also add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-core-rest-api/bundle.js"></script>
```

#### Style
The style of this component is based on Google Material Design, so if you want to visualize it correctly you have to add 
the material-design-lite dependency to your project:

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
import { Component, OnInit } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core/dist/ng2-alfresco-core';

import {
    ALFRESCO_SEARCH_DIRECTIVES
} from 'ng2-alfresco-search/dist/ng2-alfresco-search';


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
        translation.translationInit();
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
import { Component, Input } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';

import { ALFRESCO_CORE_PROVIDERS } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { ALFRESCO_SEARCH_DIRECTIVES } from 'ng2-alfresco-search/dist/ng2-alfresco-search';

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