/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { CoreTestingModule } from '../testing/core.testing.module';
import { SearchTextInputComponent } from './search-text-input.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { UserPreferencesService } from '../common/services/user-preferences.service';
import { setupTestBed } from '../testing/setup-test-bed';

describe('SearchTextInputComponent', () => {

    let fixture: ComponentFixture<SearchTextInputComponent>;
    let component: SearchTextInputComponent;
    let debugElement: DebugElement;
    let element: HTMLElement;
    let userPreferencesService: UserPreferencesService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchTextInputComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        element = fixture.nativeElement;
        userPreferencesService = TestBed.inject(UserPreferencesService);
        component.focusListener = new Subject<any>();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('component rendering', () => {

        it('should display a search input field when specified', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            component.inputType = 'search';

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        });
    });

    describe('expandable option false', () => {

        beforeEach(() => {
            component.expandable = false;
        });

        it('search button should be hide', () => {
            fixture.detectChanges();
            const searchButton: any = element.querySelector('#adf-search-button');
            expect(searchButton).toBe(null);
        });

        it('should not have animation', () => {
            userPreferencesService.setWithoutStore('textOrientation', 'rtl');
            fixture.detectChanges();
            expect(component.subscriptAnimationState.value).toBe('no-animation');
        });
    });

    describe('search button', () => {

        it('should NOT display a autocomplete list control when configured not to', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            component.subscriptAnimationState.value = 'active';
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('active');

            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();
            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('inactive');
            discardPeriodicTasks();
        }));

        it('click on the search button should open the input box when is close', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            searchButton.triggerEventHandler('click', null);

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('active');
            discardPeriodicTasks();
        }));

        it('Search button should not change the input state too often', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
            component.subscriptAnimationState.value = 'active';
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('active');
            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);

            searchButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('inactive');
            discardPeriodicTasks();
        }));

        it('Search bar should close when user press ESC button', fakeAsync(() => {
            fixture.detectChanges();

            tick(100);

            const inputDebugElement = debugElement.query(By.css('#adf-control-input'));
            component.subscriptAnimationState.value = 'active';
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('active');

            inputDebugElement.triggerEventHandler('keyup.escape', {});

            tick(100);
            fixture.detectChanges();

            tick(100);

            expect(component.subscriptAnimationState.value).toBe('inactive');
            discardPeriodicTasks();
        }));
    });

    describe('toggle animation', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should have margin-left set when active and direction is ltr', fakeAsync(() => {
            userPreferencesService.setWithoutStore('textOrientation', 'ltr');
            fixture.detectChanges();

            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));

            searchButton.triggerEventHandler('click', null);
            tick(100);
            fixture.detectChanges();
            tick(100);

            expect(component.subscriptAnimationState.params).toEqual({ 'margin-left': 13 });
            discardPeriodicTasks();
        }));

        it('should have positive transform translateX set when inactive and direction is ltr', fakeAsync(() => {
            userPreferencesService.setWithoutStore('textOrientation', 'ltr');
            component.subscriptAnimationState.value = 'active';

            fixture.detectChanges();
            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));

            searchButton.triggerEventHandler('click', null);
            tick(100);
            fixture.detectChanges();
            tick(100);

            expect(component.subscriptAnimationState.params).toEqual({ transform: 'translateX(82%)' });
            discardPeriodicTasks();
        }));

        it('should have margin-right set when active and direction is rtl', fakeAsync(() => {
            userPreferencesService.setWithoutStore('textOrientation', 'rtl');
            fixture.detectChanges();

            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));

            searchButton.triggerEventHandler('click', null);
            tick(100);
            fixture.detectChanges();
            tick(100);

            expect(component.subscriptAnimationState.params).toEqual({ 'margin-right': 13 });
            discardPeriodicTasks();
        }));

        it('should have negative transform translateX set when inactive and direction is rtl', fakeAsync(() => {
            userPreferencesService.setWithoutStore('textOrientation', 'rtl');
            component.subscriptAnimationState.value = 'active';

            fixture.detectChanges();
            const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));

            searchButton.triggerEventHandler('click', null);
            tick(100);
            fixture.detectChanges();
            tick(100);

            expect(component.subscriptAnimationState.params).toEqual({ transform: 'translateX(-82%)' });
            discardPeriodicTasks();
        }));

        it('should set browser autocomplete to on when configured', async () => {
            component.autocomplete = true;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#adf-control-input').getAttribute('autocomplete')).toBe('on');
        });
    });

    describe('Search visibility', () => {
        beforeEach(() => {
            userPreferencesService.setWithoutStore('textOrientation', 'ltr');
            fixture.detectChanges();
        });

        it('should emit an event when the search becomes active', fakeAsync(() => {
            const searchVisibilityChangeSpy = spyOn(component.searchVisibility, 'emit');
            component.toggleSearchBar();
            tick(200);

            expect(searchVisibilityChangeSpy).toHaveBeenCalledWith(true);
        }));

        it('should emit an event when the search becomes inactive', fakeAsync(() => {
            component.toggleSearchBar();
            tick(200);
            expect(component.subscriptAnimationState.value).toEqual('active');

            const searchVisibilityChangeSpy = spyOn(component.searchVisibility, 'emit');
            component.toggleSearchBar();
            tick(200);

            expect(component.subscriptAnimationState.value).toEqual('inactive');
            expect(searchVisibilityChangeSpy).toHaveBeenCalledWith(false);
        }));

        it('should reset emit when the search becomes inactive', fakeAsync(() => {
            const resetSpy = spyOn(component.reset, 'emit');

            component.toggleSearchBar();
            tick(200);
            expect(component.subscriptAnimationState.value).toEqual('active');
            component.searchTerm = 'fake-search-term';

            component.toggleSearchBar();
            tick(200);

            expect(resetSpy).toHaveBeenCalled();
            expect(component.searchTerm).toEqual('');
        }));

        describe('Clear button', () => {
            beforeEach(fakeAsync(() => {
                fixture.detectChanges();
                component.subscriptAnimationState.value = 'active';
                fixture.detectChanges();
                tick(200);
            }));

            it('should clear button be visible when showClearButton is set to true', async () => {
                component.showClearButton = true;
                fixture.detectChanges();
                await fixture.whenStable();
                const clearButton = fixture.debugElement.query(By.css('[data-automation-id="adf-clear-search-button"]'));

                expect(clearButton).not.toBeNull();
            });

            it('should clear button not be visible when showClearButton is set to false', () => {
                component.showClearButton = false;
                fixture.detectChanges();
                const clearButton = fixture.debugElement.query(By.css('[data-automation-id="adf-clear-search-button"]'));

                expect(clearButton).toBeNull();
            });

            it('should reset the search when clicking the clear button', async () => {
                const resetEmitSpy = spyOn(component.reset, 'emit');
                const searchVisibilityChangeSpy = spyOn(component.searchVisibility, 'emit');

                component.searchTerm = 'fake-search-term';
                component.showClearButton = true;
                fixture.detectChanges();
                await fixture.whenStable();

                const clearButton = fixture.debugElement.query(By.css('[data-automation-id="adf-clear-search-button"]'));
                clearButton.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
                fixture.detectChanges();
                await fixture.whenStable();

                expect(resetEmitSpy).toHaveBeenCalled();
                expect(searchVisibilityChangeSpy).toHaveBeenCalledWith(false);
                expect(component.subscriptAnimationState.value).toEqual('inactive');
                expect(component.searchTerm).toEqual('');
            });

        });

        describe('Collapse on blur', () => {
            beforeEach(fakeAsync(() => {
                fixture.detectChanges();
                component.toggleSearchBar();
                tick(200);
            }));

            it('should collapse search on blur when the collapseOnBlur is set to true', fakeAsync (() => {
                const searchVisibilityChangeSpy = spyOn(component.searchVisibility, 'emit');
                const resetEmitSpy = spyOn(component.reset, 'emit');
                component.collapseOnBlur = true;
                component.searchTerm = 'fake-search-term';
                component.onBlur({ relatedTarget: null });
                tick(200);

                expect(searchVisibilityChangeSpy).toHaveBeenCalledWith(false);
                expect(component.subscriptAnimationState.value).toEqual('inactive');
                expect(component.searchTerm).toEqual('');
                expect(resetEmitSpy).toHaveBeenCalled();
            }));

            it('should not collapse search on blur when the collapseOnBlur is set to false', () => {
                const searchVisibilityChangeSpy = spyOn(component.searchVisibility, 'emit');
                component.searchTerm = 'fake-search-term';
                component.collapseOnBlur = false;
                component.onBlur({ relatedTarget: null });

                expect(searchVisibilityChangeSpy).not.toHaveBeenCalled();
                expect(component.subscriptAnimationState.value).toEqual('active');
                expect(component.searchTerm).toEqual('fake-search-term');
            });
        });
    });
});
