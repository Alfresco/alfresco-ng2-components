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

import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import {
    fakeAppFilter,
    fakeAppPromise,
    fakeApps,
    fakeErrorTaskList,
    fakeFilter,
    fakeFilters,
    fakeFilterWithProcessDefinitionKey,
    fakeFormList,
    fakeRepresentationFilter1,
    fakeRepresentationFilter2,
    fakeTaskDetails,
    fakeTaskList,
    fakeTaskListDifferentProcessDefinitionKey,
    fakeTasksChecklist,
    fakeTasksComment,
    fakeUser1,
    fakeUser2,
    secondFakeTaskList
} from '../assets/tasklist-service.mock';
import { Comment } from '../models/comment.model';
import { FilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { User } from '../models/user.model';
import { TaskListService } from './tasklist.service';

declare let jasmine: any;

describe('Activiti TaskList Service', () => {

    let service: TaskListService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                TaskListService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(TaskListService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Content tests', () => {

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

        it('should return the task filter by id', (done) => {
            service.getTaskFilterById(2).subscribe(
                (taskFilter: FilterRepresentationModel) => {
                    expect(taskFilter).toBeDefined();
                    expect(taskFilter.id).toEqual(2);
                    expect(taskFilter.name).toEqual('FakeMyTasks');
                    expect(taskFilter.filter.sort).toEqual('created-desc');
                    expect(taskFilter.filter.state).toEqual('open');
                    expect(taskFilter.filter.assignment).toEqual('fake-assignee');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeFilters)
            });
        });

        it('should return the task filter by name', (done) => {
            service.getTaskFilterByName('FakeMyTasks').subscribe(
                (res: FilterRepresentationModel) => {
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
            service.getTasks(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
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

        it('should return the task list filtered by processDefinitionKey', (done) => {
            service.getTasks(<TaskQueryRequestRepresentationModel> fakeFilterWithProcessDefinitionKey).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(1);
                    expect(res[0].name).toEqual('FakeNameTask');
                    expect(res[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res[0].assignee.firstName).toEqual('firstName');
                    expect(res[0].assignee.lastName).toEqual('lastName');
                    expect(res[0].processDefinitionKey).toEqual('1');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeTaskListDifferentProcessDefinitionKey)
            });
        });

        it('should throw an exception when the response is wrong', () => {
            service.getTasks(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
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
            service.getComments('999').subscribe(
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
                assignee: fakeUser1,
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
                    assignee: fakeUser1,
                    created: '2016-07-15T11:19:17.440+0000'
                })
            });
        });

        it('should remove a checklist task ', (done) => {
            service.deleteTask('999').subscribe(
                () => {
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json'
            });
        });

        it('should add a comment task ', (done) => {
            service.addComment('999', 'fake-comment-message').subscribe(
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
                    createdBy: fakeUser1,
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
            service.getTotalTasks(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
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

        it('should return the default filters', (done) => {
            service.createDefaultFilters('1234').subscribe(
                (res: FilterRepresentationModel []) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(4);
                    expect(res[0].name).toEqual('Involved Tasks');
                    expect(res[1].name).toEqual('My Tasks');
                    expect(res[2].name).toEqual('Queued Tasks');
                    expect(res[3].name).toEqual('Completed Tasks');
                    done();
                }
            );

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    id: '111', name: 'Involved Tasks', filter: { assignment: 'fake-involved' }
                })
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    id: '222', name: 'My Tasks', filter: { assignment: 'fake-assignee' }
                })
            });

            jasmine.Ajax.requests.at(2).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    id: '333', name: 'Queued Tasks', filter: { assignment: 'fake-candidate' }
                })
            });

            jasmine.Ajax.requests.at(3).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    id: '444', name: 'Completed Tasks', filter: { assignment: 'fake-involved' }
                })
            });
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
                    id: '2233', name: 'FakeNameFilter', filter: { assignment: 'fake-assignement' }
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

        it('should get the deployed app details by id ', (done) => {
            service.getApplicationDetailsById(1).subscribe(
                (app: any) => {
                    expect(app).toBeDefined();
                    expect(app.name).toEqual('Sales-Fakes-App');
                    expect(app.description).toEqual('desc-fake1');
                    expect(app.deploymentId).toEqual('111');
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
                    assignee: fakeUser1,
                    created: '2016-07-15T11:19:17.440+0000'
                })
            });
        });

        it('should assign task to a user', (done) => {
            let testTaskId = '8888';
            service.assignTask(testTaskId, fakeUser2).subscribe(
                (res: TaskDetailsModel) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual(testTaskId);
                    expect(res.name).toEqual('FakeNameTask');
                    expect(res.description).toEqual('FakeDescription');
                    expect(res.category).toEqual('3');
                    expect(res.created).not.toEqual('');
                    expect(res.adhocTaskCanBeReassigned).toBe(true);
                    expect(res.assignee).toEqual(new User(fakeUser2));
                    expect(res.involvedPeople).toEqual([fakeUser1]);
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    id: testTaskId,
                    name: 'FakeNameTask',
                    description: 'FakeDescription',
                    adhocTaskCanBeReassigned: true,
                    category: '3',
                    assignee: fakeUser2,
                    involvedPeople: [fakeUser1],
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

        it('should update a task', (done) => {
            let taskId = '111';

            service.updateTask(taskId, {property: 'value'}).subscribe(
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

        it('should return the filter if it contains task id', (done) => {
            let taskId = '1';
            let filterFake = new FilterRepresentationModel({
                name: 'FakeNameFilter',
                assignment: 'fake-assignement',
                filter: {
                    processDefinitionKey: '1',
                    assignment: 'fake',
                    state: 'none',
                    sort: 'asc'
                }
            });

            service.isTaskRelatedToFilter(taskId, filterFake).subscribe(
                (res: any) => {
                    expect(res).toBeDefined();
                    expect(res).not.toBeNull();
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeTaskList)
            });
        });

        it('should return the filters if it contains task id', async(() => {
            let taskId = '1';

            let fakeFilterList: FilterRepresentationModel[] = [];
            fakeFilterList.push(fakeRepresentationFilter1, fakeRepresentationFilter2);
            let resultFilter = null;
            service.getFilterForTaskById(taskId, fakeFilterList).subscribe(
                (res: FilterRepresentationModel) => {
                    resultFilter = res;
                },
                () => {
                },
                () => {
                    expect(resultFilter).toBeDefined();
                    expect(resultFilter).not.toBeNull();
                    expect(resultFilter.name).toBe('CONTAIN FILTER');
                });

            jasmine.Ajax.requests.at(0).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeTaskList)
            });

            jasmine.Ajax.requests.at(1).respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(secondFakeTaskList)
            });
        }));

        it('should get possibile form list', (done) => {
            service.getFormList().subscribe(
                (res: any) => {
                    expect(res).toBeDefined();
                    expect(res.length).toBe(2);
                    expect(res[0].id).toBe(1);
                    expect(res[0].name).toBe('form with all widgets');
                    expect(res[1].id).toBe(2);
                    expect(res[1].name).toBe('uppy');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeFormList)
            });
        });
    });

});
