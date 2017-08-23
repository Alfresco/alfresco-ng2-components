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
import {
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    AlfrescoTranslationService,
    CoreModule,
    SearchService
} from 'ng2-alfresco-core';
import { errorJson, folderResult, noResult, result, results } from './../assets/search.component.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

describe('SearchAutocompleteComponent', () => {

    let fixture: ComponentFixture<SearchAutocompleteComponent>, element: HTMLElement;
    let component: SearchAutocompleteComponent;

    let updateSearchTerm = (newSearchTerm: string): void => {
        let oldSearchTerm = component.searchTerm;
        component.searchTerm = newSearchTerm;
        component.ngOnChanges({searchTerm: { currentValue: newSearchTerm, previousValue: oldSearchTerm}});
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [ SearchAutocompleteComponent ], // declare the test component
            providers: [
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                ThumbnailService,
                AlfrescoSettingsService,
                AlfrescoApiService,
                AlfrescoAuthenticationService,
                AlfrescoContentService,
                SearchService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchAutocompleteComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    describe('search results', () => {

        let searchService;

        beforeEach(() => {
            searchService = fixture.debugElement.injector.get(SearchService);
        });

        it('should clear results straight away when a new search term is entered', async(() => {

            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.searchTerm = 'searchTerm';
            component.ngOnChanges({searchTerm: { currentValue: 'searchTerm', previousValue: ''} });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchTerm = 'searchTerm2';
                component.ngOnChanges({searchTerm: { currentValue: 'searchTerm2', previousValue: 'searchTerm'} });
                fixture.detectChanges();
                expect(element.querySelectorAll('table[data-automation-id="autocomplete_results"] tbody tr').length).toBe(0);
            });
        }));

        it('should display the returned search results', (done) => {

            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect( element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect( element.querySelector('#result_name_0').innerHTML).toContain('MyDoc');
                done();
            });

            updateSearchTerm('searchTerm');
        });

        it('should highlight the searched word', (done) => {
            component.highlight = true;
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let el: any = element.querySelectorAll('table[data-automation-id="autocomplete_results"] tbody tr')[1].children[1].children[0];
                expect(el.innerText).toEqual('MyDoc');
                let spanHighlight = el.children[0];
                expect(spanHighlight.classList[0]).toEqual('highlight');
                expect(spanHighlight.innerText).toEqual('My');
                done();
            });

            updateSearchTerm('My');

        });

        it('should limit the number of returned search results to the configured maximum', (done) => {

            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelectorAll('table[data-automation-id="autocomplete_results"] tbody tr').length).toBe(2);
                done();
            });

            component.maxResults = 2;
            updateSearchTerm('searchTerm');
        });

        it('should display the correct thumbnail for result items', (done) => {

            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            let thumbnailService = fixture.debugElement.injector.get(ThumbnailService);
            spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue('fake-type-icon.svg');

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let imgEl = <any> element.querySelector('#result_row_0 img');
                expect(imgEl).not.toBeNull();
                expect(imgEl.src).toContain('fake-type-icon.svg');
                done();
            });

            updateSearchTerm('searchTerm');
        });

        it('should display no result if no result are returned', (done) => {

            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(noResult));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#search_no_result')).not.toBeNull();
                done();
            });

            updateSearchTerm('searchTerm');
        });

    });

    describe('errors', () => {

        let searchService;

        beforeEach(() => {
            searchService = fixture.debugElement.injector.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.reject(errorJson));
        });

        it('should display an error if an error is encountered running the search', (done) => {

            component.resultsLoad.subscribe(() => {}, () => {
                fixture.detectChanges();
                let resultsEl = element.querySelector('[data-automation-id="autocomplete_results"]');
                let errorEl = <any> element.querySelector('[data-automation-id="autocomplete_error_message"]');
                expect(resultsEl).toBeNull();
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText.trim()).toBe('SEARCH.RESULTS.ERROR');
                done();
            });

            updateSearchTerm('searchTerm');
        });

        it('should clear errors straight away when a new search is performed', async(() => {

            updateSearchTerm('searchTerm');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchTerm = 'searchTerm2';
                component.ngOnChanges({searchTerm: { currentValue: 'searchTerm2', previousValue: 'searchTerm'} });
                fixture.detectChanges();
                let errorEl = <any> element.querySelector('[data-automation-id="autocomplete_error_message"]');
                expect(errorEl).toBeNull();
            });
        }));

    });

    describe('mouse interactions', () => {

        let searchService;

        beforeEach(() => {
            searchService = fixture.debugElement.injector.get(SearchService);
        });

        it('should emit fileSelect event when file item clicked', (done) => {

            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<any> element.querySelector('#result_row_0')).click();
            });

            updateSearchTerm('searchTerm');

            component.fileSelect.subscribe(() => {
                done();
            });
        });

        it('should emit fileSelect event if when folder item clicked', (done) => {

            spyOn(searchService, 'getQueryNodesPromise').and.returnValue(Promise.resolve(folderResult));

            spyOn(component.fileSelect, 'emit');
            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<any> element.querySelector('#result_row_0')).click();
                expect(component.fileSelect.emit).toHaveBeenCalled();
                done();
            });

            updateSearchTerm('searchTerm');
        });

    });

    describe('keyboard interactions', () => {

        let searchService;

        beforeEach(() => {
            searchService = fixture.debugElement.injector.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(results));
        });

        it('should emit file select when enter key pressed when a file item is in focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<any> element.querySelector('#result_row_0')).dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Enter'
                }));
            });

            updateSearchTerm('searchTerm');

            component.fileSelect.subscribe(() => {
                done();
            });
        });

        it('should emit cancel event when escape key pressed when a result is in focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<any> element.querySelector('#result_row_0')).dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Escape'
                }));
            });

            updateSearchTerm('searchTerm');

            component.cancel.subscribe(() => {
                done();
            });
        });

        it('should focus the next result when down arrow key pressed when a result is in focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let firstResult: any = element.querySelector('#result_row_0');
                let secondResult: any = element.querySelector('#result_row_1');
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

        it('should do nothing when down arrow key pressed when the last result is in focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let lastResult: any = element.querySelector('#result_row_2');
                lastResult.focus();
                lastResult.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowDown'
                }));
                done();
            });

            updateSearchTerm('searchTerm');
        });

        it('should focus the previous result when up arrow key pressed when a result is in focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let firstResult: any = element.querySelector('#result_row_0');
                let secondResult: any = element.querySelector('#result_row_1');
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

        it('should emit scroll back event when up arrow key pressed and the first result is in focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let firstResult: any = element.querySelector('#result_row_0');
                firstResult.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowUp'
                }));
            });

            component.scrollBack.subscribe(() => {
                done();
            });

            updateSearchTerm('searchTerm');
        });

    });

    describe('changing focus', () => {

        let searchService;

        beforeEach(() => {
            searchService = fixture.debugElement.injector.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));
        });

        it('should emit a focus event when a result comes into focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<any> element.querySelector('#result_row_0')).dispatchEvent(new FocusEvent('focus'));
            });

            updateSearchTerm('searchTerm');

            component.searchFocus.subscribe((e: FocusEvent) => {
                expect(e).not.toBeNull();
                expect(e.type).toBe('focus');
                done();
            });
        });

        it('should emit a focus event when a result loses focus', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<any> element.querySelector('#result_row_0')).dispatchEvent(new FocusEvent('blur'));
            });

            updateSearchTerm('searchTerm');

            component.searchFocus.subscribe((e: FocusEvent) => {
                expect(e).not.toBeNull();
                expect(e.type).toBe('blur');
                done();
            });
        });

        it('should give focus to the first result when focusResult() is called externally', (done) => {

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                let firstResult: any = element.querySelector('#result_row_0');
                spyOn(firstResult, 'focus');
                component.focusResult();
                expect(firstResult.focus).toHaveBeenCalled();
                done();
            });

            updateSearchTerm('searchTerm');
        });

    });

});
