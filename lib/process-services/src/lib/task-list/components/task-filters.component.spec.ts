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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { from, of } from 'rxjs';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskListService } from '../services/tasklist.service';
import { TaskFilterService } from '../services/task-filter.service';
import { TaskFiltersComponent } from './task-filters.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { fakeTaskFilters } from '../../mock/task/task-filters.mock';
import { NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('TaskFiltersComponent', () => {

    let taskListService: TaskListService;
    let taskFilterService: TaskFilterService;
    let appsProcessService: AppsProcessService;
    let component: TaskFiltersComponent;
    let fixture: ComponentFixture<TaskFiltersComponent>;
    let router: Router;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule,
            RouterTestingModule
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
        router = TestBed.inject(Router);
    });

    it('should emit an error with a bad response', async () => {
        const mockErrorFilterList = {
            error: 'wrong request'
        };
        const mockErrorFilterPromise = Promise.reject(mockErrorFilterList);
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(mockErrorFilterPromise));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ appId: change });

        await component.error.subscribe((err) => {
            expect(err).toBeDefined();
        });
   });

    it('should return the filter task list', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        await component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters.length).toEqual(3);
            expect(component.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(component.filters[1].name).toEqual('FakeMyTasks1');
            expect(component.filters[2].name).toEqual('FakeMyTasks2');
        });

        component.ngOnChanges({ appId: change });
    });

    it('Should call the API to create the default task filters when no task filters exist', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of([]));
        const filtersMock: any[] = [{ name: 'default-task-filter-1'}, { name: 'default-task-filter-2'}];
        const createDefaultFiltersSpy = spyOn(taskFilterService, 'createDefaultFilters').and.returnValue(of(filtersMock));
        const appId = '2';
        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ appId: change });
        fixture.detectChanges();

        expect(createDefaultFiltersSpy).toHaveBeenCalledWith(appId);
    });

    it('should return the filter task list, filtered By Name', async () => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(of({} as any));
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));

        const change = new SimpleChange(null, 'test', true);

        await component.success.subscribe((res) => {
            const deployApp: any = appsProcessService.getDeployedApplicationsByName;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
        });

        component.ngOnChanges({ appName: change });
    });

    it('should select the task filter based on the input by name param', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));
        component.filterParam = new FilterParamsModel({ name: 'FakeMyTasks1' });

        await component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks1');
        });

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ appId: change });
   });

    it('should select the task filter based on the input by index param', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));
        component.filterParam = new FilterParamsModel({ index: 2 });

        await component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks2');
        });

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ appId: change });
   });

    it('should select the task filter based on the input by id param', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));

        component.filterParam = new FilterParamsModel({ id: 10 });

        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        await component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
        });

        component.ngOnChanges({ appId: change });
   });

    it('should emit the selected filter based on the filterParam input', () => {
        spyOn(component.filterSelected, 'emit');
        component.filters = fakeTaskFilters;

        const filterParam = new FilterParamsModel({ id: 10 });
        const change = new SimpleChange(null, filterParam, true);
        component.filterParam = filterParam;

        component.ngOnChanges({ filterParam: change });

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
        component.ngOnChanges({ appId: change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = null;

        const change = new SimpleChange(undefined, appId, true);
        component.ngOnChanges({ appId: change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should change current filter when filterParam (id) changes', async () => {
        component.filters = fakeTaskFilters;
        component.currentFilter = null;

        const change = new SimpleChange(null, { id: fakeTaskFilters[2].id }, true);
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter.id).toEqual(fakeTaskFilters[2].id);
    });

    it('should change current filter when filterParam (name) changes', async () => {
        component.filters = fakeTaskFilters;
        component.currentFilter = null;

        const change = new SimpleChange(null, { name: fakeTaskFilters[2].name }, true);
        component.ngOnChanges({ filterParam: change });

        await fixture.whenStable();
        expect(component.currentFilter.name).toEqual(fakeTaskFilters[2].name);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

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
        component.ngOnChanges({ appId: change });

        expect(component.getFiltersByAppId).toHaveBeenCalled();
    });

    it('should not change the current filter if no filter with taskid is found', () => {
        const filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        component.filters = fakeTaskFilters;
        component.currentFilter = filter;
        spyOn(taskListService, 'isTaskRelatedToFilter').and.returnValue(of(null));
        component.selectFilterWithTask('111');

        expect(component.currentFilter).toBe(filter);
    });

    it('should attach specific icon for each filter if showIcon is true', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));
        component.showIcon = true;
        const change = new SimpleChange(undefined, 1, true);
        component.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filters.length).toBe(3);
        const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('format_align_left');
        expect(filters[1].nativeElement.innerText).toContain('check_circle');
        expect(filters[2].nativeElement.innerText).toContain('inbox');
    });

    it('should not attach icons for each filter if showIcon is false', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));
        component.showIcon = false;
        const change = new SimpleChange(undefined, 1, true);
        component.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(filters.length).toBe(0);
    });

    it('should reset selection when filterParam is a filter that does not exist', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeTaskFilters));
        component.currentFilter = fakeTaskFilters[0];
        component.filterParam = new FilterRepresentationModel( {name: 'non-existing-filter'});
        const appId = '1';

        const change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ appId: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBe(undefined);
    });

    describe('Display Task Filters', () => {

        it('Should be able to display default task filters', async  () => {
            spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of([]));
            const defaultTaskFiltersMock: any = [
                { name: 'default-my-filter' },
                { name: 'default-involved-filter' },
                { name: 'default-completed-filter' }
            ];
            spyOn(taskFilterService, 'createDefaultFilters').and.returnValue(of(defaultTaskFiltersMock));
            const appId = '2';
            const change = new SimpleChange(null, appId, true);
            component.ngOnChanges({ appId: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const taskFilterOne = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="default-my-filter_filter"]`);
            const taskFilterTwo = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="default-involved-filter_filter"]`);
            const taskFilterThree = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="default-completed-filter_filter"]`);

            expect(taskFilterOne.innerText).toBe('default-my-filter');
            expect(taskFilterTwo.innerText).toBe('default-involved-filter');
            expect(taskFilterThree.innerText).toBe('default-completed-filter');
        });

        it('should set isTaskActive to true when activeRoute includes "tasks"', () => {
            const navigationStartEvent = new NavigationStart(1, 'tasks/123');
            spyOn(router.events, 'pipe').and.returnValue(of(navigationStartEvent));
            fixture.detectChanges();
            expect(component.isTaskActive).toBe(true);
          });

        it('should set isTaskActive to false when activeRoute does not include "tasks"', () => {
            const navigationStartEvent = new NavigationStart(1, 'other-route');
            spyOn(router.events, 'pipe').and.returnValue(of(navigationStartEvent));
            fixture.detectChanges();
            expect(component.isTaskActive).toBe(false);
        });
    });
});
