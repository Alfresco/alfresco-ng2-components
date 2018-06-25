Error.stackTraceLimit = Infinity;

require('../../node_modules/core-js/es6');
require('../../node_modules/core-js/es7/reflect');

require('../../node_modules/zone.js/dist/zone');
require('../../node_modules/zone.js/dist/long-stack-trace-zone');
require('../../node_modules/zone.js/dist/proxy');
require('../../node_modules/zone.js/dist/sync-test');
require('../../node_modules/zone.js/dist/jasmine-patch');
require('../../node_modules/zone.js/dist/async-test');
require('../../node_modules/zone.js/dist/fake-async-test');

const pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = 'base/node_modules/pdfjs-dist/build/pdf.worker.js';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

var appContext = require.context(".", true, /.spec.ts/);
appContext.keys().forEach(appContext);

const TestBed = require('@angular/core/testing').TestBed;
const browser = require('@angular/platform-browser-dynamic/testing');

TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);
