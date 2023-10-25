/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreModule } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { fakeCompletedTaskList, fakeOpenTaskList, fakeTaskList } from '../../mock';
import { fakeFilter } from '../../mock/task/task-filters.mock';
import { TaskListService } from './tasklist.service';
import { ProcessTestingModule } from '../../testing/process.testing.module';

describe('Activiti TaskList Service', () => {
    let service: TaskListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), ProcessTestingModule]
        });
        service = TestBed.inject(TaskListService);
    });

    describe('Content tests', () => {
        it('should return the task list with all tasks filtered by state', (done) => {
            spyOn(service, 'getTasks').and.returnValue(of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(of(fakeTaskList));

            service.findAllTaskByState(fakeFilter, 'open').subscribe((res) => {
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
            });
        });

        it('should return the task list with all tasks filtered', (done) => {
            spyOn(service, 'getTasks').and.returnValue(of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(of(fakeTaskList));

            service.findAllTaskByState(fakeFilter).subscribe((res) => {
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
            });
        });

        it('should return the task list with all tasks filtered without state', (done) => {
            spyOn(service, 'getTasks').and.returnValue(of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(of(fakeTaskList));

            service.findAllTasksWithoutState(fakeFilter).subscribe((res) => {
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
            });
        });

        it('Should return both open and completed task', (done) => {
            spyOn(service, 'findTasksByState').and.returnValue(of(fakeOpenTaskList));
            spyOn(service, 'findAllTaskByState').and.returnValue(of(fakeCompletedTaskList));
            service.findAllTasksWithoutState(fakeFilter).subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.data).toBeDefined();
                expect(res.data.length).toEqual(4);
                expect(res.data[0].name).toEqual('FakeOpenTask1');
                expect(res.data[1].assignee.email).toEqual('fake-open-email@dom.com');
                expect(res.data[2].name).toEqual('FakeCompletedTaskName1');
                expect(res.data[2].assignee.email).toEqual('fake-completed-email@dom.com');
                expect(res.data[3].name).toEqual('FakeCompletedTaskName2');
                done();
            });
        });

        it('should add  the task list to the tasklistSubject with all tasks filtered without state', (done) => {
            spyOn(service, 'getTasks').and.returnValue(of(fakeTaskList));
            spyOn(service, 'getTotalTasks').and.returnValue(of(fakeTaskList));

            service.findAllTasksWithoutState(fakeFilter).subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.data).toBeDefined();
                expect(res.data.length).toEqual(2);
                expect(res.data[0].name).toEqual('FakeNameTask');
                expect(res.data[0].assignee.email).toEqual('fake-email@dom.com');
                expect(res.data[1].name).toEqual('FakeNameTask');
                expect(res.data[1].assignee.email).toEqual('fake-email@dom.com');
                done();
            });
        });
    });
});
