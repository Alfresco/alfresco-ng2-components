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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

var appContext = require.context(".", true, /\.spec\.ts/);
appContext.keys().forEach(appContext);

const TestBed = require('@angular/core/testing').TestBed;
const browser = require('@angular/platform-browser-dynamic/testing');
const NoopAnimationsModule = require('@angular/platform-browser/animations').NoopAnimationsModule;
const FormsModule = require('@angular/forms').FormsModule;
const ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;
const HttpClient = require('@angular/common/http').HttpClient;
const HttpClientModule = require('@angular/common/http').HttpClientModule;
const TranslateModule = require('@ngx-translate/core').TranslateModule;
const TranslateLoader = require('@ngx-translate/core').TranslateLoader;

const ServicesModule = require('@alfresco/core').ServiceModule;
const DirectiveModule = require('@alfresco/core').DirectiveModule;
const ContextMenuModule = require('@alfresco/core').ContextMenuModule;
const PipeModule = require('@alfresco/core').PipeModule;
const AppConfigModule = require('@alfresco/core').AppConfigModule;
const LogService = require('@alfresco/core').LogService;
const TranslateLoaderService = require('@alfresco/core').TranslateLoaderService;

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

export function createTranslateLoader(http, logService) {
    return new TranslateLoaderService(http, logService);
}

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            ServicesModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient, LogService]
                }
            }),
            DirectiveModule,
            ContextMenuModule,
            PipeModule,
            AppConfigModule,
            NoopAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            HttpClientModule
        ]});
});

afterEach(() => {
    TestBed.resetTestingModule();
});


