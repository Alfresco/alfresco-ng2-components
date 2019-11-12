/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    AuthenticationService,
    SearchService,
    setupTestBed,
    CoreModule,
    UserPreferencesService,
    SearchTextInputComponent
} from '@alfresco/adf-core';
import { ThumbnailService } from '@alfresco/adf-core';
import { noResult, results } from '../../mock';
import { SearchControlComponent } from './search-control.component';
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

    @ViewChild(SearchTextInputComponent)
    searchTextInputComponent: SearchTextInputComponent;

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
    let userPreferencesService: UserPreferencesService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            SearchControlComponent,
            SearchComponent,
            EmptySearchResultComponent,
            SimpleSearchTestCustomEmptyComponent
        ],
        providers: [
            ThumbnailService,
            SearchService,
            UserPreferencesService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchControlComponent);
        debugElement = fixture.debugElement;
        searchService = TestBed.get(SearchService);
        authService = TestBed.get(AuthenticationService);
        userPreferencesService = TestBed.get(UserPreferencesService);
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        searchServiceSpy = spyOn(searchService, 'search').and.returnValue(of(''));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    function typeWordIntoSearchInput(word: string): void {
        const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
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

            const searchDisposable = component.searchChange.subscribe((value) => {
                expect(value).toBe('customSearchTerm');
                searchDisposable.unsubscribe();
                done();
            });

            typeWordIntoSearchInput('customSearchTerm');
            fixture.detectChanges();
        });

        it('should NOT update FAYT term when user inputs an empty string as search term ', (done) => {
            typeWordIntoSearchInput('');
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

            const searchDisposable = component.searchChange.subscribe((value) => {
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

    describe('component rendering', () => {

        it('should display a text input field by default', async(() => {
            fixture.detectChanges();
            expect(element.querySelectorAll('#adf-control-input').length).toBe(1);
            expect(element.querySelector('#adf-control-input')).toBeDefined();
            expect(element.querySelector('#adf-control-input')).not.toBeNull();
        }));

        it('should set browser autocomplete to off by default', async(() => {
            fixture.detectChanges();
            const attr = element.querySelector('#adf-control-input').getAttribute('autocomplete');
            expect(attr).toBe('off');
        }));

    });

    describe('autocomplete list', () => {

        it('should make autocomplete list control hidden initially', (done) => {

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#autocomplete-search-result-list')).toBeNull();
                done();
            });
        });

        it('should make autocomplete list control visible when search box has focus and there is a search result', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const resultElement: Element = element.querySelector('#autocomplete-search-result-list');
                expect(resultElement).not.toBe(null);
                done();
            });
        });

        it('should show autocomplete list no results when search box has focus and there is search result with length 0', (done) => {
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(noResult));
            fixture.detectChanges();

            typeWordIntoSearchInput('NO RES');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const noResultElement: Element = element.querySelector('#search_no_result');
                expect(noResultElement).not.toBe(null);
                done();
            });
        });

        it('should hide autocomplete list results when the search box loses focus', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            fixture.detectChanges();

            const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
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
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            fixture.detectChanges();

            const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                resultElement.focus();
                expect(resultElement).not.toBe(null);
                inputDebugElement.nativeElement.dispatchEvent(new KeyboardEvent('keypress', { key: 'TAB' }));
                fixture.detectChanges();

                expect(element.querySelector('#autocomplete-search-result-list')).not.toBeNull();
                done();
            });
        });

        it('should close the autocomplete when user press ESCAPE', (done) => {
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            fixture.detectChanges();

            const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(resultElement).not.toBeNull();
                const escapeEvent: any = new Event('ESCAPE');
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
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            fixture.detectChanges();

            const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let resultElement: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(resultElement).not.toBeNull();
                const escapeEvent: any = new Event('ENTER');
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

            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            fixture.detectChanges();

            const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            const escapeEvent: any = new Event('ESCAPE');
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

    });

    describe('option click', () => {

        it('should emit a option clicked event when item is clicked', (done) => {
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            const clickDisposable = component.optionClicked.subscribe((item) => {
                expect(item.entry.id).toBe('123');
                clickDisposable.unsubscribe();
                done();
            });
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        });

        it('should set deactivate the search after element is clicked', (done) => {
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            const clickDisposable = component.optionClicked.subscribe(() => {
                expect(component.searchTextInput.subscriptAnimationState.value).toBe('inactive');
                clickDisposable.unsubscribe();
                done();
            });
            fixture.detectChanges();

            typeWordIntoSearchInput('TEST');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        });

        it('should NOT reset the search term after element is clicked', (done) => {
            spyOn(component.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(JSON.parse(JSON.stringify(results))));
            const clickDisposable = component.optionClicked.subscribe(() => {
                expect(component.searchTextInput.searchTerm).not.toBeFalsy();
                expect(component.searchTextInput.searchTerm).toBe('TEST');
                clickDisposable.unsubscribe();
                done();
            });
            fixture.detectChanges();
            typeWordIntoSearchInput('TEST');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const firstOption: DebugElement = debugElement.query(By.css('#result_name_0'));
                firstOption.nativeElement.click();
            });
        });
    });

    describe('SearchControlComponent - No result custom', () => {

        beforeEach(() => {
            fixtureCustom = TestBed.createComponent(SimpleSearchTestCustomEmptyComponent);
            componentCustom = fixtureCustom.componentInstance;
            elementCustom = fixtureCustom.nativeElement;
            fixture.detectChanges();
        });

        it('should display the custom no results when it is configured', (done) => {
            const noResultCustomMessage = 'BANDI IS NOTHING';
            spyOn(componentCustom.searchComponent, 'isLoggedIn').and.returnValue(true);
            fixtureCustom.detectChanges();
            spyOn(componentCustom.searchComponent.searchTextInput, 'isSearchBarActive').and.returnValue(true);
            searchServiceSpy.and.returnValue(of(noResult));
            componentCustom.setCustomMessageForNoResult(noResultCustomMessage);
            fixtureCustom.detectChanges();

            const inputDebugElement = fixtureCustom.debugElement.query(By.css('#adf-control-input'));
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

    describe('directionality', () => {
        describe('initial animation state', () => {
            beforeEach(() => {
                component.expandable = true;
            });

            it('should have positive transform translation', () => {
                userPreferencesService.setWithoutStore('textOrientation', 'ltr');
                fixture.detectChanges();
                expect(component.searchTextInput.subscriptAnimationState.params.transform).toBe('translateX(82%)');
            });

            it('should have negative transform translation ', () => {
                userPreferencesService.setWithoutStore('textOrientation', 'rtl');
                fixture.detectChanges();
                expect(component.searchTextInput.subscriptAnimationState.params.transform).toBe('translateX(-82%)');
            });
        });
    });
});
