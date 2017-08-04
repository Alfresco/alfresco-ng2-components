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
import { async } from '@angular/core/testing';
import { LogServiceMock } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskListService } from '../services/tasklist.service';
import { TaskFiltersComponent } from './task-filters.component';

describe('TaskFiltersComponent', () => {

    let filterList: TaskFiltersComponent;
    let activitiService: TaskListService;
    let logService: LogServiceMock;

    let fakeGlobalFilter = [];
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeInvolvedTasks',
        id: 10,
        filter: { state: 'open', assignment: 'fake-involved' }
    }));
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeMyTasks1',
        id: 11,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }));
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeMyTasks2',
        id: 12,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }));

    let fakeFilter = new FilterRepresentationModel({
        name: 'FakeMyTasks1',
        filter: { state: 'open', assignment: 'fake-assignee' }
    });

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
        logService = new LogServiceMock();
        activitiService = new TaskListService(null, logService);
        filterList = new TaskFiltersComponent(null, activitiService);
    });

    it('should return the filter task list', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(3);
            expect(filterList.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(filterList.filters[1].name).toEqual('FakeMyTasks1');
            expect(filterList.filters[2].name).toEqual('FakeMyTasks2');
            done();
        });

        filterList.ngOnInit();
    });

    it('should return the filter task list, filtered By Name', (done) => {

        let fakeDeployedApplicationsPromise = new Promise(function (resolve, reject) {
            resolve({});
        });

        spyOn(activitiService, 'getDeployedApplications').and.returnValue(Observable.fromPromise(fakeDeployedApplicationsPromise));
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        let change = new SimpleChange(null, 'test', true);
        filterList.ngOnChanges({ 'appName': change });

        filterList.onSuccess.subscribe((res) => {
            let deployApp: any = activitiService.getDeployedApplications;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onError.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(activitiService, 'getDeployedApplications').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        const appId = 'fake-app';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appName': change });

        filterList.onError.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should select the first filter as default', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

        filterList.ngOnInit();
    });

    it('should select the task filter based on the input by name param', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterParamsModel({name: 'FakeMyTasks1'});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeMyTasks1');
            done();
        });

        filterList.ngOnInit();
    });

    it('should select the default task filter if filter input does not exist', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterParamsModel({name: 'UnexistableFilter'});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

        filterList.ngOnInit();
    });

    it('should select the task filter based on the input by index param', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterParamsModel({index: 2});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeMyTasks2');
            done();
        });

        filterList.ngOnInit();
    });

    it('should select the task filter based on the input by id param', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterParamsModel({id: 10});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an event when a filter is selected', (done) => {
        let currentFilter = new FilterRepresentationModel({ filter: { state: 'open', assignment: 'fake-involved' } });

        filterList.filterClick.subscribe((filter: FilterRepresentationModel) => {
            expect(filter).toBeDefined();
            expect(filter).toEqual(currentFilter);
            expect(filterList.currentFilter).toEqual(currentFilter);
            done();
        });

        filterList.selectFilter(currentFilter);
    });

    it('should reload filters by appId on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();
        const appId = '1';

        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();
        const appId = null;

        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        let change = new SimpleChange(null, appName, true);
        filterList.ngOnChanges({ 'appName': change });

        expect(filterList.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        let filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        expect(filterList.currentFilter).toBeUndefined();
        filterList.selectFilter(filter);
        expect(filterList.getCurrentFilter()).toBe(filter);
    });

    it('should load Default list when no appid or taskid are provided', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();

        let change = new SimpleChange(null, null, true);
        filterList.ngOnChanges({ 'appName': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalled();
    });

    it('should change the current filter if a filter with taskid is found', async(() => {
        spyOn(activitiService, 'isTaskRelatedToFilter').and.returnValue(Observable.of(fakeFilter));
        filterList.filters = fakeGlobalFilter;
        filterList.selectFilterWithTask('111');

        expect(filterList.currentFilter.landingTaskId).toBeDefined();
        expect(filterList.currentFilter.landingTaskId).toBe('111');
    }));

    it('should not change the current filter if no filter with taskid is found', async(() => {
        let filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        filterList.filters = fakeGlobalFilter;
        filterList.currentFilter = filter;
        spyOn(activitiService, 'isTaskRelatedToFilter').and.returnValue(Observable.of(null));
        filterList.selectFilterWithTask('111');

        expect(filterList.currentFilter).toBe(filter);
    }));
});
