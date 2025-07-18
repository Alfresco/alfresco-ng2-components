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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness, MatChipRemoveHarness } from '@angular/material/chips/testing';
import { SearchChipListComponent } from './search-chip-list.component';

@Component({
    selector: 'adf-test-component',
    imports: [SearchChipListComponent],
    template: ` <adf-search-chip-list [searchFilter]="searchFilter" [clearAll]="allowClear" /> `
})
class TestComponent {
    allowClear = true;
    searchFilter = {
        selectedBuckets: [],
        unselectFacetBucket: () => {}
    } as any;
}

describe('SearchChipListComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let searchFacetFiltersService: SearchFacetFiltersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);

        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should display clear button only when entries present', () => {
        fixture.detectChanges();

        let clearButton = fixture.debugElement.query(By.css(`[data-automation-id="reset-filter"]`));
        expect(clearButton).toBeNull();

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
        clearButton = fixture.debugElement.query(By.css(`[data-automation-id="reset-filter"]`));
        expect(clearButton).toBeDefined();
    });

    it('should reflect changes in the search filter', async () => {
        const selectedBuckets = searchFacetFiltersService.selectedBuckets;
        fixture.detectChanges();

        let chips = await loader.getAllHarnesses(MatChipHarness.with({ selector: '[data-automation-id="chip-list-entry"]' }));
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
        chips = await loader.getAllHarnesses(MatChipHarness.with({ selector: '[data-automation-id="chip-list-entry"]' }));
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

        const removeButton = await loader.getHarness(MatChipRemoveHarness.with({ ancestor: `[data-automation-id="chip-list-entry"]` }));
        await removeButton.click();

        await fixture.whenStable();
        expect(searchFacetFiltersService.unselectFacetBucket).toHaveBeenCalled();
    });

    it('should remove items from the search filter on clear button click', async () => {
        spyOn(searchFacetFiltersService, 'unselectFacetBucket').and.stub();

        const selectedBucket1: any = { field: { id: 1 }, bucket: { label: 'bucket1' } };
        const selectedBucket2: any = { field: { id: 2 }, bucket: { label: 'bucket2' } };
        searchFacetFiltersService.selectedBuckets = [selectedBucket1, selectedBucket2];

        fixture.detectChanges();

        const closeButtons = await loader.getAllHarnesses(MatChipRemoveHarness);
        expect(closeButtons.length).toBe(2);
        await closeButtons[0].click();

        expect(searchFacetFiltersService.unselectFacetBucket).toHaveBeenCalledWith(selectedBucket1.field, selectedBucket1.bucket);
    });

    it('should disable clear mode via input properties', async () => {
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

        const closeButtons = await loader.getAllHarnesses(MatChipRemoveHarness.with({ ancestor: `[data-automation-id="chip-list-entry"]` }));
        expect(closeButtons.length).toBe(1);

        const hasClearButton = await loader.hasHarness(MatChipRemoveHarness.with({ selector: `[data-automation-id="reset-filter"]` }));
        expect(hasClearButton).toBe(false);
    });
});
