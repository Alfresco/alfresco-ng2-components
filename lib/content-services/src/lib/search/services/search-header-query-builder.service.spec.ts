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

import { SearchConfiguration } from '../models/search-configuration.interface';
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { SearchHeaderQueryBuilderService } from './search-header-query-builder.service';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';

describe('SearchHeaderQueryBuilderService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
    });

    const buildConfig = (searchSettings): AppConfigService => {
        const config = TestBed.inject(AppConfigService);
        config.config['search-headers'] = searchSettings;
        return config;
    };

    it('should load the configuration from app config', () => {
        const config: SearchConfiguration = {
            categories: [
                { id: 'cat1', enabled: true } as any,
                { id: 'cat2', enabled: true } as any
            ],
            filterQueries: [{ query: 'query1' }, { query: 'query2' }]
        };

        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        const builder = new SearchHeaderQueryBuilderService(
            buildConfig(config),
            alfrescoApiService,
            null
        );

        builder.categories = [];
        builder.filterQueries = [];

        expect(builder.categories.length).toBe(0);
        expect(builder.filterQueries.length).toBe(0);

        builder.resetToDefaults();

        expect(builder.categories.length).toBe(2);
        expect(builder.filterQueries.length).toBe(2);
    });

    it('should return the category assigned to a column key', () => {
        const config: SearchConfiguration = {
            categories: [
                { id: 'cat1', columnKey: 'fake-key-1', enabled: true } as any,
                { id: 'cat2', columnKey: 'fake-key-2', enabled: true } as any
            ],
            filterQueries: [{ query: 'query1' }, { query: 'query2' }]
        };

        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        const service = new SearchHeaderQueryBuilderService(
            buildConfig(config),
            alfrescoApiService,
            null
        );

        const category = service.getCategoryForColumn('fake-key-1');
        expect(category).not.toBeNull();
        expect(category).not.toBeUndefined();
        expect(category.columnKey).toBe('fake-key-1');
    });

    it('should have empty user query by default', () => {
        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        const builder = new SearchHeaderQueryBuilderService(
            buildConfig({}),
            alfrescoApiService,
            null
        );
        expect(builder.userQuery).toBe('');
    });

    it('should add the extra filter for the parent node', () => {
        const config: SearchConfiguration = {
            categories: [
                { id: 'cat1', enabled: true } as any,
                { id: 'cat2', enabled: true } as any
            ],
            filterQueries: [{ query: 'query1' }, { query: 'query2' }]
        };

        const expectedResult = [
            { query: 'PARENT:"workspace://SpacesStore/fake-node-id"' }
        ];

        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        const searchHeaderService = new SearchHeaderQueryBuilderService(
            buildConfig(config),
            alfrescoApiService,
            null
        );

        searchHeaderService.setCurrentRootFolderId('fake-node-id');

        expect(searchHeaderService.filterQueries).toEqual(expectedResult, 'Filters are not as expected');
    });

    it('should not add again the parent filter if that node is already added', () => {

        const expectedResult = [
            { query: 'PARENT:"workspace://SpacesStore/fake-node-id"' }
        ];

        const config: SearchConfiguration = {
            categories: [
                { id: 'cat1', enabled: true } as any,
                { id: 'cat2', enabled: true } as any
            ],
            filterQueries: expectedResult
        };

        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        const searchHeaderService = new SearchHeaderQueryBuilderService(
            buildConfig(config),
            alfrescoApiService,
            null
        );

        searchHeaderService.setCurrentRootFolderId('fake-node-id');

        expect(searchHeaderService.filterQueries).toEqual(
            expectedResult,
            'Filters are not as expected'
        );
    });

    it('should not add duplicate column names in activeFilters', () => {
        const activeFilter = 'FakeColumn';

        const config: SearchConfiguration = {
            categories: [
                { id: 'cat1', enabled: true } as any
            ],
            filterQueries: [
                { query: 'PARENT:"workspace://SpacesStore/fake-node-id' }
            ]
        };

        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        const searchHeaderService = new SearchHeaderQueryBuilderService(
            buildConfig(config),
            alfrescoApiService,
            null
        );

        expect(searchHeaderService.activeFilters.length).toBe(0);

        searchHeaderService.setActiveFilter(activeFilter, 'fake-value');
        searchHeaderService.setActiveFilter(activeFilter, 'fake-value');

        expect(searchHeaderService.activeFilters.length).toBe(1);
    });
});
