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

import { SearchFilterComponent } from './search-filter.component';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { AppConfigService, SearchService, setupTestBed, TranslationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';
import { FacetField } from '../../facet-field.interface';
import { SearchFilterList } from './models/search-filter-list.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import {
    disabledCategories,
    expandableCategories,
    expandedCategories,
    filteredResult,
    mockSearchResult,
    searchFilter,
    simpleCategories,
    stepOne,
    stepThree,
    stepTwo
} from '../../../mock';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchFilterComponent', () => {
    let fixture: ComponentFixture<SearchFilterComponent>;
    let component: SearchFilterComponent;
    let queryBuilder: SearchQueryBuilderService;
    let appConfigService: AppConfigService;
    const searchMock: any = {
        dataLoaded: new Subject()
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: SearchService, useValue: searchMock }
        ]
    });

    beforeEach(() => {
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

        it('should subscribe to query builder executed event', () => {
            spyOn(component, 'onDataLoaded').and.stub();
            const data = { list: {} };
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
            spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

            const event: any = { checked: false };
            const query = { checked: true, label: 'q1', filterQuery: 'query1' };
            const field = { type: 'query', label: 'label1', buckets: [ query ] };

            component.onToggleBucket(event, <any> field, <any> query);

            expect(query.checked).toEqual(false);
            expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledWith(field, query);
            expect(queryBuilder.update).toHaveBeenCalled();
        });

        it('should fetch facet queries from response payload', () => {
            component.responseFacets = null;

            queryBuilder.config = {
                categories: [],
                facetQueries: {
                    label: 'label1',
                    queries: [
                        { label: 'q1', query: 'query1' },
                        { label: 'q2', query: 'query2' }
                    ]
                }
            };

            const queries = [
                { label: 'q1', filterQuery: 'query1', metrics: [{value: {count: 1}}] },
                { label: 'q2', filterQuery: 'query2', metrics: [{value: {count: 1}}] }
            ];
            const data = {
                list: {
                    context: {
                        facets: [{
                            type: 'query',
                            label: 'label1',
                            buckets: queries
                        }]
                    }
                }
            };

            component.onDataLoaded(data);

            expect(component.responseFacets.length).toBe(1);
            expect(component.responseFacets[0].buckets.length).toEqual(2);
        });

        it('should preserve order after response processing', () => {
            component.responseFacets = null;

            queryBuilder.config = {
                categories: [],
                facetQueries: {
                    label: 'label1',
                    queries: [
                        { label: 'q1', query: 'query1' },
                        { label: 'q2', query: 'query2' },
                        { label: 'q3', query: 'query3' }
                    ]
                }
            };

            const queries = [
                { label: 'q2', filterQuery: 'query2', metrics: [{value: {count: 1}}] },
                { label: 'q1', filterQuery: 'query1', metrics: [{value: {count: 1}}] },
                { label: 'q3', filterQuery: 'query3', metrics: [{value: {count: 1}}] }

            ];
            const data = {
                list: {
                    context: {
                        facets: [{
                            type: 'query',
                            label: 'label1',
                            buckets: queries
                        }]
                    }
                }
            };

            component.onDataLoaded(data);

            expect(component.responseFacets.length).toBe(1);
            expect(component.responseFacets[0].buckets.length).toBe(3);
            expect(component.responseFacets[0].buckets.items[0].label).toBe('q1');
            expect(component.responseFacets[0].buckets.items[1].label).toBe('q2');
            expect(component.responseFacets[0].buckets.items[2].label).toBe('q3');
        });

        it('should not fetch facet queries from response payload', () => {
            component.responseFacets = null;

            queryBuilder.config = {
                categories: [],
                facetQueries: {
                    queries: []
                }
            };

            const data = {
                list: {
                    context: {
                        facets: null
                    }
                }
            };

            component.onDataLoaded(data);

            expect(component.responseFacets).toBeNull();
        });

        it('should fetch facet fields from response payload', () => {
            component.responseFacets = null;

            queryBuilder.config = {
                categories: [],
                facetFields: { fields: [
                        { label: 'f1', field: 'f1', mincount: 0 },
                        { label: 'f2', field: 'f2', mincount: 0 }
                    ]},
                facetQueries: {
                    queries: []
                }
            };

            const fields: any = [
                { type: 'field', label: 'f1', buckets: [{ label: 'a1' }, { label: 'a2' }] },
                { type: 'field', label: 'f2', buckets: [{ label: 'b1' }, { label: 'b2' }] }
            ];
            const data = {
                list: {
                    context: {
                        facets: fields
                    }
                }
            };

            component.onDataLoaded(data);

            expect(component.responseFacets.length).toEqual(2);
            expect(component.responseFacets[0].buckets.length).toEqual(2);
            expect(component.responseFacets[1].buckets.length).toEqual(2);
        });

        it('should filter response facet fields based on search filter config method', () => {
            queryBuilder.config = {
                categories: [],
                facetFields: { fields: [
                        { label: 'f1', field: 'f1' }
                    ]},
                facetQueries: {
                    queries: []
                },
                filterWithContains: false
            };

            const initialFields: any = [
                { type: 'field', label: 'f1', buckets: [
                        { label: 'firstLabel', display: 'firstLabel', metrics: [{value: {count: 5}}] },
                        { label: 'secondLabel', display: 'secondLabel', metrics: [{value: {count: 5}}] },
                        { label: 'thirdLabel', display: 'thirdLabel', metrics: [{value: {count: 5}}] }
                    ]
                }
            ];

            const data = {
                list: {
                    context: {
                        facets: initialFields
                    }
                }
            };

            component.onDataLoaded(data);
            expect(component.responseFacets.length).toBe(1);
            expect(component.responseFacets[0].buckets.visibleItems.length).toBe(3);

            component.responseFacets[0].buckets.filterText = 'f';
            expect(component.responseFacets[0].buckets.visibleItems.length).toBe(1);
            expect(component.responseFacets[0].buckets.visibleItems[0].label).toEqual('firstLabel');

            component.responseFacets[0].buckets.filterText = 'label';
            expect(component.responseFacets[0].buckets.visibleItems.length).toBe(0);

            // Set filter method to use contains and test again
            queryBuilder.config.filterWithContains = true;
            component.responseFacets[0].buckets.filterText = 'f';
            expect(component.responseFacets[0].buckets.visibleItems.length).toBe(1);
            component.responseFacets[0].buckets.filterText = 'label';
            expect(component.responseFacets[0].buckets.visibleItems.length).toBe(3);
        });

        it('should fetch facet fields from response payload and show the bucket values', () => {
            component.responseFacets = null;

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
                    type: 'field',
                    label: 'f1',
                    buckets: [
                        { label: 'b1', metrics: [{value: {count: 10}}] },
                        { label: 'b2', metrics: [{value: {count: 1}}] }
                    ]
                },
                { type: 'field', label: 'f2', buckets: [] }
            ];
            const data = {
                list: {
                    context: {
                        facets: serverResponseFields
                    }
                }
            };

            component.onDataLoaded(data);
            expect(component.responseFacets.length).toEqual(2);
            expect(component.responseFacets[0].buckets.items[0].count).toEqual(10);
            expect(component.responseFacets[0].buckets.items[1].count).toEqual(1);
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
                { type: 'field', label: 'f1', buckets: { items: [{ label: 'b1', count: 10, filterQuery: 'filter' }, { label: 'b2', count: 1 }]} },
                { type: 'field', label: 'f2', buckets: [] }
            ];
            component.responseFacets = initialFields;
            expect(component.responseFacets[0].buckets.items[0].count).toEqual(10);
            expect(component.responseFacets[0].buckets.items[1].count).toEqual(1);

            const serverResponseFields: any = [
                { type: 'field', label: 'f1', buckets:
                        [{ label: 'b1', metrics: [{value: {count: 6}}], filterQuery: 'filter' },
                            { label: 'b2', metrics: [{value: {count: 0}}] }] },
                { type: 'field', label: 'f2', buckets: [] }
            ];
            const data = {
                list: {
                    context: {
                        facets: serverResponseFields
                    }
                }
            };

            component.onDataLoaded(data);
            expect(component.responseFacets[0].buckets.items[0].count).toEqual(6);
            expect(component.responseFacets[0].buckets.items[1].count).toEqual(0);
        });

        it('should update correctly the existing facetFields bucket values', () => {
            component.responseFacets = null;

            queryBuilder.config = {
                categories: [],
                facetFields: { fields: [{ label: 'f1', field: 'f1' }] },
                facetQueries: { queries: [] }
            };

            const firstCallFields: any = [{
                type: 'field',
                label: 'f1',
                buckets: [{ label: 'b1', metrics: [{value: {count: 10}}] }]
            }];
            const firstCallData = { list: { context: { facets: firstCallFields }}};
            component.onDataLoaded(firstCallData);
            expect(component.responseFacets[0].buckets.items[0].count).toEqual(10);

            const secondCallFields: any = [{
                type: 'field',
                label: 'f1',
                buckets: [{ label: 'b1', metrics: [{value: {count: 6}}] }]
            }];
            const secondCallData = { list: { context: { facets: secondCallFields}}};
            component.onDataLoaded(secondCallData);
            expect(component.responseFacets[0].buckets.items[0].count).toEqual(6);
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

            component.responseFacets = <any> [
                { type: 'field', label: 'f1', field: 'f1', buckets: {items: [
                            { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                            { label: 'b2', count: 1, filterQuery: 'filter2' }] }},
                { type: 'field', label: 'f2', field: 'f2', buckets: {items: [] }}
            ];
            component.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacets[0].buckets.items[0]);

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
            component.selectFacetBucket({ field: 'f1', label: 'f1' }, component.responseFacets[0].buckets.items[1]);
            component.onDataLoaded(data);
            expect(component.responseFacets.length).toEqual(2);
            expect(component.responseFacets[0].buckets.items[0].checked).toEqual(true, 'should show the already checked item');
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

            component.responseFacets = <any> [
                { type: 'field', label: 'f1', field: 'f1', buckets: {items: [
                            { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                            { label: 'b2', count: 1, filterQuery: 'filter2' }] }},
                { type: 'field', label: 'f2', field: 'f2', buckets: {items: [] }}
            ];
            component.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacets[0].buckets.items[0]);

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
            component.selectFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacets[0].buckets.items[1]);
            component.onDataLoaded(data);
            expect(component.responseFacets.length).toEqual(2);
            expect(component.responseFacets[0].buckets.items[1].checked).toEqual(true, 'should show the newly checked item');
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

            component.responseFacets = <any> [
                { type: 'field', label: 'f1', field: 'f1', buckets: {items: [
                            { label: 'b1', count: 10, filterQuery: 'filter', checked: true },
                            { label: 'b2', count: 1, filterQuery: 'filter2' }] }},
                { type: 'field', label: 'f2', field: 'f2', buckets: {items: [] }}
            ];
            component.queryBuilder.addUserFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacets[0].buckets.items[0]);
            const data = {
                list: {
                    context: {}
                }
            };
            component.selectFacetBucket({ label: 'f1', field: 'f1' }, component.responseFacets[0].buckets.items[1]);
            component.onDataLoaded(data);

            expect(component.responseFacets[0].buckets.items[0].count).toEqual(0);
            expect(component.responseFacets[0].buckets.items[1].count).toEqual(0);
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

            expect(component.canResetSelectedBuckets(field)).toEqual(false);
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

            expect(buckets[0].checked).toEqual(false);
            expect(buckets[1].checked).toEqual(false);
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
            spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

            const queryResponse = <any> {
                label: 'query response',
                buckets: <any> {
                    items: [
                        { label: 'q1', query: 'q1', checked: true, metrics: [{value: {count: 1}}] },
                        { label: 'q2', query: 'q2', checked: false, metrics: [{value: {count: 1}}] },
                        { label: 'q3', query: 'q3', checked: true, metrics: [{value: {count: 1}}] }]
                }};
            component.responseFacets = [queryResponse];
            component.resetSelectedBuckets(queryResponse);

            expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledTimes(3);
            expect(queryBuilder.update).toHaveBeenCalled();

            for (const entry of component.responseFacets[0].buckets.items) {
                expect(entry.checked).toEqual(false);
            }
        });

        it('should fetch facet intervals from response payload', () => {
            component.responseFacets = null;
            queryBuilder.config = {
                categories: [],
                facetIntervals: {
                    intervals: [
                        { label: 'test_intervals1', field: 'f1', sets: [
                                { label: 'interval1', start: 's1', end: 'e1'},
                                { label: 'interval2', start: 's2', end: 'e2'}
                            ]},
                        { label: 'test_intervals2', field: 'f2', sets: [
                                { label: 'interval3', start: 's3', end: 'e3'},
                                { label: 'interval4', start: 's4', end: 'e4'}
                            ]}
                    ]
                }
            };

            const response1 = [
                { label: 'interval1', filterQuery: 'query1', metrics: [{ value: { count: 1 }}]},
                { label: 'interval2', filterQuery: 'query2', metrics: [{ value: { count: 2 }}]}
            ];
            const response2 = [
                { label: 'interval3', filterQuery: 'query3', metrics: [{ value: { count: 3 }}]},
                { label: 'interval4', filterQuery: 'query4', metrics: [{ value: { count: 4 }}]}
            ];
            const data = {
                list: {
                    context: {
                        facets: [
                            { type: 'interval', label: 'test_intervals1', buckets: response1 },
                            { type: 'interval', label: 'test_intervals2', buckets: response2 }
                        ]
                    }
                }
            };

            component.onDataLoaded(data);

            expect(component.responseFacets.length).toBe(2);
            expect(component.responseFacets[0].buckets.length).toEqual(2);
            expect(component.responseFacets[1].buckets.length).toEqual(2);
        });

        it('should filter out the fetched facet intervals that have bucket values less than their set mincount', () => {
            component.responseFacets = null;
            queryBuilder.config = {
                categories: [],
                facetIntervals: {
                    intervals: [
                        { label: 'test_intervals1', field: 'f1', mincount: 2, sets: [
                                { label: 'interval1', start: 's1', end: 'e1'},
                                { label: 'interval2', start: 's2', end: 'e2'}
                            ]},
                        { label: 'test_intervals2', field: 'f2', mincount: 5, sets: [
                                { label: 'interval3', start: 's3', end: 'e3'},
                                { label: 'interval4', start: 's4', end: 'e4'}
                            ]}
                    ]
                }
            };

            const response1 = [
                { label: 'interval1', filterQuery: 'query1', metrics: [{ value: { count: 1 }}]},
                { label: 'interval2', filterQuery: 'query2', metrics: [{ value: { count: 2 }}]}
            ];
            const response2 = [
                { label: 'interval3', filterQuery: 'query3', metrics: [{ value: { count: 3 }}]},
                { label: 'interval4', filterQuery: 'query4', metrics: [{ value: { count: 4 }}]}
            ];
            const data = {
                list: {
                    context: {
                        facets: [
                            { type: 'interval', label: 'test_intervals1', buckets: response1 },
                            { type: 'interval', label: 'test_intervals2', buckets: response2 }
                        ]
                    }
                }
            };

            component.onDataLoaded(data);

            expect(component.responseFacets.length).toBe(2);
            expect(component.responseFacets[0].buckets.length).toEqual(1);
            expect(component.responseFacets[1].buckets.length).toEqual(0);
        });
    });

    describe('widgets', () => {

        it('should have expandable categories', async(() => {
            fixture.detectChanges();
            queryBuilder.categories = expandableCategories;

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
                expect(panels.length).toBe(1);

                const element: HTMLElement = panels[0].nativeElement;

                (element.childNodes[0] as HTMLElement).click();
                fixture.detectChanges();
                expect(element.classList.contains('mat-expanded')).toBeTruthy();

                (element.childNodes[0] as HTMLElement).click();
                fixture.detectChanges();
                expect(element.classList.contains('mat-expanded')).toEqual(false);
            });
        }));

        it('should not show the disabled widget', async(() => {
            appConfigService.config.search = { categories: disabledCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
                expect(panels.length).toBe(0);
            });
        }));

        it('should show the widget in expanded mode', async(() => {
            appConfigService.config.search = { categories: expandedCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
                expect(panels.length).toBe(1);

                const title = fixture.debugElement.query(By.css('.mat-expansion-panel-header-title'));
                expect(title.nativeElement.innerText.trim()).toBe('Type');

                const element: HTMLElement = panels[0].nativeElement;
                expect(element.classList.contains('mat-expanded')).toBeTruthy();

                (element.childNodes[0] as HTMLElement).click();
                fixture.detectChanges();
                expect(element.classList.contains('mat-expanded')).toEqual(false);
            });
        }));

        it('should show the widgets only if configured', async(() => {
            appConfigService.config.search = { categories: simpleCategories };
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
                expect(panels.length).toBe(2);

                const titleElements = fixture.debugElement.queryAll(By.css('.mat-expansion-panel-header-title'));
                expect(titleElements.map(title => title.nativeElement.innerText.trim())).toEqual(['Name', 'Type']);
            });
        }));

        it('should be update the search query when name changed', async( async () => {
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

            queryBuilder.executed.next(<any> mockSearchResult);
            fixture.detectChanges();

            panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
            expect(panels.length).toBe(16);
        }));

        it('should show the long facet options list with pagination', () => {
            const panel = '[data-automation-id="expansion-panel-Size facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();

            fixture.detectChanges();
            queryBuilder.executed.next(<any> mockSearchResult);
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
            queryBuilder.executed.next(<any> mockSearchResult);
            fixture.detectChanges();

            const facetElement = fixture.debugElement.query(By.css(panel));
            expect(facetElement).toEqual(null);
        });

        it('should search the facets options and select it', () => {
            const panel = '[data-automation-id="expansion-panel-Size facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(<any> mockSearchResult);
            fixture.detectChanges();

            spyOn(queryBuilder, 'update').and.stub();
            spyOn(component, 'selectFacetBucket').and.callThrough();
            spyOn(component, 'onToggleBucket').and.callThrough();

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

            const clearButton = fixture.debugElement.query(By.css(`${panel} button`));
            clearButton.triggerEventHandler('click', {});
            fixture.detectChanges();

            filteredMenu = getAllMenus(`${panel} mat-checkbox`, fixture);
            expect(filteredMenu).toEqual(stepOne);

            const firstOption = fixture.debugElement.query(By.css(`${panel} mat-checkbox`));
            firstOption.triggerEventHandler('change', { checked: true });
            fixture.detectChanges();

            const checkedOption = fixture.debugElement.query(By.css(`${panel} mat-checkbox.mat-checkbox-checked`));
            expect(checkedOption.nativeElement.innerText).toEqual('Extra Small (10239)');

            expect(component.onToggleBucket).toHaveBeenCalledTimes(1);
            expect(component.selectFacetBucket).toHaveBeenCalledTimes(1);
        });

        it('should preserve the filter state if other fields edited', () => {
            const panel1 = '[data-automation-id="expansion-panel-Size facet queries"]';
            const panel2 = '[data-automation-id="expansion-panel-Type facet queries"]';
            appConfigService.config.search = searchFilter;
            queryBuilder.resetToDefaults();
            fixture.detectChanges();
            queryBuilder.executed.next(<any> mockSearchResult);
            fixture.detectChanges();
            spyOn(queryBuilder, 'update').and.stub();
            spyOn(component, 'selectFacetBucket').and.callThrough();
            spyOn(component, 'onToggleBucket').and.callThrough();

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

            expect(component.onToggleBucket).toHaveBeenCalledTimes(2);
            expect(component.selectFacetBucket).toHaveBeenCalledTimes(2);
        });

    });
});

export function getAllMenus(regex, fixture: ComponentFixture<any>): string[] {
    const elements = fixture.debugElement.queryAll(By.css(regex));
    return Array.from(elements).map(element => element.nativeElement.innerText);
}
