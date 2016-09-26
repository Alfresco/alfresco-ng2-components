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

import { SimpleChange } from '@angular/core';
import { ActivitiTaskList } from './activiti-tasklist.component';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';
import { UserTaskFilterRepresentationModel } from '../models/filter.model';
import { Observable } from 'rxjs/Rx';
import { ObjectDataRow, DataRowEvent, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';


describe('ActivitiTaskList', () => {

    let taskList: ActivitiTaskList;

    let fakeGlobalTask = {
        size: 2, total: 2, start: 0,
        data: [
            {
                id: 14, name: 'fake-long-name-fake-long-name-fake-long-name-fak50-long-name', description: null, category: null,
                assignee: {
                    id: 1, firstName: null, lastName: 'Administrator', email: 'admin'
                }
            },
            {
                id: 2, name: '', description: null, category: null,
                assignee: {
                    id: 1, firstName: null, lastName: 'Administrator', email: 'admin'
                }
            }
        ]
    };

    let fakeGlobalTotalTasks = {
        size: 2, total: 2, start: 0,
        data: []
    };

    let fakeGlobalTaskPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalTask);
    });

    let fakeGlobalTotalTasksPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalTotalTasks);
    });

    let fakeErrorTaskList = {
        error: 'wrong request'
    };

    let fakeErrorTaskPromise = new Promise(function (resolve, reject) {
        reject(fakeErrorTaskList);
    });

    beforeEach(() => {
        let activitiSerevice = new ActivitiTaskListService(null);
        taskList = new ActivitiTaskList(null, null, activitiSerevice);
    });

    it('should use the default schemaColumn as default', () => {
        taskList.ngOnInit();
        expect(taskList.data.getColumns()).toBeDefined();
        expect(taskList.data.getColumns().length).toEqual(4);
    });

    it('should use the schemaColumn passed in input', () => {
        taskList.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );

        taskList.ngOnInit();
        expect(taskList.data.getColumns()).toBeDefined();
        expect(taskList.data.getColumns().length).toEqual(1);
    });

    it('should return an empty task list when the taskFilter is not passed', () => {
        taskList.ngOnInit();
        expect(taskList.data).toBeDefined();
        expect(taskList.isTaskListEmpty()).toBeTruthy();
    });

    it('should return the filtered task list when the taskFilter is passed', (done) => {
        spyOn(taskList.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeGlobalTotalTasksPromise));
        spyOn(taskList.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));
        taskList.taskFilter = new UserTaskFilterRepresentationModel({filter: { state: 'open', assignment: 'fake-assignee'}});

        taskList.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(taskList.data).toBeDefined();
            expect(taskList.isTaskListEmpty()).not.toBeTruthy();
            expect(taskList.data.getRows().length).toEqual(2);
            expect(taskList.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(taskList.data.getRows()[1].getValue('name')).toEqual('Nameless task');
            done();
        });

        taskList.ngOnInit();
    });

    it('should return a currentId null when the taskList is empty', () => {
        taskList.selectFirstTask();
        expect(taskList.getCurrentTaskId()).toBeNull();
    });

    it('should throw an exception when the response is wrong', (done) => {
        spyOn(taskList.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeErrorTaskPromise));
        taskList.taskFilter = new UserTaskFilterRepresentationModel({filter: { state: 'open', assignment: 'fake-assignee'}});

        taskList.onError.subscribe( (err) => {
            expect(err).toBeDefined();
            done();
        });

        taskList.ngOnInit();
    });

    it('should reload tasks when reload() is called', (done) => {
        spyOn(taskList.activiti, 'getTotalTasks').and.returnValue(Observable.fromPromise(fakeGlobalTotalTasksPromise));
        spyOn(taskList.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));
        taskList.taskFilter = new UserTaskFilterRepresentationModel({filter: { state: 'open', assignment: 'fake-assignee'}});
        taskList.ngOnInit();
        taskList.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(taskList.data).toBeDefined();
            expect(taskList.isTaskListEmpty()).not.toBeTruthy();
            expect(taskList.data.getRows().length).toEqual(2);
            expect(taskList.data.getRows()[0].getValue('name')).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
            expect(taskList.data.getRows()[1].getValue('name')).toEqual('Nameless task');
            done();
        });
        taskList.reload();
    });

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow({
            id: 999
        });
        let rowEvent = <DataRowEvent> {value: row};

        taskList.rowClick.subscribe(taskId => {
            expect(taskId).toEqual(999);
            expect(taskList.getCurrentTaskId()).toEqual(999);
            done();
        });

        taskList.onRowClick(rowEvent);
    });

    it('should reload task list by filter on binding changes', () => {
        spyOn(taskList, 'load').and.stub();
        const taskFilter = new UserTaskFilterRepresentationModel({filter: { state: 'open', assignment: 'fake-assignee'}});

        let change = new SimpleChange(null, taskFilter);
        taskList.ngOnChanges({ 'taskFilter': change });

        expect(taskList.load).toHaveBeenCalled();
    });

});
