# Alfresco Login Component for Angular 2
<p>
  <a href='https://raw.githubusercontent.com/Alfresco/dev-platform-webcomponents/master/ng2-components/ng2-alfresco-upload/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='my blog' />
  </a>
</p>

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
<script src="node_modules/alfresco-core-rest-api/bundle.js"></script>
```

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

Make sure your systemjs.config has the following configuration:

```javascript
    System.config({
                defaultJSExtensions: true,
                map: {
                    'ng2-alfresco-core': 'node_modules/ng2-alfresco-core',
                    'ng2-alfresco-login': 'node_modules/ng2-alfresco-login',
                    'rxjs': 'node_modules/rxjs',
                    'angular2' : 'node_modules/angular2',
                    'ng2-translate': 'node_modules/ng2-translate',
                    'src': 'src'
                },
                packages: {
                    'src': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-core': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-login': {
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

#### Basic usage


```html
<alfresco-login></alfresco-login>
```

Example of an App that use Alfresco login component :

main.ts
```ts

import { bootstrap }    from 'angular2/platform/browser';
import { Component } from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { AlfrescoLoginComponent } from 'ng2-alfresco-login/dist/ng2-alfresco-login';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS }    from 'angular2/http';
import { ALFRESCO_CORE_PROVIDERS, AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/dist/ng2-alfresco-core';


@RouteConfig([
    {path: '/', name: 'Login', component: AlfrescoLoginComponent, useAsDefault: true}
])
@Component({
    selector: 'my-app',
    template: '<alfresco-login method="POST" (onSuccess)="mySuccessMethod($event)" (onError)="myErrorMethod($event)"></alfresco-login>',
    directives: [ROUTER_DIRECTIVES, AlfrescoLoginComponent]
})
export class AppComponent {

    constructor(public auth: AlfrescoAuthenticationService,
                public router: Router,
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
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    AlfrescoTranslationLoader,
    AlfrescoTranslationService,
    AlfrescoAuthenticationService,
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

