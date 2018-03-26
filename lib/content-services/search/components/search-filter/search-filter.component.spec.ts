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
import { SearchQueryBuilder } from '../../search-query-builder';
import { SearchConfiguration } from '../../search-configuration.interface';

describe('SearchSettingsComponent', () => {

    let component: SearchFilterComponent;

    beforeEach(() => {
        component = new SearchFilterComponent();
        component.queryBuilder = new SearchQueryBuilder({}, null);
        component.ngOnInit();
    });

    it('should subscribe to query builder executed event', () => {
        spyOn(component, 'onDataLoaded').and.stub();
        const data = {};
        component.queryBuilder.executed.next(data);

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
        const field: any = { $expanded: false };

        component.onFacetFieldExpanded(field);

        expect(field.$expanded).toBeTruthy();
    });

    it('should update facet field model on collapse', () => {
        const field: any = { $expanded: true };

        component.onFacetFieldCollapsed(field);

        expect(field.$expanded).toBeFalsy();
    });

    it('should update bucket model and query builder on facet toggle', () => {
        const builder = component.queryBuilder;
        spyOn(builder, 'update').and.stub();

        const event: any = { checked: true };
        const field: any = {};
        const bucket: any = { $checked: false, filterQuery: 'q1' };

        component.onFacetToggle(event, field, bucket);

        expect(component.selectedBuckets.length).toBe(1);
        expect(component.selectedBuckets[0]).toEqual(bucket);

        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q1');

        expect(builder.update).toHaveBeenCalled();
    });

    it('should update bucket model and query builder on facet un-toggle', () => {
        const builder = component.queryBuilder;
        spyOn(builder, 'update').and.stub();

        const event: any = { checked: false };
        const field: any = { label: 'f1' };
        const bucket: any = { $checked: true, filterQuery: 'q1', $field: 'f1', label: 'b1' };

        component.selectedBuckets.push(bucket);
        builder.addFilterQuery(bucket.filterQuery);

        component.onFacetToggle(event, field, bucket);

        expect(bucket.$checked).toBeFalsy();
        expect(component.selectedBuckets.length).toBe(0);
        expect(builder.filterQueries.length).toBe(0);

        expect(builder.update).toHaveBeenCalled();
    });

    it('should unselect facet query and update builder', () => {
        const config: SearchConfiguration = {
            facetQueries: [
                { label: 'q1', query: 'query1' }
            ]
        };
        component.queryBuilder = new SearchQueryBuilder(config, null);
        spyOn(component.queryBuilder, 'update').and.stub();
        component.queryBuilder.filterQueries = [{ query: 'query1' }];
        component.selectedFacetQueries = ['q1'];

        component.unselectFacetQuery('q1');

        expect(component.selectedFacetQueries.length).toBe(0);
        expect(component.queryBuilder.filterQueries.length).toBe(0);

        expect(component.queryBuilder.update).toHaveBeenCalled();
    });

    it('should unselect facet bucket and update builder', () => {
        spyOn(component.queryBuilder, 'update').and.stub();

        const bucket: any = { $checked: true, filterQuery: 'q1', $field: 'f1', label: 'b1' };
        component.selectedBuckets.push(bucket);
        component.queryBuilder.filterQueries.push({ query: 'q1' });

        component.unselectFacetBucket(bucket);

        expect(component.selectedBuckets.length).toBe(0);
        expect(component.queryBuilder.filterQueries.length).toBe(0);

        expect(component.queryBuilder.update).toHaveBeenCalled();
    });

    it('should fetch facet queries from response payload', () => {
        component.responseFacetQueries = [];
        const queries = [
            { label: 'q1', query: 'query1' },
            { label: 'q2', query: 'query2' }
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
        expect(component.responseFacetQueries).toEqual(queries);
    });

    it('should not fetch facet queries from response payload', () => {
        component.responseFacetQueries = [];

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
        component.responseFacetQueries = [];

        const queries = [
            { label: 'q1', query: 'query1' },
            { label: 'q2', query: 'query2' }
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
        expect((<any> component.responseFacetQueries[0]).$checked).toBeFalsy();
        expect((<any> component.responseFacetQueries[1]).$checked).toBeFalsy();
    });

    it('should not restore checked state for new response facet queries', () => {
        component.selectedFacetQueries = ['q2'];
        component.responseFacetQueries = [];

        const queries = [
            { label: 'q1', query: 'query1' },
            { label: 'q2', query: 'query2' }
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
        expect((<any> component.responseFacetQueries[0]).$checked).toBeFalsy();
        expect((<any> component.responseFacetQueries[1]).$checked).toBeTruthy();
    });

    it('should fetch facet fields from response payload', () => {
        component.responseFacetFields = [];

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

        expect(component.responseFacetFields).toEqual(fields);
    });

    it('should restore expanded state for new response facet fields', () => {
        component.responseFacetFields = [
            { label: 'f1', buckets: [] },
            { label: 'f2', buckets: [], $expanded: true }
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
        expect(component.responseFacetFields[0].$expanded).toBeFalsy();
        expect(component.responseFacetFields[1].$expanded).toBeTruthy();
    });

    it('should restore checked buckets for new response facet fields', () => {
        const bucket1 = { label: 'b1', $field: 'f1', count: 1, filterQuery: 'q1' };
        const bucket2 = { label: 'b2', $field: 'f2', count: 1, filterQuery: 'q2' };

        component.selectedBuckets = [ bucket2 ];
        component.responseFacetFields = [
            { label: 'f2', buckets: [] }
        ];

        const data = {
            list: {
                context: {
                    facetsFields: [
                        { label: 'f1', buckets: [ bucket1 ] },
                        { label: 'f2', buckets: [ bucket2 ] }
                    ]
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetFields.length).toBe(2);
        expect(component.responseFacetFields[0].buckets[0].$checked).toBeFalsy();
        expect(component.responseFacetFields[1].buckets[0].$checked).toBeTruthy();
    });

    it('should reset queries and fields on empty response payload', () => {
        component.responseFacetQueries = [<any> {}, <any> {}];
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
        const builder = component.queryBuilder;
        spyOn(builder, 'update').and.stub();

        component.unselectFacetBucket(null);

        expect(builder.update).not.toHaveBeenCalled();
    });

});
