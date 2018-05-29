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

import { SearchFilterComponent } from './search-filter.component';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { SearchConfiguration } from '../../search-configuration.interface';
import { AppConfigService, TranslationMock } from '@alfresco/adf-core';
import { Subject } from 'rxjs/Subject';
import { ResponseFacetQueryList } from './models/response-facet-query-list.model';
import { ResponseFacetField } from '../../response-facet-field.interface';
import { SearchFilterList } from './models/search-filter-list.model';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';

describe('SearchSettingsComponent', () => {

    let component: SearchFilterComponent;
    let queryBuilder: SearchQueryBuilderService;
    let appConfig: AppConfigService;

    beforeEach(() => {
        appConfig = new AppConfigService(null);
        appConfig.config.search = {};

        queryBuilder = new SearchQueryBuilderService(appConfig, null);
        const searchMock: any = {
            dataLoaded: new Subject()
        };
        const translationMock = new TranslationMock();
        component = new SearchFilterComponent(queryBuilder, searchMock, translationMock);
        component.ngOnInit();
    });

    it('should subscribe to query builder executed event', () => {
        spyOn(component, 'onDataLoaded').and.stub();
        const data = {};
        queryBuilder.executed.next(data);

        expect(component.onDataLoaded).toHaveBeenCalledWith(data);
    });

    it('should update category model on expand', () => {
        const category: any = { expanded: false };

        component.onCategoryExpanded(category);

        expect(category.expanded).toBeTruthy();
    });

    it('should update category model on collapse', () => {
        const category: any = { expanded: true };

        component.onCategoryCollapsed(category);

        expect(category.expanded).toBeFalsy();
    });

    it('should update facet field model on expand', () => {
        const field: any = { expanded: false };

        component.onFacetFieldExpanded(field);

        expect(field.expanded).toBeTruthy();
    });

    it('should update facet field model on collapse', () => {
        const field: any = { expanded: true };

        component.onFacetFieldCollapsed(field);

        expect(field.expanded).toBeFalsy();
    });

    it('should update bucket model and query builder on facet toggle', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const event: any = { checked: true };
        const field: any = {};
        const bucket: any = { $checked: false, filterQuery: 'q1' };

        component.onFacetToggle(event, field, bucket);

        expect(component.selectedBuckets.length).toBe(1);
        expect(component.selectedBuckets[0]).toEqual(bucket);

        expect(queryBuilder.filterQueries.length).toBe(1);
        expect(queryBuilder.filterQueries[0].query).toBe('q1');

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should update bucket model and query builder on facet un-toggle', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const event: any = { checked: false };
        const field: any = { label: 'f1' };
        const bucket: any = { $checked: true, filterQuery: 'q1', $field: 'f1', label: 'b1' };

        component.selectedBuckets.push(bucket);
        queryBuilder.addFilterQuery(bucket.filterQuery);

        component.onFacetToggle(event, field, bucket);

        expect(bucket.$checked).toBeFalsy();
        expect(component.selectedBuckets.length).toBe(0);
        expect(queryBuilder.filterQueries.length).toBe(0);

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should unselect facet query and update builder', () => {
        const translationMock = new TranslationMock();
        const config: SearchConfiguration = {
            categories: [],
            facetQueries: {
                queries: [
                    { label: 'q1', query: 'query1' }
                ]
            }
        };
        appConfig.config.search = config;
        queryBuilder = new SearchQueryBuilderService(appConfig, null);
        component = new SearchFilterComponent(queryBuilder, null, translationMock);

        spyOn(queryBuilder, 'update').and.stub();
        queryBuilder.filterQueries = [{ query: 'query1' }];
        component.selectedFacetQueries = ['q1'];

        component.unselectFacetQuery('q1');

        expect(component.selectedFacetQueries.length).toBe(0);
        expect(queryBuilder.filterQueries.length).toBe(0);

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should unselect facet bucket and update builder', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const bucket: any = { $checked: true, filterQuery: 'q1', $field: 'f1', label: 'b1' };
        component.selectedBuckets.push(bucket);
        queryBuilder.filterQueries.push({ query: 'q1' });

        component.unselectFacetBucket(bucket);

        expect(component.selectedBuckets.length).toBe(0);
        expect(queryBuilder.filterQueries.length).toBe(0);

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should fetch facet queries from response payload', () => {
        component.responseFacetQueries = new ResponseFacetQueryList();
        const queries = [
            { label: 'q1', query: 'query1', count: 1 },
            { label: 'q2', query: 'query2', count: 1 }
        ];
        const data = {
            list: {
                context: {
                    facetQueries: queries
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries.length).toBe(2);
        expect(component.responseFacetQueries.items).toEqual(queries);
    });

    it('should not fetch facet queries from response payload', () => {
        component.responseFacetQueries = new ResponseFacetQueryList();

        const data = {
            list: {
                context: {
                    facetQueries: null
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries.length).toBe(0);
    });

    it('should restore checked state for new response facet queries', () => {
        component.selectedFacetQueries = ['q3'];
        component.responseFacetQueries = new ResponseFacetQueryList();

        const queries = [
            { label: 'q1', query: 'query1', count: 1 },
            { label: 'q2', query: 'query2', count: 1 }
        ];
        const data = {
            list: {
                context: {
                    facetQueries: queries
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries.length).toBe(2);
        expect((<any> component.responseFacetQueries.items[0]).$checked).toBeFalsy();
        expect((<any> component.responseFacetQueries.items[1]).$checked).toBeFalsy();
    });

    it('should not restore checked state for new response facet queries', () => {
        component.selectedFacetQueries = ['q2'];
        component.responseFacetQueries = new ResponseFacetQueryList();

        const queries = [
            { label: 'q1', query: 'query1', count: 1 },
            { label: 'q2', query: 'query2', count: 1 }
        ];
        const data = {
            list: {
                context: {
                    facetQueries: queries
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries.length).toBe(2);
        expect((<any> component.responseFacetQueries.items[0]).$checked).toBeFalsy();
        expect((<any> component.responseFacetQueries.items[1]).$checked).toBeTruthy();
    });

    it('should fetch facet fields from response payload', () => {
        component.responseFacetFields = [];

        const fields: any = [
            { label: 'f1', buckets: [] },
            { label: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facetsFields: fields
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetFields).toEqual(fields);
    });

    it('should restore expanded state for new response facet fields', () => {
        component.responseFacetFields = <any> [
            { label: 'f1', buckets: [] },
            { label: 'f2', buckets: [], expanded: true }
        ];

        const fields = [
            { label: 'f1', buckets: [] },
            { label: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facetsFields: fields
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetFields.length).toBe(2);
        expect(component.responseFacetFields[0].expanded).toBeFalsy();
        expect(component.responseFacetFields[1].expanded).toBeTruthy();
    });

    it('should restore checked buckets for new response facet fields', () => {
        const bucket1 = { label: 'b1', $field: 'f1', count: 1, filterQuery: 'q1' };
        const bucket2 = { label: 'b2', $field: 'f2', count: 1, filterQuery: 'q2' };

        component.selectedBuckets = [bucket2];
        component.responseFacetFields = <any> [
            { label: 'f2', buckets: [] }
        ];

        const data = {
            list: {
                context: {
                    facetsFields: [
                        { label: 'f1', buckets: [bucket1] },
                        { label: 'f2', buckets: [bucket2] }
                    ]
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetFields.length).toBe(2);
        expect(component.responseFacetFields[0].buckets.items[0].$checked).toBeFalsy();
        expect(component.responseFacetFields[1].buckets.items[0].$checked).toBeTruthy();
    });

    it('should reset queries and fields on empty response payload', () => {
        component.responseFacetQueries = new ResponseFacetQueryList([<any> {}, <any> {}]);
        component.responseFacetFields = [<any> {}, <any> {}];

        const data = {
            list: {
                context: {
                    facetQueries: null,
                    facetsFields: null
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries.length).toBe(0);
        expect(component.responseFacetFields.length).toBe(0);
    });

    it('should update query builder only when has bucket to unselect', () => {
        spyOn(queryBuilder, 'update').and.stub();

        component.unselectFacetBucket(null);

        expect(queryBuilder.update).not.toHaveBeenCalled();
    });

    it('should allow to to reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', $checked: true, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', $checked: false, count: 1, filterQuery: 'q2' }
        ];

        const field: ResponseFacetField = {
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        expect(component.canResetSelectedBuckets(field)).toBeTruthy();
    });

    it('should not allow to reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', $checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', $checked: false, count: 1, filterQuery: 'q2' }
        ];

        const field: ResponseFacetField = {
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        expect(component.canResetSelectedBuckets(field)).toBeFalsy();
    });

    it('should reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', $checked: false, count: 1, filterQuery: 'q1', $field: 'field1' },
            { label: 'bucket2', $checked: true, count: 1, filterQuery: 'q2', $field: 'field1' }
        ];

        const field: ResponseFacetField = {
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.selectedBuckets = [buckets[1]];
        component.resetSelectedBuckets(field);

        expect(buckets[0].$checked).toBeFalsy();
        expect(buckets[1].$checked).toBeFalsy();
        expect(component.selectedBuckets.length).toBe(0);
    });

    it('should update query builder upon resetting buckets', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', $checked: false, count: 1, filterQuery: 'q1', $field: 'field1' },
            { label: 'bucket2', $checked: true, count: 1, filterQuery: 'q2', $field: 'field1' }
        ];

        const field: ResponseFacetField = {
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.selectedBuckets = [buckets[1]];
        component.resetSelectedBuckets(field);

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should allow to reset selected queries', () => {
        component.selectedFacetQueries = ['q1', 'q2'];
        expect(component.canResetSelectedQueries()).toBeTruthy();
    });

    it('should not allow to reset selected queries when nothing selected', () => {
        component.selectedFacetQueries = [];
        expect(component.canResetSelectedQueries()).toBeFalsy();
    });

    it('should reset selected queries', () => {
        const methodSpy = spyOn(component, 'unselectFacetQuery').and.stub();

        component.selectedFacetQueries = ['q1', 'q2'];
        component.resetSelectedQueries();

        expect(methodSpy.calls.count()).toBe(2);
        expect(methodSpy.calls.argsFor(0)).toEqual(['q1', false]);
        expect(methodSpy.calls.argsFor(1)).toEqual(['q2', false]);
    });

    it('should update query builder upon resetting selected queries', () => {
        spyOn(queryBuilder, 'update').and.stub();

        component.selectedFacetQueries = ['q1', 'q2'];
        component.resetSelectedQueries();

        expect(queryBuilder.update).toHaveBeenCalled();
    });

});
