# &lt;ng2-alfresco-viewer&gt;
[![NPM version][npm-image]][npm-url] 
[![Build Status][travis-image]][travis-url] 
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coveralls-image]][coveralls-url]
[![Style guide][style-image]][style-url]          
[![Alfresco component][alfrescocomponent-image]][alfrescocomponent-url]          
                  
## About ng2-alfresco-viewer
> Alfresco documents viewer

## Installation

```bash
npm set registry http://devproducts.alfresco.me:4873
npm install ng2-alfresco-viewer --save
```

#### Basic usage

```html
<ng2-alfresco-viewer [urlFile]="'filename.pdf'"></ng2-alfresco-viewer>
```

#### Dependencies

Add the following dependency to your index.html:

```html
    <script src="node_modules/pdfjs-dist/build/pdf.js"></script>
    <script src="node_modules/pdfjs-dist/build/pdf.worker.js"></script>
    <script src="node_modules/pdfjs-dist/web/pdf_viewer.js"></script>
```

Make sure your systemjs.config has the following configuration:

```javascript
    System.config({
                defaultJSExtensions: true,
                map: {
                    'ng2-alfresco-viewer': 'node_modules/ng2-alfresco-viewer',
                    'rxjs': 'node_modules/rxjs',
                    'angular2': 'node_modules/angular2',
                    'app': 'dist/main'
                },
                packages: {
                    'src': {
                        defaultExtension: 'js'
                    },
                    'ng2-alfresco-viewer': {
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

#### Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`foo`         | *string*    | `bar`        | Lorem ipsum dolor.


Method        | Parameters   | Returns     | Description
---           | ---          | ---         | ---
`methodName()`   | None.        | void    | Lorem ipsum dolor.

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
