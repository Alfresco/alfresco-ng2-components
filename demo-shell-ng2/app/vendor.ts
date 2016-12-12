// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...

// Google Material Design Lite
import '../public/css/material.orange-blue.min.css';
import 'material-design-lite/material.min';
import 'material-design-icons/iconfont/material-icons.css';

// Flags
import 'flag-icon-css/css/flag-icon.min.css';

// Polyfill(s) for dialogs
import 'dialog-polyfill/dialog-polyfill';
import 'dialog-polyfill/dialog-polyfill.css';

// app content
import '../public/css/app.css';
import '../public/css/muli-font.css';

import 'ng2-activiti-form/stencils/runtime.ng1';
import 'ng2-activiti-form/stencils/runtime.adf';

require('script!../public/js/Polyline.js');
import 'chart.js';

require('script!moment/min/moment.min.js');

import 'md-date-time-picker/dist/css/mdDateTimePicker.css';
// import 'md-date-time-picker/dist/js/mdDateTimePicker.min.js';
require('script!md-date-time-picker/dist/js/mdDateTimePicker.min.js');
require('script!md-date-time-picker/dist/js/draggabilly.pkgd.min.js');
require('script!element.scrollintoviewifneeded-polyfill/index.js');

require('pdfjs-dist/web/compatibility.js');

let pdfjsLib = require('pdfjs-dist');

// Setting worker path to worker bundle.
if (process.env.ENV === 'production') {
  pdfjsLib.PDFJS.workerSrc = '../../dist/pdf.worker.js';
} else {
  pdfjsLib.PDFJS.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
}

require('pdfjs-dist/web/pdf_viewer.js');
