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
const CoreModule = require('@alfresco/core').CoreModule;
const AppConfigService = require('@alfresco/core').AppConfigService;
const AppConfigServiceMock = require('@alfresco/core').AppConfigServiceMock;
const TranslationService = require('@alfresco/core').TranslationService;
const TranslationMock = require('@alfresco/core').TranslationMock;

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

patchTestBedToDestroyFixturesAfterEveryTest(TestBed);

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [CoreModule],
        providers: [
            {provide: AppConfigService, useClass: AppConfigServiceMock},
            {provide: TranslationService, useClass: TranslationMock}
        ]
    });
});

afterEach(() => {
    TestBed.resetTestingModule();
});

function patchTestBedToDestroyFixturesAfterEveryTest(testBed) {
    // Original resetTestingModule function of the TestBed.
    var _resetTestingModule = testBed.resetTestingModule;

    // Monkey-patch the resetTestingModule to destroy fixtures outside of a try/catch block.
    // With https://github.com/angular/angular/commit/2c5a67134198a090a24f6671dcdb7b102fea6eba
    // errors when destroying components are no longer causing Jasmine to fail.
    testBed.resetTestingModule = function() {
        try {
            if(this._activeFixtures) {
                this._activeFixtures.forEach(function (fixture) {
                    fixture.destroy();
                });
            }
        } finally {
            this._activeFixtures = [];
            // Regardless of errors or not, run the original reset testing module function.
            _resetTestingModule.call(this);
        }
    };
};
