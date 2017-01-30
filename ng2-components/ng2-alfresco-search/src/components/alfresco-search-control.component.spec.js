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
var alfresco_search_control_component_1 = require("./alfresco-search-control.component");
var alfresco_search_autocomplete_component_1 = require("./alfresco-search-autocomplete.component");
var alfresco_thumbnail_service_1 = require("./../services/alfresco-thumbnail.service");
var translation_service_mock_1 = require("./../assets/translation.service.mock");
var alfresco_search_component_mock_1 = require("./../assets/alfresco-search.component.mock");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var alfresco_search_service_1 = require("../services/alfresco-search.service");
describe('AlfrescoSearchControlComponent', function () {
    var fixture;
    var component, element;
    var componentHandler;
    beforeEach(testing_1.async(function () {
        componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
        window['componentHandler'] = componentHandler;
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [
                alfresco_search_control_component_1.AlfrescoSearchControlComponent,
                alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent
            ],
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
            fixture = testing_1.TestBed.createComponent(alfresco_search_control_component_1.AlfrescoSearchControlComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));
    it('should setup i18n folder', function () {
        var translationService = fixture.debugElement.injector.get(ng2_alfresco_core_1.AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');
        fixture.detectChanges();
        expect(translationService.addTranslationFolder)
            .toHaveBeenCalledWith('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
    });
    it('should emit searchChange when search term input changed', function (done) {
        fixture.componentInstance.searchChange.subscribe(function (e) {
            expect(e.value).toBe('customSearchTerm');
            done();
        });
        fixture.detectChanges();
        fixture.componentInstance.searchTerm = 'customSearchTerm';
        fixture.detectChanges();
    });
    it('should emit searchChange when search term changed by user', function (done) {
        fixture.detectChanges();
        fixture.componentInstance.searchChange.subscribe(function (e) {
            expect(e.value).toBe('customSearchTerm211');
            done();
        });
        component.searchControl.setValue('customSearchTerm211', true);
        fixture.detectChanges();
    });
    describe('Component rendering', function () {
        it('should display a text input field by default', function () {
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
        });
        it('should display a search input field when specified', function () {
            fixture.componentInstance.inputType = 'search';
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        });
        it('should set browser autocomplete to off by default', function () {
            fixture.detectChanges();
            var attr = element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete');
            expect(attr).toBe('off');
        });
        it('should set browser autocomplete to on when configured', function () {
            fixture.componentInstance.autocomplete = true;
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete')).toBe('on');
        });
        it('should show an expanding control by default', function () {
            fixture.detectChanges();
            expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(1);
            expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(1);
            expect(element.querySelectorAll('label.mdl-button--icon').length).toBe(1);
        });
        it('should show a normal non-expanding control when configured', function () {
            fixture.detectChanges();
            fixture.componentInstance.expandable = false;
            fixture.detectChanges();
            expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(0);
            expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(0);
            expect(element.querySelectorAll('label.mdl-button--icon').length).toBe(0);
        });
    });
    describe('Find as you type', function () {
        var inputEl;
        beforeEach(function () {
            inputEl = element.querySelector('input');
        });
        it('should display a find-as-you-type control by default', function () {
            fixture.detectChanges();
            var autocomplete = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete).not.toBeNull();
        });
        it('should make find-as-you-type control hidden initially', function () {
            fixture.detectChanges();
            var autocomplete = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete.classList.contains('active')).toBe(false);
        });
        it('should make find-as-you-type control visible when search box has focus', function (done) {
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            window.setTimeout(function () {
                fixture.detectChanges();
                var autocomplete = element.querySelector('alfresco-search-autocomplete');
                expect(autocomplete.classList.contains('active')).toBe(true);
                done();
            }, 100);
        });
        it('should hide find-as-you-type results when the search box loses focus', function (done) {
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            inputEl.dispatchEvent(new FocusEvent('blur'));
            window.setTimeout(function () {
                fixture.detectChanges();
                var autocomplete = element.querySelector('alfresco-search-autocomplete');
                expect(autocomplete.classList.contains('active')).toBe(false);
                done();
            }, 100);
        });
        it('should keep find-as-you-type control visible when user tabs into results', function (done) {
            var searchService = fixture.debugElement.injector.get(alfresco_search_service_1.AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(alfresco_search_component_mock_1.result));
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('blur'));
            component.onAutoCompleteFocus(new FocusEvent('focus'));
            window.setTimeout(function () {
                fixture.detectChanges();
                var autocomplete = element.querySelector('alfresco-search-autocomplete');
                expect(autocomplete.classList.contains('active')).toBe(true);
                done();
            }, 100);
        });
        it('should hide find-as-you-type results when escape key pressed', function () {
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Escape'
            }));
            fixture.detectChanges();
            var autocomplete = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete.classList.contains('active')).toBe(false);
        });
        it('should make find-as-you-type control visible again when down arrow is pressed', function () {
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Escape'
            }));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'ArrowDown'
            }));
            fixture.detectChanges();
            var autocomplete = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete.classList.contains('active')).toBe(true);
        });
        it('should select the first result in find-as-you-type when down arrow is pressed and FAYT is visible', function (done) {
            fixture.detectChanges();
            spyOn(component.liveSearchComponent, 'focusResult');
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            window.setTimeout(function () {
                fixture.detectChanges();
                inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowDown'
                }));
                fixture.detectChanges();
                expect(component.liveSearchComponent.focusResult).toHaveBeenCalled();
                done();
            }, 100);
        });
        it('should focus input element when find-as-you-type returns control', function () {
            fixture.detectChanges();
            spyOn(inputEl, 'focus');
            fixture.detectChanges();
            component.onAutoCompleteReturn(new KeyboardEvent('keyup', {
                key: 'ArrowUp'
            }));
            expect(inputEl.focus).toHaveBeenCalled();
        });
        it('should focus input element when find-as-you-type is cancelled', function () {
            fixture.detectChanges();
            spyOn(inputEl, 'focus');
            fixture.detectChanges();
            component.onAutoCompleteCancel(new KeyboardEvent('keyup', {
                key: 'ArrowUp'
            }));
            expect(inputEl.focus).toHaveBeenCalled();
        });
        it('should NOT display a find-as-you-type control when configured not to', function () {
            fixture.componentInstance.liveSearchEnabled = false;
            fixture.detectChanges();
            var autocomplete = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete).toBeNull();
        });
    });
    describe('search submit', function () {
        it('should fire a search when a term has been entered', function () {
            spyOn(component.searchSubmit, 'emit');
            fixture.detectChanges();
            var formEl = element.querySelector('form');
            component.searchTerm = 'searchTerm1';
            component.searchControl.setValue('searchTerm1', true);
            fixture.detectChanges();
            formEl.dispatchEvent(new Event('submit'));
            fixture.detectChanges();
            expect(component.searchSubmit.emit).toHaveBeenCalledWith({
                'value': 'searchTerm1'
            });
        });
        it('should not fire a search when no term has been entered', function () {
            spyOn(component.searchSubmit, 'emit');
            fixture.detectChanges();
            var inputEl = element.querySelector('input[type="text"]');
            var formEl = element.querySelector('form');
            inputEl.value = '';
            formEl.dispatchEvent(new Event('submit'));
            fixture.detectChanges();
            expect(component.searchSubmit.emit).not.toHaveBeenCalled();
        });
    });
    describe('component focus', function () {
        it('should fire an event when the search box receives focus', function (done) {
            spyOn(component.expand, 'emit');
            var inputEl = element.querySelector('input');
            inputEl.dispatchEvent(new FocusEvent('focus'));
            window.setTimeout(function () {
                expect(component.expand.emit).toHaveBeenCalledWith({
                    expanded: true
                });
                done();
            }, 100);
        });
        it('should fire an event when the search box loses focus', function (done) {
            spyOn(component.expand, 'emit');
            var inputEl = element.querySelector('input');
            inputEl.dispatchEvent(new FocusEvent('blur'));
            window.setTimeout(function () {
                expect(component.expand.emit).toHaveBeenCalledWith({
                    expanded: false
                });
                done();
            }, 100);
        });
        it('should NOT fire an event when the search box receives/loses focus but the component is not expandable', function (done) {
            spyOn(component.expand, 'emit');
            component.expandable = false;
            var inputEl = element.querySelector('input');
            inputEl.dispatchEvent(new FocusEvent('focus'));
            inputEl.dispatchEvent(new FocusEvent('blur'));
            window.setTimeout(function () {
                expect(component.expand.emit).not.toHaveBeenCalled();
                done();
            }, 100);
        });
    });
    describe('file preview', function () {
        it('should emit a file select event when onFileClicked is called', function () {
            spyOn(component.fileSelect, 'emit');
            component.onFileClicked({
                value: 'node12345'
            });
            expect(component.fileSelect.emit).toHaveBeenCalledWith({
                'value': 'node12345'
            });
        });
        it('should set deactivate the search after file/folder is clicked', function () {
            component.searchActive = true;
            component.onFileClicked({
                value: 'node12345'
            });
            expect(component.searchActive).toBe(false);
        });
        it('should NOT reset the search term after file/folder is clicked', function () {
            component.liveSearchTerm = 'test';
            component.onFileClicked({
                value: 'node12345'
            });
            expect(component.liveSearchTerm).toBe('test');
        });
    });
});
//# sourceMappingURL=alfresco-search-control.component.spec.js.map