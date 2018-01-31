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
import { async, discardPeriodicTasks, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { MaterialModule } from '../../material.module';
import { By } from '@angular/platform-browser';
import { AuthenticationService, SearchService } from '@alfresco/adf-core';
import { ThumbnailService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { noResult, results } from '../../mock';
import { SearchControlComponent } from './search-control.component';
import { SearchTriggerDirective } from './search-trigger.directive';
import { SearchComponent } from './search.component';

describe('SearchControlComponent', () => {

    let fixture: ComponentFixture<SearchControlComponent>;
    let component: SearchControlComponent;
    let element: HTMLElement;
    let debugElement: DebugElement;
    let searchService: SearchService;
    let authService: AuthenticationService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule
            ],
            declarations: [
                SearchControlComponent,
                SearchComponent,
                SearchTriggerDirective
            ],
            providers: [
                ThumbnailService,
                SearchService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchControlComponent);
            debugElement = fixture.debugElement;
            searchService = TestBed.get(SearchService);
            authService = TestBed.get(AuthenticationService);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    beforeEach(async(() => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
    }));

    afterEach(async(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    }));

    function typeWordIntoSearchInput(word: string): void {
        let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
        inputDebugElement.nativeElement.value = word;
        inputDebugElement.nativeElement.focus();
        inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
    }

    describe('when input values are inserted', () => {

        beforeEach(async(() => {
            fixture.detectChanges();
        }));

        it('should emit searchChange when search term input changed', async(() => {
            spyOn(searchService, 'search').and.callFake(() => {
                return Observable.of({ entry: { list: [] } });
            });
            component.searchChange.subscribe(value => {
                expect(value).toBe('customSearchTerm');
            });

            typeWordIntoSearchInput('customSearchTerm');
            fixture.detectChanges();
        }));

        it('should update FAYT search when user inputs a valid term', async(() => {
            typeWordIntoSearchInput('customSearchTerm');
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0')).not.toBeNull();
                expect(element.querySelector('#result_option_1')).not.toBeNull();
                expect(element.querySelector('#result_option_2')).not.toBeNull();
            });
        }));

        it('should NOT update FAYT term when user inputs an empty string as search term ', async(() => {
            typeWordIntoSearchInput('');
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));

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
            typeWordIntoSearchInput('cu');
            fixture.detectChanges();
        }));
    });

    describe('expandable option false', () => {

        beforeEach(() => {
            component.expandable = false;
            fixture.detectChanges();
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

        it('should display a text input field by default', async(() => {
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
            expect(element.querySelector('#adf-control-input')).toBeDefined();
            expect(element.querySelector('#adf-control-input')).not.toBeNull();
        }));

        it('should set browser autocomplete to off by default', async(() => {
            fixture.detectChanges();
            let attr = element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete');
            expect(attr).toBe('off');
        }));

        it('should display a search input field when specified', async(() => {
            component.inputType = 'search';
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        }));

        it('should set browser autocomplete to on when configured', async(() => {
            component.autocomplete = true;
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete')).toBe('on');
        }));

        it('should fire a search when a enter key is pressed', async(() => {
            component.submit.subscribe((value) => {
                expect(value).toBe('TEST');
            });

            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));

            fixture.detectChanges();
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            let enterKeyEvent: any = new Event('keyup');
            enterKeyEvent.keyCode = '13';
            inputDebugElement.nativeElement.dispatchEvent(enterKeyEvent);
        }));
    });

    describe('autocomplete list', () => {

        it('should make autocomplete list control hidden initially', async(() => {
            fixture.detectChanges();
            expect(element.querySelector('#autocomplete-search-result-list')).toBeNull();
        }));

        it('should make autocomplete list control visible when search box has focus and there is a search result', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');
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
            spyOn(searchService, 'search').and.returnValue(Observable.of(noResult));
            fixture.detectChanges();

            typeWordIntoSearchInput('NO RES');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let noResultElement: Element = element.querySelector('#search_no_result');
                expect(noResultElement).not.toBe(null);
            });
        }));

        it('should hide autocomplete list results when the search box loses focus', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('NO RES');
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
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                resultElement.focus();
                expect(resultElement).not.toBe(null);
                inputDebugElement.nativeElement.dispatchEvent(new KeyboardEvent('keypress', { key: 'TAB' }));
                fixture.detectChanges();

                expect(element.querySelector('#autocomplete-search-result-list')).not.toBeNull();
            });
        }));

        it('should close the autocomplete when user press ESCAPE', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(resultElement).not.toBeNull();
                let escapeEvent: any = new Event('ESCAPE');
                escapeEvent.keyCode = 27;
                inputDebugElement.triggerEventHandler('keydown', escapeEvent);
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    resultElement = <HTMLElement> element.querySelector('#result_option_0');
                    expect(resultElement).toBeNull();
                });
            });
        }));

        it('should close the autocomplete when user press ENTER on input', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(resultElement).not.toBeNull();
                let escapeEvent: any = new Event('ENTER');
                escapeEvent.keyCode = 13;
                inputDebugElement.triggerEventHandler('keydown', escapeEvent);
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    resultElement = <HTMLElement> element.querySelector('#result_option_0');
                    expect(resultElement).toBeNull();
                });
            });
        }));

        it('should focus input element when autocomplete list is cancelled', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            let escapeEvent: any = new Event('ESCAPE');
            escapeEvent.keyCode = 27;
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(escapeEvent);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#result_name_0')).toBeNull();
                expect(document.activeElement.id).toBe(inputDebugElement.nativeElement.id);
            });
        }));

        it('should NOT display a autocomplete list control when configured not to', async(() => {
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            component.liveSearchEnabled = false;
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list')).toBeNull();
            });
        }));

        it('should select the first item on autocomplete list when ARROW DOWN is pressed on input', async(() => {
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list')).not.toBeNull();

                inputDebugElement.triggerEventHandler('keyup.arrowdown', {});
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('result_option_0');
            });
        }));

        it('should select the second item on autocomplete list when ARROW DOWN is pressed on list', async(() => {
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list')).not.toBeNull();

                inputDebugElement.triggerEventHandler('keyup.arrowdown', {});
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('result_option_0');

                let firstElement = debugElement.query(By.css('#result_option_0'));
                firstElement.triggerEventHandler('keyup.arrowdown', { target : firstElement.nativeElement});
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('result_option_1');
            });
        }));

        it('should focus the input search when ARROW UP is pressed on the first list item', async(() => {
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            fixture.detectChanges();
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list')).not.toBeNull();

                inputDebugElement.triggerEventHandler('keyup.arrowdown', {});
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('result_option_0');

                let firstElement = debugElement.query(By.css('#result_option_0'));
                firstElement.triggerEventHandler('keyup.arrowup', { target : firstElement.nativeElement});
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(document.activeElement.id).toBe('adf-control-input');
                });
            });
        }));

    });

    describe('search button', () => {

        it('should NOT display a autocomplete list control when configured not to', fakeAsync(() => {
            fixture.detectChanges();
            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            component.subscriptAnimationState = 'active';
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('active');

            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('inactive');
            discardPeriodicTasks();
        }));

        it('click on the search button should open the input box when is close', fakeAsync(() => {
            fixture.detectChanges();

            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            searchButton.triggerEventHandler('click', null);

            tick(100);
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('active');
            discardPeriodicTasks();
        }));

        it('click on the search button should apply focus on input', fakeAsync(() => {
            fixture = TestBed.createComponent(SearchControlComponent);
            debugElement = fixture.debugElement;
            fixture.detectChanges();
            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));

            searchButton.triggerEventHandler('click', null);

            tick(100);
            fixture.detectChanges();

            tick(300);
            fixture.detectChanges();
            expect(document.activeElement.id).toBe(inputDebugElement.nativeElement.id);
            discardPeriodicTasks();
        }));

        it('Search button should not change the input state too often', fakeAsync(() => {
            fixture.detectChanges();
            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            component.subscriptAnimationState = 'active';
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('active');
            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();
            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('inactive');
            discardPeriodicTasks();
        }));

        it('Search bar should close when user press ESC button', fakeAsync(() => {
            fixture.detectChanges();
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            component.subscriptAnimationState = 'active';
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('active');

            inputDebugElement.triggerEventHandler('keyup.escape', {});

            tick(100);
            fixture.detectChanges();
            expect(component.subscriptAnimationState).toBe('inactive');
            discardPeriodicTasks();
        }));
    });

    describe('option click', () => {

        it('should emit a option clicked event when item is clicked', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            component.optionClicked.subscribe((item) => {
                expect(item.entry.id).toBe('123');
            });
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.triggerEventHandler('click', null);
            });
        }));

        it('should set deactivate the search after element is clicked', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            component.optionClicked.subscribe((item) => {
                window.setTimeout(() => {
                    expect(component.subscriptAnimationState).toBe('inactive');
                }, 200);
            });
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.triggerEventHandler('click', null);
            });
        }));

        it('should NOT reset the search term after element is clicked', async(() => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            spyOn(searchService, 'search').and.returnValue(Observable.of(results));
            component.optionClicked.subscribe((item) => {
                expect(component.searchTerm).not.toBeFalsy();
                expect(component.searchTerm).toBe('TEST');
            });
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.triggerEventHandler('click', null);
            });
        }));
    });
});
