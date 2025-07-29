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
import { ProcessFilterService } from './process-filter.service';
import { ProcessInstanceFilterRepresentation, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';
import { of } from 'rxjs';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { AdfHttpClient } from '@alfresco/adf-core/api';

declare let jasmine: any;

const fakeProcessFiltersResponse: any = {
    size: 1,
    total: 1,
    start: 0,
    data: [
        {
            name: 'Running',
            appId: '22',
            id: 333,
            recent: true,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' }
        }
    ]
};

const mockError = {
    message: null,
    messageKey: 'GENERAL.ERROR.FORBIDDEN'
};

describe('Process filter', () => {
    let service: ProcessFilterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                // TODO: remove this as soon as unit test not using jasmine.Ajax
                { provide: AdfHttpClient, useValue: null }
            ]
        });
        service = TestBed.inject(ProcessFilterService);
    });

    describe('filters', () => {
        let getFilters: jasmine.Spy;
        let createFilter: jasmine.Spy;

        beforeEach(() => {
            getFilters = spyOn(service.userFiltersApi, 'getUserProcessInstanceFilters').and.returnValue(Promise.resolve(fakeProcessFiltersResponse));

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
                expect(getFilters).toHaveBeenCalledWith({ appId: 226 });
            });

            it('should return the task filter by id', (done) => {
                service.getProcessFilterById(333).subscribe((processFilter) => {
                    expect(processFilter).toBeDefined();
                    expect(processFilter.id).toEqual(333);
                    expect(processFilter.name).toEqual('Running');
                    expect(processFilter.filter.sort).toEqual('created-desc');
                    expect(processFilter.filter.state).toEqual('running');
                    done();
                });
            });

            it('should return the task filter by name', (done) => {
                service.getProcessFilterByName('Running').subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual(333);
                    expect(res.name).toEqual('Running');
                    expect(res.filter.sort).toEqual('created-desc');
                    expect(res.filter.state).toEqual('running');
                    done();
                });
            });

            it('should return the default filters', (done) => {
                service.createDefaultFilters(1234).subscribe((res) => {
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
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001,
                        id: 111,
                        name: 'Running',
                        icon: 'fake-icon',
                        recent: false
                    })
                });

                jasmine.Ajax.requests.at(1).respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001,
                        id: 222,
                        name: 'Completed',
                        icon: 'fake-icon',
                        recent: false
                    })
                });

                jasmine.Ajax.requests.at(2).respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001,
                        id: 333,
                        name: 'All',
                        icon: 'fake-icon',
                        recent: false
                    })
                });
            });

            it('should be able create filters and add sorting information to the response', (done) => {
                service.createDefaultFilters(1234).subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(3);
                    expect(res[0].name).toEqual('Running');
                    expect(res[0].filter.sort).toEqual('created-desc');
                    expect(res[0].filter.state).toEqual('running');

                    expect(res[1].name).toEqual('Completed');
                    expect(res[1].filter.sort).toEqual('created-desc');
                    expect(res[1].filter.state).toEqual('completed');

                    expect(res[2].name).toEqual('All');
                    expect(res[2].filter.sort).toEqual('created-desc');
                    expect(res[2].filter.state).toEqual('all');
                    done();
                });

                jasmine.Ajax.requests.at(0).respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001,
                        id: 111,
                        name: 'Running',
                        icon: 'fake-icon',
                        recent: false
                    })
                });

                jasmine.Ajax.requests.at(1).respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001,
                        id: 222,
                        name: 'Completed',
                        icon: 'fake-icon',
                        recent: false
                    })
                });

                jasmine.Ajax.requests.at(2).respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({
                        appId: 1001,
                        id: 333,
                        name: 'All',
                        icon: 'fake-icon',
                        recent: false
                    })
                });
            });

            it('should pass on any error that is returned by the API', (done) => {
                getFilters = getFilters.and.returnValue(Promise.reject(mockError));

                service.getProcessFilters(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                        done();
                    }
                );
            });
        });

        describe('add filter', () => {
            beforeEach(() => {
                createFilter = spyOn(service.userFiltersApi, 'createUserProcessInstanceFilter').and.callFake((processFilter) =>
                    Promise.resolve(processFilter)
                );
            });

            const filter: UserProcessInstanceFilterRepresentation = fakeProcessFiltersResponse.data[0];

            it('should call the API to create the filter', () => {
                service.addProcessFilter(filter);
                expect(createFilter).toHaveBeenCalledWith(filter);
            });

            it('should return the created filter', (done) => {
                service.addProcessFilter(filter).subscribe((createdFilter) => {
                    expect(createdFilter).toBe(filter);
                    done();
                });
            });

            it('should pass on any error that is returned by the API', (done) => {
                createFilter = createFilter.and.returnValue(Promise.reject(mockError));

                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                        done();
                    }
                );
            });

            it('should return a default error if no data is returned by the API', (done) => {
                createFilter = createFilter.and.returnValue(Promise.reject(new Error('Server error')));
                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (err) => {
                        expect(err.message).toBe('Server error');
                        done();
                    }
                );
            });
        });

        describe('isFilterAlreadyExisting', () => {
            let dummyProcessFilters: UserProcessInstanceFilterRepresentation[];
            let filterRepresentationData: ProcessInstanceFilterRepresentation;

            beforeEach(() => {
                dummyProcessFilters = [
                    {
                        appId: 0,
                        filter: filterRepresentationData,
                        icon: 'fa-random',
                        id: 8,
                        index: 0,
                        name: 'Running',
                        recent: false
                    }
                ];

                filterRepresentationData = {
                    name: '',
                    sort: 'created-desc',
                    state: 'running'
                };
            });

            it('should return true if the process filter already exists', () => {
                const processFilterName = 'Running';
                const result = service.isFilterAlreadyExisting(dummyProcessFilters, processFilterName);
                expect(result).toBe(true);
            });

            it('should return false if the process filter does not exist', () => {
                const processFilterName = 'All';
                const result = service.isFilterAlreadyExisting(dummyProcessFilters, processFilterName);
                expect(result).toBe(false);
            });
        });

        describe('createDefaultFilters', () => {
            it('should return an array with unique process filters', (done) => {
                const appId = 123;

                const runningFilter = {
                    appId: 123,
                    name: 'Running',
                    filter: { sort: 'created-desc', name: '', state: 'running' },
                    icon: 'fa-random',
                    id: 18,
                    index: 10,
                    recent: false
                };
                const completedFilter = {
                    appId: 123,
                    name: 'Completed',
                    filter: { sort: 'created-desc', name: '', state: 'completed' },
                    icon: 'fa-random',
                    id: 19,
                    index: 11,
                    recent: false
                };
                const allFilter = {
                    appId: 123,
                    name: 'All',
                    filter: { sort: 'created-desc', name: '', state: 'all' },
                    icon: 'fa-random',
                    id: 20,
                    index: 12,
                    recent: false
                };
                const duplicateRunningFilter = {
                    appId: 123,
                    name: 'Running',
                    filter: { sort: 'created-desc', name: '', state: 'running' },
                    icon: 'fa-random',
                    id: 21,
                    index: 13,
                    recent: false
                };

                const runningObservable = of(runningFilter);
                const completedObservable = of(completedFilter);
                const allObservable = of(allFilter);
                const duplicateRunningObservable = of(duplicateRunningFilter);

                spyOn(service, 'getRunningFilterInstance').and.returnValue(runningFilter);
                spyOn(service, 'getCompletedFilterInstance').and.returnValue(completedFilter);
                spyOn(service, 'getAllFilterInstance').and.returnValue(allFilter);

                spyOn(service, 'addProcessFilter').and.returnValues(
                    runningObservable,
                    completedObservable,
                    allObservable,
                    duplicateRunningObservable
                );

                service.createDefaultFilters(appId).subscribe((result) => {
                    expect(result).toEqual([
                        { ...runningFilter, filter: runningFilter.filter, appId },
                        { ...completedFilter, filter: completedFilter.filter, appId },
                        { ...allFilter, filter: allFilter.filter, appId }
                    ]);
                    done();
                });
            });
        });
    });
});
