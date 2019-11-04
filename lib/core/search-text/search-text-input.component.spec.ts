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

import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick, async } from '@angular/core/testing';
import { setupTestBed, UserPreferencesService } from 'core';
import { CoreTestingModule } from '../testing/core.testing.module';
import { SearchTextInputComponent } from './search-text-input.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

describe('SearchTextInputComponent', () => {

    let fixture: ComponentFixture<SearchTextInputComponent>;
    let component: SearchTextInputComponent;
    let debugElement: DebugElement;
    let element: HTMLElement;
    let userPreferencesService: UserPreferencesService;

    setupTestBed({
        imports: [CoreTestingModule],
        providers: [ UserPreferencesService ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchTextInputComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        element = fixture.nativeElement;
        userPreferencesService = TestBed.get(UserPreferencesService);
        component.focusListener = new Subject<any>();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('component rendering', () => {

        it('should display a search input field when specified', async(() => {
            component.inputType = 'search';
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        }));
    });

    describe('expandable option false', () => {

        beforeEach(() => {
            component.expandable = false;
            fixture.detectChanges();
        });

        it('search button should be hide', () => {
            const searchButton: any = element.querySelector('#adf-search-button');
            expect(searchButton).toBe(null);
        });

        it('should not have animation', () => {
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

            expect(component.subscriptAnimationState.params).toEqual({ 'transform': 'translateX(82%)' });
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

            expect(component.subscriptAnimationState.params).toEqual({ 'transform': 'translateX(-82%)' });
            discardPeriodicTasks();
        }));

        it('should set browser autocomplete to on when configured', async(() => {
            component.autocomplete = true;
            fixture.detectChanges();
            expect(element.querySelector('#adf-control-input').getAttribute('autocomplete')).toBe('on');
        }));
    });
});
