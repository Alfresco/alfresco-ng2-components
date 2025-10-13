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

import { SearchConfiguration } from '../models/search-configuration.interface';
import { AppConfigService } from '@alfresco/adf-core';
import { SearchHeaderQueryBuilderService } from './search-header-query-builder.service';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('SearchHeaderQueryBuilderService', () => {
    let activatedRoute: ActivatedRoute;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        router = TestBed.inject(Router);
        activatedRoute = TestBed.inject(ActivatedRoute);
    });

    const buildConfig = (searchSettings): AppConfigService => {
        const config = TestBed.inject(AppConfigService);
        config.config['search-headers'] = searchSettings;
        return config;
    };

    it('should load the configuration from app config', () => {
        TestBed.runInInjectionContext(() => {
            const config: SearchConfiguration = {
                categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any],
                filterQueries: [{ query: 'query1' }, { query: 'query2' }]
            };

            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const builder = new SearchHeaderQueryBuilderService(buildConfig(config), alfrescoApiService, null);

            builder.categories = [];
            builder.filterQueries = [];

            expect(builder.categories.length).toBe(0);
            expect(builder.filterQueries.length).toBe(0);

            builder.resetToDefaults();

            expect(builder.categories.length).toBe(2);
            expect(builder.filterQueries.length).toBe(2);
        });
    });

    it('should return the category assigned to a column key', () => {
        TestBed.runInInjectionContext(() => {
            const config: SearchConfiguration = {
                categories: [
                    { id: 'cat1', columnKey: 'fake-key-1', enabled: true } as any,
                    { id: 'cat2', columnKey: 'fake-key-2', enabled: true } as any
                ],
                filterQueries: [{ query: 'query1' }, { query: 'query2' }]
            };

            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const service = new SearchHeaderQueryBuilderService(buildConfig(config), alfrescoApiService, null);

            const category = service.getCategoryForColumn('fake-key-1');
            expect(category).not.toBeNull();
            expect(category).not.toBeUndefined();
            expect(category.columnKey).toBe('fake-key-1');
        });
    });

    it('should return operator for a category by id', () => {
        TestBed.runInInjectionContext(() => {
            const config: SearchConfiguration = {
                categories: [
                    { id: 'cat1', columnKey: 'fake-key-1', enabled: true, component: { settings: { operator: 'operator' } } } as any,
                    { id: 'cat2', columnKey: 'fake-key-2', enabled: true } as any
                ]
            };

            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const service = new SearchHeaderQueryBuilderService(buildConfig(config), alfrescoApiService, null);

            const operator = service.getOperatorForFilterId('cat1');
            expect(operator).toBe('operator');
            const operator1 = service.getOperatorForFilterId('cat2');
            expect(operator1).toBeUndefined();
        });
    });

    it('should have empty user query by default', () => {
        TestBed.runInInjectionContext(() => {
            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const builder = new SearchHeaderQueryBuilderService(buildConfig({}), alfrescoApiService, null);
            expect(builder.userQuery).toBe('');
        });
    });

    it('should add the extra filter for the parent node', () => {
        TestBed.runInInjectionContext(() => {
            const config: SearchConfiguration = {
                categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any],
                filterQueries: [{ query: 'query1' }, { query: 'query2' }]
            };

            const expectedResult = [{ query: 'PARENT:"workspace://SpacesStore/fake-node-id"' }];

            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const searchHeaderService = new SearchHeaderQueryBuilderService(buildConfig(config), alfrescoApiService, null);

            searchHeaderService.setCurrentRootFolderId('fake-node-id');

            expect(searchHeaderService.filterQueries).toEqual(expectedResult, 'Filters are not as expected');
        });
    });

    it('should not add again the parent filter if that node is already added', () => {
        TestBed.runInInjectionContext(() => {
            const expectedResult = [{ query: 'PARENT:"workspace://SpacesStore/fake-node-id"' }];

            const config: SearchConfiguration = {
                categories: [{ id: 'cat1', enabled: true } as any, { id: 'cat2', enabled: true } as any],
                filterQueries: expectedResult
            };

            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const searchHeaderService = new SearchHeaderQueryBuilderService(buildConfig(config), alfrescoApiService, null);

            searchHeaderService.setCurrentRootFolderId('fake-node-id');

            expect(searchHeaderService.filterQueries).toEqual(expectedResult, 'Filters are not as expected');
        });
    });

    it('should not add duplicate column names in activeFilters', () => {
        TestBed.runInInjectionContext(() => {
            const activeFilter = 'FakeColumn';

            const config: SearchConfiguration = {
                categories: [{ id: 'cat1', enabled: true } as any],
                filterQueries: [{ query: 'PARENT:"workspace://SpacesStore/fake-node-id' }]
            };

            const alfrescoApiService = TestBed.inject(AlfrescoApiService);
            const searchHeaderService = new SearchHeaderQueryBuilderService(buildConfig(config), alfrescoApiService, null);

            expect(searchHeaderService.activeFilters.length).toBe(0);

            searchHeaderService.setActiveFilter(activeFilter, 'fake-value');
            searchHeaderService.setActiveFilter(activeFilter, 'fake-value');

            expect(searchHeaderService.activeFilters.length).toBe(1);
        });
    });

    describe('updateSearchQueryParams', () => {
        it('should use properly encoded query containing non-latin character when calls router.navigate', () => {
            spyOn(router, 'navigate');
            spyOn(console, 'error');
            const service = TestBed.inject(SearchHeaderQueryBuilderService);
            service.filterRawParams = { userQuery: '((cm:name:"wąż*" OR cm:title:"wąż*" OR cm:description:"wąż*" OR TEXT:"wąż*" OR TAG:"wąż*"))' };

            service.updateSearchQueryParams();
            expect(console.error).not.toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith([], {
                relativeTo: activatedRoute,
                queryParams: {
                    q: 'eyJ1c2VyUXVlcnkiOiIoKGNtOm5hbWU6XCJ3xIXFvCpcIiBPUiBjbTp0aXRsZTpcInfEhcW8KlwiIE9SIGNtOmRlc2NyaXB0aW9uOlwid8SFxbwqXCIgT1IgVEVYVDpcInfEhcW8KlwiIE9SIFRBRzpcInfEhcW8KlwiKSkifQ=='
                },
                queryParamsHandling: 'merge'
            });
        });
    });

    describe('navigateToSearch', () => {
        it('should use properly encoded query containing non-latin character when calls router.navigate', async () => {
            spyOn(router, 'navigate');
            spyOn(console, 'error');
            const searchUrl = 'search';
            const service = TestBed.inject(SearchHeaderQueryBuilderService);
            service.filterRawParams = { userQuery: '((cm:name:"wąż*" OR cm:title:"wąż*" OR cm:description:"wąż*" OR TEXT:"wąż*" OR TAG:"wąż*"))' };
            service.encodeQuery();

            await service.navigateToSearch('', searchUrl);
            expect(console.error).not.toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith([searchUrl], {
                queryParams: {
                    q: 'eyJ1c2VyUXVlcnkiOiIoKGNtOm5hbWU6XCJ3xIXFvCpcIiBPUiBjbTp0aXRsZTpcInfEhcW8KlwiIE9SIGNtOmRlc2NyaXB0aW9uOlwid8SFxbwqXCIgT1IgVEVYVDpcInfEhcW8KlwiIE9SIFRBRzpcInfEhcW8KlwiKSkifQ=='
                },
                queryParamsHandling: 'merge'
            });
        });
    });
});
