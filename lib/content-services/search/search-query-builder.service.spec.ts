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

describe('SearchQueryBuilder', () => {

    const buildConfig = (searchSettings): AppConfigService => {
        const config = new AppConfigService(null);
        config.config.search = searchSettings;
        return config;
    };

    it('should throw error if configuration not provided', () => {
        expect(() => {
            const appConfig = new AppConfigService(null);
            // tslint:disable-next-line:no-unused-expression
            new SearchQueryBuilderService(appConfig, null);
        }).toThrowError('Search configuration not found.');
    });

    it('should use only enabled categories', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true },
                    <any> { id: 'cat2', enabled: false },
                    <any> { id: 'cat3', enabled: true }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        expect(builder.categories.length).toBe(2);
        expect(builder.categories[0].id).toBe('cat1');
        expect(builder.categories[1].id).toBe('cat3');
    });

    it('should fetch filter queries from config', () => {
        const config: SearchConfiguration = {
            query: {
                categories: []
            },
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

    it('should setup default location scope', () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);

        expect(builder.scope).toBeDefined();
        expect(builder.scope.locations).toBeNull();
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
            facetQueries: [
                { query: 'q1', label: 'query1' },
                { query: 'q2', label: 'query2' }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        const query = builder.getFacetQuery('query2');

        expect(query.query).toBe('q2');
        expect(query.label).toBe('query2');
    });

    it('should not fetch empty facet query from the config', () => {
        const config: SearchConfiguration = {
            facetQueries: [
                { query: 'q1', label: 'query1' }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        const query1 = builder.getFacetQuery('');
        expect(query1).toBeNull();

        const query2 = builder.getFacetQuery(null);
        expect(query2).toBeNull();
    });

    it('should build query and raise an event on update', async () => {
        const builder = new SearchQueryBuilderService(buildConfig({}), null);
        const query = {};
        spyOn(builder, 'buildQuery').and.returnValue(query);

        let eventArgs;
        builder.updated.subscribe(args => eventArgs = args);

        await builder.execute();
        expect(eventArgs).toBe(query);
    });

    it('should build query and raise an event on execute', async () => {
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
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = null;

        const compiled = builder.buildQuery();
        expect(compiled).toBeNull();
    });

    it('should build query with single fragment', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.query.query).toBe('(cm:name:test)');
    });

    it('should build query with multiple fragments', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true },
                    <any> { id: 'cat2', enabled: true }
                ]
            }
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
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true },
                    <any> { id: 'cat2', enabled: true }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.fields['cat1'] = ['field1', 'field3'];
        builder.fields['cat2'] = ['field2', 'field3'];

        const compiled = builder.buildQuery();
        expect(compiled.fields).toEqual(['field1', 'field3', 'field2']);
    });

    it('should build query with empty custom fields', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true },
                    <any> { id: 'cat2', enabled: true }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);

        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.fields['cat1'] = [];
        builder.fields['cat2'] = null;

        const compiled = builder.buildQuery();
        expect(compiled.fields).toEqual([]);
    });

    it('should build query with custom filter queries', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            }
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
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            },
            facetQueries: [
                { query: 'q1', label: 'q2' }
            ]
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetQueries).toEqual(config.facetQueries);
    });

    it('should build query with custom facet fields', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            },
            facetFields: {
                facets: [
                    { field: 'field1', label: 'field1' },
                    { field: 'field2', label: 'field2' }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.facetFields).toEqual(config.facetFields);
    });

    it('should build query with custom limits', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            },
            limits: {
                permissionEvaluationCount: 100,
                permissionEvaluationTime: 100
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';

        const compiled = builder.buildQuery();
        expect(compiled.limits).toEqual(config.limits);
    });

    it('should build query with custom scope', () => {
        const config: SearchConfiguration = {
            query: {
                categories: [
                    <any> { id: 'cat1', enabled: true }
                ]
            }
        };
        const builder = new SearchQueryBuilderService(buildConfig(config), null);
        builder.queryFragments['cat1'] = 'cm:name:test';
        builder.scope.locations = 'custom';

        const compiled = builder.buildQuery();
        expect(compiled.scope.locations).toEqual('custom');

    });

});
