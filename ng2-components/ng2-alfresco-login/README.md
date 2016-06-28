# Alfresco Login Component for Angular 2
<p>
  <a href='https://raw.githubusercontent.com/Alfresco/app-dev-framework/master/ng2-components/ng2-alfresco-upload/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
  <a title='Build Status' href="https://travis-ci.com/Alfresco/app-dev-framework">
    <img src='https://travis-ci.com/Alfresco/app-dev-framework.svg?token=SCyeWaC53Nr62GmuRyZA&branch=master'  alt='travis
    Status' />  
  </a>
</p>

### Node
To correctly use this component check that on your machine is running Node version 5.0.0 or higher.

## Install

```sh
npm set registry http://devproducts.alfresco.me:4873
npm install --save ng2-alfresco-login
```

Components included:

* Alfresco Login Component
* Alfresco Authentication Service

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/bundle.js"></script>
```

The following component needs to be added to your systemjs.config: 

- ng2-translate
- ng2-alfresco-core
- ng2-alfresco-login

Please refer to the following example to have an idea of how your systemjs.config should look like :

https://github.com/Alfresco/app-dev-framework/blob/master/ng2-components/ng2-alfresco-login/demo/systemjs.config.js

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
<alfresco-login></alfresco-login>
```

Example of an App that use Alfresco login component :

main.ts
```ts

import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { AlfrescoLoginComponent } from 'ng2-alfresco-login';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

@Component({
    selector: 'my-app',
    template: '<alfresco-login (onSuccess)="mySuccessMethod($event)" (onError)="myErrorMethod($event)"></alfresco-login>',
    directives: [AlfrescoLoginComponent]
})
export class AppComponent {

    constructor(public auth: AlfrescoAuthenticationService,
                alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://192.168.99.100:8080';
    }

    mySuccessMethod($event) {
        console.log('Success Login EventEmitt called with: ' + $event.value);
    }

    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: ' + $event.value);
    }

}

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);

```
#### Events
**onSuccess**: The event is emitted when the login is done
**onError**: The event is emitted when the login fails<br />


#### Options

**method**: {string} optional) default POST. The method attribute specifies how to send form-data
The form-data can be sent as URL variables (with method="get") or as HTTP post transaction (with method="post").<br />

## Build from sources
Alternatively you can build component from sources with the following commands:


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

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

