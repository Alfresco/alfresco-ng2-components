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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterChipsComponent } from './search-filter-chips.component';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { By } from '@angular/platform-browser';
import { SearchFacetFieldComponent } from '../search-facet-field/search-facet-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFilterList } from '../../models/search-filter-list.model';
import {
    disabledCategories,
    filteredResult,
    mockSearchResult,
    searchFilter,
    simpleCategories,
    stepOne,
    stepThree,
    stepTwo
} from '../../../mock';
import { getAllMenus } from '../search-filter/search-filter.component.spec';
import { AppConfigService } from '@alfresco/adf-core';

describe('SearchFilterChipsComponent', () => {
    let fixture: ComponentFixture<SearchFilterChipsComponent>;
    let searchFacetFiltersService: SearchFacetFiltersService;
    let queryBuilder: SearchQueryBuilderService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        appConfigService = TestBed.inject(AppConfigService);
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
        fixture = TestBed.createComponent(SearchFilterChipsComponent);
    });

    it('should fetch facet fields from response payload and show the already checked items', () => {
        spyOn(queryBuilder, 'execute').and.stub();
        queryBuilder.config = {
            categories: [],
            facetFields: { fields: [
                    { label: 'f1', field: 'f1' },
                    { label: 'f2', field: 'f2' }
                ]},
            facetQueries: {
                queries: []
            }
        };

        searchFacetFiltersService.responseFacets =  [
            { type: 'field', label: 'f1', field: 'f1', buckets: new SearchFilterList([
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }]) },
            { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList()}
        ];
        searchFacetFiltersService.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[0]);

        const serverResponseFields: any = [
            { type: 'field', label: 'f1', field: 'f1', buckets: [
                    { label: 'b1', metrics: [{value: {count: 6}}], filterQuery: 'filter' },
                    { label: 'b2', metrics: [{value: {count: 1}}], filterQuery: 'filter2' }] },
            { type: 'field', label: 'f2', field: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facets: serverResponseFields
                }
            }
        };

        fixture.detectChanges();

        const facetChip = fixture.debugElement.query(By.css('[data-automation-id="search-fact-chip-f1"] mat-chip'));
        facetChip.triggerEventHandler('click', { stopPropagation: () => null });

        fixture.detectChanges();

        const facetField: SearchFacetFieldComponent = fixture.debugElement.query(By.css('adf-search-facet-field')).componentInstance;
        facetField.selectFacetBucket({ field: 'f1', label: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[1]);

        searchFacetFiltersService.onDataLoaded(data);
        expect(searchFacetFiltersService.responseFacets.length).toEqual(2);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].checked).toEqual(true, 'should show the already checked item');
    });

    it('should fetch facet fields from response payload and show the newly checked items', () => {
        spyOn(queryBuilder, 'execute').and.stub();
        queryBuilder.config = {
            categories: [],
            facetFields: { fields: [
                    { label: 'f1', field: 'f1' },
                    { label: 'f2', field: 'f2' }
                ]},
            facetQueries: {
                queries: []
            }
        };

        searchFacetFiltersService.responseFacets = [
            { type: 'field', label: 'f1', field: 'f1', buckets: new SearchFilterList([
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }]) },
            { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList()}
        ];
        queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[0]);

        const serverResponseFields: any = [
            { type: 'field', label: 'f1', field: 'f1', buckets: [
                    { label: 'b1', metrics: [{value: {count: 6}}], filterQuery: 'filter' },
                    { label: 'b2', metrics: [{value: {count: 1}}], filterQuery: 'filter2' }] },
            { type: 'field', label: 'f2', field: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facets: serverResponseFields
                }
            }
        };
        fixture.detectChanges();

        const facetChip = fixture.debugElement.query(By.css('[data-automation-id="search-fact-chip-f1"] mat-chip'));
        facetChip.triggerEventHandler('click', { stopPropagation: () => null });

        fixture.detectChanges();

        const facetField: SearchFacetFieldComponent = fixture.debugElement.query(By.css('adf-search-facet-field')).componentInstance;
        facetField.selectFacetBucket({ field: 'f1', label: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[1]);

        searchFacetFiltersService.onDataLoaded(data);
        expect(searchFacetFiltersService.responseFacets.length).toEqual(2);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].checked).toEqual(true, 'should show the newly checked item');
    });

    it('should show buckets with 0 values when there are no facet fields on the response payload', () => {
        spyOn(queryBuilder, 'execute').and.stub();
        queryBuilder.config = {
            categories: [],
            facetFields: { fields: [
                    { label: 'f1', field: 'f1' },
                    { label: 'f2', field: 'f2' }
                ]},
            facetQueries: {
                queries: []
            }
        };

        searchFacetFiltersService.responseFacets = [
            { type: 'field', label: 'f1', field: 'f1', buckets: new SearchFilterList( [
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }]) },
            { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList() }
        ];
        queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[0]);
        const data = {
            list: {
                context: {}
            }
        };
        fixture.detectChanges();

        const facetChip = fixture.debugElement.query(By.css('[data-automation-id="search-fact-chip-f1"] mat-chip'));
        facetChip.triggerEventHandler('click', { stopPropagation: () => null });

        fixture.detectChanges();

        const facetField: SearchFacetFieldComponent = fixture.debugElement.query(By.css('adf-search-facet-field')).componentInstance;
        facetField.selectFacetBucket({ field: 'f1', label: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[1]);
        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(0);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].count).toEqual(0);
    });

    it('should update query builder upon resetting selected queries', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

        const queryResponse = {
            field: 'query-response',
            label: 'query response',
            buckets: new SearchFilterList([
                    { label: 'q1', query: 'q1', checked: true, metrics: [{value: {count: 1}}] },
                    { label: 'q2', query: 'q2', checked: false, metrics: [{value: {count: 1}}] },
                    { label: 'q3', query: 'q3', checked: true, metrics: [{value: {count: 1}}] }])
            } as any;
        searchFacetFiltersService.responseFacets = [queryResponse];

        fixture.detectChanges();

        const facetChip = fixture.debugElement.query(By.css(`[data-automation-id="search-fact-chip-query-response"] mat-chip`));
        facetChip.triggerEventHandler('click', { stopPropagation: () => null });
        fixture.detectChanges();
        const facetField: SearchFacetFieldComponent = fixture.debugElement.query(By.css('adf-search-facet-field')).componentInstance;

        facetField.resetSelectedBuckets(queryResponse);

        expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledTimes(3);
        expect(queryBuilder.update).toHaveBeenCalled();

        for (const entry of searchFacetFiltersService.responseFacets[0].buckets.items) {
            expect(entry.checked).toEqual(false);
        }
    });

    describe('widgets', () => {

        it('should not show the disabled widget',  async () => {
            appConfigService.config.search = { categories: disabledCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(0);
        });

        it('should show the widgets only if configured',  async () => {
            appConfigService.config.search = { categories: simpleCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(2);

            const titleElements = fixture.debugElement.queryAll(By.css('.adf-search-filter-placeholder'));
            expect(titleElements.map(title => title.nativeElement.innerText.trim())).toEqual(['Name:', 'Type:']);
        });

        it('should be update the search query when name changed', async () => {
            spyOn(queryBuilder, 'update').and.stub();
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();
            let chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(6);

            fixture.detectChanges();
            const searchChip = fixture.debugElement.query(By.css(`[data-automation-id="search-filter-chip-Name"]`));
            searchChip.triggerEventHandler('click', { stopPropagation: () => null });
            fixture.detectChanges();

            const inputElement = fixture.debugElement.query(By.css('[data-automation-id="search-field-Name"] input'));
            inputElement.triggerEventHandler('change', { target: { value: '*' } });
            expect(queryBuilder.update).toHaveBeenCalled();

            queryBuilder.executed.next(mockSearchResult);
            await fixture.whenStable();
            fixture.detectChanges();

            chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(8);
        });

        it('should show the long facet options list with pagination', () => {
            const field = `[data-automation-id="search-field-Size facet queries"]`;
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            fixture.detectChanges();
            const searchChip = fixture.debugElement.query(By.css(`[data-automation-id="search-filter-chip-Size facet queries"]`));
            searchChip.triggerEventHandler('click', { stopPropagation: () => null });
            fixture.detectChanges();

            let sizes = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepOne);

            let moreButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            let lessButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));

            expect(lessButton).toEqual(null);
            expect(moreButton).toBeDefined();

            moreButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            sizes = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepTwo);

            moreButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toBeDefined();
            expect(moreButton).toBeDefined();

            moreButton.triggerEventHandler('click', {});
            fixture.detectChanges();
            sizes = getAllMenus(`${field} mat-checkbox`, fixture);

            expect(sizes).toEqual(stepThree);

            moreButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toBeDefined();
            expect(moreButton).toEqual(null);

            lessButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            sizes = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepTwo);

            moreButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toBeDefined();
            expect(moreButton).toBeDefined();

            lessButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            sizes = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepOne);

            moreButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${field} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toEqual(null);
            expect(moreButton).toBeDefined();
        });

        it('should not show facets if filter is not available', () => {
            const chip = '[data-automation-id="search-filter-chip-Size facet queries"]';
            const filter = { ...searchFilter };
            delete filter.facetQueries;

            appConfigService.config.search = filter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            const facetElement = fixture.debugElement.query(By.css(chip));
            expect(facetElement).toEqual(null);
        });

        it('should search the facets options and select it', () => {
            const field = `[data-automation-id="search-field-Size facet queries"]`;
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            spyOn(queryBuilder, 'update').and.stub();

            const searchChip = fixture.debugElement.query(By.css(`[data-automation-id="search-filter-chip-Size facet queries"]`));
            searchChip.triggerEventHandler('click', { stopPropagation: () => null });
            fixture.detectChanges();

            const inputElement = fixture.debugElement.query(By.css(`${field} input`));
            inputElement.nativeElement.value = 'Extra';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            let filteredMenu = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(['Extra Small (10239)']);

            inputElement.nativeElement.value = 'my';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            filteredMenu = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(filteredResult);

            const clearButton = fixture.debugElement.query(By.css(`${field} mat-form-field button`));
            clearButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            filteredMenu = getAllMenus(`${field} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(stepOne);

            const firstOption = fixture.debugElement.query(By.css(`${field} mat-checkbox`));
            firstOption.triggerEventHandler('change', { checked: true });
            fixture.detectChanges();

            const checkedOption = fixture.debugElement.query(By.css(`${field} mat-checkbox.mat-checkbox-checked`));
            expect(checkedOption.nativeElement.innerText).toEqual('Extra Small (10239)');

            expect(queryBuilder.update).toHaveBeenCalledTimes(1);
        });

    });
});
