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

import { SearchQueryBuilderService } from './search-query-builder.service';
import { SearchConfiguration } from '../models/search-configuration.interface';
import { AppConfigService } from '@alfresco/adf-core';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { FacetField } from '../models/facet-field.interface';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { ADF_SEARCH_CONFIGURATION } from '../search-configuration.token';
import { ActivatedRoute, Router } from '@angular/router';

const buildConfig = (searchSettings = {}): AppConfigService => {
    let config: AppConfigService;
    TestBed.runInInjectionContext(() => {
        config = TestBed.inject(AppConfigService);
    });
    config.config.search = searchSettings;
    return config;
};

describe('SearchQueryBuilder (runtime config)', () => {
    const runtimeConfig: SearchConfiguration = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            providers: [{ provide: ADF_SEARCH_CONFIGURATION, useValue: runtimeConfig }]
        });
    });

    it('should use custom search configuration via dependency injection', () => {
        let builder: SearchQueryBuilderService;
        TestBed.runInInjectionContext(() => {
            builder = TestBed.inject(SearchQueryBuilderService);
        });
        const currentConfig = builder.loadConfiguration();

        expect(currentConfig).toEqual(runtimeConfig);
    });

    it('should prioritise runtime config over configuration file', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any],
            filterQueries: [{ query: 'query1' }, { query: 'query2' }]
        };

        let alfrescoApiService: AlfrescoApiService;
        let builder: SearchQueryBuilderService;
        TestBed.runInInjectionContext(() => {
            alfrescoApiService = TestBed.inject(AlfrescoApiService);
            builder = new SearchQueryBuilderService(buildConfig(config), alfrescoApiService, runtimeConfig);
        });
        const currentConfig = builder.loadConfiguration();

        expect(currentConfig).toEqual(runtimeConfig);
    });
});

describe('SearchQueryBuilder', () => {
    let router: Router;
    let activatedRoute: ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        router = TestBed.inject(Router);
        activatedRoute = TestBed.inject(ActivatedRoute);
    });

    const createQueryBuilder = (config?: any) => {
        let builder: SearchQueryBuilderService;
        TestBed.runInInjectionContext(() => {
            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            builder = new SearchQueryBuilderService(buildConfig(config), alfrescoApiService);
        });
        return builder;
    };

    it('should reset to defaults', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any],
            filterQueries: [{ query: 'query1' }, { query: 'query2' }]
        };

        const builder = createQueryBuilder(config);

        builder.categories = [];
        builder.filterQueries = [];

        expect(builder.categories.length).toBe(0);
        expect(builder.filterQueries.length).toBe(0);

        builder.resetToDefaults();

        expect(builder.categories.length).toBe(2);
        expect(builder.filterQueries.length).toBe(2);
    });

    it('should have empty user query by default', () => {
        const builder = createQueryBuilder();
        expect(builder.userQuery).toBe('');
    });

    it('should wrap user query with brackets', () => {
        const builder = createQueryBuilder();
        builder.userQuery = 'my query';
        expect(builder.userQuery).toEqual('(my query)');
    });

    it('should trim user query value', () => {
        const builder = createQueryBuilder();
        builder.userQuery = ' something   ';
        expect(builder.userQuery).toEqual('(something)');
    });

    it('should use only enabled categories', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: false } as any, { id: 'cat3', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);

        expect(builder.categories.length).toBe(2);
        expect(builder.categories[0].id).toBe('cat1');
        expect(builder.categories[1].id).toBe('cat3');
    });

    it('should fetch filter queries from config', () => {
        const config: SearchConfiguration = {
            categories: [],
            filterQueries: [{ query: 'query1' }, { query: 'query2' }]
        };
        const builder = createQueryBuilder(config);

        expect(builder.filterQueries.length).toBe(2);
        expect(builder.filterQueries[0].query).toBe('query1');
        expect(builder.filterQueries[1].query).toBe('query2');
    });

    it('should add new filter query', () => {
        const builder = createQueryBuilder();
        builder.addFilterQuery('q1');

        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q1');
    });

    it('should not add empty filter query', () => {
        const builder = createQueryBuilder();
        builder.addFilterQuery(null);
        builder.addFilterQuery('');

        expect(builder.filterQueries.length).toBe(0);
    });

    it('should not add duplicate filter query', () => {
        const builder = createQueryBuilder();
        builder.addFilterQuery('q1');
        builder.addFilterQuery('q1');
        builder.addFilterQuery('q1');

        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q1');
    });

    it('should remove filter query', () => {
        const builder = createQueryBuilder();
        builder.addFilterQuery('q1');
        builder.addFilterQuery('q2');
        expect(builder.filterQueries.length).toBe(2);

        builder.removeFilterQuery('q1');
        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q2');
    });

    it('should not remove empty query', () => {
        const builder = createQueryBuilder();
        builder.addFilterQuery('q1');
        builder.addFilterQuery('q2');
        expect(builder.filterQueries.length).toBe(2);

        builder.removeFilterQuery(null);
        builder.removeFilterQuery('');
        expect(builder.filterQueries.length).toBe(2);
    });

    it('should call filterQueryUpdate after adding or removing filterQuery', () => {
        const builder = createQueryBuilder();
        spyOn(builder.filterQueryUpdate, 'next');
        builder.addFilterQuery('q1');
        builder.removeFilterQuery('q1');
        expect(builder.filterQueryUpdate.next).toHaveBeenCalledTimes(2);
    });

    it('should fetch facet query from config', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetQueries: {
                queries: [
                    { query: 'q1', label: 'query1' },
                    { query: 'q2', label: 'query2' }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        const query = builder.getFacetQuery('query2');

        expect(query.query).toBe('q2');
        expect(query.label).toBe('query2');
    });

    it('should not fetch empty facet query from the config', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetQueries: {
                queries: [{ query: 'q1', label: 'query1' }]
            }
        };
        const builder = createQueryBuilder(config);

        const query1 = builder.getFacetQuery('');
        expect(query1).toBeNull();

        const query2 = builder.getFacetQuery(null);
        expect(query2).toBeNull();
    });

    it('should fetch facet from the config by label', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetFields: {
                fields: [
                    { field: 'content.mimetype', mincount: 1, label: 'Type' },
                    { field: 'content.size', mincount: 1, label: 'Size' }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        const field = builder.getFacetField('Size');

        expect(field.label).toBe('Size');
        expect(field.field).toBe('content.size');
    });

    it('should not fetch facet from the config by label', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetFields: {
                fields: [
                    { field: 'content.mimetype', mincount: 1, label: 'Type' },
                    { field: 'content.size', mincount: 1, label: 'Size' }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        const field = builder.getFacetField('Missing');

        expect(field).toBeFalsy();
    });

    it('should fetch facets from the config by label with spaces and return field with request compatible label (escaped)', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetFields: {
                fields: [{ field: 'content.size', mincount: 1, label: 'Label with spaces' }]
            }
        };
        const builder = createQueryBuilder(config);
        const field = builder.getFacetField('Label with spaces');

        expect(field.label).toBe('"Label with spaces"');
        expect(field.field).toBe('content.size');
    });

    it('should require a query fragment to build query', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = null;

        const compiled = builder.buildQuery();
        expect(compiled).toBeNull();
    });

    it('should build query with single fragment', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.query.query).toBe('(cm:name:test)');
    });

    it('should build query with multiple fragments', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);

        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.queryFragments['cat2'] = 'NOT cm:creator:System';

        const compiled = builder.buildQuery();
        expect(compiled.query.query).toBe('(cm:name:test) AND (NOT cm:creator:System)');
    });

    it('should build query with custom fields', () => {
        const config: SearchConfiguration = {
            fields: ['field1', 'field2'],
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.fields).toEqual(['field1', 'field2']);
    });

    it('should build query with empty custom fields', () => {
        const config: SearchConfiguration = {
            fields: [],
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.fields).toEqual([]);
    });

    it('should build query with custom filter queries', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.addFilterQuery('query1');

        const compiled = builder.buildQuery();
        expect(compiled.filterQueries).toEqual([{ query: 'query1' }]);
    });

    it('should build query with custom facet queries', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any],
            facetQueries: {
                queries: [{ query: 'q1', label: 'q2', group: 'group-name' }]
            }
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetQueries).toEqual(config.facetQueries.queries);
    });

    it('should build query with custom facet fields', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any],
            facetFields: {
                fields: [
                    { field: 'field1', label: 'field1', mincount: 1, limit: null, offset: 0, prefix: null },
                    { field: 'field2', label: 'field2', mincount: 1, limit: null, offset: 0, prefix: null }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetFields.facets).toEqual(jasmine.objectContaining(config.facetFields.fields));
    });

    it('should build query with custom facet fields automatically getting their request compatible labels', () => {
        const spacesLabel = {
            configValue: 'label with spaces',
            requestCompatibleValue: '"label with spaces"'
        };
        const noSpacesLabel = {
            configValue: 'label',
            requestCompatibleValue: 'label'
        };

        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any],
            facetFields: {
                fields: [
                    {
                        field: 'field1',
                        label: spacesLabel.configValue,
                        mincount: 1,
                        limit: null,
                        offset: 0,
                        prefix: null
                    },
                    {
                        field: 'field2',
                        label: noSpacesLabel.configValue,
                        mincount: 1,
                        limit: null,
                        offset: 0,
                        prefix: null
                    }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetFields.facets[0].label).toEqual(spacesLabel.requestCompatibleValue);
        expect(compiled.facetFields.facets[0].label).not.toEqual(spacesLabel.configValue);
        expect(compiled.facetFields.facets[1].label).toEqual(noSpacesLabel.requestCompatibleValue);
        expect(compiled.facetFields.facets[1].label).toEqual(noSpacesLabel.configValue);
    });

    it('should build query with custom facet intervals', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any],
            facetIntervals: {
                intervals: [
                    {
                        label: 'test_intervals1',
                        field: 'f1',
                        sets: [
                            { label: 'interval1', start: 's1', end: 'e1', startInclusive: true, endInclusive: true },
                            { label: 'interval2', start: 's2', end: 'e2', startInclusive: false, endInclusive: true }
                        ]
                    },
                    {
                        label: 'test_intervals2',
                        field: 'f2',
                        sets: [
                            { label: 'interval3', start: 's3', end: 'e3', startInclusive: true, endInclusive: false },
                            { label: 'interval4', start: 's4', end: 'e4', startInclusive: false, endInclusive: false }
                        ]
                    }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetIntervals).toEqual(jasmine.objectContaining(config.facetIntervals));
    });

    it('should build query with custom facet intervals automatically getting their request compatible labels', () => {
        const spacesLabel = {
            configValue: 'label with spaces',
            requestCompatibleValue: '"label with spaces"'
        };
        const noSpacesLabel = {
            configValue: 'label',
            requestCompatibleValue: 'label'
        };
        const spacesLabelForSet = {
            configValue: 'label for set',
            requestCompatibleValue: '"label for set"'
        };

        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any],
            facetIntervals: {
                intervals: [
                    {
                        label: spacesLabel.configValue,
                        field: 'f1',
                        sets: [
                            { label: spacesLabelForSet.configValue, start: 's1', end: 'e1' },
                            { label: 'interval2', start: 's2', end: 'e2' }
                        ]
                    },
                    {
                        label: noSpacesLabel.configValue,
                        field: 'f2',
                        sets: [
                            { label: 'interval3', start: 's3', end: 'e3' },
                            { label: 'interval4', start: 's4', end: 'e4' }
                        ]
                    }
                ]
            }
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetIntervals.intervals[0].label).toEqual(spacesLabel.requestCompatibleValue);
        expect(compiled.facetIntervals.intervals[0].label).not.toEqual(spacesLabel.configValue);
        expect(compiled.facetIntervals.intervals[1].label).toEqual(noSpacesLabel.requestCompatibleValue);
        expect(compiled.facetIntervals.intervals[1].label).toEqual(noSpacesLabel.configValue);

        expect(compiled.facetIntervals.intervals[0].sets[0].label).toEqual(spacesLabelForSet.requestCompatibleValue);
    });

    it('should build query with sorting', () => {
        const config: SearchConfiguration = {
            fields: [],
            categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        const sorting: any = { type: 'FIELD', field: 'cm:name', ascending: true };
        builder.sorting = [sorting];

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.sort[0]).toEqual(jasmine.objectContaining(sorting));
    });

    it('should use pagination settings', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.paging = { maxItems: 5, skipCount: 5 };

        const compiled = builder.buildQuery();
        expect(compiled.paging).toEqual({
            maxItems: 5,
            skipCount: 5
        });
    });

    it('should build final request with user and custom queries', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        builder.userQuery = 'my query';

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.query.query).toBe('(my query) AND (cm:name:test)');
    });

    it('should group facet buckets by field', () => {
        const field1: FacetField = {
            field: 'f1',
            label: 'f1'
        };

        const field1buckets = [
            { checked: true, filterQuery: 'f1-q1', label: 'f1-q1', count: 1 },
            { checked: true, filterQuery: 'f1-q2', label: 'f1-q2', count: 1 }
        ];

        const field2: FacetField = {
            field: 'f2',
            label: 'f2'
        };

        const field2buckets = [
            { checked: true, filterQuery: 'f2-q1', label: 'f2-q1', count: 1 },
            { checked: true, filterQuery: 'f2-q2', label: 'f2-q2', count: 1 }
        ];

        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);

        builder.addUserFacetBucket(field1.field, field1buckets[0]);
        builder.addUserFacetBucket(field1.field, field1buckets[1]);
        builder.addUserFacetBucket(field2.field, field2buckets[0]);
        builder.addUserFacetBucket(field2.field, field2buckets[1]);

        const compiledQuery = builder.buildQuery();
        const expectedResult = '(f1-q1 OR f1-q2) AND (f2-q1 OR f2-q2)';

        expect(compiledQuery.query.query).toBe(expectedResult);
    });

    it('should use highlight in the queries', () => {
        const config: SearchConfiguration = {
            highlight: {
                prefix: 'my-prefix',
                postfix: 'my-postfix',
                mergeContiguous: true
            }
        };
        const builder = createQueryBuilder(config);
        builder.userQuery = 'my query';

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.highlight.prefix).toBe('my-prefix');
        expect(compiled.highlight.postfix).toBe('my-postfix');
        expect(compiled.highlight.mergeContiguous).toBe(true);
    });

    it('should emit error event', () => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        spyOn(builder, 'buildQuery').and.throwError('some error');

        builder.error.subscribe((error) => {
            expect(error).toEqual(new Error('some error'));
        });

        builder.execute();
    });

    it('should emit empty results on error', (done) => {
        const config: SearchConfiguration = {
            categories: [{ id: 'cat1', enabled: true } as any]
        };
        const builder = createQueryBuilder(config);
        spyOn(builder, 'buildQuery').and.throwError('some error');

        builder.executed.subscribe((data) => {
            expect(data.list.entries).toEqual([]);
            expect(data.list.pagination.totalItems).toBe(0);
            done();
        });

        builder.execute();
    });

    it('should include contain the path and allowableOperations by default', () => {
        const builder = createQueryBuilder();
        builder.userQuery = 'nuka cola quantum';
        const searchRequest = builder.buildQuery();

        expect(searchRequest.include).toEqual(['path', 'allowableOperations']);
    });

    it('should fetch the include config from the app config', () => {
        const includeConfig = ['path', 'allowableOperations', 'properties'];
        const config: SearchConfiguration = {
            include: includeConfig
        };
        const builder = createQueryBuilder(config);
        builder.userQuery = 'nuka cola quantum';
        const searchRequest = builder.buildQuery();

        expect(searchRequest.include).toEqual(includeConfig);
    });

    it('should the query contain the pagination', () => {
        const builder = createQueryBuilder();
        builder.userQuery = 'nuka cola quantum';
        const mockPagination = {
            maxItems: 10,
            skipCount: 0
        };
        builder.paging = mockPagination;
        const searchRequest = builder.buildQuery();

        expect(searchRequest.paging).toEqual(mockPagination);
    });

    it('should the query contain the scope in case it is defined', () => {
        const builder = createQueryBuilder();
        const mockScope = { locations: 'mock-location' };
        builder.userQuery = 'nuka cola quantum';
        builder.setScope(mockScope);
        const searchRequest = builder.buildQuery();

        expect(searchRequest.scope).toEqual(mockScope);
    });

    it('should return empty if array of search config not found', (done) => {
        const builder = createQueryBuilder(null);
        builder.searchForms.subscribe((forms) => {
            expect(forms).toEqual([]);
            done();
        });
    });

    it('should add user query to filter raw params when query is built', () => {
        const builder = createQueryBuilder();
        builder.userQuery = 'nuka cola quantum';
        builder.buildQuery();

        expect(builder.filterRawParams).toEqual({ userQuery: '(nuka cola quantum)' });
    });

    it('should encode query from filter raw params and update query params on executing query', (done) => {
        spyOn(router, 'navigate');
        const builder = createQueryBuilder();
        builder.userQuery = 'nuka cola quantum';
        builder.executed.subscribe(() => {
            expect(builder.filterRawParams).toEqual({ userQuery: '(nuka cola quantum)' });
            expect(router.navigate).toHaveBeenCalledWith([], {
                relativeTo: activatedRoute,
                queryParams: { q: 'eyJ1c2VyUXVlcnkiOiIobnVrYSBjb2xhIHF1YW50dW0pIn0=' },
                queryParamsHandling: 'merge'
            });
            done();
        });
        builder.execute();
    });

    it('should encode query from filter raw params and update query params on navigating to search', async () => {
        spyOn(router, 'navigate');
        const builder = createQueryBuilder();
        await builder.navigateToSearch('test query', '/search');

        expect(builder.filterRawParams).toEqual({ userQuery: '(test query)' });
        expect(router.navigate).toHaveBeenCalledWith([], {
            relativeTo: activatedRoute,
            queryParams: { q: 'eyJ1c2VyUXVlcnkiOiIodGVzdCBxdWVyeSkifQ==' },
            queryParamsHandling: 'merge'
        });
    });

    describe('Multiple search configuration', () => {
        let configs: SearchConfiguration[];
        let builder: SearchQueryBuilderService;
        beforeEach(() => {
            configs = [
                {
                    categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any],
                    filterQueries: [{ query: 'query1' }, { query: 'query2' }],
                    name: 'config1',
                    default: true
                },
                {
                    categories: [{ id: 'mouse', enabled: true } as any],
                    filterQueries: [{ query: 'query1' }, { query: 'query2' }],
                    name: 'config2',
                    default: false
                },
                {
                    categories: [{ id: 'cat_and_mouse', enabled: true } as any],
                    default: false
                }
            ];
            builder = createQueryBuilder(configs);
        });

        it('should pick the default configuration from list', () => {
            builder.categories = [];
            builder.filterQueries = [];

            expect(builder.categories.length).toBe(0);
            expect(builder.filterQueries.length).toBe(0);

            builder.resetToDefaults();

            expect(builder.categories.length).toBe(2);
            expect(builder.categories.length).toBe(2);
            expect(builder.filterQueries.length).toBe(2);
        });

        it('should list available search form names', (done) => {
            builder.searchForms.subscribe((forms) => {
                expect(forms).toEqual([
                    { index: 0, name: 'config1', default: true, selected: true },
                    { index: 1, name: 'config2', default: false, selected: false },
                    { index: 2, name: 'SEARCH.UNKNOWN_CONFIGURATION', default: false, selected: false }
                ]);
                done();
            });
        });

        it('should allow the user switch the form', () => {
            builder.updateSelectedConfiguration(1);

            expect(builder.categories.length).toBe(1);
            expect(builder.filterQueries.length).toBe(2);
        });

        it('should keep the selected configuration value', (done) => {
            builder.updateSelectedConfiguration(1);
            builder.searchForms.subscribe((forms) => {
                expect(forms).toEqual([
                    { index: 0, name: 'config1', default: true, selected: false },
                    { index: 1, name: 'config2', default: false, selected: true },
                    { index: 2, name: 'SEARCH.UNKNOWN_CONFIGURATION', default: false, selected: false }
                ]);
                done();
            });
        });
    });
});
