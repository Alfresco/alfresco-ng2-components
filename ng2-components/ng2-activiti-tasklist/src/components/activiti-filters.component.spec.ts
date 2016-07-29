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

import { ActivitiFilters } from './activiti-filters.component';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';
import { Observable } from 'rxjs/Rx';
import { FilterModel } from '../models/filter.model';

describe('ActivitiFilters', () => {

    let filterList: ActivitiFilters;

    let fakeGlobalFilter = [];
    fakeGlobalFilter.push(new FilterModel('FakeInvolvedTasks', false, 'glyphicon-align-left', '', 'open',  'fake-involved'));
    fakeGlobalFilter.push(new FilterModel('FakeMyTasks', false, 'glyphicon-align-left', '', 'open',  'fake-assignee'));

    let fakeGlobalFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalFilter);
    });

    let fakeErrorFilterList = {
        error: 'wrong request'
    };

    let fakeErrorFilterPromise = new Promise(function (resolve, reject) {
        reject(fakeErrorFilterList);
    });

    beforeEach(() => {
        let activitiService = new ActivitiTaskListService(null);
        filterList = new ActivitiFilters(null, null, activitiService);
    });

    it('should return the filter task list', (done) => {
        spyOn(filterList.activiti, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.onSuccess.subscribe( (res) => {
            expect(res).toBeDefined();
            expect(res).toEqual('Filter task list loaded');
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(2);
            expect(filterList.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(filterList.filters[1].name).toEqual('FakeMyTasks');
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(filterList.activiti, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        filterList.onError.subscribe( (err) => {
            expect(err).toBeDefined();
            expect(err).toEqual('Error to load a task filter list');
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an event when a filter is selected', (done) => {
        let currentFilter = new FilterModel('FakeInvolvedTasks', false, 'glyphicon-align-left', '', 'open', 'fake-involved');

        filterList.filterClick.subscribe((filter: FilterModel) => {
            expect(filter).toBeDefined();
            expect(filter).toEqual(currentFilter);
            expect(filterList.currentFilter).toEqual(currentFilter);
            done();
        });

        filterList.selectFilter(currentFilter);
    });

});
