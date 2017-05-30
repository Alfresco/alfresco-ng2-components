# Alfresco File Viewer Component for Angular 2

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
  <a href='https://www.npmjs.com/package/ng2-alfresco-viewer'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-viewer.svg' alt='npm downloads' />
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

See it live: [Viewer Quickstart](https://embed.plnkr.co/iTuG1lFIXfsP95l6bDW6/)

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-alfresco-viewer --save
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

    <!-- Polyfill(s) for pdf support -->
    <script src="node_modules/pdfjs-dist/web/compatibility.js"></script>

    <script src="node_modules/pdfjs-dist/build/pdf.js"></script>
    <script src="node_modules/pdfjs-dist/build/pdf.worker.js"></script>
    <script src="node_modules/pdfjs-dist/web/pdf_viewer.js"></script>


    ```

3. SystemJs

    Add the following components to your systemjs.config.js file:

    - ng2-translate
    - alfresco-js-api
    - ng2-alfresco-core
    - ng2-alfresco-viewer

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .

#### Basic usage with node id

```html
<alfresco-viewer [overlayMode]="true" [urlFile]="'filename.pdf'"></alfresco-viewer>
```

Example of an App that declares the file viewer component :

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ViewerModule } from 'ng2-alfresco-viewer';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <alfresco-viewer 
            [showViewer]="true" 
            [overlayMode]="true" 
            [fileNodeId]="'d367023a-7ebe-4f3a-a7d0-4f27c43f1045'">
        </alfresco-viewer>`
})
class MyDemoApp {

    constructor(private authService: AlfrescoAuthenticationService, 
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';

        this.authService.login('admin', 'admin').subscribe(
            ticket => console.log(ticket),
            error => console.log(error)
        );
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ViewerModule.forRoot()
    ],
    declarations: [ MyDemoApp ],
    bootstrap:    [ MyDemoApp ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
```

#### Basic usage with urlFile

```html
<alfresco-viewer [overlayMode]="true" [urlFile]="'filename.pdf'"></alfresco-viewer>
```

Example of an App that declares the file viewer component :

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ViewerModule } from 'ng2-alfresco-viewer';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <alfresco-viewer 
            [showViewer]="true" 
            [overlayMode]="true" 
            [urlFile]="'localTestFile.pdf'">
        </alfresco-viewer>`
})
class MyDemoApp {

    constructor(private authService: AlfrescoAuthenticationService, 
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';
        this.authService.login('admin', 'admin').subscribe(
            ticket => console.log(ticket),
            error => console.log(error)
        );
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ViewerModule.forRoot()
    ],
    declarations: [ MyDemoApp ],
    bootstrap:    [ MyDemoApp ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
```

#### Options

| Attribute     | Options     | Default      | Description | Mandatory
| --- | --- | --- | --- | --- |
| `fileNodeId` | *string* | | Node Id of the file to load the file |
| `urlFile` | *string* | | If you want load an external file that not comes from the ECM you can use this Url where to load the file |
| `urlBlob` | *Blob* | | If you want load a Blob File |
| `overlayMode` | *boolean* | `false` | if true Show the Viewer full page over the present content otherwise will fit the parent div |
| `showViewer` | *boolean* | `true` | Hide or show the viewer |
| `showToolbar` | *boolean* | `true` | Hide or show the toolbars |
| `displayName` | *string* | | You can specify the name of the file |

#### Supported file formats

| Type | extensions |
| --- | --- |
| Media | Mp4,  WebM, Ogv |
| Images | png, jpg, jpeg, gif, bmp |
| Text | pdf, txt |

# Custom extension handler

If you want handle other file formats that are not yet supported by the ng2-alfresco-viewer you can define your own custom handler.

Below you can find an example where with the use of ```extension-viewer``` if you can handle 3d files

```html
<alfresco-viewer 
    [(showViewer)]="fileShowed"
    [fileNodeId]="fileNodeId"
    [overlayMode]="true">
    
    <extension-viewer [supportedExtensions]="['obj','3ds']" #extension>
        <template let-urlFileContent="urlFileContent" let-extension="extension">
            <threed-viewer 
                [urlFile]="urlFileContent" 
                [extension]="extension">
            </threed-viewer>
        </template>
    </extension-viewer>

</alfresco-viewer> 
```

Note: you need adding `ng2-3d-editor` dependency to your `package.json` file to make example above work.

It is possible to define multiple ```extension-viewer``` templates:

```html
<alfresco-viewer 
    [(showViewer)]="fileShowed"
    [fileNodeId]="fileNodeId"
    [overlayMode]="true">

    <extension-viewer [supportedExtensions]="['xls','xlsx']" #extension>
        <template let-urlFileContent="urlFileContent"  >
            <my-custom-xls-component 
                urlFileContent="urlFileContent">
            </my-custom-xls-component>
        </template>
    </extension-viewer>

    <extension-viewer [supportedExtensions]="['txt']" #extension>
        <template  let-urlFileContent="urlFileContent" >               
            <my-custom-txt-component 
                urlFileContent="urlFileContent">
            </my-custom-txt-component>
        </template>
    </extension-viewer>
</alfresco-viewer> 
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
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)