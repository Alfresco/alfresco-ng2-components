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

import { it, describe, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { ActivitiTaskListService } from './activiti-tasklist.service';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { HTTP_PROVIDERS } from '@angular/http';

declare let AlfrescoApi: any;
declare let jasmine: any;

describe('AlfrescoUploadService', () => {
    let service, options: any;

    options = {
        host: 'fakehost',
        url: '/some/cool/url',
        baseUrlPath: 'fakebasepath',
        formFields: {
            siteid: 'fakeSite',
            containerid: 'fakeFolder'
        }
    };

    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            ActivitiTaskListService
        ];
    });

    beforeEach( inject([ActivitiTaskListService], (activitiService: ActivitiTaskListService) => {
        jasmine.Ajax.install();
        service = activitiService;
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return the task list filters', (done) => {
        let fakeFilter = {
            size: 2, total: 2, start: 0,
            data: [
                {
                    id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
                    filter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved'}
                },
                {
                    id: 2, name: 'FakeMyTasks', recent: false, icon: 'glyphicon-align-left',
                    filter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-assignee'}
                }
            ]
        };

        let filters = service.getTaskListFilters();
        filters.subscribe(res => {
            expect(res).toBeDefined();
            expect(res.size).toEqual(2);
            expect(res.total).toEqual(2);
            expect(res.data.length).toEqual(2);
            expect(res.data[0].name).toEqual('FakeInvolvedTasks');
            expect(res.data[1].name).toEqual('FakeMyTasks');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeFilter)
        });
    });

    it('should return the task list filtered', (done) => {
        let fakeTaskList = {
            size: 1, total: 1, start: 0,
            data: [
                {
                    id: 1, name: 'FakeNameTask', description: null, category: null,
                    assignee: {
                        id: 1,
                        firstName: null,
                        lastName: 'Fake Admin',
                        email: 'fake-admin'
                    },
                    created: '2016-07-15T11:19:17.440+0000'
                }
            ]
        };

        let fakeFilter = {
            page: 2, filterId: 2, appDefinitionId: null,
            filter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-assignee'}
        };

        let taskList = service.getTasks(fakeFilter);
        taskList.subscribe(res => {
            expect(res).toBeDefined();
            expect(res.size).toEqual(1);
            expect(res.total).toEqual(1);
            expect(res.data.length).toEqual(1);
            expect(res.data[0].name).toEqual('FakeNameTask');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTaskList)
        });
    });

    it('should throw an exception when the response is wrong', (done) => {
        let fakeTaskList = {
            error: 'wrong request'
        };

        let fakeFilter = {
            page: 2, filterId: 2, appDefinitionId: null,
            wrongfilter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-assignee'}
        };

        let fakePromise = new Promise(function (resolve, reject) {
            reject(fakeTaskList);
        });
        spyOn(service, 'callApiTasksFiltered').and.returnValue(fakePromise);

        let taskList = service.getTasks(fakeFilter);

        service.getTasks(fakeFilter).subscribe((res) => {
            let tasks = res.data;
            service.loadTasks(tasks);
        });
        taskList.subscribe(
            (res) => {

            },
            (err: any) => {
                expect(err).toBeDefined();
                expect(err.error).toEqual('wrong request');
                done();
            });
    });

});
