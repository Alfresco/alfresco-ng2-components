# Alfresco Tag Component for Angular 2
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
  <a href='https://www.npmjs.com/package/ng2-alfresco-tag'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-tag.svg' alt='npm downloads' />
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

### Node
To correctly use this component check that on your machine is running Node version 5.0.0 or higher.

## Install

```sh
npm install --save ng2-alfresco-tag
```

Components included:

* Alfresco Tag Component

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

The following component needs to be added to your systemjs.config: 

- ng2-translate
- ng2-alfresco-core

Please refer to the following example to have an idea of how your systemjs.config should look like :

https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-tag/demo/systemjs.config.js

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

In this component are present three different tags :

* alfresco-tag-node-actions-list
* alfresco-tag-list
* alfresco-tag-node-list

##### alfresco-tag-node-actions-list

```html
<alfresco-tag-node-actions-list [nodeId]="nodeId"></alfresco-tag-node-actions-list>
```  

```ts
import { Component, OnInit, Input } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

import { TAGCOMPONENT, TAGSERVICES } from 'ng2-alfresco-tag';

@Component({
    selector: 'alfresco-tag-demo',
    template: `
           <div class="container" *ngIf="authenticated">
             <alfresco-tag-node-actions-list [nodeId]="nodeId"></alfresco-tag-node-actions-list>
           </div>
    `,
    directives: [TAGCOMPONENT, CONTEXT_MENU_DIRECTIVES],
    providers: [TAGSERVICES]
})
class TagDemo implements OnInit {

    @Input()
    nodeId: string = '74cd8a96-8a21-47e5-9b3b-a1b3e296787d';

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                this.authenticated = true;
            },
            error => {
                this.authenticated = false;
            });
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    logData(data) {
        console.log(data);
    }
}
bootstrap(TagDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
```   


![Custom columns](docs/assets/tag3.png)                         

##### alfresco-tag-node-list

```html
<alfresco-tag-node-list [nodeId]="nodeId"></alfresco-tag-node-list>
``` 

```ts
import { Component, OnInit, Input } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

import { TAGCOMPONENT, TAGSERVICES } from 'ng2-alfresco-tag';

@Component({
    selector: 'alfresco-tag-demo',
    template: `
           <div class="container" *ngIf="authenticated">
             <alfresco-tag-node-list [nodeId]="nodeId"></alfresco-tag-node-list>
           </div>
    `,
    directives: [TAGCOMPONENT, CONTEXT_MENU_DIRECTIVES],
    providers: [TAGSERVICES]
})
class TagDemo implements OnInit {

    @Input()
    nodeId: string = '74cd8a96-8a21-47e5-9b3b-a1b3e296787d';

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                this.authenticated = true;
            },
            error => {
                this.authenticated = false;
            });
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    logData(data) {
        console.log(data);
    }
}
bootstrap(TagDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
```  

![Custom columns](docs/assets/tag1.png)                         

##### alfresco-tag-list

```html
<alfresco-tag-list></alfresco-tag-list>
``` 

```ts
import { Component, OnInit, Input } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

import { TAGCOMPONENT, TAGSERVICES } from 'ng2-alfresco-tag';

@Component({
    selector: 'alfresco-tag-demo',
    template: `
           <div class="container" *ngIf="authenticated">
             <alfresco-tag-list></alfresco-tag-list>
           </div>
    `,
    directives: [TAGCOMPONENT, CONTEXT_MENU_DIRECTIVES],
    providers: [TAGSERVICES]
})
class TagDemo implements OnInit {

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                this.authenticated = true;
            },
            error => {
                this.authenticated = false;
            });
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    logData(data) {
        console.log(data);
    }
}
bootstrap(TagDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
```  

![Custom columns](docs/assets/tag2.png)                         

        
## Build from sources
Alternatively you can build component from sources with the following commands:
     
     
```sh
npm install
npm run build
```

##Build the files and keep watching for changes

```sh
npm run build:w
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

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

