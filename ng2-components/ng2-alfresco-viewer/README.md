# Alfresco File Viewer Component for Angular 2
<p>
  <a href='https://raw.githubusercontent.com/Alfresco/app-dev-framework/master/ng2-components/ng2-alfresco-viewer/LICENSE'>
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
npm install --save ng2-alfresco-viewer
```

#### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/pdfjs-dist/build/pdf.js"></script>
<script src="node_modules/pdfjs-dist/build/pdf.worker.js"></script>
<script src="node_modules/pdfjs-dist/web/pdf_viewer.js"></script>
```

Make sure your systemjs.config has the following configuration:

https://github.com/Alfresco/app-dev-framework/blob/master/ng2-components/ng2-alfresco-viewer/demo/systemjs.config.js

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
`urlFile`         | *string*    |        |  Url where to load the file | mandatory
`fileName`         | *string*    | Parsed from `urlFile` |  Name of the file to display in the title bar. If not specified will take the last part of the URL |
`overlayMode`         | *boolean*    | `false`        | if true Show the Viewer full page over the present content |
`showViewer`         | *boolean*    | `true`        | Hide or show the viewer |
`mimeType`         | *string*    | `true`        | MimeType of the file, used to detect if the browser can display the content. If not supplied the component will attempt to guess based on file extension of the `urlFile` |

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
