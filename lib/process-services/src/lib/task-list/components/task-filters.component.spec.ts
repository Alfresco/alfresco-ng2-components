/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { TaskFiltersComponent } from './task-filters.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { fakeTaskFilters } from '../../mock/task/task-filters.mock';

describe('TaskFiltersComponent', () => {

    let taskListService: TaskListService;
    let taskFilterService: TaskFilterService;
    let appsProcessService: AppsProcessService;

    const fakeGlobalFilterPromise = new Promise(function (resolve) {
        resolve(fakeTaskFilters);
    });

    const fakeGlobalEmptyFilter = {
        message: 'invalid data'
    };

    const fakeGlobalEmptyFilterPromise = new Promise(function (resolve) {
        resolve(fakeGlobalEmptyFilter);
    });

    const mockErrorFilterList = {
        error: 'wrong request'
    };

    let component: TaskFiltersComponent;
    let fixture: ComponentFixture<TaskFiltersComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.bpmHost = 'http://localhost:9876/bpm';

        fixture = TestBed.createComponent(TaskFiltersComponent);
        component = fixture.componentInstance;

        taskListService = TestBed.inject(TaskListService);
        taskFilterService = TestBed.inject(TaskFilterService);
        appsProcessService = TestBed.inject(AppsProcessService);
    });

    it('should emit an error with a bad response', (done) => {
        const mockErrorFilterPromise = Promise.reject(mockErrorFilterList);
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(mockErrorFilterPromise));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });
   });

    it('should return the filter task list', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);
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

        const fakeDeployedApplicationsPromise = new Promise(function (resolve) {
            resolve({});
        });

        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(fakeDeployedApplicationsPromise));
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        const change = new SimpleChange(null, 'test', true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            const deployApp: any = appsProcessService.getDeployedApplicationsByName;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        component.ngOnInit();
    });

    it('should be able to fetch and select the default if the input filter is not valid', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalEmptyFilterPromise));
        spyOn(component, 'createFiltersByAppId').and.stub();

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
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
        const change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks1');
            done();
        });
   });

    it('should select the task filter based on the input by index param', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({ index: 2 });

        const appId = '1';
        const change = new SimpleChange(null, appId, true);

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
        const change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });
   });

    it('should emit the selected filter based on the filterParam input', () => {
        spyOn(component.filterSelected, 'emit');
        component.filters = fakeTaskFilters;

        const filterParam = new FilterParamsModel({ id: 10 });
        const change = new SimpleChange(null, filterParam, true);
        component.filterParam = filterParam;

        component.ngOnChanges({ 'filterParam': change });
        fixture.detectChanges();

        expect(component.filterSelected.emit).toHaveBeenCalledWith(fakeTaskFilters[0]);
    });

    it('should filterClicked emit when a filter is clicked from the UI', async  () => {
        component.filters = fakeTaskFilters;
        spyOn(component.filterClicked, 'emit');

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeTaskFilters[0].name}_filter"]`);
        filterButton.click();

        expect(component.filterClicked.emit).toHaveBeenCalledWith(fakeTaskFilters[0]);
    });

    it('should reload filters by appId on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = '1';

        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = null;

        const change = new SimpleChange(undefined, appId, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should change current filter when filterParam (id) changes', async () => {
        component.filters = fakeTaskFilters;
        component.currentFilter = null;

        fixture.whenStable().then(() => {
            expect(component.currentFilter.id).toEqual(fakeTaskFilters[2].id);
        });
        const change = new SimpleChange(null, { id: fakeTaskFilters[2].id }, true);
        component.ngOnChanges({ 'filterParam': change });
    });

    it('should change current filter when filterParam (name) changes', async () => {
        component.filters = fakeTaskFilters;
        component.currentFilter = null;

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeTaskFilters[2].name);
        });

        const change = new SimpleChange(null, { name: fakeTaskFilters[2].name }, true);
        component.ngOnChanges({ 'filterParam': change });
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        component.filters = fakeTaskFilters;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(fakeTaskFilters[1]);
        expect(component.getCurrentFilter()).toBe(fakeTaskFilters[1]);
    });

    it('should load default list when app id is null', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();

        const change = new SimpleChange(undefined, null, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalled();
    });

    it('should not change the current filter if no filter with taskid is found', async(() => {
        const filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        component.filters = fakeTaskFilters;
        component.currentFilter = filter;
        spyOn(taskListService, 'isTaskRelatedToFilter').and.returnValue(of(null));
        component.selectFilterWithTask('111');

        expect(component.currentFilter).toBe(filter);
    }));

    it('should attach specific icon for each filter if showIcon is true', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        component.showIcon = true;
        const change = new SimpleChange(undefined, 1, true);
        component.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.filters.length).toBe(3);
            const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('format_align_left');
            expect(filters[1].nativeElement.innerText).toContain('check_circle');
            expect(filters[2].nativeElement.innerText).toContain('inbox');
            done();
        });
    });

    it('should not attach icons for each filter if showIcon is false', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        component.showIcon = false;
        const change = new SimpleChange(undefined, 1, true);
        component.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
            expect(filters.length).toBe(0);
            done();
        });
    });

    it('should reset selection when filterParam is a filter that does not exist', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        component.currentFilter = fakeTaskFilters[0];
        component.filterParam = new FilterRepresentationModel( {name: 'non-existing-filter'});
        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.currentFilter).toBe(undefined);
    });
});
