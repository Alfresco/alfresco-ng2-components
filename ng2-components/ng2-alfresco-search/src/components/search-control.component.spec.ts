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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoTranslationService, CoreModule, SearchService } from 'ng2-alfresco-core';
import { ThumbnailService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Observable';
import { noResult, results } from './../assets/search.component.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { SearchControlComponent } from './search-control.component';
import { AdfAutocompleteTriggerDirective } from './search-trigger.component';
import { SearchComponent } from './search.component';

declare let jasmine: any;

fdescribe('SearchControlComponent', () => {

    let fixture: ComponentFixture<SearchControlComponent>;
    let component: SearchControlComponent;
    let element: HTMLElement;
    let debugElement: DebugElement;
    let searchService: SearchService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                SearchControlComponent,
                SearchComponent,
                AdfAutocompleteTriggerDirective
            ],
            providers: [
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                ThumbnailService,
                SearchService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchControlComponent);
            debugElement = fixture.debugElement;
            searchService = TestBed.get(SearchService);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    describe('when input values are inserted', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
            fixture.detectChanges();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
            fixture.destroy();
        });

        it('should emit searchChange when search term input changed', async(() => {
            spyOn(searchService, 'getNodeQueryResults').and.callFake(() => {
                return Observable.of({ entry: { list: []}});
            });
            component.searchChange.subscribe(value => {
                expect(value).toBe('customSearchTerm');
            });

            let inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
            inputDebugElement.nativeElement.value = 'customSearchTerm';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        }));

        it('should update FAYT search when user inputs a valid term', async(() => {
            let inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
            inputDebugElement.nativeElement.value = 'customSearchTerm';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0')).not.toBeNull();
                expect(element.querySelector('#result_option_1')).not.toBeNull();
                expect(element.querySelector('#result_option_2')).not.toBeNull();
            });

        }));

        it('should NOT update FAYT term when user inputs a search term less than 3 characters', async(() => {
            let inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
            inputDebugElement.nativeElement.value = 'cu';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0')).toBeNull();
            });
        }));

        it('should still fire an event when user inputs a search term less than 3 characters', async(() => {
            component.searchChange.subscribe(value => {
                expect(value).toBe('cu');
            });
            let inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
            inputDebugElement.nativeElement.value = 'cu';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        }));
    });

    describe('expandable option false', () => {

        beforeEach(() => {
            component.expandable = false;
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('search button should be hide', () => {
            let searchButton: any = element.querySelector('#adf-search-button');
            expect(searchButton).toBe(null);
        });

        it('should not have animation', () => {
            expect(component.subscriptAnimationState).toBe('no-animation');
        });
    });

    describe('component rendering', () => {

        afterEach(() => {
            fixture.destroy();
        });

        it('should display a text input field by default', () => {
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
            expect(element.querySelector('#adf-control-input')).toBeDefined();
            expect(element.querySelector('#adf-control-input')).not.toBeNull();
        });

        it('should set browser autocomplete to off by default', () => {
            fixture.detectChanges();
            let attr = element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete');
            expect(attr).toBe('off');
        });

        it('should display a search input field when specified', () => {
            component.inputType = 'search';
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        });

        it('should set browser autocomplete to on when configured', () => {
            component.autocomplete = true;
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete')).toBe('on');
        });
    });

    describe('autocomplete list', () => {

        let inputDebugElement: DebugElement;

        beforeEach(() => {
            inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should make autocomplete list control hidden initially', () => {
            fixture.detectChanges();
            expect(element.querySelector('#autocomplete-search-result-list')).toBeNull();
        });

        it('should make autocomplete list control visible when search box has focus and there is a search result', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: Element = element.querySelector('#autocomplete-search-result-list');
                expect(resultElement).not.toBe(null);
                done();
            });
        });

        it('should show autocomplete list noe results when search box has focus and there is search result with length 0', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(noResult));
            fixture.detectChanges();

            inputDebugElement.nativeElement.value = 'NO RES';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let noResultElement: Element = element.querySelector('#search_no_result');
                expect(noResultElement).not.toBe(null);
            });
        }));

        it('should hide autocomplete list results when the search box loses focus', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            inputDebugElement.nativeElement.value = 'NO RES';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: Element = element.querySelector('#autocomplete-search-result-list');
                expect(resultElement).not.toBe(null);
                inputDebugElement.nativeElement.dispatchEvent(new Event('blur'));

                fixture.detectChanges();
                resultElement = element.querySelector('#autocomplete-search-result-list');
                expect(resultElement).not.toBe(null);
                done();
            });
        });

        it('should keep autocomplete list control visible when user tabs into results', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                resultElement.focus();
                expect(resultElement).not.toBe(null);
                inputDebugElement.nativeElement.dispatchEvent(new KeyboardEvent('keypress', { key: 'TAB' }));
                fixture.detectChanges();

                expect(element.querySelector('#autocomplete-search-result-list') ).not.toBeNull();
            });
        }));

        it('should focus input element when autocomplete list is cancelled', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            let escapeEvent: any = new Event('ESCAPE');
            escapeEvent.keyCode = 27;
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(escapeEvent);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#result_name_0') ).toBeNull();
                expect(document.activeElement.id).toBe(inputDebugElement.nativeElement.id);
            });
        }));

        it('should NOT display a autocomplete list control when configured not to', async(() => {
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            component.liveSearchEnabled = false;
            fixture.detectChanges();

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list') ).toBeNull();
            });
        }));

    });

    describe('search submit', () => {

        let inputDebugElement: DebugElement;

        beforeEach(() => {
            inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should fire a search when a enter key is pressed', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            component.submit.subscribe((value) => {
                expect(value).toBe('TEST');
            });

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            let enterKeyEvent: any = new Event('keyup');
            enterKeyEvent.keyCode = '13';
            inputDebugElement.nativeElement.dispatchEvent(enterKeyEvent);
        }));
    });

    describe('search button', () => {

        afterEach(() => {
            fixture.destroy();
        });

        it('click on the search button should close the input box when is open', async(() => {
            fixture.detectChanges();
            component.subscriptAnimationState = 'active';

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.subscriptAnimationState).toBe('inactive');
            });
        }));

        it('click on the search button should open the input box when is close', async(() => {
            component.subscriptAnimationState = 'inactive';
            fixture.detectChanges();

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.subscriptAnimationState).toBe('active');
            });
        }));

        it('Search button should not change the input state too often', async(() => {
            fixture.detectChanges();
            component.subscriptAnimationState = 'active';

            let searchButton: any = element.querySelector('#adf-search-button');
            searchButton.click();
            fixture.detectChanges();
            searchButton.click();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(component.subscriptAnimationState).toBe('inactive');
            });
        }));
    });

    describe('option click', () => {

        let inputDebugElement: DebugElement;

        beforeEach(() => {
            inputDebugElement = fixture.debugElement.query(By.css('#adf-control-input'));
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'getNodeQueryResults').and.returnValue(Observable.of(results));
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should emit a option clicked event when item is clicked', async(() => {
            component.optionClicked.subscribe((item) => {
                expect(item.entry.id).toBe('123');
            });

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = fixture.debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        }));

        it('should set deactivate the search after element is clicked', async(() => {
            component.optionClicked.subscribe((item) => {
                expect(component.subscriptAnimationState).toBe('inactive');
            });

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = fixture.debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        }));

        it('should NOT reset the search term after element is clicked', async(() => {
            component.optionClicked.subscribe((item) => {
                expect(component.searchTerm).not.toBeFalsy();
                expect(component.searchTerm).toBe('TEST');
            });

            inputDebugElement.nativeElement.value = 'TEST';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = fixture.debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        }));
    });
});
