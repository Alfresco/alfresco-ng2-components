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

import { SearchQueryBuilderService } from './search-query-builder.service';
import { SearchConfiguration } from './search-configuration.interface';
import { AppConfigService } from '@alfresco/adf-core';
import { FacetField } from './facet-field.interface';

describe('SearchQueryBuilder', () => {

    const buildConfig = (searchSettings): AppConfigService => {
        const config = new AppConfigService(null);
        config.config.search = searchSettings;
        return config;
    };

    it('should reset to defaults', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true },
                <any> { id: 'cat2', enabled: true }
            ],
            filterQueries: [
                { query: 'query1' },
                { query: 'query2' }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.categories = [];
        builder.filterQueries = [];

        expect(builder.categories.length).toBe(0);
        expect(builder.filterQueries.length).toBe(0);

        builder.resetToDefaults();

        expect(builder.categories.length).toBe(2);
        expect(builder.filterQueries.length).toBe(2);
    });

    it('should have empty user query by default', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);
        expect(builder.userQuery).toBe('');
    });

    it('should wrap user query with brackets', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);
        builder.userQuery = 'my query';
        expect(builder.userQuery).toEqual('(my query)');
    });

    it('should trim user query value', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);
        builder.userQuery = ' something   ';
        expect(builder.userQuery).toEqual('(something)');
    });

    it('should use only enabled categories', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true },
                <any> { id: 'cat2', enabled: false },
                <any> { id: 'cat3', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        expect(builder.categories.length).toBe(2);
        expect(builder.categories[0].id).toBe('cat1');
        expect(builder.categories[1].id).toBe('cat3');
    });

    it('should fetch filter queries from config', () => {
        const config: SearchConfiguration = {
            categories: [],
            filterQueries: [
                { query: 'query1' },
                { query: 'query2' }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        expect(builder.filterQueries.length).toBe(2);
        expect(builder.filterQueries[0].query).toBe('query1');
        expect(builder.filterQueries[1].query).toBe('query2');
    });

    it('should add new filter query', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);

        builder.addFilterQuery('q1');

        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q1');
    });

    it('should not add empty filter query', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);

        builder.addFilterQuery(null);
        builder.addFilterQuery('');

        expect(builder.filterQueries.length).toBe(0);
    });

    it('should not add duplicate filter query', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);

        builder.addFilterQuery('q1');
        builder.addFilterQuery('q1');
        builder.addFilterQuery('q1');

        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q1');
    });

    it('should remove filter query', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);

        builder.addFilterQuery('q1');
        builder.addFilterQuery('q2');
        expect(builder.filterQueries.length).toBe(2);

        builder.removeFilterQuery('q1');
        expect(builder.filterQueries.length).toBe(1);
        expect(builder.filterQueries[0].query).toBe('q2');
    });

    it('should not remove empty query', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);
        builder.addFilterQuery('q1');
        builder.addFilterQuery('q2');
        expect(builder.filterQueries.length).toBe(2);

        builder.removeFilterQuery(null);
        builder.removeFilterQuery('');
        expect(builder.filterQueries.length).toBe(2);
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
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        const query = builder.getFacetQuery('query2');

        expect(query.query).toBe('q2');
        expect(query.label).toBe('query2');
    });

    it('should not fetch empty facet query from the config', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetQueries: {
                queries: [
                    { query: 'q1', label: 'query1' }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        const query1 = builder.getFacetQuery('');
        expect(query1).toBeNull();

        const query2 = builder.getFacetQuery(null);
        expect(query2).toBeNull();
    });

    it('should fetch facet from the config by label', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetFields: { 'fields': [
                { 'field': 'content.mimetype', 'mincount': 1, 'label': 'Type' },
                { 'field': 'content.size', 'mincount': 1, 'label': 'Size' }
            ]}
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        const field = builder.getFacetField('Size');

        expect(field.label).toBe('Size');
        expect(field.field).toBe('content.size');
    });

    it('should not fetch facet from the config by label', () => {
        const config: SearchConfiguration = {
            categories: [],
            facetFields: { 'fields': [
                { 'field': 'content.mimetype', 'mincount': 1, 'label': 'Type' },
                { 'field': 'content.size', 'mincount': 1, 'label': 'Size' }
            ]}
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        const field = builder.getFacetField('Missing');

        expect(field).toBeFalsy();
    });

    xit('should build query and raise an event on update', async () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);
        const query = {};
        spyOn(builder, 'buildQuery').and.returnValue(query);

        let eventArgs;
        builder.updated.subscribe(args => eventArgs = args);

        await builder.execute();
        expect(eventArgs).toBe(query);
    });

    xit('should build query and raise an event on execute', async () => {
        const data = {};
        const api = jasmine.createSpyObj('api', ['search']);
        api.search.and.returnValue(data);

        const builder = new SearchQueryBuilderService(buildConfig({}), api);
        spyOn(builder, 'buildQuery').and.returnValue({});

        let eventArgs;
        builder.executed.subscribe(args => eventArgs = args);

        await builder.execute();
        expect(eventArgs).toBe(data);
    });

    it('should require a query fragment to build query', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = null;

        const compiled = builder.buildQuery();
        expect(compiled).toBeNull();
    });

    it('should build query with single fragment', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.query.query).toBe('(cm:name:test)');
    });

    it('should build query with multiple fragments', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true },
                <any> { id: 'cat2', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.queryFragments['cat2'] = 'NOT cm:creator:System';

        const compiled = builder.buildQuery();
        expect(compiled.query.query).toBe(
            '(cm:name:test) AND (NOT cm:creator:System)'
        );
    });

    it('should build query with custom fields', () => {
        const config: SearchConfiguration = {
            fields: ['field1', 'field2'],
            categories: [
                <any> { id: 'cat1', enabled: true },
                <any> { id: 'cat2', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.fields).toEqual(['field1', 'field2']);
    });

    it('should build query with empty custom fields', () => {
        const config: SearchConfiguration = {
            fields: [],
            categories: [
                <any> { id: 'cat1', enabled: true },
                <any> { id: 'cat2', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.fields).toEqual([]);
    });

    it('should build query with custom filter queries', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.addFilterQuery('query1');

        const compiled = builder.buildQuery();
        expect(compiled.filterQueries).toEqual(
            [{ query: 'query1' }]
        );
    });

    it('should build query with custom facet queries', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true }
            ],
            facetQueries: {
                queries: [
                    { query: 'q1', label: 'q2' }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetQueries).toEqual(config.facetQueries.queries);
    });

    it('should build query with custom facet fields', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true }
            ],
            facetFields: { fields: [
                { field: 'field1', label: 'field1', mincount: 1, limit: null, offset: 0, prefix: null },
                { field: 'field2', label: 'field2', mincount: 1, limit: null, offset: 0, prefix: null }
            ]}
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetFields.facets).toEqual(jasmine.objectContaining(config.facetFields.fields));
    });

    it('should build query with sorting', () => {
        const config: SearchConfiguration = {
            fields: [],
            categories: [
                <any> { id: 'cat1', enabled: true },
                <any> { id: 'cat2', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        const sorting: any = { type: 'FIELD', field: 'cm:name', ascending: true };
        builder.sorting = [sorting];

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.sort[0]).toEqual(jasmine.objectContaining(sorting));
    });

    it('should use pagination settings', () => {
        const config: SearchConfiguration = {
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
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
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
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
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.addUserFacetBucket(field1, field1buckets[0]);
        builder.addUserFacetBucket(field1, field1buckets[1]);
        builder.addUserFacetBucket(field2, field2buckets[0]);
        builder.addUserFacetBucket(field2, field2buckets[1]);

        const compiledQuery = builder.buildQuery();
        const expectedResult = '(f1-q1 OR f1-q2) AND (f2-q1 OR f2-q2)';

        expect(compiledQuery.query.query).toBe(expectedResult);
    });

});
