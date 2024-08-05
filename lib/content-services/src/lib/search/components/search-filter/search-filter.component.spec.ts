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

import { SearchFilterComponent } from './search-filter.component';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';
import { SearchService } from '../../services/search.service';
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
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { SearchFacetFieldComponent } from '../search-facet-field/search-facet-field.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('SearchFilterComponent', () => {
    let loader: HarnessLoader;
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
            imports: [ContentTestingModule],
            providers: [{ provide: SearchService, useValue: searchMock }]
        });
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        fixture = TestBed.createComponent(SearchFilterComponent);
        appConfigService = TestBed.inject(AppConfigService);
        const translationService = fixture.debugElement.injector.get(TranslationService);
        spyOn(translationService, 'instant').and.callFake((key) => (key ? `${key}_translated` : null));
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => fixture.destroy());

    describe('component', () => {
        beforeEach(() => fixture.detectChanges());

        it('should fetch facet fields from response payload and show the already checked items', () => {
            spyOn(queryBuilder, 'execute').and.stub();
            queryBuilder.config = {
                categories: [],
                facetFields: {
                    fields: [
                        { label: 'f1', field: 'f1' },
                        { label: 'f2', field: 'f2' }
                    ]
                },
                facetQueries: {
                    queries: []
                }
            };

            searchFacetFiltersService.responseFacets = [
                {
                    type: 'field',
                    label: 'f1',
                    field: 'f1',
                    buckets: new SearchFilterList([
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }
                    ])
                },
                { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList([]) }
            ];
            queryBuilder.addUserFacetBucket('f1', searchFacetFiltersService.responseFacets[0].buckets.items[0]);

            const serverResponseFields: any = [
                {
                    type: 'field',
                    label: 'f1',
                    field: 'f1',
                    buckets: [
                        { label: 'b1', metrics: [{ value: { count: 6 } }], filterQuery: 'filter' },
                        { label: 'b2', metrics: [{ value: { count: 1 } }], filterQuery: 'filter2' }
                    ]
                },
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
                facetFields: {
                    fields: [
                        { label: 'f1', field: 'f1' },
                        { label: 'f2', field: 'f2' }
                    ]
                },
                facetQueries: {
                    queries: []
                }
            };

            searchFacetFiltersService.responseFacets = [
                {
                    type: 'field',
                    label: 'f1',
                    field: 'f1',
                    buckets: new SearchFilterList([
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }
                    ])
                },
                { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList([]) }
            ];
            queryBuilder.addUserFacetBucket('f1', searchFacetFiltersService.responseFacets[0].buckets.items[0]);

            const serverResponseFields: any = [
                {
                    type: 'field',
                    label: 'f1',
                    field: 'f1',
                    buckets: [
                        { label: 'b1', metrics: [{ value: { count: 6 } }], filterQuery: 'filter' },
                        { label: 'b2', metrics: [{ value: { count: 1 } }], filterQuery: 'filter2' }
                    ]
                },
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
                facetFields: {
                    fields: [
                        { label: 'f1', field: 'f1' },
                        { label: 'f2', field: 'f2' }
                    ]
                },
                facetQueries: {
                    queries: []
                }
            };

            searchFacetFiltersService.responseFacets = [
                {
                    type: 'field',
                    label: 'f1',
                    field: 'f1',
                    buckets: new SearchFilterList([
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }
                    ])
                },
                { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList() }
            ];
            queryBuilder.addUserFacetBucket('f1', searchFacetFiltersService.responseFacets[0].buckets.items[0]);
            const data = {
                list: {
                    context: { /* empty */ }
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
                    { label: 'q1', query: 'q1', checked: true, metrics: [{ value: { count: 1 } }] },
                    { label: 'q2', query: 'q2', checked: false, metrics: [{ value: { count: 1 } }] },
                    { label: 'q3', query: 'q3', checked: true, metrics: [{ value: { count: 1 } }] }
                ])
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

            const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(1);
        });

        it('should not show the disabled widget', async () => {
            appConfigService.config.search = { categories: disabledCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(0);
        });

        it('should show the widget in expanded mode', async () => {
            appConfigService.config.search = { categories: expandedCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(1);

            expect(await panels[0].getTitle()).toBe('Type');
            expect(await panels[0].isExpanded()).toBe(true);
        });

        it('should show the widgets only if configured', async () => {
            appConfigService.config.search = { categories: simpleCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(2);

            expect(await panels[0].getTitle()).toBe('Name');
            expect(await panels[1].getTitle()).toBe('Type');
        });

        it('should be update the search query when name changed', async () => {
            spyOn(queryBuilder, 'update').and.stub();
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            let panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(6);

            const inputElement = fixture.debugElement.query(By.css('[data-automation-id="expansion-panel-Name"] input'));
            inputElement.triggerEventHandler('change', { target: { value: '*' } });

            expect(queryBuilder.update).toHaveBeenCalled();

            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(8);
        });

        it('should add a panel only for the response buckets that are present in the response', async () => {
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            await fixture.whenStable();

            const input = await loader.getHarness(MatInputHarness);
            await input.setValue('*');

            queryBuilder.executed.next(getMockSearchResultWithResponseBucket());
            fixture.detectChanges();

            const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
            expect(panels.length).toBe(9);
        });

        it('should show the long facet options list with pagination', async () => {
            const showMoreButton = MatButtonHarness.with({ selector: `[title="SEARCH.FILTER.ACTIONS.SHOW-MORE"]` });
            const showLessButton = MatButtonHarness.with({ selector: `[title="SEARCH.FILTER.ACTIONS.SHOW-LESS"]` });

            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            const panel = await loader.getHarness(
                MatExpansionPanelHarness.with({
                    selector: `[data-automation-id="expansion-panel-Size facet queries"]`
                })
            );

            let sizes = await panel.getAllHarnesses(MatCheckboxHarness);
            let sizeLabels = await Promise.all(sizes.map((element) => element.getLabelText()));
            expect(sizeLabels).toEqual(stepOne);

            let moreButton = await loader.getHarness(showMoreButton);
            expect(await loader.hasHarness(showLessButton)).toBe(false);

            await moreButton.click();

            sizes = await panel.getAllHarnesses(MatCheckboxHarness);
            sizeLabels = await Promise.all(sizes.map((element) => element.getLabelText()));
            expect(sizeLabels).toEqual(stepTwo);

            moreButton = await loader.getHarness(showMoreButton);
            expect(await loader.hasHarness(showLessButton)).toBe(true);
            await moreButton.click();

            sizes = await panel.getAllHarnesses(MatCheckboxHarness);
            sizeLabels = await Promise.all(sizes.map((element) => element.getLabelText()));
            expect(sizeLabels).toEqual(stepThree);

            expect(await loader.hasHarness(showMoreButton)).toBe(false);
            let lessButton = await loader.getHarness(showLessButton);
            await lessButton.click();

            sizes = await panel.getAllHarnesses(MatCheckboxHarness);
            sizeLabels = await Promise.all(sizes.map((element) => element.getLabelText()));
            expect(sizeLabels).toEqual(stepTwo);

            expect(await loader.hasHarness(showMoreButton)).toBe(true);
            lessButton = await loader.getHarness(showLessButton);
            await lessButton.click();

            sizes = await panel.getAllHarnesses(MatCheckboxHarness);
            sizeLabels = await Promise.all(sizes.map((element) => element.getLabelText()));
            expect(sizeLabels).toEqual(stepOne);

            expect(await loader.hasHarness(showMoreButton)).toBe(true);
            expect(await loader.hasHarness(showLessButton)).toBe(false);
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

        it('should search the facets options and select it', async () => {
            const panelSelector = '[data-automation-id="expansion-panel-Size facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();

            spyOn(queryBuilder, 'update').and.stub();

            const panel = await loader.getHarness(
                MatExpansionPanelHarness.with({
                    selector: panelSelector
                })
            );

            const input = await panel.getHarness(MatInputHarness);
            await input.setValue('Extra');

            let checkboxes = await panel.getAllHarnesses(MatCheckboxHarness);
            expect(checkboxes.length).toBe(1);
            expect(await checkboxes[0].getLabelText()).toBe('Extra Small (10239)');

            await input.setValue('my');

            checkboxes = await panel.getAllHarnesses(MatCheckboxHarness);
            let labels = await Promise.all(checkboxes.map((element) => element.getLabelText()));
            expect(labels).toEqual(filteredResult);

            const clearButton = await panel.getHarness(MatButtonHarness.with({ selector: '[title="SEARCH.FILTER.BUTTONS.CLEAR"]' }));
            await clearButton.click();

            checkboxes = await panel.getAllHarnesses(MatCheckboxHarness);
            labels = await Promise.all(checkboxes.map((element) => element.getLabelText()));
            expect(labels).toEqual(stepOne);

            await checkboxes[0].check();
            expect(queryBuilder.update).toHaveBeenCalledTimes(1);
        });

        it('should preserve the filter state if other fields edited', async () => {
            const panel1Selector = '[data-automation-id="expansion-panel-Size facet queries"]';
            const panel2selector = '[data-automation-id="expansion-panel-Type facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(mockSearchResult);
            fixture.detectChanges();
            spyOn(queryBuilder, 'update').and.stub();

            const inputElement = fixture.debugElement.query(By.css(`${panel1Selector} input`));
            inputElement.nativeElement.value = 'my';
            inputElement.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const panel1 = await loader.getHarness(MatExpansionPanelHarness.with({ selector: panel1Selector }));

            let checkboxes = await panel1.getAllHarnesses(MatCheckboxHarness);
            let labels = await Promise.all(checkboxes.map((element) => element.getLabelText()));
            expect(labels).toEqual(filteredResult);

            await checkboxes[0].check();
            expect(await checkboxes[0].isChecked()).toBe(true);
            expect(await checkboxes[0].getLabelText()).toBe('my1 (806)');

            const panel2 = await loader.getHarness(MatExpansionPanelHarness.with({ selector: panel2selector }));
            checkboxes = await panel2.getAllHarnesses(MatCheckboxHarness);
            await checkboxes[0].check();
            expect(await checkboxes[0].isChecked()).toBe(true);
            expect(await checkboxes[0].getLabelText()).toBe('SEARCH.FACET_QUERIES.MIMETYPE (13)');

            checkboxes = await panel1.getAllHarnesses(MatCheckboxHarness);
            labels = await Promise.all(checkboxes.map((element) => element.getLabelText()));
            expect(labels).toEqual(filteredResult);

            const checkedOption = await panel1.getHarness(MatCheckboxHarness.with({ checked: true }));
            expect(await checkedOption.getLabelText()).toBe('my1 (806)');

            expect(queryBuilder.update).toHaveBeenCalledTimes(2);
        });

        it('should reset the query fragments when reset All is clicked', () => {
            component.queryBuilder.queryFragments = { fragment1: 'value1' };
            appConfigService.config.search = searchFilter;
            searchFacetFiltersService.responseFacets = [];
            component.displayResetButton = true;
            fixture.detectChanges();
            spyOn(queryBuilder, 'resetToDefaults').and.callThrough();

            const resetButton = fixture.debugElement.query(By.css('button'));
            resetButton.nativeElement.click();

            expect(component.queryBuilder.queryFragments).toEqual({ /* empty */ });
            expect(queryBuilder.resetToDefaults).toHaveBeenCalled();
        });
    });
});

export const getAllMenus = (regex, fixture: ComponentFixture<any>): string[] => {
    const elements = fixture.debugElement.queryAll(By.css(regex));
    return Array.from(elements).map((element) => element.nativeElement.innerText);
};
