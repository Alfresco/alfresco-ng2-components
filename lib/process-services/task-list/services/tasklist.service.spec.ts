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
import { UserProcessModel } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import {
    fakeCompletedTaskList,
    mockErrorTaskList,
    fakeFilter,
    fakeFormList,
    fakeOpenTaskList,
    fakeRepresentationFilter1,
    fakeRepresentationFilter2,
    fakeTaskDetails,
    fakeTaskList,
    fakeTaskListDifferentProcessDefinitionKey,
    fakeTasksChecklist,
    fakeUser1,
    fakeUser2,
    secondFakeTaskList
} from '../../mock';
import { FilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './tasklist.service';

declare let jasmine: any;

xdescribe('Activiti TaskList Service', () => {

    let service: TaskListService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({

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

        it('should return the task list filtered', (done) => {
            service.getTasks(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.size).toEqual(1);
                    expect(res.start).toEqual(0);
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(1);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');
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
            service.getTasks(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.size).toEqual(2);
                    expect(res.start).toEqual(0);
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(2);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');
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
                responseText: JSON.stringify(mockErrorTaskList)
            });
        });

        it('should return the task list with all tasks filtered by state', (done) => {
            spyOn(service, 'getTasks').and.returnValue(Observable.of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(Observable.of(fakeTaskList));

            service.findAllTaskByState(<TaskQueryRequestRepresentationModel> fakeFilter, 'open').subscribe(
                res => {

                    expect(res).toBeDefined();
                    expect(res.size).toEqual(1);
                    expect(res.start).toEqual(0);
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(1);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');
                    done();
                }
            );
        });

        it('should return the task list with all tasks filtered', (done) => {
            spyOn(service, 'getTasks').and.returnValue(Observable.of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(Observable.of(fakeTaskList));

            service.findAllTaskByState(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.size).toEqual(1);
                    expect(res.start).toEqual(0);
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(1);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');
                    done();
                }
            );
        });

        it('should return the task list filtered by state', (done) => {
            service.findTasksByState(<TaskQueryRequestRepresentationModel> fakeFilter, 'open').subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.size).toEqual(1);
                    expect(res.start).toEqual(0);
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(1);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeTaskList)
            });
        });

        it('should return the task list filtered', (done) => {
            service.findTasksByState(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res.size).toEqual(1);
                    expect(res.start).toEqual(0);
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(1);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeTaskList)
            });
        });

        it('should return the task list with all tasks filtered without state', (done) => {
            spyOn(service, 'getTasks').and.returnValue(Observable.of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(Observable.of(fakeTaskList));

            service.findAllTasksWithoutState(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(2);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[0].assignee.firstName).toEqual('firstName');
                    expect(res.data[0].assignee.lastName).toEqual('lastName');

                    expect(res.data[1].name).toEqual('FakeNameTask');
                    expect(res.data[1].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[1].assignee.firstName).toEqual('firstName');
                    expect(res.data[1].assignee.lastName).toEqual('lastName');
                    done();
                }
            );
        });

        it('Should return both open and completed task', (done) => {
            spyOn(service, 'findTasksByState').and.returnValue(Observable.of(fakeOpenTaskList));
            spyOn(service, 'findAllTaskByState').and.returnValue(Observable.of(fakeCompletedTaskList));
            service.findAllTasksWithoutState(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(4);
                    expect(res.data[0].name).toEqual('FakeOpenTask1');
                    expect(res.data[1].assignee.email).toEqual('fake-open-email@dom.com');
                    expect(res.data[2].name).toEqual('FakeCompletedTaskName1');
                    expect(res.data[2].assignee.email).toEqual('fake-completed-email@dom.com');
                    expect(res.data[3].name).toEqual('FakeCompletedTaskName2');
                    done();
                }
            );
        });

        it('should add  the task list to the tasklistSubject with all tasks filtered without state', (done) => {
            spyOn(service, 'getTasks').and.returnValue(Observable.of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(Observable.of(fakeTaskList));

            service.tasksList$.subscribe(
                 (res) => {
                    expect(res).toBeDefined();
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(2);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[1].assignee.email).toEqual('fake-email@dom.com');
                });
            service.findAllTasksWithoutState(<TaskQueryRequestRepresentationModel> fakeFilter).subscribe(
                res => {
                    expect(res).toBeDefined();
                    expect(res.data).toBeDefined();
                    expect(res.data.length).toEqual(2);
                    expect(res.data[0].name).toEqual('FakeNameTask');
                    expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                    expect(res.data[1].name).toEqual('FakeNameTask');
                    expect(res.data[1].assignee.email).toEqual('fake-email@dom.com');
                    done();
                }
            );
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
                    expect(res.created).not.toEqual(null);
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
                    expect(res.created).not.toEqual(null);
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
                    expect(res.created).not.toEqual(null);
                    expect(res.adhocTaskCanBeReassigned).toBe(true);
                    expect(res.assignee).toEqual(new UserProcessModel(fakeUser2));
                    expect(res.involvedPeople[0].email).toEqual(fakeUser1.email);
                    expect(res.involvedPeople[0].firstName).toEqual(fakeUser1.firstName);
                    expect(res.involvedPeople[0].lastName).toEqual(fakeUser1.lastName);
                    expect(res.involvedPeople[0].id).toEqual(fakeUser1.id);
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

        it('should assign task to a userId', (done) => {
            let testTaskId = '8888';
            service.assignTaskByUserId(testTaskId, fakeUser2.id).subscribe(
                (res: TaskDetailsModel) => {
                    expect(res).toBeDefined();
                    expect(res.id).toEqual(testTaskId);
                    expect(res.name).toEqual('FakeNameTask');
                    expect(res.description).toEqual('FakeDescription');
                    expect(res.category).toEqual('3');
                    expect(res.created).not.toEqual(null);
                    expect(res.adhocTaskCanBeReassigned).toBe(true);
                    expect(res.assignee).toEqual(new UserProcessModel(fakeUser2));
                    expect(res.involvedPeople[0].email).toEqual(fakeUser1.email);
                    expect(res.involvedPeople[0].firstName).toEqual(fakeUser1.firstName);
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

        it('should unclaim a task', (done) => {
            let taskId = '111';

            service.unclaimTask(taskId).subscribe(
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
            let resultFilter: FilterRepresentationModel = null;
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
