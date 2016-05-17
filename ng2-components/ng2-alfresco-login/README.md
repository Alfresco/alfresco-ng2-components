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
npm install --save ng2-alfresco-core ng2-alfresco-login
```


## Build from sources
Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
```

Components included:

* Alfresco Login Component
* Alfresco Authentication Service

### Custom Login Component

```ts
import {Component} from 'angular2/core';
import {AlfrescoLoginComponent} from 'ng2-alfresco-login/ng2-alfresco-login';

@Component({
    selector: 'my-login',
    template: ' <alfresco-login method="{{methodName}}" (onSuccess)="mySuccessMethod($event)" (onError)="myErrorMethod($event)"></alfresco-login>',
    directives: [Login]
})
export class MyLoginComponent {
    methodName: string = 'POST';
    
    mySuccessMethod($event) {
            console.log('Success Login EventEmitt called with: '+$event.value);
        }
    
    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: '+$event.value);
    }
}
```

### Demo

## Configuring development environment

*All scripts assume you are at the project root folder*

**Install symlinks for Alfresco components**

*ng2-alfresco-core:*

```sh
cd ng2-components/ng2-alfresco-core
npm link
cd ../ng2-alfresco-login/demo
npm link ng2-alfresco-core
```


*ng2-alfresco-login component:*

```sh
cd ng2-components/ng2-alfresco-login
npm link
cd ../ng2-alfresco-login/demo
npm link ng2-alfresco-login
```

**Start the demo**

```sh
cd demo
npm install
npm start
```

## Running unit tests

```sh
npm test
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools 
before performing unit testing. 

## Code coverage

```sh
npm run coverage
```
