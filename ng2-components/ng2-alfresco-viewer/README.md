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

### Node
To correctly use this component check that on your machine is running Node version 5.0.0 or higher.

## Install

```sh
npm install --save ng2-alfresco-viewer
```

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/pdfjs-dist/build/pdf.js"></script>
<script src="node_modules/pdfjs-dist/build/pdf.worker.js"></script>
<script src="node_modules/pdfjs-dist/web/pdf_viewer.js"></script>
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

The following component needs to be added to your systemjs.config: 

- ng2-translate
- ng2-alfresco-core

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

#### Basic usage with node id

```html
<ng2-alfresco-viewer [overlayMode]="true" [urlFile]="'filename.pdf'"></ng2-alfresco-viewer>
```

Example of an App that declares the file viewer component :

```ts
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';

@Component({
    selector: 'my-app',
    template: `   <alfresco-viewer [showViewer]="true" [overlayMode]="true" [fileNodeId]="fileNodeId">
                    <div class="mdl-spinner mdl-js-spinner is-active"></div>
                   </alfresco-viewer>`,
    directives: [VIEWERCOMPONENT]
})
class MyDemoApp {

    fileNodeId: any;
    
    constructor() {
        this.fileNodeId = '09469a81-1ed9-4caa-a5df-8362fc3d096f';    
    }
}
bootstrap(MyDemoApp, [
    VIEWERCOMPONENT
]);
```

#### Basic usage with urlFile

```html
<ng2-alfresco-viewer [overlayMode]="true" [urlFile]="'filename.pdf'"></ng2-alfresco-viewer>
```

Example of an App that declares the file viewer component :

```ts
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';

@Component({
    selector: 'my-app',
    template: `   <alfresco-viewer [showViewer]="true" [overlayMode]="true" [urlFile]="'local_filename.pdf'">
                    <div class="mdl-spinner mdl-js-spinner is-active"></div>
                   </alfresco-viewer>`,
    directives: [VIEWERCOMPONENT]
})
class MyDemoApp {
    constructor() {
        console.log('constructor');
    }
}
bootstrap(MyDemoApp, [
    VIEWERCOMPONENT
]);
```

#### Options

Attribute     | Options     | Default      | Description | Mandatory
---           | ---         | ---          | ---         | ---
`fileNodeId`         | *string*    |        |  node Id of the file to load the file | 
`urlFile`         | *string*    |        |  If you want laod an external file that not comes from the ECM you can use this Url where to load the file | 
`overlayMode`         | *boolean*    | `false`        | if true Show the Viewer full page over the present content otherwise will fit the parent div  |
`showViewer`         | *boolean*    | `true`        | Hide or show the viewer |
`showToolbar`         | *boolean*    | `true`        | Hide or show the toolbars |

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


## History

For detailed changelog, check [Releases](https://github.com/alfresco/ng2-alfresco-viewer/releases).

## Contributors

[Contributors](https://github.com/alfresco/ng2-alfresco-viewer/graphs/contributors)


[npm-image]: https://badge.fury.io/js/ng2-alfresco-viewer.svg
[npm-url]: https://npmjs.org/package/ng2-alfresco-viewer
[travis-image]: https://travis-ci.org/alfresco/ng2-alfresco-viewer.svg?branch=master
[travis-url]: https://travis-ci.org/alfresco/ng2-alfresco-viewer
[daviddm-image]: https://david-dm.org/alfresco/ng2-alfresco-viewer.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alfresco/ng2-alfresco-viewer
[coveralls-image]: https://coveralls.io/repos/alfresco/ng2-alfresco-viewer/badge.svg
[coveralls-url]: https://coveralls.io/r/alfresco/ng2-alfresco-viewer
[style-url]: https://github.com/mgechev/angular2-style-guide
[style-image]: https://mgechev.github.io/angular2-style-guide/images/badge.svg
[alfrescocomponent-image]: https://img.shields.io/badge/Alfresco%20component-approved-green.svg
[alfrescocomponent-url]: https://www.alfresco.com
