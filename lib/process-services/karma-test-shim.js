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

var appContext = require.context(".", true, /.spec.ts/);
appContext.keys().forEach(appContext);

const TestBed = require('@angular/core/testing').TestBed;
const browser = require('@angular/platform-browser-dynamic/testing');
// const NoopAnimationsModule = require('@angular/platform-browser/animations').NoopAnimationsModule;
// const CoreModule = require('../core').CoreModule;
// const AppConfigService = require('../core').AppConfigService;
// const AppConfigServiceMock = require('../core').AppConfigServiceMock;
// const TranslationService = require('../core').TranslationService;
// const TranslationMock = require('../core').TranslationMock;
// const TranslateModule = require('@ngx-translate/core').TranslateModule;
// const CommonModule = require('@angular/common').CommonModule;
// const FormsModule = require('@angular/forms').FormsModule;
// const ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;

// const AlfrescoApiServiceMock = require('../core').AlfrescoApiServiceMock;
// const AlfrescoApiService = require('../core').AlfrescoApiService;

// console.log('AlfrescoApiServiceMock' + AlfrescoApiServiceMock);

TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);

/*
beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            TranslateModule,
            CommonModule,
            FormsModule,
            ReactiveFormsModule
        ],
        providers: [
            {provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock},
            {provide: AppConfigService, useClass: AppConfigServiceMock},
            {provide: TranslationService, useClass: TranslationMock}
        ]
    });
});

afterEach(() => {
    TestBed.resetTestingModule();
});
*/
