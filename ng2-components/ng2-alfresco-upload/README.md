# Alfresco Upload Component for Angular 2

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
  <a href='https://www.npmjs.com/package/ng2-alfresco-upload'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-upload.svg' alt='npm downloads' />
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
    npm install ng2-alfresco-upload --save
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
    - ng2-alfresco-upload

    Please refer to the following example file: [systemjs.config.js](demo/systemjs
    .config.js) .


#### Basic usage


```html
<alfresco-upload-button [showNotificationBar]="true"
                        [uploadFolders]="true"
                        [multipleFiles]="false"
                        [acceptedFilesType]=".jpg,.gif,.png,.svg"
                        [currentFolderPath]="/Sites/swsdp/documentLibrary"
                        [versioning]="false"
                        (onSuccess)="customMethod($event)">
</alfresco-upload-button>
<file-uploading-dialog></file-uploading-dialog>
```

Example of an App that declares upload button component :

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { UploadModule } from 'ng2-alfresco-upload';

@Component({
    selector: 'alfresco-app-demo',
    template: `<alfresco-upload-button [showNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="false"
                                       [acceptedFilesType]="'.jpg,.gif,.png,.svg'"
                                       (onSuccess)="onSuccess($event)">
               </alfresco-upload-button>
               <file-uploading-dialog></file-uploading-dialog>`
})
export class MyDemoApp {

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

    public onSuccess(event: Object): void {
        console.log('File uploaded');
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        UploadModule.forRoot()
    ],
    declarations: [ MyDemoApp ],
    bootstrap:    [ MyDemoApp ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

```
#### Events
Attribute     | Description 
---           | ---         
`onSuccess`   |  The event is emitted when the file is uploaded 

#### Options

Attribute     | Options     | Default      | Description | Mandatory
---           | ---         | ---          | ---         | ---
`showNotificationBar`         | *boolean*    |     true   |  Hide/show notification bar | 
`uploadFolders`         | *boolean*    |     false   |  Allow/disallow upload folders (only for chrome) | 
`multipleFiles`         | *boolean*    |     false   |  Allow/disallow multiple files | 
`acceptedFilesType`         | *string*    |     *   |  array of allowed file extensions , example: ".jpg,.gif,.png,.svg" | 
`currentFolderPath`         | *string*    |     '/Sites/swsdp/documentLibrary'   |  define the path where the files are uploaded | 
`versioning`         | *boolean*    |     false   |  Versioning false is the default uploader behaviour and it rename using an integer suffix if there is a name clash. Versioning true to indicate that a major version should be created  | 



### Drag and drop
This component, provide a drag and drop are to upload files to alfresco.

#### Basic usage

```html
<alfresco-upload-drag-area (onSuccess)="customMethod($event)"></alfresco-upload-drag-area>
<file-uploading-dialog></file-uploading-dialog>
```

Example of an App that declares upload drag and drop component :

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { UploadModule } from 'ng2-alfresco-upload';

@Component({
    selector: 'alfresco-app-demo',
    template: `<alfresco-upload-drag-area (onSuccess)="customMethod($event)" >
                     <div style="width: 200px; height: 100px; border: 1px solid #888888">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>
               <file-uploading-dialog></file-uploading-dialog>`
})
export class MyDemoApp {

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

    public onSuccess(event: Object): void {
        console.log('File uploaded');
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        UploadModule.forRoot()
    ],
    declarations: [ MyDemoApp ],
    bootstrap:    [ MyDemoApp ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

```

#### Events
Attribute     | Description 
---           | ---         
`onSuccess`   |  The event is emitted when the file is uploaded 

#### Options

Attribute     | Options     | Default      | Description | Mandatory
---           | ---         | ---          | ---         | ---
`showNotificationBar`         | *boolean*    |     true   |  Hide/show notification bar | 
`currentFolderPath`         | *string*    |     '/Sites/swsdp/documentLibrary'   |  define the path where the files are uploaded | 
`versioning`         | *boolean*    |     false   |  Versioning false is the default uploader behaviour and it rename using an integer suffix if there is a name clash. Versioning true to indicate that a major version should be created  | 


### Files Dialog
This component provides a dialog that shows all the files uploaded 
with upload button or drag & drop area components. This component should
 be used in combination with upload button or drag & drop area.

#### Basic usage

```html
<file-uploading-dialog></file-uploading-dialog>
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