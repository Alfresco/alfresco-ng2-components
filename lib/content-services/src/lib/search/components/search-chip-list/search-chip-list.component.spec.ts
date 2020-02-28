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
import { CoreModule, setupTestBed } from '@alfresco/adf-core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchModule } from '../../search.module';
import { By } from '@angular/platform-browser';
import { SelectedBucket } from '../search-filter/search-filter.component';

@Component({
    selector: 'adf-test-component',
    template: `
        <adf-search-chip-list
            [searchFilter]="searchFilter"
            [clearAll]="allowClear">
        </adf-search-chip-list>
    `
})
class TestComponent {
    allowClear = true;
    searchFilter = {
        selectedBuckets: <SelectedBucket[]> [],
        unselectFacetBucket() {}
    };
}

describe('SearchChipListComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            SearchModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    it('should display clear button only when entries present', () => {
        fixture.detectChanges();

        let clearButton = fixture.debugElement.query(By.css(`[data-automation-id="reset-filter"]`));
        expect(clearButton).toBeNull();

        component.searchFilter.selectedBuckets = [{
            bucket: {
                count: 1,
                label: 'test',
                filterQuery: 'query'
            },
            field: null
        }];
        fixture.detectChanges();
        clearButton = fixture.debugElement.query(By.css(`[data-automation-id="reset-filter"]`));
        expect(clearButton).toBeDefined();
    });

    it('should reflect changes in the search filter', () => {
        const selectedBuckets = component.searchFilter.selectedBuckets;
        fixture.detectChanges();

        let chips = fixture.debugElement.queryAll(By.css(`[data-automation-id="chip-list-entry"]`));
        expect(chips.length).toBe(0);

        selectedBuckets.push({
            bucket: {
                count: 1,
                label: 'test',
                filterQuery: 'query'
            },
            field: null
        });

        fixture.detectChanges();
        chips = fixture.debugElement.queryAll(By.css(`[data-automation-id="chip-list-entry"]`));
        expect(chips.length).toBe(1);
    });

    it('should remove the entry upon remove button click', async () => {
        spyOn(component.searchFilter, 'unselectFacetBucket').and.callThrough();

        component.searchFilter.selectedBuckets = [
            {
                bucket: {
                    count: 1,
                    label: 'test',
                    filterQuery: 'query'
                },
                field: null
            }
        ];

        fixture.detectChanges();

        const chips = fixture.debugElement.queryAll(By.css(`[data-automation-id="chip-list-entry"] .mat-chip-remove`));
        chips[0].nativeElement.click();

        await fixture.whenStable();
        expect(component.searchFilter.unselectFacetBucket).toHaveBeenCalled();
    });

    it('should remove items from the search filter on clear button click', () => {
        spyOn(component.searchFilter, 'unselectFacetBucket').and.stub();

        const selectedBucket1: any = { field: { id: 1 }, bucket: {label: 'bucket1'} };
        const selectedBucket2: any = { field: { id: 2 }, bucket: {label: 'bucket2'} };
        component.searchFilter.selectedBuckets = [selectedBucket1, selectedBucket2];

        fixture.detectChanges();

        const closeButtons = fixture.debugElement.nativeElement.querySelectorAll('.mat-chip-remove');
        expect(closeButtons.length).toBe(2);

        closeButtons[0].click();
        fixture.detectChanges();

        expect(component.searchFilter.unselectFacetBucket).toHaveBeenCalledWith(selectedBucket1.field, selectedBucket1.bucket);
    });

    it('should disable clear mode via input properties', () => {
        spyOn(component.searchFilter, 'unselectFacetBucket').and.callThrough();

        component.allowClear = false;
        component.searchFilter.selectedBuckets = [
            {
                bucket: {
                    count: 1,
                    label: 'test',
                    filterQuery: 'query'
                },
                field: null
            }
        ];

        fixture.detectChanges();

        const chips = fixture.debugElement.queryAll(By.css(`[data-automation-id="chip-list-entry"] .mat-chip-remove`));
        expect(chips.length).toBe(1);

        const clearButton = fixture.debugElement.query(By.css(`[data-automation-id="reset-filter"]`));
        expect(clearButton).toBeNull();
    });
});
