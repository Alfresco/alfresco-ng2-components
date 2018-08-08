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

import { Component, DebugElement, ViewChild } from '@angular/core';
import { async, discardPeriodicTasks, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationService, SearchService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { ThumbnailService } from '@alfresco/adf-core';
import { noResult, results } from '../../mock';
import { SearchControlComponent } from './search-control.component';
import { SearchTriggerDirective } from './search-trigger.directive';
import { SearchComponent } from './search.component';
import { EmptySearchResultComponent } from './empty-search-result.component';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    template: `
        <adf-search-control [highlight]="true" #search>
            <adf-empty-search-result>
                <span id="custom-no-result">{{customMessage}}</span>
            </adf-empty-search-result>
        </adf-search-control>
    `
})

export class SimpleSearchTestCustomEmptyComponent {

    customMessage: string = '';

    @ViewChild(SearchControlComponent)
    searchComponent: SearchControlComponent;

    constructor() {
    }

    setCustomMessageForNoResult(message: string) {
        this.customMessage = message;
    }

}

describe('SearchControlComponent', () => {

    let fixture: ComponentFixture<SearchControlComponent>;
    let component: SearchControlComponent;
    let element: HTMLElement;
    let debugElement: DebugElement;
    let searchService: SearchService;
    let authService: AuthenticationService;
    let fixtureCustom: ComponentFixture<SimpleSearchTestCustomEmptyComponent>;
    let elementCustom: HTMLElement;
    let componentCustom: SimpleSearchTestCustomEmptyComponent;
    let searchServiceSpy: any;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            SearchControlComponent,
            SearchComponent,
            SearchTriggerDirective,
            EmptySearchResultComponent,
            SimpleSearchTestCustomEmptyComponent
        ],
        providers: [
            ThumbnailService,
            SearchService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchControlComponent);
        debugElement = fixture.debugElement;
        searchService = TestBed.get(SearchService);
        authService = TestBed.get(AuthenticationService);
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        searchServiceSpy = spyOn(searchService, 'search').and.returnValue(of(''));
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    function typeWordIntoSearchInput(word: string): void {
        let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
        inputDebugElement.nativeElement.value = word;
        inputDebugElement.nativeElement.focus();
        inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
    }

    describe('when input values are inserted', () => {

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should emit searchChange when search term input changed', (done) => {
            searchServiceSpy.and.returnValue(
                of({ entry: { list: [] } })
            );

            let searchDisposable = component.searchChange.subscribe(value => {
                expect(value).toBe('customSearchTerm');
                searchDisposable.unsubscribe();
                done();
            });

            typeWordIntoSearchInput('customSearchTerm');
            fixture.detectChanges();
        });

        it('should update FAYT search when user inputs a valid term', (done) => {
            typeWordIntoSearchInput('customSearchTerm');
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0')).not.toBeNull();
                expect(element.querySelector('#result_option_1')).not.toBeNull();
                expect(element.querySelector('#result_option_2')).not.toBeNull();
                done();
            });
        });

        it('should NOT update FAYT term when user inputs an empty string as search term ', (done) => {
            typeWordIntoSearchInput('');
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0')).toBeNull();
                done();
            });
        });

        it('should still fire an event when user inputs a search term less than 3 characters', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));

            let searchDisposable = component.searchChange.subscribe(value => {
                expect(value).toBe('cu');
                searchDisposable.unsubscribe();
            });

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                typeWordIntoSearchInput('cu');
                done();
            });
        });
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
            expect(element.querySelectorAll('#adf-control-input').length).toBe(1);
            expect(element.querySelector('#adf-control-input')).toBeDefined();
            expect(element.querySelector('#adf-control-input')).not.toBeNull();
        }));

        it('should set browser autocomplete to off by default', async(() => {
            fixture.detectChanges();
            let attr = element.querySelector('#adf-control-input').getAttribute('autocomplete');
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
            expect(element.querySelector('#adf-control-input').getAttribute('autocomplete')).toBe('on');
        }));

        xit('should fire a search when a enter key is pressed', (done) => {
            let searchDisposable = component.submit.subscribe((value) => {
                expect(value).toBe('TEST');
                searchDisposable.unsubscribe();
                done();
            });

            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));

            fixture.detectChanges();
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            let enterKeyEvent: any = new Event('keyup');
            enterKeyEvent.keyCode = '13';
            inputDebugElement.nativeElement.dispatchEvent(enterKeyEvent);
        });
    });

    describe('autocomplete list', () => {

        it('should make autocomplete list control hidden initially', async(() => {
            fixture.detectChanges();
            expect(element.querySelector('#autocomplete-search-result-list')).toBeNull();
        }));

        it('should make autocomplete list control visible when search box has focus and there is a search result', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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

        it('should show autocomplete list noe results when search box has focus and there is search result with length 0', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(noResult));
            fixture.detectChanges();

            typeWordIntoSearchInput('NO RES');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let noResultElement: Element = element.querySelector('#search_no_result');
                expect(noResultElement).not.toBe(null);
                done();
            });
        });

        it('should hide autocomplete list results when the search box loses focus', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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

        it('should keep autocomplete list control visible when user tabs into results', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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
                done();
            });
        });

        it('should close the autocomplete when user press ESCAPE', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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
                    done();
                });
            });
        });

        it('should close the autocomplete when user press ENTER on input', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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
                    done();
                });
            });
        });

        it('should focus input element when autocomplete list is cancelled', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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
                done();
            });
        });

        it('should NOT display a autocomplete list control when configured not to', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            component.liveSearchEnabled = false;
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list')).toBeNull();
                done();
            });
        });

        xit('should select the first item on autocomplete list when ARROW DOWN is pressed on input', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#autocomplete-search-result-list')).not.toBeNull();

                inputDebugElement.triggerEventHandler('keyup.arrowdown', {});
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('result_option_0');
                done();
            });
        });

        xit('should select the second item on autocomplete list when ARROW DOWN is pressed on list', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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
                firstElement.triggerEventHandler('keyup.arrowdown', { target: firstElement.nativeElement });
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('result_option_1');
                done();
            });
        });

        xit('should focus the input search when ARROW UP is pressed on the first list item', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
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
                firstElement.triggerEventHandler('keyup.arrowup', { target: firstElement.nativeElement });
                fixture.detectChanges();
                expect(document.activeElement.id).toBe('adf-control-input');
                done();
            });
        });

    });

    describe('search button', () => {

        it('should NOT display a autocomplete list control when configured not to', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            component.subscriptAnimationState = 'active';
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('active');

            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('inactive');
            discardPeriodicTasks();
        }));

        it('click on the search button should open the input box when is close', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            searchButton.triggerEventHandler('click', null);

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('active');
            discardPeriodicTasks();
        }));

        xit('click on the search button should apply focus on input', fakeAsync(() => {
            fixture.detectChanges();
            tick(100);

            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            searchButton.triggerEventHandler('click', null);

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(document.activeElement.id).toBe(inputDebugElement.nativeElement.id);
            discardPeriodicTasks();
        }));

        it('Search button should not change the input state too often', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            let searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            component.subscriptAnimationState = 'active';
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('active');
            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);

            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('inactive');
            discardPeriodicTasks();
        }));

        it('Search bar should close when user press ESC button', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            let inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            component.subscriptAnimationState = 'active';
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('active');

            inputDebugElement.triggerEventHandler('keyup.escape', {});

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState).toBe('inactive');
            discardPeriodicTasks();
        }));
    });

    describe('option click', () => {

        it('should emit a option clicked event when item is clicked', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            let clickDisposable = component.optionClicked.subscribe((item) => {
                expect(item.entry.id).toBe('123');
                clickDisposable.unsubscribe();
                done();
            });
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        });

        it('should set deactivate the search after element is clicked', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            let clickDisposable = component.optionClicked.subscribe((item) => {
                expect(component.subscriptAnimationState).toBe('inactive');
                clickDisposable.unsubscribe();
                done();
            });
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        });

        it('should NOT reset the search term after element is clicked', (done) => {
            spyOn(component, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            let clickDisposable = component.optionClicked.subscribe((item) => {
                expect(component.searchTerm).not.toBeFalsy();
                expect(component.searchTerm).toBe('TEST');
                clickDisposable.unsubscribe();
                done();
            });
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        });
    });

    describe('SearchControlComponent - No result custom', () => {

        beforeEach(() => {
            fixtureCustom = TestBed.createComponent(SimpleSearchTestCustomEmptyComponent);
            componentCustom = fixtureCustom.componentInstance;
            elementCustom = fixtureCustom.nativeElement;
        });

        it('should display the custom no results when it is configured', (done) => {
            const noResultCustomMessage = 'BANDI IS NOTHING';
            spyOn(componentCustom.searchComponent, 'isSearchBarActive').and.returnValue(true);
            componentCustom.setCustomMessageForNoResult(noResultCustomMessage);
            searchServiceSpy.and.returnValue(of(noResult));
            fixtureCustom.detectChanges();

            let inputDebugElement = fixtureCustom.debugElement.query(By.css('#adf-control-input'));
            inputDebugElement.nativeElement.value = 'SOMETHING';
            inputDebugElement.nativeElement.focus();
            inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

            fixtureCustom.detectChanges();
            fixtureCustom.whenStable().then(() => {
                fixtureCustom.detectChanges();
                expect(elementCustom.querySelector('#custom-no-result').textContent).toBe(noResultCustomMessage);
                done();
            });
        });
    });
});
