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

import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';

import { ActivitiTaskList } from './activiti-tasklist.component';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';
import { FilterModel } from '../models/filter.model';
import { Observable } from 'rxjs/Rx';


describe('ActivitiTaskList', () => {

    let taskList: ActivitiTaskList;

    let fakeGlobalFilter = {
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

    let fakeGlobalTask = {
        size: 1, total: 12, start: 0,
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

    let fakeErrorTaskList = {
        error: 'wrong request'
    };

    let fakeGlobalFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalFilter);
    });

    let fakeGlobalTaskPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalTask);
    });

    let fakeErrorTaskPromise = new Promise(function (resolve, reject) {
        reject(fakeErrorTaskList);
    });

    beforeEach(() => {
        let activitiSerevice = new ActivitiTaskListService(null);
        taskList = new ActivitiTaskList(null, null, activitiSerevice);
    });

    it('should return the default filters', (done) => {
        spyOn(taskList.activiti, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        taskList.ngOnInit();

        taskList.filtersList.subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res.length).toEqual(2);
            expect(res[0].name).toEqual('FakeInvolvedTasks');
            expect(res[1].name).toEqual('FakeMyTasks');
            done();
        });
    });

    it('should subscribe to Filter when a filter is selected', (done) => {
        let filterModel: FilterModel = new FilterModel('name', false, 'icon', 'open', 'fake-assignee');
        taskList.filter$.subscribe((filter: FilterModel) => {
            expect(filter).toBe(filterModel);
            done();
        });
        taskList.selectFilter(filterModel);
    });

    it('should return the tasks when a filter is selected', (done) => {
        spyOn(taskList.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));
        spyOn(taskList.activiti, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        taskList.ngOnInit();

        let filterModel: FilterModel = new FilterModel('name', false, 'icon', 'open', 'fake-assignee');
        taskList.selectFilter(filterModel);

        taskList.activiti.getTasks(filterModel).subscribe(
            (res) => {
                expect(res).toBeDefined();
                done();
            });
    });

    it('should throw an exception when the response is wrong', (done) => {
        spyOn(taskList.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeErrorTaskPromise));
        spyOn(taskList.activiti, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        taskList.ngOnInit();

        let filterModel: FilterModel = new FilterModel('name', false, 'icon', 'open', 'fake-assignee');
        taskList.selectFilter(filterModel);

        taskList.activiti.getTasks(filterModel).subscribe(
            (res) => {
                expect(res).toBeUndefined();
            },
            (err: any) => {
                expect(err).toBeDefined();
                expect(err.error).toEqual('wrong request');
                done();
            });
    });

    it('should optimize the task name when are empty or exceed 50 characters', (done) => {
        spyOn(taskList.activiti, 'getTasks').and.returnValue(Observable.fromPromise(fakeGlobalTaskPromise));
        spyOn(taskList.activiti, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        taskList.ngOnInit();

        let filterModel: FilterModel = new FilterModel('name', false, 'icon', 'open', 'fake-assignee');
        taskList.selectFilter(filterModel);

        taskList.activiti.getTasks(filterModel).subscribe(
            (res) => {
                expect(res.data[0].name).toEqual('fake-long-name-fake-long-name-fake-long-name-fak50...');
                expect(res.data[1].name).toEqual('Nameless task');
                done();
            });
    });

});
