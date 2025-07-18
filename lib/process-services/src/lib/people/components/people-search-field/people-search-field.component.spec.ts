/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { PeopleSearchFieldComponent } from './people-search-field.component';
import { By } from '@angular/platform-browser';

describe('PeopleSearchFieldComponent', () => {
    let component: PeopleSearchFieldComponent;
    let fixture: ComponentFixture<PeopleSearchFieldComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleSearchFieldComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();
    });

    it('should have the proper placeholder by default', () => {
        const input = element.querySelector<HTMLElement>('[data-automation-id="adf-people-search-input"]') as HTMLInputElement;
        expect(input.placeholder).toBe('ADF_TASK_LIST.PEOPLE.SEARCH_USER');
    });

    it('should have the overridden placeholder if set as input parameter', async () => {
        component.placeholder = 'Arcadia Bay';

        fixture.detectChanges();
        await fixture.whenStable();

        const input = element.querySelector<HTMLElement>('[data-automation-id="adf-people-search-input"]') as HTMLInputElement;
        expect(input.placeholder).toBe('Arcadia Bay');
    });

    it('should reset the user on reset method invocation', () => {
        let searchField = debug.query(By.css('[data-automation-id="adf-people-search-input"]')).nativeElement;
        searchField.value = 'User to be searched';
        fixture.detectChanges();

        component.reset();

        searchField = debug.query(By.css('[data-automation-id="adf-people-search-input"]')).nativeElement;
        expect(searchField.value).toBe('');
    });
});
