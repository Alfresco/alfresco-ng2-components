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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThumbnailService } from 'ng2-alfresco-core';
import { AlfrescoTranslationService, CoreModule, SearchService } from 'ng2-alfresco-core';
import { noResult, results } from './../assets/search.component.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { SearchAutocompleteComponent } from './search-autocomplete.component';
import { SearchControlComponent } from './search-control.component';

describe('SearchControlComponent', () => {

    let fixture: ComponentFixture<SearchControlComponent>;
    let component: SearchControlComponent, element: HTMLElement;
    let searchService: SearchService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                SearchControlComponent,
                SearchAutocompleteComponent
            ],
            providers: [
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                ThumbnailService,
                SearchService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchControlComponent);
            searchService = TestBed.get(SearchService);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    it('should emit searchChange when search term input changed', (done) => {
        fixture.componentInstance.searchChange.subscribe(e => {
            expect(e.value).toBe('customSearchTerm');
            done();
        });
        fixture.detectChanges();
        fixture.componentInstance.searchTerm = 'customSearchTerm';
        fixture.detectChanges();
    });

    it('should emit searchChange when search term changed by user', (done) => {
        fixture.detectChanges();
        fixture.componentInstance.searchChange.subscribe(e => {
            expect(e.value).toBe('customSearchTerm211');
            expect(e.valid).toBe(true);
            done();
        });
        component.searchControl.setValue('customSearchTerm211');
        fixture.detectChanges();
    });

    it('should update FAYT search when user inputs a valid term', (done) => {
        fixture.componentInstance.searchChange.subscribe(() => {
            expect(fixture.componentInstance.liveSearchTerm).toBe('customSearchTerm');
            done();
        });
        fixture.detectChanges();
        fixture.componentInstance.searchTerm = 'customSearchTerm';
        fixture.detectChanges();
    });

    it('should NOT update FAYT term when user inputs a search term less than 3 characters', (done) => {
        fixture.componentInstance.searchChange.subscribe(() => {
            expect(fixture.componentInstance.liveSearchTerm).toBe('');
            done();
        });
        fixture.detectChanges();
        fixture.componentInstance.searchTerm = 'cu';
        fixture.detectChanges();
    });

    it('should still fire an event when user inputs a search term less than 3 characters', (done) => {
        fixture.componentInstance.searchChange.subscribe((e) => {
            expect(e.value).toBe('cu');
            expect(e.valid).toBe(false);
            done();
        });
        fixture.detectChanges();
        fixture.componentInstance.searchTerm = 'cu';
        fixture.detectChanges();
    });

    describe('expandable option false', () => {

        beforeEach(() => {
            component.expandable = false;
        });

        afterEach(() => {
            component.expandable = true;
        });

        it('search button should be hide', () => {
            let searchButton: any = element.querySelector('#adf-search-button');
            expect(searchButton).toBe(null);
        });

        it('should not have animation', () => {
            component.ngOnInit();
            expect(component.subscriptAnimationState).toBe('no-animation');
        });
    });

    describe('component rendering', () => {

        it('should display a text input field by default', () => {
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
        });

        it('should display a search input field when specified', () => {
            fixture.componentInstance.inputType = 'search';
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        });

        it('should set browser autocomplete to off by default', () => {
            fixture.detectChanges();
            let attr = element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete');
            expect(attr).toBe('off');
        });

        it('should set browser autocomplete to on when configured', () => {
            fixture.componentInstance.autocomplete = true;
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete')).toBe('on');
        });
    });

    describe('autocomplete list', () => {

        let inputEl: HTMLInputElement;

        beforeEach(() => {
            inputEl = element.querySelector('input');
        });

        it('should display a autocomplete list control by default', () => {
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('adf-search-autocomplete');
            expect(autocomplete).not.toBeNull();
        });

        it('should make autocomplete list control hidden initially', () => {
            fixture.detectChanges();
            expect(component.liveSearchComponent.panelAnimationState).toBe('void');
        });

        it('should make autocomplete list control visible when search box has focus and there is a search result', (done) => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.liveSearchTerm = 'test';

            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            window.setTimeout(() => {
                fixture.detectChanges();
                expect(component.liveSearchComponent.panelAnimationState).not.toBe('void');
                let resultElement: Element = element.querySelector('#adf-search-results');
                expect(resultElement).not.toBe(null);
                done();
            }, 100);
        });

        it('should show autocomplete list noe results cwhen search box has focus and there is search result with length 0', (done) => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(noResult));

            component.liveSearchTerm = 'test';

            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            window.setTimeout(() => {
                fixture.detectChanges();
                expect(component.liveSearchComponent.panelAnimationState).not.toBe('void');
                let noResultElement: Element = element.querySelector('#search_no_result');
                expect(noResultElement).not.toBe(null);
                done();
            }, 100);
        });

        it('should hide autocomplete list results when the search box loses focus', (done) => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.liveSearchTerm = 'test';

            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            inputEl.dispatchEvent(new FocusEvent('blur'));
            window.setTimeout(() => {
                fixture.detectChanges();
                expect(component.liveSearchComponent.panelAnimationState).toBe('void');
                done();
            }, 100);
        });

        it('should keep autocomplete list control visible when user tabs into results', (done) => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.liveSearchTerm = 'test';

            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            fixture.detectChanges();
            component.onAutoCompleteFocus(new FocusEvent('focus'));
            window.setTimeout(() => {
                fixture.detectChanges();
                expect(component.liveSearchComponent.panelAnimationState).not.toBe('void');
                done();
            }, 100);
        });

        it('should hide autocomplete list results when escape key pressed', () => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.liveSearchTerm = 'test';

            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Escape'
            }));
            fixture.detectChanges();
            expect(component.liveSearchComponent.panelAnimationState).toBe('void');
        });

        it('should select the first result in autocomplete list when down arrow is pressed and autocomplete list is visible', (done) => {
            fixture.detectChanges();
            spyOn(component.liveSearchComponent, 'focusResult');
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            window.setTimeout(() => {
                fixture.detectChanges();
                inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowDown'
                }));
                fixture.detectChanges();
                expect(component.liveSearchComponent.focusResult).toHaveBeenCalled();
                done();
            }, 100);
        });

        it('should focus input element when autocomplete list returns control', () => {
            fixture.detectChanges();
            spyOn(inputEl, 'focus');
            fixture.detectChanges();
            component.onAutoCompleteReturn();
            expect(inputEl.focus).toHaveBeenCalled();
        });

        it('should focus input element when autocomplete list is cancelled', () => {
            fixture.detectChanges();
            spyOn(inputEl, 'focus');
            fixture.detectChanges();
            component.onAutoCompleteCancel();
            expect(inputEl.focus).toHaveBeenCalled();
        });

        it('should NOT display a autocomplete list control when configured not to', () => {
            fixture.componentInstance.liveSearchEnabled = false;
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('adf-search-autocomplete');
            expect(autocomplete).toBeNull();
        });

    });

    describe('search submit', () => {

        it('should fire a search when a term has been entered', () => {
            spyOn(component.searchSubmit, 'emit');
            fixture.detectChanges();
            let formEl: HTMLElement = element.querySelector('form');
            component.searchTerm = 'searchTerm1';
            component.searchControl.setValue('searchTerm1');
            fixture.detectChanges();
            formEl.dispatchEvent(new Event('submit'));

            fixture.detectChanges();

            expect(component.searchSubmit.emit).toHaveBeenCalledWith({
                'value': 'searchTerm1'
            });
        });

        it('should not fire a search when no term has been entered', () => {
            spyOn(component.searchSubmit, 'emit');
            fixture.detectChanges();
            let inputEl: HTMLInputElement = <HTMLInputElement> element.querySelector('input[type="text"]');
            let formEl: HTMLElement = element.querySelector('form');
            inputEl.value = '';
            formEl.dispatchEvent(new Event('submit'));

            fixture.detectChanges();

            expect(component.searchSubmit.emit).not.toHaveBeenCalled();
        });

    });

    describe('search button', () => {

        it('click on the search button should close the input box when is open', (done) => {
            fixture.detectChanges();
            component.subscriptAnimationState = 'active';

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();

            setTimeout(() => {
                expect(component.subscriptAnimationState).toBe('inactive');
                done();
            }, 500);
        });

        it('click on the search button should not trigger the search when you click on it to close the search bar', (done) => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.liveSearchTerm = 'test';

            fixture.detectChanges();
            component.subscriptAnimationState = 'active';

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();

            setTimeout(() => {
                fixture.detectChanges();
                expect(component.liveSearchComponent.panelAnimationState).not.toBe('void');
                let resultElement: Element = element.querySelector('#adf-search-results');
                expect(resultElement).toBe(null);
                done();
                done();
            }, 500);
        });

        it('click on the search button should open the input box when is close', (done) => {
            fixture.detectChanges();
            component.subscriptAnimationState = 'inactive';

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();

            setTimeout(() => {
                expect(component.subscriptAnimationState).toBe('active');
                done();
            }, 300);
        });

        it('Search button should not change the input state too often', (done) => {
            fixture.detectChanges();
            component.subscriptAnimationState = 'active';

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();
            searchButton.click();

            setTimeout(() => {
                expect(component.subscriptAnimationState).toBe('inactive');
                done();
            }, 400);

        });
    });

    describe('file preview', () => {

        it('should emit a file select event when onFileClicked is called', () => {
            spyOn(component.fileSelect, 'emit');
            component.onFileClicked({
                value: 'node12345'
            });
            expect(component.fileSelect.emit).toHaveBeenCalledWith({
                'value': 'node12345'
            });
        });

        it('should set deactivate the search after file/folder is clicked', (done) => {
            component.subscriptAnimationState = 'active';
            component.onFileClicked({
                value: 'node12345'
            });

            setTimeout(() => {
                expect(component.subscriptAnimationState).toBe('inactive');
                done();
            }, 300);

        });

        it('should NOT reset the search term after file/folder is clicked', () => {
            component.liveSearchTerm = 'test';
            component.onFileClicked({
                value: 'node12345'
            });

            expect(component.liveSearchTerm).toBe('test');
        });
    });
});
