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

import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { AlfrescoApi } from 'alfresco-js-api';
import { AlfrescoApiService } from '@alfresco/core';
import { fakeError, fakeProcessFilters } from '../../mock';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessFilterService } from './process-filter.service';

describe('Process filter', () => {

    let service: ProcessFilterService;
    let apiService: AlfrescoApiService;
    let alfrescoApi: AlfrescoApi;

    beforeEach(() => {
        TestBed.configureTestingModule({

            providers: [
                ProcessFilterService
            ]
        });
        service = TestBed.get(ProcessFilterService);
        apiService = TestBed.get(AlfrescoApiService);
        alfrescoApi = apiService.getInstance();
    });

    describe('filters', () => {

        let getFilters: jasmine.Spy;
        let createFilter: jasmine.Spy;

        beforeEach(() => {
            getFilters = spyOn(alfrescoApi.activiti.userFiltersApi, 'getUserProcessInstanceFilters')
                .and
                .returnValue(Promise.resolve(fakeProcessFilters));

            createFilter = spyOn(alfrescoApi.activiti.userFiltersApi, 'createUserProcessInstanceFilter')
                .and
                .callFake((filter: FilterProcessRepresentationModel) => Promise.resolve(filter));
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
                service.createDefaultFilters(1234).subscribe(
                    (res: FilterProcessRepresentationModel []) => {
                        expect(res).toBeDefined();
                        expect(res.length).toEqual(3);
                        expect(res[0].name).toEqual('Running');
                        expect(res[1].name).toEqual('Completed');
                        expect(res[2].name).toEqual('All');
                        done();
                    }
                );
            });

            it('should pass on any error that is returned by the API', async(() => {
                getFilters = getFilters.and.returnValue(Promise.reject(fakeError));

                service.getProcessFilters(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
                    }
                );
            }));

        });

        describe('add filter', () => {

            let filter = fakeProcessFilters.data[0];

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
                createFilter = createFilter.and.returnValue(Promise.reject(fakeError));

                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
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
