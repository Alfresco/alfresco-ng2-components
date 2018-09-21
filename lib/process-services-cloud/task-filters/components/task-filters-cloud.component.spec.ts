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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService, AppsProcessService, setupTestBed } from '@alfresco/adf-core';
import { from, of } from 'rxjs';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskListService } from '../services/tasklist.service';
import { TaskFilterService } from '../services/task-filter.service';
import { TaskFiltersComponent } from './task-filters-cloud.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { By } from '@angular/platform-browser';

describe('TaskFiltersComponent', () => {

    let taskListService: TaskListService;
    let taskFilterService: TaskFilterService;
    let appsProcessService: AppsProcessService;

    let fakeGlobalFilter = [];
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeInvolvedTasks',
        icon: 'glyphicon-align-left',
        id: 10,
        filter: { state: 'open', assignment: 'fake-involved' }
    }));
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeMyTasks1',
        icon: 'glyphicon-ok-sign',
        id: 11,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }));
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeMyTasks2',
        icon: 'glyphicon-inbox',
        id: 12,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }));

    let fakeGlobalFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalFilter);
    });

    let fakeGlobalEmptyFilter = {
        message: 'invalid data'
    };

    let fakeGlobalEmptyFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalEmptyFilter);
    });

    let mockErrorFilterList = {
        error: 'wrong request'
    };

    let mockErrorFilterPromise = Promise.reject(mockErrorFilterList);

    let component: TaskFiltersComponent;
    let fixture: ComponentFixture<TaskFiltersComponent>;

    setupTestBed({
        imports: [
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.bpmHost = 'http://localhost:9876/bpm';

        fixture = TestBed.createComponent(TaskFiltersComponent);
        component = fixture.componentInstance;

        taskListService = TestBed.get(TaskListService);
        taskFilterService = TestBed.get(TaskFilterService);
        appsProcessService = TestBed.get(AppsProcessService);
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(mockErrorFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

    });

    it('should return the filter task list', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters.length).toEqual(3);
            expect(component.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(component.filters[1].name).toEqual('FakeMyTasks1');
            expect(component.filters[2].name).toEqual('FakeMyTasks2');
            done();
        });

        component.ngOnInit();
    });

    it('should return the filter task list, filtered By Name', (done) => {

        let fakeDeployedApplicationsPromise = new Promise(function (resolve, reject) {
            resolve({});
        });

        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(fakeDeployedApplicationsPromise));
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        let change = new SimpleChange(null, 'test', true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            let deployApp: any = appsProcessService.getDeployedApplicationsByName;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        component.ngOnInit();
    });

    it('should select the first filter as default', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

    });

    it('should be able to fetch and select the default if the input filter is not valid', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalEmptyFilterPromise));
        spyOn(component, 'createFiltersByAppId').and.stub();

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.createFiltersByAppId).not.toHaveBeenCalled();
            done();
        });
    });

    it('should select the task filter based on the input by name param', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({ name: 'FakeMyTasks1' });
        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks1');
            done();
        });

    });

    it('should select the default task filter if filter input does not exist', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({ name: 'UnexistableFilter' });

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

    });

    it('should select the task filter based on the input by index param', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({ index: 2 });

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks2');
            done();
        });

    });

    it('should select the task filter based on the input by id param', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({ id: 10 });

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

    });

    it('should emit an event when a filter is selected', (done) => {
        let currentFilter = fakeGlobalFilter[0];
        component.filters = fakeGlobalFilter;
        component.filterClick.subscribe((filter: FilterRepresentationModel) => {
            expect(filter).toBeDefined();
            expect(filter).toEqual(currentFilter);
            expect(component.currentFilter).toEqual(currentFilter);
            done();
        });

        component.selectFilterAndEmit(currentFilter);
    });

    it('should reload filters by appId on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = '1';

        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = null;

        let change = new SimpleChange(undefined, appId, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should change current filter when filterParam (id) changes', async () => {
        component.filters = fakeGlobalFilter;
        component.currentFilter = null;

        fixture.whenStable().then(() => {
            expect(component.currentFilter.id).toEqual(fakeGlobalFilter[2].id);
        });
        const change = new SimpleChange(null, { id: fakeGlobalFilter[2].id }, true);
        component.ngOnChanges({ 'filterParam': change });
    });

    it('should change current filter when filterParam (name) changes', async () => {
        component.filters = fakeGlobalFilter;
        component.currentFilter = null;

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeGlobalFilter[2].name);
        });

        const change = new SimpleChange(null, { name: fakeGlobalFilter[2].name }, true);
        component.ngOnChanges({ 'filterParam': change });
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        let filter = fakeGlobalFilter[1];
        component.filters = fakeGlobalFilter;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(filter);
        expect(component.getCurrentFilter()).toBe(filter);
    });

    it('should load default list when appid is null', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();

        let change = new SimpleChange(undefined, null, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalled();
    });

    it('should not change the current filter if no filter with taskid is found', async(() => {
        let filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        component.filters = fakeGlobalFilter;
        component.currentFilter = filter;
        spyOn(taskListService, 'isTaskRelatedToFilter').and.returnValue(of(null));
        component.selectFilterWithTask('111');

        expect(component.currentFilter).toBe(filter);
    }));

    it('should attach specific icon for each filter if hasIcon is true', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        component.hasIcon = true;
        let change = new SimpleChange(undefined, 1, true);
        component.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.filters.length).toBe(3);
            let filters: any = fixture.debugElement.queryAll(By.css('.adf-filters__entry-icon'));
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('format_align_left');
            expect(filters[1].nativeElement.innerText).toContain('check_circle');
            expect(filters[2].nativeElement.innerText).toContain('inbox');
            done();
        });
    });

    it('should not attach icons for each filter if hasIcon is false', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        component.hasIcon = false;
        let change = new SimpleChange(undefined, 1, true);
        component.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let filters: any = fixture.debugElement.queryAll(By.css('.adf-filters__entry-icon'));
            expect(filters.length).toBe(0);
            done();
        });
    });
});
