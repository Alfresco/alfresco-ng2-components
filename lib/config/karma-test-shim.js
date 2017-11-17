Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

var appContext = require.context(".", true, /.spec.ts/);appContext.keys().forEach(appContext);

const TestBed = require('@angular/core/testing').TestBed;
const browser = require('@angular/platform-browser-dynamic/testing');
const CoreModule = require('@alfresco/adf-core').CoreModule;
const AppConfigService = require('@alfresco/adf-core').AppConfigService;
const AppConfigServiceMock = require('@alfresco/adf-core').AppConfigServiceMock;
const TranslationService = require('@alfresco/adf-core').TranslationService;
const TranslationMock = require('@alfresco/adf-core').TranslationMock;
const TranslateModule = require('@ngx-translate/core').TranslateModule;
const CommonModule = require('@angular/common').CommonModule;
const FormsModule = require('@angular/forms').FormsModule;
const ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [CoreModule, TranslateModule, CommonModule, FormsModule, ReactiveFormsModule],
        providers: [
            {provide: AppConfigService, useClass: AppConfigServiceMock},
            {provide: TranslationService, useClass: TranslationMock}
        ]
    });
});

afterEach(() => {
    TestBed.resetTestingModule();
});
