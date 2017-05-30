# Alfresco Angular 2 Components core

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
  <a href='https://www.npmjs.com/package/ng2-alfresco-core'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-core.svg' alt='npm downloads' />
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
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-alfresco-core
```

## Library content

- Components
    - Context Menu directive
- Directives
    - UploadDirective
- Services
    - **LogService**, log service implementation
    - **NotificationService**, Notification service implementation
    - **AlfrescoApiService**, provides access to Alfresco JS API instance
    - **AlfrescoAuthenticationService**, main authentication APIs
    - **AlfrescoTranslationService**, various i18n-related APIs
    - **ContextMenuService**, global context menu APIs


## UploadDirective

Allows your components or common HTML elements reacting on File drag and drop in order to upload content. 
Used by attaching to an element or component.

### Basic usage

The directive itself does not do any file management process, 
but collects information on dropped files and raises corresponding events instead.

```html
<div style="width:100px; height:100px"
     [adf-upload]="true" 
     [adf-upload-data]="{ some: 'data' }">
    Drop files here...
</div>
```

It is possible controlling when upload behaviour is enabled/disabled by binding directive to a `boolean` value or expression:

```html
<div [adf-upload]="true">...</div>
<div [adf-upload]="allowUpload">...</div>
<div [adf-upload]="isUploadEnabled()">...</div>
```

You can decorate any element including buttons, for example:

```html
<button [adf-upload]="true" [multiple]="true" [accept]="'image/*'">
    Upload photos
</button>
```

### Modes

Directive supports several modes:

- **drop** mode, where decorated element acts like a drop zone for files (**default** mode)
- **click** mode, where decorated element invokes File Dialog to select files or folders.

It is also possible combining modes together. 

```html
<div [adf-upload]="true" mode="['click']">...</div>
<div [adf-upload]="true" mode="['drop']">...</div>
<div [adf-upload]="true" mode="['click', 'drop']">...</div>
```

#### Click mode

For the click mode you can provide additional attributes for the File Dialog:

- **directory**, enables directory selection
- **multiple**, enables multiple file/folder selection
- **accept**, filters the content accepted

```html
<div style="width: 50px; height: 50px; background-color: brown"
     [adf-upload]="true"
     [multiple]="true"
     [accept]="'image/*'">
</div>

<div style="width: 50px; height: 50px; background-color: blueviolet"
     [adf-upload]="true"
     [multiple]="true"
     [directory]="true">
</div>
```

#### Drop mode

For the moment upload directive supports only Files (single or multiple). 
Support for Folders and `accept` filters is subject to implement.

### Events

Once a single or multiple files are dropped on the decorated element the `upload-files` [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) is raised.
The DOM event is configured to have `bubbling` enabled, so any component up the component tree can handle, process or prevent it:

```html
<div (upload-files)="onUploadFiles($event)">
    <div [adf-upload]="true"></div>
</div>
```

```ts
onUploadFiles(e: CustomEvent) {
    console.log(e.detail.files);
    
    // your code
}
```

Please note that event will be raised only if valid [Files](https://developer.mozilla.org/en-US/docs/Web/API/File) were dropped onto the decorated element.

The `upload-files` event is cancellable, so you can stop propagation of the drop event to uppper levels in case it has been already handled by your code:

```ts
onUploadFiles(e: CustomEvent) {
    e.stopPropagation();
    e.preventDefault();

    // your code
}
```

It is also possible attaching arbitrary data to each event in order to access it from within external event handlers.
A typical scenario is data tables where you may want to handle also the data row and/or underlying data to be accessible upon files drop.

You may be using `adf-upload-data` to bind custom values or objects for every event raised:

```html
<div [adf-upload]="true" [adf-upload-data]="dataRow"></div>
<div [adf-upload]="true" [adf-upload-data]="'string value'"></div>
<div [adf-upload]="true" [adf-upload-data]="{ name: 'custom object' }"></div>
<div [adf-upload]="true" [adf-upload-data]="getUploadData()"></div>
```

As part of the `details` property of the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) you can get access to the following:

```ts
detail: {
    sender: UploadDirective,    // directive that raised given event
    data: any,                  // arbitrary data associated (bound)
    files: File[]               // dropped files
}
```

### Styling

The decorated element gets `adf-upload__dragging` CSS class name in the class list every time files are dragged over it.
This allows changing look and feel of your components in case additional visual indication is required, 
for example you may want drawing a dashed border around the table row on drag:

```html
<table>
    <tr [adf-upload]="true">
        ...
    </tr>
</table>
```

```css
.adf-upload__dragging > td:first-child {
    border-left: 1px dashed rgb(68,138,255);
}

.adf-upload__dragging > td {
    border-top: 1px dashed rgb(68,138,255);
    border-bottom: 1px dashed rgb(68,138,255);
}

.adf-upload__dragging > td:last-child {
    border-right: 1px dashed rgb(68,138,255);
}
```

## Alfresco Api Service

Provides access to initialized **AlfrescoJSApi** instance.

```ts

export class MyComponent implements OnInit {

    constructor(private apiService: AlfrescoApiService) {   
    }

    ngOnInit() {
        let nodeId = 'some-node-id';
        let params = {};
        this.apiService.getInstance().nodes
            .getNodeChildren(nodeId, params)
            .then(result => console.log(result));
    }
}
```

**Note for developers**: _the TypeScript declaration files for Alfresco JS API
are still under development and some Alfresco APIs may not be accessed
via your favourite IDE's intellisense or TypeScript compiler. 
In case of any TypeScript type check errors you can still call any supported 
Alfresco JS api by casting the instance to `any` type like the following:_

```ts
let api: any = this.apiService.getInstance();
api.nodes.addNode('-root-', body, {});
```

## Notification Service

The Notification Service is implemented on top of the Angular 2 Material Design snackbar.
Use this service to show a notification message, and optionaly get feedback from it.

```ts
import { NotificationService } from 'ng2-alfresco-core';

export class MyComponent implements OnInit {

    constructor(private notificationService: NotificationService) {   
    }

    ngOnInit() {
          this.notificationService.openSnackMessage('test', 200000).afterDismissed().subscribe(() => {
                    console.log('The snack-bar was dismissed');
                });                        
    }
}
```

```ts
import { NotificationService } from 'ng2-alfresco-core';

export class MyComponent implements OnInit {

    constructor(private notificationService: NotificationService) {   
    }

    ngOnInit() {
         this.notificationService.openSnackMessageAction('Do you want to report this issue?', 'send', 200000).afterDismissed().subscribe(() => {
                console.log('The snack-bar was dismissed');
            });
    }
}
```

## Context Menu directive

_See **Demo Shell** or **DocumentList** implementation for more details and use cases._

```html
<my-component [context-menu]="menuItems"></my-component>
<context-menu-holder></context-menu-holder>
```

```ts
@Component({
    selector: 'my-component'
})
export class MyComponent implements OnInit {

    menuItems: any[];
    
    constructor() {
        this.menuItems = [
            { title: 'Item 1', subject: new Subject() },
            { title: 'Item 2', subject: new Subject() },
            { title: 'Item 3', subject: new Subject() }
        ];
    }
    
    ngOnInit() {
        this.menuItems.forEach(l => l.subject.subscribe(item => this.commandCallback(item)));
    }
    
    commandCallback(item) {
        alert(`Executing ${item.title} command.`);
    }

}
```

## Accordion Component
The component provide a way to easy create an accordion menu. You can customize the header and the icon.

```html
<adf-accordion>
    <adf-accordion-group [heading]="titleHeading" [isSelected]="true" [headingIcon]="'assignment'">
        <my-list></my-list>
    </adf-accordion-group>
</adf-accordion>
```

```ts
@Component({
    selector: 'my-component'
})
export class MyComponent implements OnInit {

    titleHeading: string;

    constructor() {
        this.titleHeading = 'My Group';
    }

}
```

### Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `heading` | {string} | optional | The header title. |
| `isSelected` | {boolean} | optional | Define if the accordion group is selected or not. |
| `headingIcon` | {string} | optional | The material design icon. |


## Authentication Service

The authentication service is used inside the [login component](../ng2-alfresco-login) and is possible to find there an example of how to use it.

### Events

| Name | Description |
| --- | --- |
| onLogin | Raised when user logs in |
| onLogout | Raised when user logs out |

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <div *ngIf="!authenticated" >
            Authentication failed to ip {{ ecmHost }} with user: admin, admin
        </div>
        <div *ngIf="authenticated">
            <H5>ECM</H5>
            Authentication successfull to ip {{ ecmHost }} with user: admin, admin<br> 
            your token is {{ tokenEcm }}<br>
            <H5>BPM</H5>
            Authentication successfull to ip {{ bpmHost }} with user: admin, admin<br> 
            your token is {{ tokenBpm }}<br>
        </div>
    `
})
class MyDemoApp {
    authenticated: boolean = false;
    ecmHost: string = 'http://localhost:8080';
    bpmHost: string = 'http://localhost:9999';
    tokenBpm: string;
    tokenEcm: string;

    constructor(public alfrescoAuthenticationService: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {

        alfrescoSettingsService.ecmHost = this.ecmHost;
        alfrescoSettingsService.bpmHost = this.bpmHost;

        alfrescoSettingsService.setProviders('ALL');
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.alfrescoAuthenticationService.login('admin', 'admin').subscribe(
            token => {
                this.tokenBpm = this.alfrescoAuthenticationService.getTicketBpm();
                this.tokenEcm = this.alfrescoAuthenticationService.getTicketEcm();
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot()
    ],
    declarations: [MyDemoApp],
    bootstrap: [MyDemoApp]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
```

## AlfrescoTranslationService

In order to enable localisation support you will need creating a `/resources/i18n/en.json` file 
and registering path to it's parent `i18n` folder:

```ts
class MainApplication {
    constructor(private translateService: AlfrescoTranslationService) {
        translateService.addTranslationFolder('app', 'resources');
    }
}
```

Service also allows changing current language for entire application.
Imagine you got a language picker that invokes `onLanguageClicked` method:

```ts
class MyComponent {
    constructor(private translateService: AlfrescoTranslationService) {
    }

    onLanguageClicked(lang: string) {
        this.translateService.use('en');
    }
}
```

It is also possible providing custom translations for existing components by overriding their resource paths:

```ts
class MyComponent {
    constructor(private translateService: AlfrescoTranslationService) {
        translateService.addTranslationFolder(
            'ng2-alfresco-login', 
            'i18n/custom-translation/alfresco-login'
        );
    }
}
```

**Important note**: `addTranslationFolder` method redirects **all** languages to a new folder, you may need implementing multiple languages 
or copying existing translation files to a new path.


## Renditions Service

* getRenditionsListByNodeId(nodeId: string)
* createRendition(nodeId: string, encoding: string)
* getRendition(nodeId: string, encoding: string)
* isRenditionAvailable(nodeId: string, encoding: string)

## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
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

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
