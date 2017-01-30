/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var Rx_1 = require("rxjs/Rx");
var alfresco_search_component_1 = require("./alfresco-search.component");
var alfresco_thumbnail_service_1 = require("./../services/alfresco-thumbnail.service");
var translation_service_mock_1 = require("./../assets/translation.service.mock");
var alfresco_search_service_1 = require("../services/alfresco-search.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('AlfrescoSearchComponent', function () {
    var fixture, element;
    var component;
    var result = {
        list: {
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyDoc',
                        isFile: true,
                        content: {
                            mimeType: 'text/plain'
                        },
                        createdByUser: {
                            displayName: 'John Doe'
                        },
                        modifiedByUser: {
                            displayName: 'John Doe'
                        }
                    }
                }
            ]
        }
    };
    var folderResult = {
        list: {
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyFolder',
                        isFile: false,
                        isFolder: true,
                        createdByUser: {
                            displayName: 'John Doe'
                        },
                        modifiedByUser: {
                            displayName: 'John Doe'
                        }
                    }
                }
            ]
        }
    };
    var noResult = {
        list: {
            entries: []
        }
    };
    var errorJson = {
        error: {
            errorKey: 'Search failed',
            statusCode: 400,
            briefSummary: '08220082 search failed',
            stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
            descriptionURL: 'https://api-explorer.alfresco.com'
        }
    };
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [alfresco_search_component_1.AlfrescoSearchComponent],
            providers: [
                alfresco_search_service_1.AlfrescoSearchService,
                { provide: ng2_alfresco_core_1.AlfrescoTranslationService, useClass: translation_service_mock_1.TranslationMock },
                alfresco_thumbnail_service_1.AlfrescoThumbnailService,
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoApiService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoContentService,
                ng2_alfresco_core_1.StorageService
            ]
        }).compileComponents().then(function () {
            fixture = testing_1.TestBed.createComponent(alfresco_search_component_1.AlfrescoSearchComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));
    it('should not have a search term by default', function () {
        var search = new alfresco_search_component_1.AlfrescoSearchComponent(null, null, null, null);
        expect(search).toBeDefined();
        expect(search.searchTerm).toBe('');
    });
    it('should take the provided search term from query param provided via RouteParams', function () {
        var injector = core_1.ReflectiveInjector.resolveAndCreate([
            { provide: router_1.ActivatedRoute, useValue: { params: Rx_1.Observable.from([{ q: 'exampleTerm692' }]) } }
        ]);
        var search = new alfresco_search_component_1.AlfrescoSearchComponent(null, null, null, injector.get(router_1.ActivatedRoute));
        search.ngOnInit();
        expect(search.searchTerm).toBe('exampleTerm692');
    });
    it('should have a null search term if no query param provided via RouteParams', function () {
        var injector = core_1.ReflectiveInjector.resolveAndCreate([
            alfresco_search_service_1.AlfrescoSearchService,
            ng2_alfresco_core_1.AlfrescoAuthenticationService,
            ng2_alfresco_core_1.AlfrescoSettingsService,
            ng2_alfresco_core_1.AlfrescoApiService,
            ng2_alfresco_core_1.StorageService,
            { provide: router_1.ActivatedRoute, useValue: { params: Rx_1.Observable.from([{}]) } }
        ]);
        var search = new alfresco_search_component_1.AlfrescoSearchComponent(injector.get(alfresco_search_service_1.AlfrescoSearchService), null, null, injector.get(router_1.ActivatedRoute));
        search.ngOnInit();
        expect(search.searchTerm).toBeNull();
    });
    it('should setup i18n folder', function () {
        var translationService = fixture.debugElement.injector.get(ng2_alfresco_core_1.AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');
        fixture.detectChanges();
        expect(translationService.addTranslationFolder).toHaveBeenCalledWith('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
    });
    describe('Search results', function () {
        it('should call search service with the correct parameters', function (done) {
            var searchTerm = 'searchTerm63688', options = {
                include: ['path'],
                rootNodeId: '-my-',
                nodeType: 'my:type',
                maxItems: 20,
                orderBy: null
            };
            component.searchTerm = searchTerm;
            component.rootNodeId = '-my-';
            component.resultType = 'my:type';
            var searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));
            fixture.detectChanges();
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise).toHaveBeenCalledWith(searchTerm, options);
                done();
            });
        });
        it('should display search results when a search term is provided', function (done) {
            var searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise).toHaveBeenCalled();
                expect(element.querySelector('#result_user_0')).not.toBeNull();
                expect(element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect(element.querySelector('#result_name_0').innerHTML).toBe('MyDoc');
                done();
            });
            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });
        it('should display no result if no result are returned', function (done) {
            var searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(noResult));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(element.querySelector('#search_no_result')).not.toBeNull();
                done();
            });
            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });
        it('should display an error if an error is encountered running the search', function (done) {
            var searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.reject(errorJson));
            component.resultsLoad.subscribe(function () { }, function () {
                fixture.detectChanges();
                var resultsEl = element.querySelector('[data-automation-id="search_result_table"]');
                var errorEl = element.querySelector('[data-automation-id="search_error_message"]');
                expect(resultsEl).toBeNull();
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText).toBe('SEARCH.RESULTS.ERROR');
                done();
            });
            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });
        it('should update search results when the search term input is changed', function (done) {
            var searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise.calls.mostRecent().args[0]).toBe('searchTerm2');
                expect(element.querySelector('#result_user_0')).not.toBeNull();
                expect(element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect(element.querySelector('#result_name_0').innerHTML).toBe('MyDoc');
                done();
            });
            component.ngOnChanges({ searchTerm: new core_1.SimpleChange('', 'searchTerm2') });
        });
    });
    describe('search result interactions', function () {
        var debugElement;
        var searchService;
        var querySpy;
        var emitSpy;
        var rowSelector = '[data-automation-id="search_result_table"] tbody tr';
        beforeEach(function () {
            debugElement = fixture.debugElement;
            searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            querySpy = spyOn(searchService, 'getQueryNodesPromise').and.returnValue(Promise.resolve(result));
            emitSpy = spyOn(component.navigate, 'emit');
        });
        describe('click results', function () {
            beforeEach(function () {
                component.navigationMode = alfresco_search_component_1.AlfrescoSearchComponent.SINGLE_CLICK_NAVIGATION;
            });
            it('should emit navigation event when file item clicked', function (done) {
                component.resultsLoad.subscribe(function () {
                    fixture.detectChanges();
                    debugElement.query(platform_browser_1.By.css(rowSelector)).triggerEventHandler('click', {});
                    expect(emitSpy).toHaveBeenCalled();
                    done();
                });
                component.searchTerm = 'searchTerm';
                component.ngOnInit();
            });
            it('should emit navigation event when non-file item is clicked', function (done) {
                querySpy.and.returnValue(Promise.resolve(folderResult));
                component.resultsLoad.subscribe(function () {
                    fixture.detectChanges();
                    debugElement.query(platform_browser_1.By.css(rowSelector)).triggerEventHandler('click', {});
                    expect(emitSpy).toHaveBeenCalled();
                    done();
                });
                component.searchTerm = 'searchTerm';
                component.ngOnInit();
            });
        });
        describe('double click results', function () {
            beforeEach(function () {
                component.navigationMode = alfresco_search_component_1.AlfrescoSearchComponent.DOUBLE_CLICK_NAVIGATION;
            });
            it('should emit navigation event when file item clicked', function (done) {
                component.resultsLoad.subscribe(function () {
                    fixture.detectChanges();
                    debugElement.query(platform_browser_1.By.css(rowSelector)).triggerEventHandler('dblclick', {});
                    expect(emitSpy).toHaveBeenCalled();
                    done();
                });
                component.searchTerm = 'searchTerm';
                component.ngOnInit();
            });
            it('should emit navigation event when non-file item is clicked', function (done) {
                querySpy.and.returnValue(Promise.resolve(folderResult));
                component.resultsLoad.subscribe(function () {
                    fixture.detectChanges();
                    debugElement.query(platform_browser_1.By.css(rowSelector)).triggerEventHandler('dblclick', {});
                    expect(emitSpy).toHaveBeenCalled();
                    done();
                });
                component.searchTerm = 'searchTerm';
                component.ngOnInit();
            });
        });
    });
});
//# sourceMappingURL=alfresco-search.component.spec.js.map