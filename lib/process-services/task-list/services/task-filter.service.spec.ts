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

import { async } from '@angular/core/testing';
import { fakeAppFilter, fakeAppPromise, fakeFilters } from '../../mock';
import { FilterRepresentationModel } from '../models/filter.model';
import { TaskFilterService } from './task-filter.service';
import { AlfrescoApiServiceMock, LogService, AppConfigService, StorageService, setupTestBed, CoreModule } from '@alfresco/adf-core';

declare let jasmine: any;

describe('Activiti Task filter Service', () => {

    let service: TaskFilterService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        service = new TaskFilterService(new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService()), new LogService(new AppConfigService(null)));
        jasmine.Ajax.install();
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Content tests', () => {

        it('should return the task list filters', (done) => {
            service.getTaskListFilters().subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].name).toEqual('FakeInvolvedTasks');
                expect(res[1].name).toEqual('FakeMyTasks');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeFilters)
            });
        });

        it('should return the task filter by id', (done) => {
            service.getTaskFilterById(2).subscribe((taskFilter: FilterRepresentationModel) => {
                expect(taskFilter).toBeDefined();
                expect(taskFilter.id).toEqual(2);
                expect(taskFilter.name).toEqual('FakeMyTasks');
                expect(taskFilter.filter.sort).toEqual('created-desc');
                expect(taskFilter.filter.state).toEqual('open');
                expect(taskFilter.filter.assignment).toEqual('fake-assignee');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeFilters)
            });
        });

        it('should return the task filter by name', (done) => {
            service.getTaskFilterByName('FakeMyTasks').subscribe((res: FilterRepresentationModel) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual(2);
                    expect(res.name).toEqual('FakeMyTasks');
                    expect(res.filter.sort).toEqual('created-desc');
                    expect(res.filter.state).toEqual('open');
                    expect(res.filter.assignment).toEqual('fake-assignee');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeFilters)
            });
        });

        it('should call the api with the appId', (done) => {
            spyOn(service, 'callApiTaskFilters').and.returnValue((fakeAppPromise));

            let appId = 1;
            service.getTaskListFilters(appId).subscribe((res) => {
                expect(service.callApiTaskFilters).toHaveBeenCalledWith(appId);
                done();
            });
        });

        it('should return the app filter by id', (done) => {
            let appId = 1;
            service.getTaskListFilters(appId).subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(1);
                expect(res[0].name).toEqual('FakeInvolvedTasks');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeAppFilter)
            });
        });

        it('should return the default filters', (done) => {
            service.createDefaultFilters(1234).subscribe((res: FilterRepresentationModel []) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(4);
                expect(res[0].name).toEqual('Involved Tasks');
                expect(res[0].id).toEqual(111);
                expect(res[1].name).toEqual('My Tasks');
                expect(res[1].id).toEqual(222);
                expect(res[2].name).toEqual('Queued Tasks');
                expect(res[2].id).toEqual(333);
                expect(res[3].name).toEqual('Completed Tasks');
                expect(res[3].id).toEqual(444);
                done();
            });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    appId: 1001, id: '111', name: 'Involved Tasks', icon: 'fake-icon', recent: false
                })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    appId: 1001, id: '222', name: 'My Tasks', icon: 'fake-icon', recent: false
                })
            });

            jasmine.Ajax.requests.at(2).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    appId: 1001, id: '333', name: 'Queued Tasks', icon: 'fake-icon', recent: false
                })
            });

            jasmine.Ajax.requests.at(3).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    appId: 1001, id: '444', name: 'Completed Tasks', icon: 'fake-icon', recent: false
                })
            });
        });

        it('should add a filter', (done) => {
            let filterFake = new FilterRepresentationModel({
                name: 'FakeNameFilter',
                assignment: 'fake-assignment'
            });

            service.addFilter(filterFake).subscribe((res: FilterRepresentationModel) => {
                expect(res).toBeDefined();
                expect(res.id).not.toEqual(null);
                expect(res.name).toEqual('FakeNameFilter');
                expect(res.filter.assignment).toEqual('fake-assignment');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    id: '2233', name: 'FakeNameFilter', filter: { assignment: 'fake-assignment' }
                })
            });
        });

    });

});
