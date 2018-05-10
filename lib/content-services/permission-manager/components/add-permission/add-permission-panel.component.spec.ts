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
import { AddPermissionPanelComponent } from './add-permission-panel.component';
import { By } from '@angular/platform-browser';
import { SearchService, setupTestBed, SearchConfigurationService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { fakeAuthorityListResult } from '../../../mock/add-permission.component.mock';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { DebugElement } from '@angular/core';

/*tslint:disable:ban*/
fdescribe('AddPermissionPanelComponent', () => {

    let fixture: ComponentFixture<AddPermissionPanelComponent>;
    let component: AddPermissionPanelComponent;
    let element: HTMLElement;
    let searchApiService: SearchService;
    let debugElement: DebugElement;

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [SearchService, SearchConfigurationService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPermissionPanelComponent);
        debugElement = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    function typeWordIntoSearchInput(word: string): void {
        let inputDebugElement = debugElement.query(By.css('#searchInput'));
        inputDebugElement.nativeElement.value = word;
        inputDebugElement.nativeElement.focus();
        inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
    }

    it('should be able to render the component', () => {
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
    });

    it('should show search results when user types something', async(() => {
        searchApiService = fixture.componentRef.injector.get(SearchService);
        spyOn(searchApiService, 'search').and.returnValue(Observable.of(fakeAuthorityListResult));
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
        typeWordIntoSearchInput('a');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(element.querySelector('#adf-add-permission-authority-results')).not.toBeNull();
            expect(element.querySelector('#result_option_0')).not.toBeNull();
        });
    }));

    it('should emit a select event with the selected items when an item is clicked', async(() => {
        searchApiService = fixture.componentRef.injector.get(SearchService);
        spyOn(searchApiService, 'search').and.returnValue(Observable.of(fakeAuthorityListResult));
        component.select.subscribe((items) => {
            expect(items).not.toBeNull();
            expect(items[0].entry.id).toBeDefined();
            expect(items[0].entry.id).not.toBeNull();
            expect(items[0].entry.id).toBe(fakeAuthorityListResult.list.entries[0].entry.id);
        });

        typeWordIntoSearchInput('a');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const listElement: DebugElement = fixture.debugElement.query(By.css('#result_option_0'));
            expect(listElement).not.toBeNull();
            listElement.triggerEventHandler('click', {});
        });
    }));

    it('should show the icon related on the nodeType', async(() => {
        searchApiService = fixture.componentRef.injector.get(SearchService);
        spyOn(searchApiService, 'search').and.returnValue(Observable.of(fakeAuthorityListResult));
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
        typeWordIntoSearchInput('a');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(element.querySelector('#adf-add-permission-authority-results')).not.toBeNull();
            expect(element.querySelector('#result_option_0 #add-person-icon')).toBeDefined();
            expect(element.querySelector('#result_option_0 #add-person-icon')).not.toBeNull();
            expect(element.querySelector('#result_option_2 #add-group-icon')).toBeDefined();
            expect(element.querySelector('#result_option_2 #add-group-icon')).not.toBeNull();
        });
    }));

    it('should clear the search when user delete the search input field', async(() => {
        searchApiService = fixture.componentRef.injector.get(SearchService);
        spyOn(searchApiService, 'search').and.returnValue(Observable.of(fakeAuthorityListResult));
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
        typeWordIntoSearchInput('a');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(element.querySelector('#adf-add-permission-authority-results')).not.toBeNull();
            expect(element.querySelector('#result_option_0')).not.toBeNull();
            const clearButton = fixture.debugElement.query(By.css('#adf-permission-clear-input'));
            expect(clearButton).not.toBeNull();
            clearButton.triggerEventHandler('click', {});
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#adf-add-permission-authority-results')).toBeNull();
            });
        });
    }));

    it('should remove element from selection when is clicked and already selected', async(() => {
        searchApiService = fixture.componentRef.injector.get(SearchService);
        spyOn(searchApiService, 'search').and.returnValue(Observable.of(fakeAuthorityListResult));
        component.selectedItems.push(fakeAuthorityListResult.list.entries[0]);
        component.select.subscribe((items) => {
            expect(items).not.toBeNull();
            expect(items[0]).toBeUndefined();
            expect(component.selectedItems.length).toBe(0);
        });

        typeWordIntoSearchInput('a');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const listElement: DebugElement = fixture.debugElement.query(By.css('#result_option_0'));
            expect(listElement).not.toBeNull();
            listElement.triggerEventHandler('click', {});
        });
    }));

});
