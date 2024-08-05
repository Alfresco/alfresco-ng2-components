/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AddPermissionPanelComponent } from './add-permission-panel.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { fakeAuthorityListResult, fakeNameListResult } from '../../../mock/add-permission.component.mock';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchService } from '../../../search/services/search.service';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectionListHarness } from '@angular/material/list/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('AddPermissionPanelComponent', () => {
    let fixture: ComponentFixture<AddPermissionPanelComponent>;
    let component: AddPermissionPanelComponent;
    let element: HTMLElement;
    let searchApiService: SearchService;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, AddPermissionPanelComponent]
        });
        fixture = TestBed.createComponent(AddPermissionPanelComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        searchApiService = fixture.componentRef.injector.get(SearchService);

        element = fixture.nativeElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    const typeWordIntoSearchInput = async (word: string): Promise<void> => {
        const input = await loader.getHarness(MatInputHarness.with({ selector: '#searchInput' }));

        return input.setValue(word);
    };

    it('should be able to render the component', () => {
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
    });

    it('should show search results when user types something', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();

        await typeWordIntoSearchInput('a');

        expect(element.querySelector('#adf-add-permission-authority-results')).not.toBeNull();
        expect(element.querySelector('#result_option_0')).not.toBeNull();
    });

    it('should emit a select event with the selected items when an item is clicked', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));
        component.select.subscribe((items) => {
            expect(items).not.toBeNull();
            expect(items[0].entry.id).toBeDefined();
            expect(items[0].entry.id).not.toBeNull();
            expect(items[0].entry.id).toBe(fakeAuthorityListResult.list.entries[0].entry.id);
        });

        await typeWordIntoSearchInput('a');

        const listElement: DebugElement = fixture.debugElement.query(By.css('#result_option_0'));
        expect(listElement).toBeTruthy();
        listElement.triggerEventHandler('click', { /* empty */ });
    });

    it('should show the icon related on the nodeType', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();

        await typeWordIntoSearchInput('a');

        expect(element.querySelector('#adf-add-permission-authority-results')).toBeTruthy();
        expect(element.querySelector('#result_option_0')).toBeTruthy();
        expect(element.querySelector('#result_option_1')).toBeTruthy();
        expect(element.querySelector('#result_option_2')).toBeTruthy();
    });

    it('should clear the search when user delete the search input field', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
        await typeWordIntoSearchInput('a');

        expect(element.querySelector('#result_option_0')).toBeTruthy();

        const clearButton = fixture.debugElement.query(By.css('#adf-permission-clear-input'));
        expect(clearButton).toBeTruthy();
        clearButton.triggerEventHandler('click', { /* empty */ });

        fixture.detectChanges();
        await fixture.whenStable();
        expect(element.querySelector('#result_option_0')).toBeNull();
    });

    it('should remove element from selection on click when is already selected', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));

        await typeWordIntoSearchInput('a');

        let selectedUserIcon = fixture.debugElement.query(By.css('.adf-people-select-icon'));
        const listElement: DebugElement = fixture.debugElement.query(By.css('#result_option_0'));
        expect(listElement).toBeTruthy();
        expect(selectedUserIcon).toBeFalsy();

        listElement.triggerEventHandler('click', { /* empty */ });
        fixture.detectChanges();

        selectedUserIcon = fixture.debugElement.query(By.css('.adf-people-select-icon'));
        expect(selectedUserIcon).toBeTruthy();

        listElement.triggerEventHandler('click', { /* empty */ });
        fixture.detectChanges();

        selectedUserIcon = fixture.debugElement.query(By.css('.adf-people-select-icon'));
        expect(selectedUserIcon).toBeFalsy();
    });

    it('should always show as extra result the everyone group', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));
        component.selectedItems.push(fakeAuthorityListResult.list.entries[0]);

        await typeWordIntoSearchInput('a');

        expect(element.querySelector('#adf-add-permission-authority-results')).toBeTruthy();
        expect(element.querySelector('#adf-add-permission-group-everyone')).toBeTruthy();
        expect(element.querySelector('#result_option_0')).toBeTruthy();
        expect(element.querySelector('#result_option_1')).toBeTruthy();
        expect(element.querySelector('#result_option_2')).toBeTruthy();
    });

    it('should show everyone group when search return no result', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of({ list: { entries: [] } }));
        component.selectedItems.push(fakeAuthorityListResult.list.entries[0]);

        await typeWordIntoSearchInput('a');

        expect(element.querySelector('#adf-add-permission-authority-results')).not.toBeNull();
        expect(element.querySelector('#adf-add-permission-group-everyone')).toBeDefined();
        expect(element.querySelector('#adf-add-permission-group-everyone')).not.toBeNull();
    });

    it('should show first and last name of users', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeNameListResult));
        component.selectedItems.push(fakeNameListResult.list.entries[0]);
        component.selectedItems.push(fakeNameListResult.list.entries[1]);

        await typeWordIntoSearchInput('a');

        const list = await loader.getHarness(MatSelectionListHarness);
        const items = await list.getItems();
        expect(items.length).toBe(3);
        expect(await items[0].getText()).not.toEqual(await items[1].getText());
    });

    it('should emit unique element in between multiple search', async () => {
        spyOn(searchApiService, 'search').and.returnValue(of(fakeAuthorityListResult));
        let searchAttempt = 0;

        component.select.subscribe((items) => {
            searchAttempt++;
            expect(items.length).toBe(1);
            expect(items[0].entry.id).toBeDefined();
            expect(items[0].entry.id).not.toBeNull();
            expect(items[0].entry.id).toBe(fakeAuthorityListResult.list.entries[0].entry.id);
        });

        await typeWordIntoSearchInput('a');

        let listElement: DebugElement = fixture.debugElement.query(By.css('#result_option_0'));
        expect(listElement).not.toBeNull();
        listElement.triggerEventHandler('click', { /* empty */ });
        fixture.detectChanges();

        const clearButton = fixture.debugElement.query(By.css('#adf-permission-clear-input'));
        expect(clearButton).not.toBeNull();
        clearButton.triggerEventHandler('click', { /* empty */ });
        fixture.detectChanges();

        await typeWordIntoSearchInput('abc');

        listElement = fixture.debugElement.query(By.css('#result_option_0'));
        expect(listElement).not.toBeNull();

        listElement.triggerEventHandler('click', { /* empty */ });
        expect(searchAttempt).toBe(2);
    });
});
