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

const ServicesModule = require('./services/service.module').ServiceModule;
const DirectiveModule = require('./directives/directive.module').DirectiveModule;
const ContextMenuModule = require('./context-menu/context-menu.module').ContextMenuModule;
const PipeModule = require('./pipes/pipe.module').PipeModule;
const AppConfigModule = require('./app-config/app-config.module').AppConfigModule;
const LogService = require('./services/log.service').LogService;
const TranslateLoaderService = require('./services/translate-loader.service').TranslateLoaderService;
const AppConfigService = require('@alfresco/core').AppConfigService;
const AppConfigServiceMock = require('@alfresco/core').AppConfigServiceMock;

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
        ],
        providers: [
            {provide: AppConfigService, useClass: AppConfigServiceMock}
        ]});
});

afterEach(() => {
    TestBed.resetTestingModule();
});


