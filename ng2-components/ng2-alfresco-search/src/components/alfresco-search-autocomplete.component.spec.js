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
var testing_1 = require("@angular/core/testing");
var alfresco_search_autocomplete_component_1 = require("./alfresco-search-autocomplete.component");
var alfresco_thumbnail_service_1 = require("./../services/alfresco-thumbnail.service");
var translation_service_mock_1 = require("./../assets/translation.service.mock");
var alfresco_search_component_mock_1 = require("./../assets/alfresco-search.component.mock");
var alfresco_search_service_1 = require("../services/alfresco-search.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('AlfrescoSearchAutocompleteComponent', function () {
    var fixture, element;
    var component;
    var updateSearchTerm = function (newSearchTerm) {
        var oldSearchTerm = component.searchTerm;
        component.searchTerm = newSearchTerm;
        component.ngOnChanges({ searchTerm: { currentValue: newSearchTerm, previousValue: oldSearchTerm } });
    };
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent],
            providers: [
                { provide: ng2_alfresco_core_1.AlfrescoTranslationService, useClass: translation_service_mock_1.TranslationMock },
                alfresco_thumbnail_service_1.AlfrescoThumbnailService,
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoApiService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoContentService,
                alfresco_search_service_1.AlfrescoSearchService
            ]
        }).compileComponents().then(function () {
            fixture = testing_1.TestBed.createComponent(alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));
    it('should setup i18n folder', function () {
        var translationService = fixture.debugElement.injector.get(ng2_alfresco_core_1.AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');
        fixture.detectChanges();
        expect(translationService.addTranslationFolder).toHaveBeenCalledWith('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
    });
    describe('search results', function () {
        var searchService;
        beforeEach(function () {
            searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
        });
        it('should clear results straight away when a new search term is entered', testing_1.async(function () {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.result));
            component.searchTerm = 'searchTerm';
            component.ngOnChanges({ searchTerm: { currentValue: 'searchTerm', previousValue: '' } });
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                component.searchTerm = 'searchTerm2';
                component.ngOnChanges({ searchTerm: { currentValue: 'searchTerm2', previousValue: 'searchTerm' } });
                fixture.detectChanges();
                expect(element.querySelectorAll('table[data-automation-id="autocomplete_results"] tbody tr').length).toBe(0);
            });
        }));
        it('should display the returned search results', function (done) {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.result));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect(element.querySelector('#result_name_0').innerHTML).toBe('<b _ngcontent-a-1="">MyDoc</b>');
                done();
            });
            updateSearchTerm('searchTerm');
        });
        it('should limit the number of returned search results to the configured maximum', function (done) {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.results));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(element.querySelectorAll('table[data-automation-id="autocomplete_results"] tbody tr').length).toBe(2);
                done();
            });
            component.maxResults = 2;
            updateSearchTerm('searchTerm');
        });
        it('should display the correct thumbnail for result items', function (done) {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.result));
            var thumbnailService = fixture.debugElement.injector.get(alfresco_thumbnail_service_1.AlfrescoThumbnailService);
            spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue('fake-type-icon.svg');
            spyOn(thumbnailService, 'getMimeTypeKey').and.returnValue('FAKE_TYPE');
            var path = 'http://localhost/fake-type-icon.svg';
            spyOn(component, 'resolveIconPath').and.returnValue(path);
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                var imgEl = element.querySelector('#result_row_0 img');
                expect(imgEl).not.toBeNull();
                expect(imgEl.src).toBe(path);
                expect(imgEl.alt).toBe('SEARCH.ICONS.FAKE_TYPE');
                done();
            });
            updateSearchTerm('searchTerm');
        });
        it('should display no result if no result are returned', function (done) {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.noResult));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                expect(element.querySelector('#search_no_result')).not.toBeNull();
                done();
            });
            updateSearchTerm('searchTerm');
        });
    });
    describe('errors', function () {
        var searchService;
        beforeEach(function () {
            searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.reject(alfresco_search_component_mock_1.errorJson));
        });
        it('should display an error if an error is encountered running the search', function (done) {
            component.resultsLoad.subscribe(function () { }, function () {
                fixture.detectChanges();
                var resultsEl = element.querySelector('[data-automation-id="autocomplete_results"]');
                var errorEl = element.querySelector('[data-automation-id="autocomplete_error_message"]');
                expect(resultsEl).toBeNull();
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText.trim()).toBe('SEARCH.RESULTS.ERROR');
                done();
            });
            updateSearchTerm('searchTerm');
        });
        it('should clear errors straight away when a new search is performed', testing_1.async(function () {
            updateSearchTerm('searchTerm');
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                component.searchTerm = 'searchTerm2';
                component.ngOnChanges({ searchTerm: { currentValue: 'searchTerm2', previousValue: 'searchTerm' } });
                fixture.detectChanges();
                var errorEl = element.querySelector('[data-automation-id="autocomplete_error_message"]');
                expect(errorEl).toBeNull();
            });
        }));
    });
    describe('mouse interactions', function () {
        var searchService;
        beforeEach(function () {
            searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
        });
        it('should emit fileSelect event when file item clicked', function (done) {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.result));
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                element.querySelector('#result_row_0').click();
            });
            updateSearchTerm('searchTerm');
            component.fileSelect.subscribe(function () {
                done();
            });
        });
        it('should emit fileSelect event if when folder item clicked', function (done) {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.folderResult));
            spyOn(component.fileSelect, 'emit');
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                element.querySelector('#result_row_0').click();
                expect(component.fileSelect.emit).toHaveBeenCalled();
                done();
            });
            updateSearchTerm('searchTerm');
        });
    });
    describe('keyboard interactions', function () {
        var searchService;
        beforeEach(function () {
            searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.results));
        });
        it('should emit file select when enter key pressed when a file item is in focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                element.querySelector('#result_row_0').dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Enter'
                }));
            });
            updateSearchTerm('searchTerm');
            component.fileSelect.subscribe(function () {
                done();
            });
        });
        it('should emit cancel event when escape key pressed when a result is in focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                element.querySelector('#result_row_0').dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Escape'
                }));
            });
            updateSearchTerm('searchTerm');
            component.cancel.subscribe(function () {
                done();
            });
        });
        it('should focus the next result when down arrow key pressed when a result is in focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                var firstResult = element.querySelector('#result_row_0');
                var secondResult = element.querySelector('#result_row_1');
                spyOn(secondResult, 'focus');
                firstResult.focus();
                firstResult.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowDown'
                }));
                expect(secondResult.focus).toHaveBeenCalled();
                done();
            });
            updateSearchTerm('searchTerm');
        });
        it('should do nothing when down arrow key pressed when the last result is in focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                var lastResult = element.querySelector('#result_row_2');
                lastResult.focus();
                lastResult.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowDown'
                }));
                done();
            });
            updateSearchTerm('searchTerm');
        });
        it('should focus the previous result when up arrow key pressed when a result is in focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                var firstResult = element.querySelector('#result_row_0');
                var secondResult = element.querySelector('#result_row_1');
                spyOn(firstResult, 'focus');
                secondResult.focus();
                secondResult.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowUp'
                }));
                expect(firstResult.focus).toHaveBeenCalled();
                done();
            });
            updateSearchTerm('searchTerm');
        });
        it('should emit scroll back event when up arrow key pressed and the first result is in focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                var firstResult = element.querySelector('#result_row_0');
                firstResult.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowUp'
                }));
            });
            component.scrollBack.subscribe(function () {
                done();
            });
            updateSearchTerm('searchTerm');
        });
    });
    describe('changing focus', function () {
        var searchService;
        beforeEach(function () {
            searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.result));
        });
        it('should emit a focus event when a result comes into focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                element.querySelector('#result_row_0').dispatchEvent(new FocusEvent('focus'));
            });
            updateSearchTerm('searchTerm');
            component.searchFocus.subscribe(function (e) {
                expect(e).not.toBeNull();
                expect(e.type).toBe('focus');
                done();
            });
        });
        it('should emit a focus event when a result loses focus', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                element.querySelector('#result_row_0').dispatchEvent(new FocusEvent('blur'));
            });
            updateSearchTerm('searchTerm');
            component.searchFocus.subscribe(function (e) {
                expect(e).not.toBeNull();
                expect(e.type).toBe('blur');
                done();
            });
        });
        it('should give focus to the first result when focusResult() is called externally', function (done) {
            component.resultsLoad.subscribe(function () {
                fixture.detectChanges();
                var firstResult = element.querySelector('#result_row_0');
                spyOn(firstResult, 'focus');
                component.focusResult();
                expect(firstResult.focus).toHaveBeenCalled();
                done();
            });
            updateSearchTerm('searchTerm');
        });
    });
});
//# sourceMappingURL=alfresco-search-autocomplete.component.spec.js.map