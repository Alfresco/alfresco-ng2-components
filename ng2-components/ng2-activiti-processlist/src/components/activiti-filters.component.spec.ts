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
import { ActivitiProcessFilters } from './activiti-filters.component';
import { ActivitiProcessService } from '../services/activiti-process.service';
import { Observable } from 'rxjs/Rx';
import { FilterRepresentationModel } from 'ng2-activiti-tasklist';

describe('ActivitiFilters', () => {

    let filterList: ActivitiProcessFilters;
    let activitiService: ActivitiProcessService;

    let fakeGlobalFilter = [];
    fakeGlobalFilter.push(new FilterRepresentationModel({name: 'FakeInvolvedTasks', filter: { state: 'open', assignment: 'fake-involved'}}));
    fakeGlobalFilter.push(new FilterRepresentationModel({name: 'FakeMyTasks', filter: { state: 'open', assignment: 'fake-assignee'}}));

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
        activitiService = new ActivitiProcessService(null);
        filterList = new ActivitiProcessFilters(null, activitiService);
    });

    it('should return the filter task list', (done) => {
        spyOn(activitiService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(2);
            expect(filterList.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(filterList.filters[1].name).toEqual('FakeMyTasks');
            done();
        });

        filterList.ngOnInit();
    });

    it('should return the filter task list, filtered By Name', (done) => {

        let fakeDeployedApplicationsPromise = new Promise(function (resolve, reject) {
            resolve({});
        });

        spyOn(activitiService, 'getDeployedApplications').and.returnValue(Observable.fromPromise(fakeDeployedApplicationsPromise));
        spyOn(activitiService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        filterList.appName = 'test';

        filterList.onSuccess.subscribe((res) => {
            let deployApp: any = activitiService.getDeployedApplications;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        filterList.appId = '1';
        spyOn(activitiService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        filterList.onError.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        filterList.appName = 'fake-app';
        spyOn(activitiService, 'getDeployedApplications').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        filterList.onError.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an event when a filter is selected', (done) => {
        let currentFilter = new FilterRepresentationModel({filter: { state: 'open', assignment:  'fake-involved'}});

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

        let change = new SimpleChange(null, appId);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();
        const appId = null;

        let change = new SimpleChange(null, appId);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        let change = new SimpleChange(null, appName);
        filterList.ngOnChanges({ 'appName': change });

        expect(filterList.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        let filter = new FilterRepresentationModel({name: 'FakeMyTasks', filter: { state: 'open', assignment: 'fake-assignee'}});
        expect(filterList.currentFilter).toBeUndefined();
        filterList.selectFilter(filter);
        expect(filterList.getCurrentFilter()).toBe(filter);
    });

});
