# Alfresco Upload Component for Angular 2
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
                    'ng2-alfresco-upload': 'node_modules/ng2-alfresco-upload',
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
                    'ng2-alfresco-upload': {
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
<alfresco-upload-button [showDialogUpload]="true"
                        [showUdoNotificationBar]="true"
                        [uploadFolders]="true"
                        [multipleFiles]="false"
                        [acceptedFilesType]=".jpg,.gif,.png,.svg"
                        (onSuccess)="customMethod($event)">
</alfresco-upload-button>
```

Example of an App that declares upload button component :

```ts
import { Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AlfrescoSettingsService, AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';


@Component({
    selector: 'my-app',
    template: `<alfresco-upload-button [showDialogUpload]="true"
                                       [showUdoNotificationBar]="true"
                                       [uploadFolders]="true"
                                       [multipleFiles]="false"
                                       [acceptedFilesType]=".jpg,.gif,.png,.svg"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>`,
    directives: [ALFRESCO_ULPOAD_COMPONENT]
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
    AlfrescoTranslationService,
    AlfrescoTranslationLoader,
    AlfrescoSettingsService,
    UploadService
]);
```
#### Events
**onSuccess**: The event is emitted when the file is uploaded<br />

#### Options

**showDialogUpload**: {boolean} optional) default true. Hide/show upload dialog.<br />
**showUdoNotificationBar**: {boolean} (optional) default true. Hide/show notification bar.<br />
**uploadFolders**: {boolean} (optional) default false. Allow/disallow upload folders (only for chrome).<br />
**multipleFiles**: {boolean} (optional) default false. Allow/disallow multiple files.<br />
**acceptedFilesType**: {string} (optional) default "*". array of allowed file extensions , example: ".jpg,.gif,.png,.svg" .<br />

### Drag and drop
This component, provide a drag and drop are to upload files to alfresco.

#### Basic usage

```html
<alfresco-upload-drag-area [showDialogUpload]="true" (onSuccess)="customMethod($event)"></alfresco-upload-drag-area>
```

Example of an App that declares upload drag and drop component :

```ts
import { Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AlfrescoSettingsService, AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';


@Component({
    selector: 'my-app',
    template: `<alfresco-upload-drag-area [showDialogUpload]="true" (onSuccess)="customMethod($event)" >
                     <div style="width: 200px; height: 100px; border: 1px solid #888888">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>`,
    directives: [ALFRESCO_ULPOAD_COMPONENT]
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
    AlfrescoTranslationService,
    AlfrescoTranslationLoader,
    AlfrescoSettingsService,
    UploadService
]);
```
#### Events
**onSuccess**: The event is emitted when the file is uploaded<br />

#### Options

**showDialogUpload**: {boolean} optional) default true. Hide/show upload dialog.<br />

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
