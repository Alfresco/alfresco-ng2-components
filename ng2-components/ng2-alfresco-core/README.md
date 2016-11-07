# Alfresco Login Component for Angular 2
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
  <a href='https://www.npmjs.com/package/ng2-alfresco-core'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-core.svg' alt='npm downloads' />
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
npm install --save ng2-alfresco-core
```

## Main components and services

### Components

- Context Menu directive
- Material Design directives
  - [mdl]
  - [alfresco-mdl-button]
  - [alfresco-mdl-menu]
  - [alfresco-mdl-tabs]

### Services

- **AlfrescoApiService**, provides access to Alfresco JS API instance
- **AlfrescoAuthenticationService**, main authentication APIs
- **AlfrescoTranslationService**, various i18n-related APIs
- **ContextMenuService**, global context menu APIs


#### Alfresco Api Service

Provides access to initialized **AlfrescoJSApi** instance.

```ts
import { OnInit } from '@angular/core'; 
import { AlfrescoApiService } from 'ng2-alfresco-core';

export class MyComponent implements OnInit {

    constructor(private apiService: AlfrescoApiService) {   
    }

    ngOnInit() {
        let nodeId = 'some-node-id';
        let params = {};
        this.getAlfrescoApi().nodes
            .getNodeChildren(nodeId, params)
            .then(result => console.log(result));
    }
}
```

**Note for developers**: _the TypeScript declaration files for Alfresco JS API
are still under development and some Alfresco APIs may not be accessed
via your favourite IDE's intellisense or TypeScript compiler. 
In case of any TypeScript type check errors you can still call any supported 
Alfresco JS api by casting the instance to `any` type like the following:_

```ts
let apiService: any = this.authService.getAlfrescoApi();
apiService.nodes.addNode('-root-', body, {});
```

#### Context Menu directive

_See **Demo Shell** or **DocumentList** implementation for more details and use cases._

```html
<my-component [context-menu]="menuItems"></my-component>
<context-menu-holder></context-menu-holder>
```

```ts
@Component({
    selector: 'my-component
})
export class MyComponent implements OnInit {

    menuItems: any[];
    
    constructor() {
        this.menuItems = [
            { title: 'Item 1', subject: new Subject() },
            { title: 'Item 2', subject: new Subject() },
            { title: 'Item 3', subject: new Subject() }
        ];
    }
    
    ngOnInit() {
        this.menuItems.forEach(l => l.subject.subscribe(item => this.commandCallback(item)));
    }
    
    commandCallback(item) {
        alert(`Executing ${item.title} command.`);
    }

}
```

#### Authentication Service

The authentication service is used inside the [login component](../ng2-alfresco-login) and is possible to find there an example of how to use it.

```ts
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

@Component({
    selector: 'my-app',
    template: `
               <div *ngIf="!authenticated" >
                    Authentication failed to ip {{ ecmHost }} with user: admin, admin
               </div>
               <div *ngIf="authenticated">
                    Authentication successfull to ip {{ ecmHost }} with user: admin, admin, your token is {{ token }}
               </div>`
})
class MyDemoApp {
    authenticated: boolean = false;

    ecmHost: string = 'http://127.0.0.1:8080';

    token: string;

    constructor(public alfrescoAuthenticationService: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {

        alfrescoSettingsService.ecmHost = this.ecmHost;
        alfrescoSettingsService.setProviders('ECM');
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.alfrescoAuthenticationService.login('admin', 'admin').subscribe(
            token => {
                this.token = token.ticket;
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }
}
bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);

```

#### Renditions Service

* getRenditionsListByNodeId(nodeId: string)
* createRendition(nodeId: string, encoding: string)
* getRendition(nodeId: string, encoding: string)
* isRenditionAvailable(nodeId: string, encoding: string)

## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
```

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

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)