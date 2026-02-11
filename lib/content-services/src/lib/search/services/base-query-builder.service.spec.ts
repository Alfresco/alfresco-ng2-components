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

import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SearchQueryBuilderService } from './search-query-builder.service';
import { AppConfigService } from '@alfresco/adf-core';
import { SearchConfiguration } from '../models/search-configuration.interface';
import { FacetFieldBucket } from '../models/facet-field-bucket.interface';
import { ResultSetPaging } from '@alfresco/js-api';
import { skip } from 'rxjs/operators';

describe('BaseQueryBuilderService', () => {
    let service: SearchQueryBuilderService;
    let appConfig: AppConfigService;
    let router: Router;

    const mockSearchConfig: SearchConfiguration = {
        id: 'config-default',
        categories: [
            {
                id: 'cat1',
                name: 'Category 1',
                enabled: true,
                expanded: false,
                component: {
                    selector: 'test',
                    settings: undefined
                }
            },
            {
                id: 'cat2',
                name: 'Category 2',
                enabled: false,
                expanded: false,
                component: {
                    selector: 'test',
                    settings: undefined
                }
            }
        ],
        filterQueries: [{ query: 'TYPE:"cm:content"' }],
        sorting: {
            options: [
                { key: 'name', label: 'Name', type: 'FIELD', field: 'cm:name', ascending: true },
                { key: 'date', label: 'Date', type: 'FIELD', field: 'cm:created', ascending: false }
            ],
            defaults: [{ key: 'name', label: 'Name', type: 'FIELD', field: 'cm:name', ascending: true }]
        }
    };

    const mockMultipleConfigs: SearchConfiguration[] = [
        { ...mockSearchConfig, id: 'config-1', name: 'Config 1', default: true },
        { ...mockSearchConfig, id: 'config-2', name: 'Config 2', default: false },
        { ...mockSearchConfig, id: 'config-3', name: 'Config 3', default: false }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                SearchQueryBuilderService,
                {
                    provide: AppConfigService,
                    useValue: {
                        get: jasmine.createSpy('get').and.returnValue(mockSearchConfig)
                    }
                }
            ]
        });

        service = TestBed.inject(SearchQueryBuilderService);
        appConfig = TestBed.inject(AppConfigService);
        router = TestBed.inject(Router);
    });

    describe('userQuery', () => {
        it('should set userQuery with parentheses', () => {
            service.userQuery = 'test query';
            expect(service.userQuery).toBe('(test query)');
        });

        it('should trim userQuery', () => {
            service.userQuery = '  test query  ';
            expect(service.userQuery).toBe('(test query)');
        });

        it('should return empty string for null input', () => {
            service.userQuery = null;
            expect(service.userQuery).toBe('');
        });
    });

    describe('queryFragments', () => {
        it('should emit queryFragmentsUpdate when queryFragments change  after initial fragments emited', (done) => {
            service.queryFragmentsUpdate.pipe(skip(1)).subscribe((fragments) => {
                expect(fragments['testId']).toBe('test query');
                done();
            });

            service.queryFragments['testId'] = 'test query';
        });

        it('should emit queryFragmentsUpdate when setting new queryFragments object  after initial fragments emited', (done) => {
            const newFragments = { id1: 'query1', id2: 'query2' };

            service.queryFragmentsUpdate.pipe(skip(1)).subscribe((fragments) => {
                expect(fragments).toEqual(newFragments);
                done();
            });

            service.queryFragments = newFragments;
        });
    });

    describe('filterQueries', () => {
        it('should add filter query', () => {
            service.filterQueries = [];
            service.addFilterQuery('TYPE:"cm:folder"');

            expect(service.filterQueries.length).toBe(1);
            expect(service.filterQueries[0].query).toBe('TYPE:"cm:folder"');
        });

        it('should not add duplicate filter query', () => {
            service.filterQueries = [];
            service.addFilterQuery('TYPE:"cm:folder"');
            service.addFilterQuery('TYPE:"cm:folder"');

            expect(service.filterQueries.length).toBe(1);
        });

        it('should remove filter query', () => {
            service.filterQueries = [{ query: 'TYPE:"cm:folder"' }, { query: 'TYPE:"cm:content"' }];
            service.removeFilterQuery('TYPE:"cm:folder"');

            expect(service.filterQueries.length).toBe(1);
            expect(service.filterQueries[0].query).toBe('TYPE:"cm:content"');
        });

        it('should not add empty filter query', () => {
            service.filterQueries = [];
            service.addFilterQuery('');

            expect(service.filterQueries.length).toBe(0);
        });
    });

    describe('userFacetBuckets', () => {
        const mockBucket: FacetFieldBucket = {
            label: 'bucket1',
            count: 10,
            filterQuery: 'field:value1'
        };

        const mockBucket2: FacetFieldBucket = {
            label: 'bucket2',
            count: 5,
            filterQuery: 'field:value2'
        };

        it('should add user facet bucket', () => {
            service.addUserFacetBucket('field1', mockBucket);

            const buckets = service.getUserFacetBuckets('field1');
            expect(buckets.length).toBe(1);
            expect(buckets[0].label).toBe('bucket1');
        });

        it('should not add duplicate bucket', () => {
            service.addUserFacetBucket('field1', mockBucket);
            service.addUserFacetBucket('field1', mockBucket);

            const buckets = service.getUserFacetBuckets('field1');
            expect(buckets.length).toBe(1);
        });

        it('should remove user facet bucket', () => {
            service.addUserFacetBucket('field1', mockBucket);
            service.addUserFacetBucket('field1', mockBucket2);
            service.removeUserFacetBucket('field1', mockBucket);

            const buckets = service.getUserFacetBuckets('field1');
            expect(buckets.length).toBe(1);
            expect(buckets[0].label).toBe('bucket2');
        });

        it('should reset user facet buckets', () => {
            service.addUserFacetBucket('field1', mockBucket);
            service.addUserFacetBucket('field2', mockBucket2);
            service.resetUserFacetBucket();

            expect(service.getUserFacetBuckets('field1').length).toBe(0);
            expect(service.getUserFacetBuckets('field2').length).toBe(0);
        });

    });

    describe('buildQuery', () => {
        it('should return null when no query is set', () => {
            service.userQuery = '';
            expect(service.buildQuery()).toBeNull();
        });

        it('should build query with userQuery', () => {
            service.userQuery = 'test';
            const query = service.buildQuery();

            expect(query).toBeTruthy();
            expect(query.query.query).toBe('(test)');
        });

        it('should include scope in query when set', () => {
            service.userQuery = 'test';
            service.setScope({ locations: 'nodes' });
            const query = service.buildQuery();

            expect(query.scope).toEqual({ locations: 'nodes' });
        });

        it('should include default includes when none configured', () => {
            service.config = { id: 'test-config', categories: [] };
            service.userQuery = 'test';
            const query = service.buildQuery();

            expect(query.include).toContain('path');
            expect(query.include).toContain('allowableOperations');
        });
    });

    describe('update', () => {
        it('should emit updated event with built query', (done) => {
            service.userQuery = 'test';

            service.updated.subscribe((query) => {
                expect(query.query.query).toBe('(test)');
                done();
            });

            service.update();
        });

        it('should emit updated event with provided query body', (done) => {
            const customQuery = {
                query: { query: 'custom query', language: 'afts' }
            };

            service.updated.subscribe((query) => {
                expect(query.query.query).toBe('custom query');
                done();
            });

            service.update(customQuery);
        });
    });

    describe('execute', () => {
        it('should update search query params by default', async () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));
            service.userQuery = 'test';

            await service.execute();

            expect(router.navigate).toHaveBeenCalled();
        });

        it('should not update search query params when disabled', async () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));
            service.userQuery = 'test';

            await service.execute(false);

            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('should emit executed event on success', async () => {
            const mockResult: ResultSetPaging = {
                list: {
                    entries: [
                        {
                            entry: {
                                id: '1',
                                name: '',
                                nodeType: '',
                                isFolder: false,
                                isFile: false
                            }
                        }
                    ]
                }
            };
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(mockResult));
            service.userQuery = 'test';

            const executedSpy = jasmine.createSpy('executedSpy');
            service.executed.subscribe(executedSpy);

            await service.execute();

            expect(executedSpy).toHaveBeenCalledWith(mockResult);
        });

        it('should emit error and empty result on failure', async () => {
            const mockError = new Error('Search failed');
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.reject(mockError));
            service.userQuery = 'test';

            const errorSpy = jasmine.createSpy('errorSpy');
            const executedSpy = jasmine.createSpy('executedSpy');
            service.error.subscribe(errorSpy);
            service.executed.subscribe(executedSpy);

            await service.execute();

            expect(errorSpy).toHaveBeenCalledWith(mockError);
            expect(executedSpy).toHaveBeenCalledWith(
              jasmine.objectContaining({
                  list: jasmine.objectContaining({
                      pagination: { totalItems: 0 },
                      entries: []
                  })
              })
            );
        });

        it('should not update URL params even when query is null', async () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            service.userQuery = '';

            await service.execute();

            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('sorting', () => {
        it('should return primary sorting', () => {
            service.sorting = [
                { key: 'name', label: 'Name', type: 'FIELD', field: 'cm:name', ascending: true },
                { key: 'date', label: 'Date', type: 'FIELD', field: 'cm:created', ascending: false }
            ];

            const primary = service.getPrimarySorting();
            expect(primary.key).toBe('name');
        });

        it('should return null when no sorting defined', () => {
            service.sorting = [];
            expect(service.getPrimarySorting()).toBeNull();
        });

        it('should return sorting options from config', () => {
            service.config = {
                id: 'test-config',
                categories: [],
                sorting: {
                    options: [{ key: 'name', label: 'Name', type: 'FIELD', field: 'cm:name', ascending: true }],
                    defaults: []
                }
            };

            const options = service.getSortingOptions();
            expect(options.length).toBe(1);
            expect(options[0].key).toBe('name');
        });
    });

    describe('multiple configurations', () => {
        beforeEach(() => {
            (appConfig.get as jasmine.Spy).and.returnValue(mockMultipleConfigs);
            service.resetToDefaults();
        });

        it('should return default configuration', () => {
            const config = service.getDefaultConfiguration();
            expect(config.name).toBe('Config 1');
        });

        it('should return search form details for multiple configurations', () => {
            const forms = service.getSearchFormDetails();

            expect(forms.length).toBe(3);
            expect(forms[0].id).toBe('config-1');
            expect(forms[0].name).toBe('Config 1');
            expect(forms[0].default).toBe(true);
            expect(forms[0].selected).toBe(true);
            expect(forms[1].id).toBe('config-2');
            expect(forms[1].name).toBe('Config 2');
            expect(forms[1].selected).toBe(false);
        });

        it('should update selected configuration', (done) => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));

            service.configUpdated.subscribe((config) => {
                expect(config.name).toBe('Config 2');
                done();
            });

            service.updateSelectedConfiguration('config-2');
        });

        it('should update searchForms when configuration changes after initial forms emited', (done) => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));

            let callCount = 0;
            service.searchForms.pipe(skip(1)).subscribe((forms) => {
                callCount++;
                expect(forms[1].selected).toBe(true);
                expect(forms[0].selected).toBe(false);
                done();
            });

            service.updateSelectedConfiguration('config-2');
        });

        it('should store selectedConfigurationId in filterRawParams', async () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));

            service.updateSelectedConfiguration('config-2');

            expect(service.filterRawParams['selectedConfigurationId']).toBe('config-2');
        });

        it('should call execute when updating configuration', async () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));
            spyOn(service, 'execute')
            service.userQuery = 'test';

            service.updateSelectedConfiguration('config-2');

            expect(service.execute).toHaveBeenCalled();
        });
    });

    describe('populateFilters and selectedConfiguration restoration', () => {
        beforeEach(() => {
            (appConfig.get as jasmine.Spy<<T>(key: string, defaultValue?: T) => T>).and.returnValue(mockMultipleConfigs);
            service.resetToDefaults();
        });

        it('should restore selectedConfiguration from populateFilters', (done) => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

            service.configUpdated.subscribe((config) => {
                expect(config.name).toBe('Config 3');
                done();
            });

            service.populateFilters.next({ selectedConfigurationId: 'config-3', someOtherFilter: 'value' });
        });

        it('should reset to default configuration when populateFilters has no selectedConfigurationId', (done) => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));

            service.updateSelectedConfiguration('config-3');

            setTimeout(() => {
                service.configUpdated.subscribe((config) => {
                    expect(config.name).toBe('Config 1');
                    done();
                });

                service.populateFilters.next({ someOtherFilter: 'value' });
            }, 0);
        });

        it('should not change configuration when populateFilters is empty', () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            const configUpdatedSpy = jasmine.createSpy('configUpdatedSpy');

            service.configUpdated.subscribe(configUpdatedSpy);
            configUpdatedSpy.calls.reset();

            service.populateFilters.next({});

            expect(configUpdatedSpy).not.toHaveBeenCalled();
        });

        it('should not change configuration when same configuration is already selected', (done) => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } } as ResultSetPaging));

            service.updateSelectedConfiguration('config-2');

            setTimeout(() => {
                const configUpdatedSpy = jasmine.createSpy('configUpdatedSpy');
                service.configUpdated.subscribe(configUpdatedSpy);

                service.populateFilters.next({ selectedConfigurationId: 'config-2' });

                setTimeout(() => {
                    expect(configUpdatedSpy).not.toHaveBeenCalled();
                    done();
                }, 0);
            }, 0);
        });

        it('should update filterRawParams when restoring configuration from populateFilters', (done) => {
            service.configUpdated.subscribe(() => {
                expect(service.filterRawParams['selectedConfigurationId']).toBe('config-2');
                done();
            });

            service.populateFilters.next({ selectedConfigurationId: 'config-2' });
        });
    });

    describe('resetToDefaults', () => {
        it('should emit configUpdated', (done) => {
            service.configUpdated.subscribe((config) => {
                expect(config).toBeTruthy();
                done();
            });

            service.resetToDefaults();
        });

        it('should emit searchForms', () => {
            let formsCalled = false;

            service.searchForms.subscribe((forms) => {
                if (!formsCalled) {
                    formsCalled = true;
                    expect(forms).toBeTruthy();
                }
            });

            service.resetToDefaults();

            expect(formsCalled).toBe(true);
        });

        it('should navigate when withNavigate is true', () => {
            spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

            service.resetToDefaults(true);

            expect(router.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { q: null } }));
        });

        it('should reset categories', () => {
            service.categories = [
                {
                    id: 'test',
                    name: 'Test',
                    enabled: true,
                    expanded: false,
                    component: {
                        selector: 'test',
                        settings: undefined
                    }
                }
            ];
            service.resetToDefaults();

            expect(service.categories.length).toBe(1);
            expect(service.categories[0].id).toBe('cat1');
        });
    });
});
