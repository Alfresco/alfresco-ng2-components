# Alfresco Upload Component for Angular

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
</p>

## Content

### Components

- [FileUploadingDialogComponent](#fileuploadingdialogcomponent)
- FileUploadingListComponent
- [UploadButtonComponent](#uploadbuttoncomponent)
- [UploadDragAreaComponent](#uploaddragareacomponent)

### Services

- [UploadService](#uploadservice)

### Directives

- FileDraggableDirective

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install ng2-alfresco-upload --save
```

## UploadButtonComponent

```html
<alfresco-upload-button 
    [showNotificationBar]="true"
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
    template: `
        <alfresco-upload-button 
            [showNotificationBar]="true"
            [uploadFolders]="false"
            [multipleFiles]="false"
            [acceptedFilesType]="'.jpg,.gif,.png,.svg'"
            (onSuccess)="onSuccess($event)">
        </alfresco-upload-button>
        <file-uploading-dialog></file-uploading-dialog>
    `
})
export class MyDemoApp {

    constructor(private authService: AlfrescoAuthenticationService, 
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';

        this.authService.login('admin', 'admin').subscribe(
            ticket => console.log(ticket),
            error => console.log(error)
        );
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

### Events

| Name | Description |
| --- | --- |
| `onSuccess` | The event is emitted when the file is uploaded |

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | *boolean* | false | Toggle component disabled state |
| `showNotificationBar` | *boolean* | true | Hide/show notification bar |
| `uploadFolders` | *boolean* | false | Allow/disallow upload folders (only for chrome) |
| `multipleFiles` | *boolean* | false | Allow/disallow multiple files |
| `acceptedFilesType` | *string* | * |  array of allowed file extensions , example: ".jpg,.gif,.png,.svg" |
| `currentFolderPath` | *string* | '/Sites/swsdp/documentLibrary' | define the path where the files are uploaded |
| `versioning` | *boolean* | false   |  Versioning false is the default uploader behaviour and it rename using an integer suffix if there is a name clash. Versioning true to indicate that a major version should be created |
| `staticTitle` | *string* | 'FILE_UPLOAD.BUTTON.UPLOAD_FILE' or 'FILE_UPLOAD.BUTTON.UPLOAD_FOLDER' string in the JSON text file | define the text of the upload button |
| `disableWithNoPermission` | *boolean* | false |  If the value is true and the user doesn't have the permission to delete the node the button will be disabled |

### Advanced usage

#### How to show notification message with no permission

You can show a notification error when the user doesn't have the right permission to perform the action.
The UploadButtonComponent provides the event permissionEvent that is raised when the delete permission is missing
You can subscribe to this event from your component and use the NotificationService to show a message.

```html
<alfresco-upload-button
    [rootFolderId]="currentFolderId"
    (permissionEvent)="onUploadPermissionFailed($event)">
</alfresco-upload-button>

export class MyComponent {

    onUploadPermissionFailed(event: any) {
        this.notificationService.openSnackMessage(
            `you don't have the ${event.permission} permission to ${event.action} the ${event.type} `, 4000
        );
    }

}
```

![Upload notification message](docs/assets/upload-notification-message.png)

#### How to disable the button when the delete permission is missing

You can easily disable the button when the user doesn't own the permission to perform the action.
The UploadButtonComponent provides the property disableWithNoPermission that can be true. In this way the button should be disabled if the delete permission is missing for the node.

```html
<alfresco-upload-button
    [rootFolderId]="currentFolderId"
    [disableWithNoPermission]="true">
</alfresco-upload-button>
```

![Upload disable button](docs/assets/upload-disable-button.png)

## UploadDragAreaComponent

This component, provide a drag and drop are to upload files to alfresco.

```html
<alfresco-upload-drag-area 
    (onSuccess)="customMethod($event)">
</alfresco-upload-drag-area>
<file-uploading-dialog></file-uploading-dialog>
```

Example of an App that declares upload drag and drop component:

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { UploadModule } from 'ng2-alfresco-upload';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <alfresco-upload-drag-area (onSuccess)="customMethod($event)" >
            <div style="width: 200px; height: 100px; border: 1px solid #888888">
                DRAG HERE
            </div>
        </alfresco-upload-drag-area>
        <file-uploading-dialog></file-uploading-dialog>
    `
})
export class MyDemoApp {

    constructor(private authService: AlfrescoAuthenticationService, 
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';

        this.authService.login('admin', 'admin').subscribe(
            ticket => console.log(ticket),
            error => console.log(error)
        );
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

### Events

| Name | Description |
| --- | --- |
| `onSuccess` | The event is emitted when the file is uploaded |

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | *boolean* | true | Toggle component enabled state |
| `showNotificationBar` | *boolean* | true |  Hide/show notification bar |
| `rootFolderId` | *string* | '-root-' | The ID of the root folder node.
| `currentFolderPath` | *string* | '/' | define the path where the files are uploaded |
| `versioning` | *boolean* | false |  Versioning false is the default uploader behaviour and it rename using an integer suffix if there is a name clash. Versioning true to indicate that a major version should be created  | 

## FileUploadingDialogComponent

This component provides a dialog that shows all the files uploaded with upload button or drag & drop area components. 
This component should be used in combination with upload button or drag & drop area.

```html
<file-uploading-dialog></file-uploading-dialog>
```

## UploadService

Provides access to various APIs related to file upload features.

### Events

| Name | Type | Description |
| --- | --- | --- |
| queueChanged | FileModel[] | Raised every time the file queue changes. |
| fileUpload | FileUploadEvent | Raised every time a File model changes its state. |
| fileUploadStarting | FileUploadEvent | Raised when upload starts. |
| fileUploadCancelled | FileUploadEvent | Raised when upload gets cancelled by user.  |
| fileUploadProgress | FileUploadEvent | Raised during file upload process and contains the current progress for the particular File model. |
| fileUploadAborted | FileUploadEvent | Raised when file upload gets aborted by the server. |
| fileUploadError | FileUploadEvent | Raised when an error occurs to file upload. |
| fileUploadComplete | FileUploadCompleteEvent | Raised when file upload is complete. |

## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
```

### Build the files and keep watching for changes

```sh
npm run build:w
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
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
