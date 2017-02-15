// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs';

// Alfresco
import 'ng2-alfresco-core';
import 'ng2-alfresco-datatable';
import 'ng2-activiti-diagrams';
import 'ng2-activiti-analytics';
import 'ng2-activiti-form';
import 'ng2-activiti-processlist';
import 'ng2-activiti-tasklist';
import 'ng2-alfresco-documentlist';
import 'ng2-alfresco-login';
import 'ng2-alfresco-search';
import 'ng2-alfresco-tag';
import 'ng2-alfresco-upload';
import 'ng2-alfresco-viewer';
import 'ng2-alfresco-webscript';
import 'ng2-alfresco-userinfo';

// Polyfill(s) for dialogs
require('script-loader!dialog-polyfill/dialog-polyfill');
import 'dialog-polyfill/dialog-polyfill.css';

// Flags
import 'flag-icon-css/css/flag-icon.min.css';

// @angular/material theme
import '@angular/material/core/theming/prebuilt/deeppurple-amber.css';

// Google Material Design Lite
import 'material-design-lite/material.js';
import 'material-design-lite/dist/material.orange-blue.min.css';
import 'material-design-icons/iconfont/material-icons.css';

import 'ng2-activiti-form/dist/resources/stencils/runtime.ng1';
import 'ng2-activiti-form/dist/resources/stencils/runtime.adf';

import 'chart.js';
require('script-loader!raphael/raphael.min.js');
require('script-loader!moment/min/moment.min.js');

import 'md-date-time-picker/dist/css/mdDateTimePicker.css';
require('script-loader!md-date-time-picker/dist/js/mdDateTimePicker.min.js');
require('script-loader!md-date-time-picker/dist/js/draggabilly.pkgd.min.js');

// PDFJS
require('pdfjs-dist/web/compatibility.js');
let pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = './pdf.worker.js';
require('pdfjs-dist/web/pdf_viewer.js');

import '../public/css/app.css';
import '../public/css/muli-font.css';
