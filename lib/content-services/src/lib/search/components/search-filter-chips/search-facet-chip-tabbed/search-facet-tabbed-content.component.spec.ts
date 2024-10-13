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
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';
import { SearchFilterList } from '../../../models/search-filter-list.model';
import { FacetField } from '../../../models/facet-field.interface';
import { SearchFacetFiltersService } from '../../../services/search-facet-filters.service';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { SearchFacetTabbedContentComponent } from './search-facet-tabbed-content.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness, MatTabHarness } from '@angular/material/tabs/testing';

describe('SearchFacetTabbedContentComponent', () => {
    let component: SearchFacetTabbedContentComponent;
    let fixture: ComponentFixture<SearchFacetTabbedContentComponent>;
    let queryBuilder: SearchQueryBuilderService;
    let searchFacetService: SearchFacetFiltersService;
    let loader: HarnessLoader;
    let queryBuilderUpdateSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(SearchFacetTabbedContentComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        searchFacetService = TestBed.inject(SearchFacetFiltersService);
        queryBuilderUpdateSpy = spyOn(queryBuilder, 'update').and.stub();

        const facet1: FacetField = { type: 'field', label: 'field', field: 'field', buckets: new SearchFilterList() };
        const facet2: FacetField = { type: 'field', label: 'field2', field: 'field2', buckets: new SearchFilterList() };

        component.tabbedFacet = {
            fields: ['field', 'field2'],
            label: 'LABEL',
            facets: {
                field: facet1,
                field2: facet2
            }
        };

        fixture.detectChanges();
    });

    /**
     * Get the tab label content
     * @returns list of native elements
     */
    async function getTabs(): Promise<MatTabHarness[]> {
        const tabGroup = await loader.getHarness(MatTabGroupHarness);

        return tabGroup.getTabs();
    }

    /**
     * Trigger component property change event
     */
    function triggerComponentChanges() {
        component.ngOnChanges({
            tabbedFacet: new SimpleChange(null, component.tabbedFacet, false)
        });
        fixture.detectChanges();
    }

    /**
     * Add new item to the bucket
     * @param field field name
     * @param displayValue value to display
     */
    function addBucketItem(field: string, displayValue: string) {
        component.tabbedFacet.facets[field].buckets.items.push({
            count: 1,
            label: displayValue,
            display: displayValue,
            filterQuery: ''
        });
        triggerComponentChanges();
    }

    it('should display 2 tabs with specific labels', async () => {
        const tabLabels = await getTabs();
        expect(tabLabels.length).toBe(2);
        expect(await tabLabels[0].getLabel()).toBe(component.tabbedFacet.facets['field'].label);
        expect(await tabLabels[1].getLabel()).toBe(component.tabbedFacet.facets['field2'].label);
    });

    it('should display creator tab as active initially and allow navigation', async () => {
        const tabs = await getTabs();
        expect(await tabs[0].isSelected()).toBeTrue();
        expect(await tabs[1].isSelected()).toBeFalse();

        await tabs[1].select();

        expect(await tabs[0].isSelected()).toBeFalse();
        expect(await tabs[1].isSelected()).toBeTrue();
    });

    it('should create empty selected options for each tab initially', () => {
        expect(component.selectedOptions['field']).toEqual([]);
        expect(component.selectedOptions['field2']).toEqual([]);
    });

    it('should update autocomplete options when buckets change', () => {
        addBucketItem('field', 'test');
        addBucketItem('field2', 'test2');
        expect(component.autocompleteOptions['field'].length).toBe(1);
        expect(component.autocompleteOptions['field'][0]).toEqual({ value: 'test' });
        expect(component.autocompleteOptions['field2'].length).toBe(1);
        expect(component.autocompleteOptions['field2'][0]).toEqual({ value: 'test2' });
    });

    it('should add buckets when items are selected', () => {
        spyOn(queryBuilder, 'addUserFacetBucket');
        addBucketItem('field', 'test');
        addBucketItem('field2', 'test2');
        component.onOptionsChange([{ value: 'test' }], 'field');
        expect(queryBuilder.addUserFacetBucket).toHaveBeenCalledWith('field', component.tabbedFacet.facets['field'].buckets.items[0]);
    });

    it('should remove buckets when items are unselected', () => {
        spyOn(queryBuilder, 'removeUserFacetBucket');
        addBucketItem('field', 'test');
        addBucketItem('field2', 'test2');
        component.onOptionsChange([], 'field');
        expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledWith('field', component.tabbedFacet.facets['field'].buckets.items[0]);
    });

    it('should update emit new display value when next elements are selected', () => {
        const selectedOption1 = 'test';
        const selectedOption2 = 'test2';
        spyOn(component.displayValue$, 'emit');
        addBucketItem('field', selectedOption1);
        addBucketItem('field', selectedOption2);
        component.onOptionsChange([{ value: selectedOption1 }, { value: selectedOption2 }], 'field');
        fixture.detectChanges();

        expect(component.displayValue$.emit).toHaveBeenCalledWith(
            `${component.tabbedFacet.facets['field'].label}_LABEL: ${selectedOption1}, ${selectedOption2} `
        );
    });

    it('should update display value when elements from both tabs are selected', () => {
        const selectedOption1 = 'test';
        const selectedOption2 = 'test2';
        const displayValueEmitterSpy = spyOn(component.displayValue$, 'emit');
        addBucketItem('field', selectedOption1);
        addBucketItem('field2', selectedOption2);
        component.onOptionsChange([{ value: selectedOption1 }], 'field');
        component.onOptionsChange([{ value: selectedOption2 }], 'field2');
        fixture.detectChanges();

        expect(displayValueEmitterSpy).toHaveBeenCalledTimes(2);
        expect(displayValueEmitterSpy.calls.allArgs()).toEqual([
            [`${component.tabbedFacet.facets['field'].label}_LABEL: ${selectedOption1} `],
            [
                `${component.tabbedFacet.facets['field'].label}_LABEL: ${selectedOption1} ${component.tabbedFacet.facets['field2'].label}_LABEL: ${selectedOption2} `
            ]
        ]);
    });

    it('should update search query and display value on submit', () => {
        spyOn(component, 'updateDisplayValue').and.callThrough();
        spyOn(component, 'submitValues').and.callThrough();
        spyOn(searchFacetService, 'updateSelectedBuckets').and.callThrough();
        component.submitValues();
        expect(component.submitValues).toHaveBeenCalled();
        expect(queryBuilderUpdateSpy).toHaveBeenCalled();
        expect(component.updateDisplayValue).toHaveBeenCalled();
        expect(searchFacetService.updateSelectedBuckets).toHaveBeenCalled();
    });

    it('should update search query and display value on reset', () => {
        spyOn(component, 'updateDisplayValue').and.callThrough();
        component.reset();
        expect(queryBuilderUpdateSpy).toHaveBeenCalled();
        expect(component.updateDisplayValue).toHaveBeenCalled();
    });

    it('should not call queryBuilder.update on options change', () => {
        component.onOptionsChange([{ value: 'test' }], 'field');
        expect(queryBuilderUpdateSpy).not.toHaveBeenCalled();
    });
});
