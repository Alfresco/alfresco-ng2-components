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
import { AppConfigService, TranslationMock } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';
import { FacetQuery } from '../../facet-query.interface';
import { FacetField } from '../../facet-field.interface';
import { SearchFilterList } from './models/search-filter-list.model';
import { ResponseFacetQueryList } from './models/response-facet-query-list.model';

describe('SearchFilterComponent', () => {

    let component: SearchFilterComponent;
    let queryBuilder: SearchQueryBuilderService;
    let appConfig: AppConfigService;
    const translationMock = new TranslationMock();

    beforeEach(() => {
        appConfig = new AppConfigService(null);
        appConfig.config.search = {};

        queryBuilder = new SearchQueryBuilderService(appConfig, null);
        const searchMock: any = {
            dataLoaded: new Subject()
        };
        translationMock.instant = (key) => `translated${key}`;
        component = new SearchFilterComponent(queryBuilder, searchMock, translationMock);
        component.ngOnInit();
    });

    it('should subscribe to query builder executed event', () => {
        spyOn(component, 'onDataLoaded').and.stub();
        const data = {};
        queryBuilder.executed.next(data);

        expect(component.onDataLoaded).toHaveBeenCalledWith(data);
    });

    it('should update bucket model and query builder on facet toggle', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'addUserFacetBucket').and.callThrough();

        const event: any = { checked: true };
        const field: FacetField = { field: 'f1', label: 'f1' };
        const bucket: FacetFieldBucket = { checked: false, filterQuery: 'q1', label: 'q1', count: 1 };

        component.onToggleBucket(event, field, bucket);

        expect(bucket.checked).toBeTruthy();
        expect(queryBuilder.addUserFacetBucket).toHaveBeenCalledWith(field, bucket);
        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should update bucket model and query builder on facet un-toggle', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

        const event: any = { checked: false };
        const field: FacetField = { field: 'f1', label: 'f1' };
        const bucket: FacetFieldBucket = { checked: true, filterQuery: 'q1', label: 'q1', count: 1 };

        component.onToggleBucket(event, field, bucket);

        expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledWith(field, bucket);
        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should unselect facet query and update builder', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'removeUserFacetQuery').and.callThrough();

        const event: any = { checked: false };
        const query: FacetQuery = { checked: true, label: 'q1', query: 'query1' };

        component.onToggleFacetQuery(event, query);

        expect(query.checked).toBeFalsy();
        expect(queryBuilder.removeUserFacetQuery).toHaveBeenCalledWith(query);
        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should fetch facet queries from response payload', () => {
        component.responseFacetQueries = null;

        queryBuilder.config = {
            categories: [],
            facetQueries: {
                queries: [
                    { label: 'q1', query: 'query1' },
                    { label: 'q2', query: 'query2' }
                ]
            }
        };

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

    it('should preserve order after response processing', () => {
        component.responseFacetQueries = null;

        queryBuilder.config = {
            categories: [],
            facetQueries: {
                queries: [
                    { label: 'q1', query: 'query1' },
                    { label: 'q2', query: 'query2' },
                    { label: 'q3', query: 'query3' }
                ]
            }
        };

        const queries = [
            { label: 'q2', query: 'query2', count: 1 },
            { label: 'q1', query: 'query1', count: 1 },
            { label: 'q3', query: 'query3', count: 1 }

        ];
        const data = {
            list: {
                context: {
                    facetQueries: queries
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries.length).toBe(3);
        expect(component.responseFacetQueries.items[0].label).toBe('q1');
        expect(component.responseFacetQueries.items[1].label).toBe('q2');
        expect(component.responseFacetQueries.items[2].label).toBe('q3');
    });

    it('should not fetch facet queries from response payload', () => {
        component.responseFacetQueries = null;

        queryBuilder.config = {
            categories: [],
            facetQueries: {
                queries: []
            }
        };

        const data = {
            list: {
                context: {
                    facetQueries: null
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetQueries).toBeNull();
    });

    it('should fetch facet fields from response payload', () => {
        component.responseFacetFields = null;

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

        expect(component.responseFacetFields.length).toEqual(2);
    });

    it('should fetch facet fields from response payload and show the bucket values', () => {
        component.responseFacetFields = null;

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

        const serverResponseFields: any = [
            {
                label: 'f1',
                buckets: [
                    { label: 'b1', count: 10 },
                    { label: 'b2', count: 1 }
                ]
            },
            { label: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facetsFields: serverResponseFields
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetFields[0].buckets.items[0].count).toEqual(10);
        expect(component.responseFacetFields[0].buckets.items[1].count).toEqual(1);
    });

    it('should fetch facet fields from response payload and update the existing bucket values', () => {
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

        const initialFields: any = [
            { label: 'f1', buckets: { items: [{ label: 'b1', count: 10, filterQuery: 'filter' }, { label: 'b2', count: 1 }]} },
            { label: 'f2', buckets: [] }
        ];
        component.responseFacetFields = initialFields;

        expect(component.responseFacetFields[0].buckets.items[0].count).toEqual(10);
        expect(component.responseFacetFields[0].buckets.items[1].count).toEqual(1);

        const serverResponseFields: any = [
            { label: 'f1', buckets: [{ label: 'b1', count: 6, filterQuery: 'filter' }, { label: 'b2', count: 0 }] },
            { label: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facetsFields: serverResponseFields
                }
            }
        };

        component.onDataLoaded(data);

        expect(component.responseFacetFields[0].buckets.items[0].count).toEqual(6);
        expect(component.responseFacetFields[0].buckets.items[1].count).toEqual(0);
    });

    it('should update correctly the existing facetFields bucket values', () => {
        component.responseFacetFields = null;

        queryBuilder.config = {
            categories: [],
            facetFields: { fields: [{ label: 'f1', field: 'f1' }] },
            facetQueries: { queries: [] }
        };

        const firstCallFields: any = [{
            label: 'f1',
            buckets: [{ label: 'b1', count: 10 }]
        }];
        const firstCallData = { list: { context: { facetsFields: firstCallFields }}};
        component.onDataLoaded(firstCallData);
        expect(component.responseFacetFields[0].buckets.items[0].count).toEqual(10);

        const secondCallFields: any = [{
            label: 'f1',
            buckets: [{ label: 'b1', count: 6 }]
        }];
        const secondCallData = { list: { context: { facetsFields: secondCallFields}}};
        component.onDataLoaded(secondCallData);
        expect(component.responseFacetFields[0].buckets.items[0].count).toEqual(6);
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

        component.responseFacetFields = <any> [
            { label: 'f1', field: 'f1', buckets: {items: [
                { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                { label: 'b2', count: 1, filterQuery: 'filter2' }] }},
            { label: 'f2', field: 'f2', buckets: {items: [] }}
        ];
        component.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacetFields[0].buckets.items[0]);

        const serverResponseFields: any = [
            { label: 'f1', field: 'f1', buckets: [
                { label: 'b1', count: 6, filterQuery: 'filter' },
                { label: 'b2', count: 1, filterQuery: 'filter2' }] },
            { label: 'f2', field: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facetsFields: serverResponseFields
                }
            }
        };
        component.selectFacetBucket({ field: 'f1', label: 'f1' }, component.responseFacetFields[0].buckets.items[1]);
        component.onDataLoaded(data);
        expect(component.responseFacetFields.length).toEqual(2);
        expect(component.responseFacetFields[0].buckets.items[0].checked).toEqual(true, 'should show the already checked item');
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

        component.responseFacetFields = <any> [
            { label: 'f1', field: 'f1', buckets: {items: [
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }] }},
            { label: 'f2', field: 'f2', buckets: {items: [] }}
        ];
        component.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacetFields[0].buckets.items[0]);

        const serverResponseFields: any = [
            { label: 'f1', field: 'f1', buckets: [
                    { label: 'b1', count: 6, filterQuery: 'filter' },
                    { label: 'b2', count: 1, filterQuery: 'filter2' }] },
            { label: 'f2', field: 'f2', buckets: [] }
        ];
        const data = {
            list: {
                context: {
                    facetsFields: serverResponseFields
                }
            }
        };
        component.selectFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacetFields[0].buckets.items[1]);
        component.onDataLoaded(data);
        expect(component.responseFacetFields.length).toEqual(2);
        expect(component.responseFacetFields[0].buckets.items[1].checked).toEqual(true, 'should show the newly checked item');
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

        component.responseFacetFields = <any> [
            { label: 'f1', field: 'f1', buckets: {items: [
                        { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                        { label: 'b2', count: 1, filterQuery: 'filter2' }] }},
            { label: 'f2', field: 'f2', buckets: {items: [] }}
        ];
        component.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacetFields[0].buckets.items[0]);
        const data = {
            list: {
                context: {}
            }
        };
        component.selectFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacetFields[0].buckets.items[1]);
        component.onDataLoaded(data);

        expect(component.responseFacetFields[0].buckets.items[0].count).toEqual(0);
        expect(component.responseFacetFields[0].buckets.items[1].count).toEqual(0);
    });

    it('should update query builder only when has bucket to unselect', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const field: FacetField = { field: 'f1', label: 'f1' };
        component.onToggleBucket(<any> { checked: true }, field, null);

        expect(queryBuilder.update).not.toHaveBeenCalled();
    });

    it('should allow to to reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: true, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: false, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        expect(component.canResetSelectedBuckets(field)).toBeTruthy();
    });

    it('should not allow to reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: false, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        expect(component.canResetSelectedBuckets(field)).toBeFalsy();
    });

    it('should reset selected buckets', () => {
        spyOn(queryBuilder, 'execute').and.stub();
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: true, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.resetSelectedBuckets(field);

        expect(buckets[0].checked).toBeFalsy();
        expect(buckets[1].checked).toBeFalsy();
    });

    it('should update query builder upon resetting buckets', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: true, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.resetSelectedBuckets(field);
        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should update query builder upon resetting selected queries', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'removeUserFacetQuery').and.callThrough();

        component.canResetSelectedQueries = true;
        component.responseFacetQueries = new ResponseFacetQueryList([
            { label: 'q1', query: 'q1', checked: true, count: 1 },
            { label: 'q2', query: 'q2', checked: false, count: 1 },
            { label: 'q3', query: 'q3', checked: true, count: 1 }
        ], translationMock);
        component.resetSelectedQueries();

        expect(queryBuilder.removeUserFacetQuery).toHaveBeenCalledTimes(3);
        expect(queryBuilder.update).toHaveBeenCalled();

        for (let entry of component.responseFacetQueries.items) {
            expect(entry.checked).toBeFalsy();
        }
    });
});
