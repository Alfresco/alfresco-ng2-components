# Alfresco Webscript Component for Angular 2

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
  <a href='https://www.npmjs.com/package/ng2-alfresco-webscript'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-webscript.svg' alt='npm downloads' />
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
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-alfresco-webscript --save
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
    - alfresco-js-api
    - ng2-alfresco-core
    - ng2-alfresco-datatable

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .

#### Basic usage


```html
 <alfresco-webscript-get [scriptPath]="string"
                         [scriptArgs]="Object"
                         [contextRoot]="string"
                         [servicePath]="string"
                         [showData]="boolean"
                         [contentType]="JSON | HTML | DATATABLE | TEXT"
                         (onSuccess)= "logData($event)">
 </alfresco-webscript-get>
 ```

Example of an App that use Alfresco webscript component :

main.ts
```ts

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService  } from 'ng2-alfresco-core';
import { DataTableModule }  from 'ng2-alfresco-datatable';
import { WebScriptModule } from 'ng2-alfresco-webscript';

@Component({
    selector: 'alfresco-app-demo',
    template: `<alfresco-webscript-get [scriptPath]="scriptPath"
                               [scriptArgs]="scriptArgs"
                               [contextRoot]="contextRoot"
                               [servicePath]="servicePath" 
                               [contentType]="'HTML'">
    </alfresco-webscript-get>
    `
})
class WebscriptDemo {

    scriptPath: string = 'sample/folder/Company%20Home';

    contextRoot: string = 'alfresco';

    servicePath: string = 'service';

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
        DataTableModule,
        WebScriptModule
    ],
    declarations: [ WebscriptDemo ],
    bootstrap:    [ WebscriptDemo ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

```

#### Options


Attribute     | Options     | Default      | Description | Mandatory
---           | ---         | ---          | ---         | ---
`scriptPath`         | *string*    |        |  path to Web Script (as defined by Web Script) | mandatory
`scriptArgs`         | *Object*    |        |  arguments to pass to Web Script | 
`contextRoot`         | *string*    |        |  path where application is deployed | 
`scriptPath`         | *string*    |        |  path to Web Script (as defined by Web Script) | alfresco
`contentType`         | *string*    |        |  path where Web Script service is mapped default value | service
`contentType`         | *string*    |        |  how to handle the data received from te web script JSON , HTML , DATATABLE or TEXT | TEXT
`onSuccess`         | *event*   |        |  You can get the plain data from the webscript through the **onSuccess** event parameter and use it as you need in your application |
`showData`         | *booleann*   |        |  render the webscript data |true


**contentType** {string}  
***data***      {string}  data contain the plain value get from the webscipt is an output parameter

## Webscript View HTML example
This sample demonstrates how to implement a Webscript component that renders the HTML contents that come from a webscript
This sample Web Scripts  reside in your Alfresco Server AND  you can access the folder webscript here:

http://localhost:8080/alfresco/service/sample/folder/Company%20Home 


```html
 <alfresco-webscript-get [scriptPath]="scriptPath"
                           [contextRoot]= "'alfresco'"
                           [servicePath]= "'service'";
                           [scriptPath]=  "'Sample/folder/Company%20Home'"
                           [contentType]= "'HTML'">
 </alfresco-webscript-get>
```                          

![Custom columns](docs/assets/HTML.png)                         

## Webscript View DATATABLE example
This sample demonstrates how to implement a Webscript component that renders the JSON contents that come from a webscript

http://localhost:8080/alfresco/service/sample/folder/DATATABLE

```html
 <alfresco-webscript-get [scriptPath]="scriptPath"
                           [contextRoot]= "'alfresco'"
                           [servicePath]= "'service'";
                           [scriptPath]=  "'Sample/folder/DATATABLE'"
                           [contentType]= "'DATATABLE'">
 </alfresco-webscript-get>
```  

If you want show the result from a webscript inside a ng2-alfresco-datatable you have to return from the GET of the webscript the datatructure below:
subdivide in data and schema

```ts
data: [],
schema: []
```

this is an example: 

```ts
data: [
    {id: 1, name: 'Name 1'},
    {id: 2, name: 'Name 2'}
],
schema: [{
    type: 'text',
    key: 'id',
    title: 'Id',
    sortable: true
}, {
    type: 'text',
    key: 'name',
    title: 'Name',
    sortable: true
}]
```

or you can send just the array data and the component will create a schema for you: 

```ts
data: [
    {id: 1, name: 'Name 1'},
    {id: 2, name: 'Name 2'}
]]
```

that will render the follow table

![Custom columns](docs/assets/datatable.png)


## Webscript View JSON example
This sample demonstrates how to implement a Webscript component that renders the JSON contents that come from a webscript
This sample Web Scripts  reside in your Alfresco Server AND  you can access the folder webscript here:

http://localhost:8080/alfresco/service/sample/folder/JSON%EXAMPLE 

```html
 <alfresco-webscript-get [scriptPath]="scriptPath"
                           [contextRoot]= "'alfresco'"
                           [servicePath]= "'service'";
                           [scriptPath]=  "'Sample/folder/JSON_EXAMPLE'"
                           [contentType]= "'HTML'"
                           [showData] = "false"
                           (onSuccess)= "logDataExample($event)">
 </alfresco-webscript-get>
``` 

You can get the plain data from the webscript through the **onSuccess** event parameter and use it as you need in your application

```ts
    logDataExample(data) {
        console.log('You webscript data are here' + data);
    }
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
| npm run build:w | Build component and keep watching the changes |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
