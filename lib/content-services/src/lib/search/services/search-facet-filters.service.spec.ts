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

import { TestBed } from '@angular/core/testing';

import { SearchFacetFiltersService } from './search-facet-filters.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { SearchQueryBuilderService } from './search-query-builder.service';

describe('SearchFacetFiltersService', () => {
    let searchFacetFiltersService: SearchFacetFiltersService;
    let queryBuilder: SearchQueryBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ContentTestingModule]
        });
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
    });

    it('should subscribe to query builder executed event', () => {
        spyOn(searchFacetFiltersService, 'onDataLoaded').and.stub();
        const data = { list: {} };
        queryBuilder.executed.next(data);

        expect(searchFacetFiltersService.onDataLoaded).toHaveBeenCalledWith(data);
    });

    it('should fetch facet queries from response payload', () => {
        searchFacetFiltersService.responseFacets = null;

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

        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets.length).toBe(1);
        expect(searchFacetFiltersService.responseFacets[0].buckets.length).toEqual(2);
    });

    it('should preserve order after response processing', () => {
        searchFacetFiltersService.responseFacets = null;

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

        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets.length).toBe(1);
        expect(searchFacetFiltersService.responseFacets[0].buckets.length).toBe(3);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].label).toBe('q1');
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].label).toBe('q2');
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[2].label).toBe('q3');
    });

    it('should not fetch facet queries from response payload', () => {
        searchFacetFiltersService.responseFacets = null;

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

        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets).toBeNull();
    });

    it('should fetch facet fields from response payload', () => {
        searchFacetFiltersService.responseFacets = null;

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

        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets.length).toEqual(2);
        expect(searchFacetFiltersService.responseFacets[0].buckets.length).toEqual(2);
        expect(searchFacetFiltersService.responseFacets[1].buckets.length).toEqual(2);
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

        searchFacetFiltersService.onDataLoaded(data);
        expect(searchFacetFiltersService.responseFacets.length).toBe(1);
        expect(searchFacetFiltersService.responseFacets[0].buckets.visibleItems.length).toBe(3);

        searchFacetFiltersService.responseFacets[0].buckets.filterText = 'f';
        expect(searchFacetFiltersService.responseFacets[0].buckets.visibleItems.length).toBe(1);
        expect(searchFacetFiltersService.responseFacets[0].buckets.visibleItems[0].label).toEqual('firstLabel');

        searchFacetFiltersService.responseFacets[0].buckets.filterText = 'label';
        expect(searchFacetFiltersService.responseFacets[0].buckets.visibleItems.length).toBe(0);

        // Set filter method to use contains and test again
        queryBuilder.config.filterWithContains = true;
        searchFacetFiltersService.responseFacets[0].buckets.filterText = 'f';
        expect(searchFacetFiltersService.responseFacets[0].buckets.visibleItems.length).toBe(1);
        searchFacetFiltersService.responseFacets[0].buckets.filterText = 'label';
        expect(searchFacetFiltersService.responseFacets[0].buckets.visibleItems.length).toBe(3);
    });

    it('should fetch facet fields from response payload and show the bucket values', () => {
        searchFacetFiltersService.responseFacets = null;

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

        searchFacetFiltersService.onDataLoaded(data);
        expect(searchFacetFiltersService.responseFacets.length).toEqual(1);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(10);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].count).toEqual(1);
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
        searchFacetFiltersService.responseFacets = initialFields;
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(10);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].count).toEqual(1);

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

        searchFacetFiltersService.onDataLoaded(data);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(6);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[1].count).toEqual(0);
    });

    it('should update correctly the existing facetFields bucket values', () => {
        searchFacetFiltersService.responseFacets = null;

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
        searchFacetFiltersService.onDataLoaded(firstCallData);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(10);

        const secondCallFields: any = [{
            type: 'field',
            label: 'f1',
            buckets: [{ label: 'b1', metrics: [{value: {count: 6}}] }]
        }];
        const secondCallData = { list: { context: { facets: secondCallFields}}};
        searchFacetFiltersService.onDataLoaded(secondCallData);
        expect(searchFacetFiltersService.responseFacets[0].buckets.items[0].count).toEqual(6);
    });

    it('should fetch facet intervals from response payload', () => {
        searchFacetFiltersService.responseFacets = null;
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

        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets.length).toBe(2);
        expect(searchFacetFiltersService.responseFacets[0].buckets.length).toEqual(2);
        expect(searchFacetFiltersService.responseFacets[1].buckets.length).toEqual(2);
    });

    it('should filter out the fetched facet intervals that have bucket values less than their set mincount', () => {
        searchFacetFiltersService.responseFacets = null;
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

        searchFacetFiltersService.onDataLoaded(data);

        expect(searchFacetFiltersService.responseFacets.length).toBe(1);
        expect(searchFacetFiltersService.responseFacets[0].buckets.length).toEqual(1);
    });

});
