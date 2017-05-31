// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs';

// hammerjs
import 'hammerjs';

// Alfresco
import 'alfresco-js-api';
import 'ng2-alfresco-viewer';

// Google Material Design Lite
import 'material-design-lite/material.js';
import 'material-design-lite/dist/material.orange-blue.min.css';
import 'material-design-icons/iconfont/material-icons.css';

// Polyfill(s) for dialogs
require('script-loader!dialog-polyfill/dialog-polyfill');
import 'dialog-polyfill/dialog-polyfill.css';

require('pdfjs-dist/web/compatibility.js');

// Setting worker path to worker bundle.
let pdfjsLib = require('pdfjs-dist');
if (process.env.ENV === 'production') {
    pdfjsLib.PDFJS.workerSrc = './pdf.worker.js';
} else {
    pdfjsLib.PDFJS.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
}

require('pdfjs-dist/web/pdf_viewer.js');
