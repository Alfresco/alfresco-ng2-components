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

import { SearchFilterComponent } from './search-filter.component';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';
import { SearchService } from  '../../services/search.service';
import { Subject } from 'rxjs';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import {
    disabledCategories,
    expandableCategories,
    expandedCategories,
    filteredResult,
    getMockSearchResultWithResponseBucket,
    mockSearchResult,
    searchFilter,
    simpleCategories,
    stepOne,
    stepThree,
    stepTwo
} from '../../../mock';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { SearchFacetFieldComponent } from '../search-facet-field/search-facet-field.component';

describe('SearchFilterComponent', () => {
    let fixture: ComponentFixture<SearchFilterComponent>;
    let component: SearchFilterComponent;
    let queryBuilder: SearchQueryBuilderService;
    let appConfigService: AppConfigService;
    const searchMock: any = {
        dataLoaded: new Subject()
    };
    let searchFacetFiltersService: SearchFacetFiltersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            providers: [
                { provide: SearchService, useValue: searchMock }
            ]
        });
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        fixture = TestBed.createComponent(SearchFilterComponent);
        appConfigService = TestBed.inject(AppConfigService);
        const translationService = fixture.debugElement.injector.get(TranslationService);
        spyOn(translationService, 'instant').and.callFake((key) => key ? `${key}_translated` : null);
        component = fixture.componentInstance;
    });

    afterEach(() => fixture.destroy());

    describe('component', () => {
        beforeEach(() => fixture.detectChanges());

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

            searchFacetFiltersService.responseFacets = [
                { type: 'field', label: 'f1', field: 'f1', buckets: new SearchFilterList([
                            { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                            { label: 'b2', count: 1, filterQuery: 'filter2' }]) },
                { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList([]) }
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
                { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList([]) }
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
                { type: 'field', label: 'f1', field: 'f1', buckets: new SearchFilterList([
                            { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                            { label: 'b2', count: 1, filterQuery: 'filter2' }]) },
                { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList() }
            ];
            searchFacetFiltersService.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[0]);
            const data = {
                list: {
                    context: {}
                }
            };

            fixture.detectChanges();
            const facetField: SearchFacetFieldComponent = fixture.debugElement.query(By.css('adf-search-facet-field')).componentInstance;
            facetField.selectFacetBucket({ label: 'f1', field: 'f1' }, searchFacetFiltersService.responseFacets[0].buckets.items[1]);
            searchFacetFiltersService.onDataLoaded(data);

            expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(0);
            expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].count).toEqual(0);
        });

        it('should update query builder upon resetting selected queries', () => {
            spyOn(queryBuilder, 'update').and.stub();
            spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

            const queryResponse = {
                label: 'query response',
                buckets: new SearchFilterList([
                        { label: 'q1', query: 'q1', checked: true, metrics: [{value: {count: 1}}] },
                        { label: 'q2', query: 'q2', checked: false, metrics: [{value: {count: 1}}] },
                        { label: 'q3', query: 'q3', checked: true, metrics: [{value: {count: 1}}] }])
            } as any;
            searchFacetFiltersService.responseFacets = [queryResponse];

            fixture.detectChanges();
            const facetField: SearchFacetFieldComponent = fixture.debugElement.query(By.css('adf-search-facet-field')).componentInstance;
            facetField.resetSelectedBuckets(queryResponse);

            expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledTimes(3);
            expect(queryBuilder.update).toHaveBeenCalled();

            for (const entry of searchFacetFiltersService.responseFacets[0].buckets.items) {
                expect(entry.checked).toEqual(false);
            }
        });
     });

    describe('widgets', () => {

        it('should have expandable categories', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            queryBuilder.categories = expandableCategories;

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(1);

            const element: HTMLElement = panels[0].nativeElement;

            (element.childNodes[0] as HTMLElement).click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.classList.contains('mat-expanded')).toBeTruthy();

            (element.childNodes[0] as HTMLElement).click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.classList.contains('mat-expanded')).toEqual(false);
        });

        it('should not show the disabled widget', async () => {
            appConfigService.config.search = { categories: disabledCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(0);
        });

        it('should show the widget in expanded mode', async () => {
            appConfigService.config.search = { categories: expandedCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(1);

            const title = fixture.debugElement.query(By.css('.mat-expansion-panel-header-title'));
            expect(title.nativeElement.innerText.trim()).toBe('Type');

            const element: HTMLElement = panels[0].nativeElement;
            expect(element.classList.contains('mat-expanded')).toBeTruthy();

            (element.childNodes[0] as HTMLElement).click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.classList.contains('mat-expanded')).toEqual(false);
        });

        it('should show the widgets only if configured', async () => {
            appConfigService.config.search = { categories: simpleCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(2);

            const titleElements = fixture.debugElement.queryAll(By.css('.mat-expansion-panel-header-title'));
            expect(titleElements.map(title => title.nativeElement.innerText.trim())).toEqual(['Name', 'Type']);
        });

        it('should be update the search query when name changed', async () => {
            spyOn(queryBuilder, 'update').and.stub();
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();
            let panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(6);

            const inputElement = fixture.debugElement.query(By.css('[data-automation-id="expansion-panel-Name"] input'));
            inputElement.triggerEventHandler('change', { target: { value: '*' } });
            expect(queryBuilder.update).toHaveBeenCalled();

            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(8);
        });

        it('should add a panel only for the response buckets that are present in the response', async () => {
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const inputElement = fixture.debugElement.query(By.css('[data-automation-id="expansion-panel-Name"] input'));
            inputElement.triggerEventHandler('change', { target: { value: '*' } });

            queryBuilder.executed.next(getMockSearchResultWithResponseBucket());
            fixture.detectChanges();

            const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));

            expect(panels.length).toBe(9);
        });

        it('should show the long facet options list with pagination', () => {
            const panel = '[data-automation-id="expansion-panel-Size facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            let sizes = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepOne);

            let moreButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            let lessButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));

            expect(lessButton).toEqual(null);
            expect(moreButton).toBeDefined();

            moreButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            sizes = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepTwo);

            moreButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toBeDefined();
            expect(moreButton).toBeDefined();

            moreButton.triggerEventHandler('click', {});
            fixture.detectChanges();
            sizes = getAllMenus(`${panel} mat-checkbox`, fixture);

            expect(sizes).toEqual(stepThree);

            moreButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toBeDefined();
            expect(moreButton).toEqual(null);

            lessButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            sizes = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepTwo);

            moreButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toBeDefined();
            expect(moreButton).toBeDefined();

            lessButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            sizes = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(sizes).toEqual(stepOne);

            moreButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]`));
            lessButton = fixture.debugElement.query(By.css(`${panel} button[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]`));
            expect(lessButton).toEqual(null);
            expect(moreButton).toBeDefined();
        });

        it('should not show facets if filter is not available', () => {
            const panel = '[data-automation-id="expansion-panel-Size facet queries"]';
            const filter = { ...searchFilter };
            delete filter.facetQueries;

            appConfigService.config.search = filter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            const facetElement = fixture.debugElement.query(By.css(panel));
            expect(facetElement).toEqual(null);
        });

        it('should search the facets options and select it', () => {
            const panel = '[data-automation-id="expansion-panel-Size facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            spyOn(queryBuilder, 'update').and.stub();

            const inputElement = fixture.debugElement.query(By.css(`${panel} input`));
            inputElement.nativeElement.value = 'Extra';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            let filteredMenu = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(['Extra Small (10239)']);

            inputElement.nativeElement.value = 'my';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            filteredMenu = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(filteredResult);

            const clearButton = fixture.debugElement.query(By.css(`${panel} mat-form-field button`));
            clearButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            filteredMenu = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(stepOne);

            const firstOption = fixture.debugElement.query(By.css(`${panel} mat-checkbox`));
            firstOption.triggerEventHandler('change', { checked: true });
            fixture.detectChanges();

            const checkedOption = fixture.debugElement.query(By.css(`${panel} mat-checkbox.mat-checkbox-checked`));
            expect(checkedOption.nativeElement.innerText).toEqual('Extra Small (10239)');

            expect(queryBuilder.update).toHaveBeenCalledTimes(1);
        });

        it('should preserve the filter state if other fields edited', () => {
            const panel1 = '[data-automation-id="expansion-panel-Size facet queries"]';
            const panel2 = '[data-automation-id="expansion-panel-Type facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();
            spyOn(queryBuilder, 'update').and.stub();

            const inputElement = fixture.debugElement.query(By.css(`${panel1} input`));
            inputElement.nativeElement.value = 'my';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            let filteredMenu = getAllMenus(`${panel1} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(filteredResult);

            const firstOption = fixture.debugElement.query(By.css(`${panel1} mat-checkbox`));
            firstOption.triggerEventHandler('change', { checked: true });
            fixture.detectChanges();

            let panel1CheckedOption = fixture.debugElement.query(By.css(`${panel1} mat-checkbox.mat-checkbox-checked`));
            expect(panel1CheckedOption.nativeElement.innerText).toEqual('my1 (806)');

            const panel2Options = fixture.debugElement.query(By.css(`${panel2} mat-checkbox`));
            panel2Options.triggerEventHandler('change', { checked: true });
            fixture.detectChanges();

            const panel2CheckedOption = fixture.debugElement.query(By.css(`${panel2} mat-checkbox.mat-checkbox-checked`));
            expect(panel2CheckedOption.nativeElement.innerText).toEqual('SEARCH.FACET_QUERIES.MIMETYPE (13)');

            filteredMenu = getAllMenus(`${panel1} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(filteredResult);

            panel1CheckedOption = fixture.debugElement.query(By.css(`${panel1} mat-checkbox.mat-checkbox-checked`));
            expect(panel1CheckedOption.nativeElement.innerText).toEqual('my1 (806)');

            expect(queryBuilder.update).toHaveBeenCalledTimes(2);
        });

        it('should reset the query fragments when reset All is clicked', () => {
            component.queryBuilder.queryFragments = { fragment1 : 'value1'};
            appConfigService.config.search = searchFilter;
            searchFacetFiltersService.responseFacets = [];
            component.displayResetButton = true;
            fixture.detectChanges();
            spyOn(queryBuilder, 'resetToDefaults').and.callThrough();

            const resetButton = fixture.debugElement.query(By.css('button'));
            resetButton.nativeElement.click();

            expect(component.queryBuilder.queryFragments).toEqual({});
            expect(queryBuilder.resetToDefaults).toHaveBeenCalled();
        });

    });
});

export const getAllMenus = (regex, fixture: ComponentFixture<any>): string[] => {
    const elements = fixture.debugElement.queryAll(By.css(regex));
    return Array.from(elements).map(element => element.nativeElement.innerText);
};
