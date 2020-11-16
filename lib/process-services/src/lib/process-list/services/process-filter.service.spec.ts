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

import { async } from '@angular/core/testing';
import { mockError, fakeProcessFiltersResponse } from '../../mock';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessFilterService } from './process-filter.service';
import { AlfrescoApiServiceMock, AlfrescoApiService, AppConfigService,
    setupTestBed, CoreModule, StorageService } from '@alfresco/adf-core';

declare let jasmine: any;

describe('Process filter', () => {

    let service: ProcessFilterService;
    let apiService: AlfrescoApiService;
    let alfrescoApi: any;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        apiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
        service = new ProcessFilterService(apiService);
        alfrescoApi = apiService.getInstance();
    });

    describe('filters', () => {

        let getFilters: jasmine.Spy;
        let createFilter: jasmine.Spy;

        beforeEach(() => {
            getFilters = spyOn(alfrescoApi.activiti.userFiltersApi, 'getUserProcessInstanceFilters')
                .and
                .returnValue(Promise.resolve(fakeProcessFiltersResponse));

            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        describe('get filters', () => {

            it('should call the API without an appId defined by default', () => {
                service.getProcessFilters(null);
                expect(getFilters).toHaveBeenCalled();
            });

            it('should call the API with the correct appId when specified', () => {
                service.getProcessFilters(226);
                expect(getFilters).toHaveBeenCalledWith({appId: 226});
            });

            it('should return the task filter by id', (done) => {
                service.getProcessFilterById(333).subscribe(
                    (processFilter: FilterProcessRepresentationModel) => {
                        expect(processFilter).toBeDefined();
                        expect(processFilter.id).toEqual(333);
                        expect(processFilter.name).toEqual('Running');
                        expect(processFilter.filter.sort).toEqual('created-desc');
                        expect(processFilter.filter.state).toEqual('running');
                        done();
                    }
                );
            });

            it('should return the task filter by name', (done) => {
                service.getProcessFilterByName('Running').subscribe(
                    (res: FilterProcessRepresentationModel) => {
                        expect(res).toBeDefined();
                        expect(res.id).toEqual(333);
                        expect(res.name).toEqual('Running');
                        expect(res.filter.sort).toEqual('created-desc');
                        expect(res.filter.state).toEqual('running');
                        done();
                    }
                );
            });

            it('should return the non-empty filter list that is returned by the API', async(() => {
                service.getProcessFilters(null).subscribe(
                    (res) => {
                        expect(res.length).toBe(1);
                    }
                );
            }));

            it('should return the default filters', (done) => {
                service.createDefaultFilters(1234).subscribe((res: FilterProcessRepresentationModel []) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(3);
                    expect(res[0].name).toEqual('Running');
                    expect(res[0].id).toEqual(111);
                    expect(res[1].name).toEqual('Completed');
                    expect(res[1].id).toEqual(222);
                    expect(res[2].name).toEqual('All');
                    expect(res[2].id).toEqual(333);
                    done();
                });

                jasmine.Ajax.requests.at(0).respondWith({
                    'status': 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001, id: 111, name: 'Running', icon: 'fake-icon', recent: false
                    })
                });

                jasmine.Ajax.requests.at(1).respondWith({
                    'status': 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001, id: 222, name: 'Completed', icon: 'fake-icon', recent: false
                    })
                });

                jasmine.Ajax.requests.at(2).respondWith({
                    'status': 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001, id: 333, name: 'All', icon: 'fake-icon', recent: false
                    })
                });
            });

            it('should pass on any error that is returned by the API', async(() => {
                getFilters = getFilters.and.returnValue(Promise.reject(mockError));

                service.getProcessFilters(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                    }
                );
            }));

        });

        describe('add filter', () => {

            beforeEach(() => {
                createFilter = spyOn(alfrescoApi.activiti.userFiltersApi, 'createUserProcessInstanceFilter')
                .and
                .callFake((processfilter: FilterProcessRepresentationModel) => Promise.resolve(processfilter));
            });

            const filter = fakeProcessFiltersResponse.data[0];

            it('should call the API to create the filter', () => {
                service.addProcessFilter(filter);
                expect(createFilter).toHaveBeenCalledWith(filter);
            });

            it('should return the created filter', async(() => {
                service.addProcessFilter(filter).subscribe((createdFilter: FilterProcessRepresentationModel) => {
                    expect(createdFilter).toBe(filter);
                });
            }));

            it('should pass on any error that is returned by the API', async(() => {
                createFilter = createFilter.and.returnValue(Promise.reject(mockError));

                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                createFilter = createFilter.and.returnValue(Promise.reject(null));
                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });
    });
});
