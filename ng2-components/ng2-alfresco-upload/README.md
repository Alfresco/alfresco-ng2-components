# Alfresco Upload Component for Angular 2
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
     <img src='https://travis-ci.com/Alfresco/app-dev-framework.svg?token=FPzV2wyyCU8imY6wHR2B&branch=master'  alt='travis Status' />
  </a>
</p>

### Node
To correctly use this component check that on your machine is running Node version 5.0.0 or higher.

## Install

```sh
npm set registry http://devproducts.alfresco.me:4873
npm install --save ng2-alfresco-upload
```

Components included:

- [Upload button](#upload-button)
- [Drag and Drop](#drag-and-drop)

### Upload button
This component, provide a buttons to upload files to alfresco.

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/bundle.js"></script>
```

The following component needs to be added to your systemjs.config: 

- ng2-translate
- ng2-alfresco-core
- ng2-alfresco-upload

Please refer to the following example to have an idea of how your systemjs.config should look like :

https://github.com/Alfresco/app-dev-framework/blob/master/ng2-components/ng2-alfresco-upload/demo/systemjs.config.js

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
<alfresco-upload-button [showUdoNotificationBar]="true"
                        [uploadFolders]="true"
                        [multipleFiles]="false"
                        [acceptedFilesType]=".jpg,.gif,.png,.svg"
                        (onSuccess)="customMethod($event)">
</alfresco-upload-button>
<file-uploading-dialog></file-uploading-dialog>
```

Example of an App that declares upload button component :

```ts
import { Component, OnInit } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService
} from 'ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload';

@Component({
    selector: 'my-app',
    template: `<alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="false"
                                       [acceptedFilesType]="'.jpg,.gif,.png,.svg'"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>
               <file-uploading-dialog></file-uploading-dialog>`,
    directives: [ALFRESCO_ULPOAD_COMPONENTS]
})
export class MyDemoApp {
    constructor(alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://myalfrescoip';
    }

    public customMethod(event: Object): void {
        console.log('File uploaded');
    }
}

bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS,
    UploadService
]);

```
#### Events
**onSuccess**: The event is emitted when the file is uploaded<br />

#### Options

**showUdoNotificationBar**: {boolean} (optional) default true. Hide/show notification bar.<br />
**uploadFolders**: {boolean} (optional) default false. Allow/disallow upload folders (only for chrome).<br />
**multipleFiles**: {boolean} (optional) default false. Allow/disallow multiple files.<br />
**acceptedFilesType**: {string} (optional) default "*". array of allowed file extensions , example: ".jpg,.gif,.png,.svg" .<br />

### Drag and drop
This component, provide a drag and drop are to upload files to alfresco.

#### Basic usage

```html
<alfresco-upload-drag-area (onSuccess)="customMethod($event)"></alfresco-upload-drag-area>
<file-uploading-dialog></file-uploading-dialog>
```

Example of an App that declares upload drag and drop component :

```ts
import { Component, OnInit } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService
} from 'ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload';

@Component({
    selector: 'my-app',
    template: `<alfresco-upload-drag-area (onSuccess)="customMethod($event)" >
                     <div style="width: 200px; height: 100px; border: 1px solid #888888">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>
               <file-uploading-dialog></file-uploading-dialog>`,
    directives: [ALFRESCO_ULPOAD_COMPONENTS]
})
export class MyDemoApp {
    constructor(alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://myalfrescoip';
    }

    public customMethod(event: Object): void {
        console.log('File uploaded');
    }
}

bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS,
    UploadService
]);

```
#### Events
**onSuccess**: The event is emitted when the file is uploaded<br />

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
