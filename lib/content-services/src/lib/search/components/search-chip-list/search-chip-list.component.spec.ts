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

import { Component } from '@angular/core';
import { setupTestBed, CoreModule } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { SearchModule } from '../../search.module';

@Component({
    selector: 'adf-test-component',
    template: `
        <adf-search-chip-list [searchFilter]="searchFilter"></adf-search-chip-list>
    `
})
class TestComponent {

    searchFilter = {
        selectedBuckets: [],
        unselectFacetBucket() {}
    };
}

describe('SearchChipListComponent', () => {

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            SearchModule
        ],
        declarations: [
            TestComponent
        ]
    });

    it('should remove items from the search filter', () => {
        const fixture = TestBed.createComponent(TestComponent);
        const component: TestComponent = fixture.componentInstance;

        spyOn(component.searchFilter, 'unselectFacetBucket').and.stub();

        const selectedBucket1 = {field: { id: 1 }, bucket: {label: 'bucket1'}};
        const selectedBucket2 = {field: { id: 2 }, bucket: {label: 'bucket2'}};
        component.searchFilter.selectedBuckets = [selectedBucket1, selectedBucket2];

        fixture.detectChanges();

        const closeButtons = fixture.debugElement.nativeElement.querySelectorAll('.mat-chip-remove');
        expect(closeButtons.length).toBe(2);

        closeButtons[0].click();
        fixture.detectChanges();

        expect(component.searchFilter.unselectFacetBucket).toHaveBeenCalledWith(selectedBucket1.field, selectedBucket1.bucket);
    });

});
