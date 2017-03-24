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
import { CoreModule } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './activiti-tasklist.service';
import { TaskDetailsModel } from '../models/task-details.model';
import { FilterRepresentationModel, AppDefinitionRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { Comment } from '../models/comment.model';

declare let AlfrescoApi: any;
declare let jasmine: any;

describe('ActivitiTaskListService', () => {
    let fakeEmptyFilters = {
        size: 0, total: 0, start: 0,
        data: [ ]
    };

    let fakeFilters = {
        size: 2, total: 2, start: 0,
        data: [
            new AppDefinitionRepresentationModel(
                {
                    id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
                    filter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved'}
                }
            ),
            {
                id: 2, name: 'FakeMyTasks', recent: false, icon: 'glyphicon-align-left',
                filter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-assignee'}
            }
        ]
    };

    let fakeAppFilter = {
        size: 1, total: 1, start: 0,
        data: [
            {
                id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
                filter: {sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved'}
            }
        ]
    };

    let fakeApps = {
        size: 2, total: 2, start: 0,
        data: [
            {
                id: 1, defaultAppId: null, name: 'Sales-Fakes-App', description: 'desc-fake1', modelId: 22,
                theme: 'theme-1-fake', icon: 'glyphicon-asterisk', 'deploymentId': '111', 'tenantId': null
            },
            {
                id: 2, defaultAppId: null, name: 'health-care-Fake', description: 'desc-fake2', modelId: 33,
                theme: 'theme-2-fake', icon: 'glyphicon-asterisk', 'deploymentId': '444', 'tenantId': null
            }
        ]
    };

    let fakeFilter = {
        sort: 'created-desc', text: '', state: 'open', assignment: 'fake-assignee'
    };

    let fakeUser = {id: 1, email: 'fake-email@dom.com', firstName: 'firstName', lastName: 'lastName'};

    let fakeTaskList = {
        size: 1, total: 1, start: 0,
        data: [
            {
                id: 1, name: 'FakeNameTask', description: null, category: null,
                assignee: fakeUser,
                created: '2016-07-15T11:19:17.440+0000'
            }
        ]
    };

    let fakeErrorTaskList = {
        error: 'wrong request'
    };

    let fakeTaskDetails = {id: '999', name: 'fake-task-name', formKey: '99', assignee: fakeUser};

    let fakeTasksComment = {
        size: 2, total: 2, start: 0,
        data: [
            {
                id: 1, message: 'fake-message-1', created: '', createdBy: fakeUser
            },
            {
                id: 2, message: 'fake-message-2', created: '', createdBy: fakeUser
            }
        ]
    };

    let fakeTasksChecklist = {
        size: 1, total: 1, start: 0,
        data: [
            {
                id: 1, name: 'FakeCheckTask1', description: null, category: null,
                assignee: fakeUser,
                created: '2016-07-15T11:19:17.440+0000'
            },
            {
                id: 2, name: 'FakeCheckTask2', description: null, category: null,
                assignee: fakeUser,
                created: '2016-07-15T11:19:17.440+0000'
            }
        ]
    };

    let fakeAppPromise = new Promise(function (resolve, reject) {
        resolve(fakeAppFilter);
    });

    let service: ActivitiTaskListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                ActivitiTaskListService
            ]
        });
        service = TestBed.get(ActivitiTaskListService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return the task list filters', (done) => {
        service.getTaskListFilters().subscribe(
            (res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].name).toEqual('FakeInvolvedTasks');
                expect(res[1].name).toEqual('FakeMyTasks');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeFilters)
        });
    });

    it('should call the api withthe appId', (done) => {
        spyOn(service, 'callApiTaskFilters').and.returnValue((fakeAppPromise));

        let appId = '1';
        service.getTaskListFilters(appId).subscribe(
            (res) => {
                expect(service.callApiTaskFilters).toHaveBeenCalledWith(appId);
                done();
            }
        );
    });

    it('should return the app filter by id', (done) => {
        let appId = '1';
        service.getTaskListFilters(appId).subscribe(
            (res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(1);
                expect(res[0].name).toEqual('FakeInvolvedTasks');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeAppFilter)
        });
    });

    it('should return the task list filtered', (done) => {
        service.getTasks(<TaskQueryRequestRepresentationModel>fakeFilter).subscribe(
                res => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(1);
                expect(res[0].name).toEqual('FakeNameTask');
                expect(res[0].assignee.email).toEqual('fake-email@dom.com');
                expect(res[0].assignee.firstName).toEqual('firstName');
                expect(res[0].assignee.lastName).toEqual('lastName');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTaskList)
        });
    });

    it('should throw an exception when the response is wrong', () => {
        service.getTasks(<TaskQueryRequestRepresentationModel>fakeFilter).subscribe(
            (res) => {
            },
            (err: any) => {
                expect(err).toBeDefined();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 404,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeErrorTaskList)
        });
    });

    it('should return the task details ', (done) => {
        service.getTaskDetails('999').subscribe(
            (res: TaskDetailsModel) => {
                expect(res).toBeDefined();
                expect(res.id).toEqual('999');
                expect(res.name).toEqual('fake-task-name');
                expect(res.formKey).toEqual('99');
                expect(res.assignee).toBeDefined();
                expect(res.assignee.email).toEqual('fake-email@dom.com');
                expect(res.assignee.firstName).toEqual('firstName');
                expect(res.assignee.lastName).toEqual('lastName');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTaskDetails)
        });
    });

    it('should return the tasks comments ', (done) => {
        service.getTaskComments('999').subscribe(
            (res: Comment[]) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].message).toEqual('fake-message-1');
                expect(res[1].message).toEqual('fake-message-2');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTasksComment)
        });
    });

    it('should return the tasks checklists ', (done) => {
        service.getTaskChecklist('999').subscribe(
            (res: TaskDetailsModel[]) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].name).toEqual('FakeCheckTask1');
                expect(res[0].assignee.email).toEqual('fake-email@dom.com');
                expect(res[0].assignee.firstName).toEqual('firstName');
                expect(res[0].assignee.lastName).toEqual('lastName');
                expect(res[1].name).toEqual('FakeCheckTask2');
                expect(res[1].assignee.email).toEqual('fake-email@dom.com');
                expect(res[1].assignee.firstName).toEqual('firstName');
                expect(res[0].assignee.lastName).toEqual('lastName');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTasksChecklist)
        });
    });

    it('should add a task ', (done) => {
        let taskFake = new TaskDetailsModel({
            id: 123,
            parentTaskId: 456,
            name: 'FakeNameTask',
            description: null,
            category: null,
            assignee: fakeUser,
            created: ''
        });

        service.addTask(taskFake).subscribe(
            (res: TaskDetailsModel) => {
                expect(res).toBeDefined();
                expect(res.id).not.toEqual('');
                expect(res.name).toEqual('FakeNameTask');
                expect(res.created).not.toEqual('');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({
                id: '777', name: 'FakeNameTask', description: null, category: null,
                assignee: fakeUser,
                created: '2016-07-15T11:19:17.440+0000'
            })
        });
    });

    it('should add a comment task ', (done) => {
        service.addTaskComment('999', 'fake-comment-message').subscribe(
            (res: Comment) => {
                expect(res).toBeDefined();
                expect(res.id).not.toEqual('');
                expect(res.message).toEqual('fake-comment-message');
                expect(res.created).not.toEqual('');
                expect(res.createdBy.email).toEqual('fake-email@dom.com');
                expect(res.createdBy.firstName).toEqual('firstName');
                expect(res.createdBy.lastName).toEqual('lastName');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({
                id: '111', message: 'fake-comment-message',
                createdBy: fakeUser,
                created: '2016-07-15T11:19:17.440+0000'
            })
        });
    });

    it('should complete the task ', (done) => {
        service.completeTask('999').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('should return the total number of tasks', (done) => {
        service.getTotalTasks(<TaskQueryRequestRepresentationModel>fakeFilter).subscribe(
                res => {
                expect(res).toBeDefined();
                expect(res.size).toEqual(1);
                expect(res.total).toEqual(1);
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTaskList)
        });
    });

    it('should call the createDefaultFilter when the list is empty', (done) => {
        spyOn(service, 'createDefaultFilter');

        service.getTaskListFilters().subscribe(
            (res) => {
                expect(service.createDefaultFilter).toHaveBeenCalled();
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeEmptyFilters)
        });
    });

    it('should return the default filters', () => {
        spyOn(service, 'addFilter');
        let filters = service.createDefaultFilter(null);
        expect(service.addFilter).toHaveBeenCalledTimes(4);
        expect(filters).toBeDefined();
        expect(filters.length).toEqual(4);
    });

    it('should add a filter ', (done) => {
        let filterFake = new FilterRepresentationModel({
            name: 'FakeNameFilter',
            assignment: 'fake-assignement'
        });

        service.addFilter(filterFake).subscribe(
            (res: FilterRepresentationModel) => {
                expect(res).toBeDefined();
                expect(res.id).not.toEqual('');
                expect(res.name).toEqual('FakeNameFilter');
                expect(res.filter.assignment).toEqual('fake-assignement');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({
                id: '2233', name: 'FakeNameFilter', filter: {assignment: 'fake-assignement'}
            })
        });
    });

    it('should get the deployed apps ', (done) => {
        service.getDeployedApplications().subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].name).toEqual('Sales-Fakes-App');
                expect(res[0].description).toEqual('desc-fake1');
                expect(res[0].deploymentId).toEqual('111');
                expect(res[1].name).toEqual('health-care-Fake');
                expect(res[1].description).toEqual('desc-fake2');
                expect(res[1].deploymentId).toEqual('444');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeApps)
        });
    });

    it('should get the filter deployed app ', (done) => {
        let name = 'health-care-Fake';
        service.getDeployedApplications(name).subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.name).toEqual('health-care-Fake');
                expect(res.description).toEqual('desc-fake2');
                expect(res.deploymentId).toEqual('444');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeApps)
        });
    });

    it('should create a new standalone task ', (done) => {
        let taskFake = new TaskDetailsModel({
            name: 'FakeNameTask',
            description: 'FakeDescription',
            category: '3'
        });

        service.createNewTask(taskFake).subscribe(
            (res: TaskDetailsModel) => {
                expect(res).toBeDefined();
                expect(res.id).not.toEqual('');
                expect(res.name).toEqual('FakeNameTask');
                expect(res.description).toEqual('FakeDescription');
                expect(res.category).toEqual('3');
                expect(res.created).not.toEqual('');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({
                id: '777',
                name: 'FakeNameTask',
                description: 'FakeDescription',
                category: '3',
                assignee: fakeUser,
                created: '2016-07-15T11:19:17.440+0000'
            })
        });
    });

    it('should claim a task', (done) => {
        let taskId = '111';

        service.claimTask(taskId).subscribe(
            (res: any) => {
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('should return the filter if', (done) => {
        let taskId = '111';

        service.claimTask(taskId).subscribe(
            (res: any) => {
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

});
