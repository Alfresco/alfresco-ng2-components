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
import { AppsProcessService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessFilterService } from '../services/process-filter.service';
import { ProcessFiltersComponent } from './process-filters.component';

describe('ProcessFiltersComponent', () => {

    let filterList: ProcessFiltersComponent;
    let processFilterService: ProcessFilterService;
    let appsProcessService: AppsProcessService;
    let fakeGlobalFilterPromise;
    let mockErrorFilterPromise;

    beforeEach(() => {
        fakeGlobalFilterPromise = Promise.resolve([
            new FilterProcessRepresentationModel({
                name: 'FakeInvolvedTasks',
                filter: { state: 'open', assignment: 'fake-involved' }
            }),
            new FilterProcessRepresentationModel({
                name: 'FakeMyTasks',
                filter: { state: 'open', assignment: 'fake-assignee' }
            }),
            new FilterProcessRepresentationModel({
                name: 'Running',
                filter: { state: 'open', assignment: 'fake-running' }
            })
        ]);

        mockErrorFilterPromise = Promise.reject({
            error: 'wrong request'
        });

        processFilterService = new ProcessFilterService(null);
        appsProcessService = new AppsProcessService(null, null);
        filterList = new ProcessFiltersComponent(processFilterService, appsProcessService);
    });

    it('should return the filter task list', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(3);
            expect(filterList.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(filterList.filters[1].name).toEqual('FakeMyTasks');
            expect(filterList.filters[2].name).toEqual('Running');
            done();
        });

        filterList.ngOnInit();
    });

    it('should select the Running process filter', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.currentFilter).toBeUndefined();

        filterList.success.subscribe((res) => {
            filterList.selectRunningFilter();
            expect(filterList.currentFilter.name).toEqual('Running');
            done();
        });

        filterList.ngOnInit();
    });

    it('should return the filter task list, filtered By Name', (done) => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(Observable.fromPromise(Promise.resolve({ id: 1 })));
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        let change = new SimpleChange(null, 'test', true);
        filterList.ngOnChanges({ 'appName': change });

        filterList.success.subscribe((res) => {
            let deployApp: any = appsProcessService.getDeployedApplicationsByName;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(Observable.fromPromise(mockErrorFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(Observable.fromPromise(mockErrorFilterPromise));

        const appId = 'fake-app';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appName': change });

        filterList.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        filterList.ngOnInit();
    });

    it('should emit an event when a filter is selected', (done) => {
        let currentFilter = new FilterProcessRepresentationModel({
            filter: {
                state: 'open',
                assignment: 'fake-involved'
            }
        });

        filterList.filterClick.subscribe((filter: FilterProcessRepresentationModel) => {
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
        let filter = new FilterProcessRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        expect(filterList.currentFilter).toBeUndefined();
        filterList.selectFilter(filter);
        expect(filterList.getCurrentFilter()).toBe(filter);
    });

    it ('should select current process filter', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.currentFilter).toBeUndefined();

        const selectedFilter = new FilterProcessRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });

        filterList.success.subscribe(() => {
            filterList.selectProcessFilter(selectedFilter);
            expect(filterList.currentFilter.name).toEqual('FakeMyTasks');
            done();
        });

        filterList.ngOnInit();
    });
});
