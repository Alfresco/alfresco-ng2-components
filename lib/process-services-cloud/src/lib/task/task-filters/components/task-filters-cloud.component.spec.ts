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
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { fakeGlobalFilter, defaultTaskFiltersMock, taskNotifications } from '../mock/task-filters-cloud.mock';

describe('TaskFiltersCloudComponent', () => {
    let taskFilterService: TaskFilterCloudService;
    let appConfigService: AppConfigService;

    let component: TaskFiltersCloudComponent;
    let fixture: ComponentFixture<TaskFiltersCloudComponent>;
    let getTaskFilterCounterSpy: jasmine.Spy;
    let getTaskListFiltersSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule,
            TaskFiltersCloudModule
        ],
        providers: [
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        taskFilterService = TestBed.inject(TaskFilterCloudService);
        getTaskFilterCounterSpy = spyOn(taskFilterService, 'getTaskFilterCounter').and.returnValue(of(11));
        spyOn(taskFilterService, 'getTaskNotificationSubscription').and.returnValue(of(taskNotifications));
        getTaskListFiltersSpy = spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeGlobalFilter));

        appConfigService = TestBed.inject(AppConfigService);

        fixture = TestBed.createComponent(TaskFiltersCloudComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should attach specific icon for each filter if hasIcon is true', async () => {
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filters.length).toBe(3);

        const filters = fixture.nativeElement.querySelectorAll('.adf-icon');
        expect(filters.length).toBe(3);
        expect(filters[0].innerText).toContain('adjust');
        expect(filters[1].innerText).toContain('done');
        expect(filters[2].innerText).toContain('inbox');
    });

    it('should not attach icons for each filter if hasIcon is false', async () => {
        component.showIcons = false;
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(filters.length).toBe(0);
    });

    it('should display the filters', async () => {
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));

        expect(component.filters.length).toBe(3);
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
        expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
        expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
    });

    it('should emit an error with a bad response', (done) => {
        const mockErrorFilterList = {
            error: 'wrong request'
        };
        getTaskListFiltersSpy.and.returnValue(throwError(mockErrorFilterList));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        component.ngOnChanges({ appName: change });
    });

    it('should display the task filters', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));
        expect(component.filters).toEqual(fakeGlobalFilter);
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
        expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
        expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
    });

    it('should not select any filter as default', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ appName: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeUndefined();
    });

    it('should select the task filter based on the input by name param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { name: 'FakeMyTasks2' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
    });

    it('should not select any task filter if filter input does not exist', async () => {
        const change = new SimpleChange(null, { name: 'nonexistentFilter' }, true);
        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBeUndefined();
    });

    it('should select the task filter based on the input by index param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { index: 2 }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
    });

    it('should select the task filter based on the input by id param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { id: '12' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
    });

    it('should select the task filter based on the input by key param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { key: 'fake-my-task2' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
    });

    it('should filterClicked emit when a filter is clicked from the UI', async () => {
        spyOn(component.filterClicked, 'emit');

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].key}_filter"]`);
        filterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filterClicked.emit).toHaveBeenCalledWith(fakeGlobalFilter[0]);
    });

    it('should not emit a filter clicked event when a filter is selected through the filterParam input (filterClicked emits only through a UI click action)', async () => {
        const filterClickedSpy = spyOn(component.filterClicked, 'emit');
        const change = new SimpleChange(null, { id: '10' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBe(fakeGlobalFilter[0]);
        expect(filterClickedSpy).not.toHaveBeenCalled();
    });

    it('should reset the filter when the param is undefined', () => {
        const change = new SimpleChange(fakeGlobalFilter[0], undefined, false);
        component.currentFilter = fakeGlobalFilter[0];
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(undefined);
    });

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should display filter counter if property set to true', async () => {
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const filterCounters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry-counter'));
        expect(component.filters.length).toBe(3);
        expect(filterCounters.length).toBe(1);
        expect(filterCounters[0].nativeElement.innerText).toContain('11');
    });

    it('should update filter counter when notification received', () => {
        component.appName = 'my-app-1';
        component.showIcons = true;
        fixture.detectChanges();

        const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
        expect(updatedFilterCounters.length).toBe(1);
        expect(Object.keys(component.counters$).length).toBe(1);
        expect(component.counters$['fake-involved-tasks']).toBeDefined();
    });

    it('should not update filter counter when notifications are disabled from app.config.json', fakeAsync(() => {
        spyOn(appConfigService, 'get').and.returnValue(false);
        component.appName = 'my-app-1';
        component.showIcons = true;
        fixture.detectChanges();

        const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
        expect(updatedFilterCounters.length).toBe(0);
    }));

    it('should reset filter counter notification when filter is selected', () => {
        spyOn(appConfigService, 'get').and.returnValue(true);
        const change = new SimpleChange(null, { key: fakeGlobalFilter[0].key }, true);
        component.appName = 'my-app-1';
        component.showIcons = true;
        fixture.detectChanges();

        let updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
        expect(updatedFilterCounters.length).toBe(1);

        component.filters = fakeGlobalFilter;
        component.currentFilter = null;

        component.ngOnChanges({ filterParam: change });
        fixture.detectChanges();

        updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
        expect(updatedFilterCounters.length).toBe(0);
    });

    it('should update filter counter when filter is selected', () => {
        component.appName = 'my-app-1';
        component.showIcons = true;
        fixture.detectChanges();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].key}_filter"]`);
        filterButton.click();

        fixture.detectChanges();
        expect(getTaskFilterCounterSpy).toHaveBeenCalledWith(fakeGlobalFilter[0]);
    });

    describe('Highlight Selected Filter', () => {

        const assignedTasksFilterKey = defaultTaskFiltersMock[1].key;
        const queuedTasksFilterKey = defaultTaskFiltersMock[0].key;
        const completedTasksFilterKey = defaultTaskFiltersMock[2].key;

        const getActiveFilterElement = (filterKey: string): Element => {
            const activeFilter = fixture.debugElement.query(By.css(`.adf-active`));
            return activeFilter.nativeElement.querySelector(`[data-automation-id="${filterKey}_filter"]`);
        };

        const clickOnFilter = async (filterKey: string) => {
            fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${filterKey}_filter"]`).click();
            fixture.detectChanges();
            await fixture.whenStable();
        };

        it('Should highlight task filter on filter click', async () => {
            getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
            component.appName = 'mock-app-name';
            const appNameChange = new SimpleChange(null, 'mock-app-name', true);
            component.ngOnChanges({ appName: appNameChange });
            fixture.detectChanges();
            await fixture.whenStable();

            await clickOnFilter(assignedTasksFilterKey);

            expect(getActiveFilterElement(assignedTasksFilterKey)).toBeDefined();
            expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

            await clickOnFilter(queuedTasksFilterKey);

            expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(queuedTasksFilterKey)).toBeDefined();
            expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

            await clickOnFilter(completedTasksFilterKey);

            expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedTasksFilterKey)).toBeDefined();
        });

        it('Should highlight task filter when filterParam input changed', async () => {
            getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
            fixture.detectChanges();

            component.ngOnChanges({ filterParam: new SimpleChange(null, { key: assignedTasksFilterKey }, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getActiveFilterElement(assignedTasksFilterKey)).toBeDefined();
            expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

            component.ngOnChanges({ filterParam: new SimpleChange(null, { key: queuedTasksFilterKey }, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(queuedTasksFilterKey)).toBeDefined();
            expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

            component.ngOnChanges({ filterParam: new SimpleChange(null, { key: completedTasksFilterKey }, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedTasksFilterKey)).toBeDefined();
        });
    });
});
