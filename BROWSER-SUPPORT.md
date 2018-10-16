# Browser Support

This page gives a guide to Browser support and polyfills.

Browser compatibility and support depends on targeted browsers and 3rd party libraries. ADF is based on the following libraries and components:

- Angular (all ADF components)
- Moment.js (many ADF components)
- PDF.js (`ng2-alfresco-viewer` component)
- Raphael.js (`ng2-alfresco-diagrams`, `ng2-alfresco-analytics`)
- Chart.js (`ng2-alfresco-analytics`)

## Browser polyfills 

### Angular

Please refer to the [official guide](https://angular.io/docs/ts/latest/guide/browser-support.html) for Angular browser support. 

ADF (demo shell) imports by default the following set of recommended polyfills:

- [core-js](https://www.npmjs.com/package/core-js) (ES6 standard support)

### 3rd party libraries

Please refer to the following list of [popular polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) for HTML5 cross-browser compatibility.

ADF (demo shell) imports by default the following set of recommended polyfills:

- [intl](https://www.npmjs.com/package/intl), Polyfill the ECMA-402 Intl API (except collation), **IE**/**Safari**
- [pdfjs compatibility](https://www.npmjs.com/package/pdfjs-dist), Portable Document Format (PDF) library that is built with HTML5, **IE**

## Example

```html

<!-- Polyfill(s) for Safari (pre-10.x) -->
<script src="node_modules/intl/dist/Intl.min.js"></script>
<script src="node_modules/intl/locale-data/jsonp/en.js"></script>

<!-- Polyfill(s) for older browsers -->
<script src="node_modules/core-js/client/shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js"></script>
<script src="node_modules/element.scrollintoviewifneeded-polyfill/index.js"></script>

<!-- Polyfill(s) for pdf support -->
<script src="node_modules/pdfjs-dist/web/compatibility.js"></script>

<!-- Polyfill(s) for dialogs -->
<script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
<link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
```

See the [demo shell](demo-shell/index.html) example project for
further information and source code.
