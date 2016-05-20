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


## Build from sources
Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
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

Make sure your systemjs.config has the following configuration:

```javascript
    System.config({
            defaultJSExtensions: true,
            map: {
                'ng2-alfresco-core': 'node_modules/ng2-alfresco-core/dist',
                'ng2-alfresco-upload': 'node_modules/ng2-alfresco-upload/dist',
                'ng2-translate': 'node_modules/ng2-translate',
                'rxjs': 'node_modules/rxjs',
                'angular2' : 'node_modules/angular2',
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
                'ng2-translate': {
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
                        [acceptedFilesType]=".jpg,.gif,.png,.svg">
</alfresco-upload-button>
```

Example of an App that declares upload button component :

```ts
import { Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/services';
import { ALFRESCO_ULPOAD_COMPONENT } from 'ng2-alfresco-upload/ng2-alfresco-upload';


@Component({
    selector: 'my-app',
    template: `<alfresco-upload-button [showDialogUpload]="true"
                                       [showUdoNotificationBar]="true"
                                       [uploadFolders]="true"
                                       [multipleFiles]="false"
                                       [acceptedFilesType]=".jpg,.gif,.png,.svg">
               </alfresco-upload-button>`,
    directives: [ALFRESCO_ULPOAD_COMPONENT]
})
export class MyDemoApp {
    constructor() {

    }
}

bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    AlfrescoTranslationService,
    AlfrescoTranslationLoader
]);
```
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
<alfresco-upload-drag-area [showDialogUpload]="true" ></alfresco-upload-drag-area>
```

Example of an App that declares upload drag and drop component :

```ts
import { Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/services';
import { ALFRESCO_ULPOAD_COMPONENT } from 'ng2-alfresco-upload/ng2-alfresco-upload';


@Component({
    selector: 'my-app',
    template: `<alfresco-upload-drag-area [showDialogUpload]="true" >
                     <div style="width: 200px; height: 100px; border: 1px solid #888888">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>`,
    directives: [ALFRESCO_ULPOAD_COMPONENT]
})
export class MyDemoApp {
    constructor() {

    }
}

bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    AlfrescoTranslationService,
    AlfrescoTranslationLoader
]);
```
#### Options

**showDialogUpload**: {boolean} optional) default true. Hide/show upload dialog.<br />

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

## Demo

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```
