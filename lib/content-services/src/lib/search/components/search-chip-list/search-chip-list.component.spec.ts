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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

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
        selectedBuckets: [],
        unselectFacetBucket: () => {}
    };
}

describe('SearchChipListComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let searchFacetFiltersService: SearchFacetFiltersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            declarations: [
                TestComponent
            ]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
    });

    it('should display clear button only when entries present', () => {
        fixture.detectChanges();

        let clearButton = fixture.debugElement.query(By.css(`[data-automation-id="reset-filter"]`));
        expect(clearButton).toBeNull();

        searchFacetFiltersService.selectedBuckets = [{
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
        const selectedBuckets = searchFacetFiltersService.selectedBuckets;
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
        spyOn(searchFacetFiltersService, 'unselectFacetBucket').and.callThrough();

        searchFacetFiltersService.selectedBuckets = [
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
        expect(searchFacetFiltersService.unselectFacetBucket).toHaveBeenCalled();
    });

    it('should remove items from the search filter on clear button click', () => {
        spyOn(searchFacetFiltersService, 'unselectFacetBucket').and.stub();

        const selectedBucket1: any = { field: { id: 1 }, bucket: {label: 'bucket1'} };
        const selectedBucket2: any = { field: { id: 2 }, bucket: {label: 'bucket2'} };
        searchFacetFiltersService.selectedBuckets = [selectedBucket1, selectedBucket2];

        fixture.detectChanges();

        const closeButtons = fixture.debugElement.nativeElement.querySelectorAll('.mat-chip-remove');
        expect(closeButtons.length).toBe(2);

        closeButtons[0].click();
        fixture.detectChanges();

        expect(searchFacetFiltersService.unselectFacetBucket).toHaveBeenCalledWith(selectedBucket1.field, selectedBucket1.bucket);
    });

    it('should disable clear mode via input properties', () => {
        spyOn(component.searchFilter, 'unselectFacetBucket').and.callThrough();

        component.allowClear = false;
        searchFacetFiltersService.selectedBuckets = [
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
