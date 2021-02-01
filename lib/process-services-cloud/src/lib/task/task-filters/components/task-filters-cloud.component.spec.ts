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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { from, Observable, of } from 'rxjs';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { fakeGlobalFilter, taskNotifications } from '../mock/task-filters-cloud.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('TaskFiltersCloudComponent', () => {

    let taskFilterService: TaskFilterCloudService;

    const fakeGlobalFilterObservable =
        new Observable(function (observer) {
            observer.next(fakeGlobalFilter);
            observer.complete();
        });

    const fakeGlobalFilterPromise = new Promise(function (resolve) {
        resolve(fakeGlobalFilter);
    });

    const mockErrorFilterList = {
        error: 'wrong request'
    };

    const mockErrorFilterPromise = Promise.reject(mockErrorFilterList);

    let component: TaskFiltersCloudComponent;
    let fixture: ComponentFixture<TaskFiltersCloudComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            TaskFiltersCloudModule
        ],
        providers: [
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFiltersCloudComponent);
        component = fixture.componentInstance;

        taskFilterService = TestBed.inject(TaskFilterCloudService);
        spyOn(taskFilterService, 'getTaskFilterCounter').and.returnValue(of(11));
        spyOn(taskFilterService, 'getTaskNotificationSubscription').and.returnValue(of(taskNotifications));
    });

    it('should attach specific icon for each filter if hasIcon is true', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.filters.length).toBe(3);
            const filters = fixture.nativeElement.querySelectorAll('.adf-icon');
            expect(filters.length).toBe(3);
            expect(filters[0].innerText).toContain('adjust');
            expect(filters[1].innerText).toContain('done');
            expect(filters[2].innerText).toContain('inbox');
        });
    }));

    it('should not attach icons for each filter if hasIcon is false', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.showIcons = false;
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
            expect(filters.length).toBe(0);
            done();
        });
    });

    it('should display the filters', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));
            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
            expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
            expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
        });
    }));

    it('should emit an error with a bad response', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(mockErrorFilterPromise));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('should return the filter task list', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters.length).toEqual(3);
            done();
        });
    });

    it('should return the filter task list, filtered By Name', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(component.filters[1].name).toEqual('FakeMyTasks1');
            expect(component.filters[2].name).toEqual('FakeMyTasks2');
            done();
        });
    });

    it('should select the first filter as default', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
        });

    }));

    it('should select the task filter based on the input by name param', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = { name: 'FakeMyTasks1' };
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks1');
        });

    }));

    it('should select the default task filter if filter input does not exist', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = { name: 'UnexistableFilter' };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
        });

    }));

    it('should select the task filter based on the input by index param', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = { index: 2 };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks2');
        });

    }));

    it('should select the task filter based on the input by id param', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = { id: '12' };
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks2');
        });

    }));

    it('should emit the selected filter based on the filterParam input', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        spyOn(component.filterSelected, 'emit');

        const filterParam = { id: '10' };
        const change = new SimpleChange(null, filterParam, true);
        component.filterParam = filterParam;

        component.ngOnChanges({ 'filterParam': change });
        fixture.detectChanges();

        expect(component.filterSelected.emit).toHaveBeenCalledWith(fakeGlobalFilter[0]);
    }));

    it('should filterClicked emit when a filter is clicked from the UI', async () => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        spyOn(component.filterClicked, 'emit');

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].key}_filter"]`);
        filterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filterClicked.emit).toHaveBeenCalledWith(fakeGlobalFilter[0]);
    });

    it('should reset the filter when the param is undefined', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        spyOn(component, 'selectFilterAndEmit');
        component.currentFilter = null;

        const filterName = undefined;
        const change = new SimpleChange(null, filterName, false);
        component.ngOnChanges({ 'filterParam': change });

        fixture.detectChanges();
        expect(component.selectFilterAndEmit).toHaveBeenCalledWith(undefined);
        expect(component.currentFilter).toEqual(undefined);
    }));

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should change current filter when filterParam (name) changes', () => {
        component.filters = fakeGlobalFilter;
        component.currentFilter = null;

        const change = new SimpleChange(null, { name: fakeGlobalFilter[1].name }, true);
        component.ngOnChanges({ 'filterParam': change });

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeGlobalFilter[1].name);
        });
    });

    it('should change current filter when filterParam (key) changes', () => {
        component.filters = fakeGlobalFilter;
        component.currentFilter = null;

        const change = new SimpleChange(null, { key: fakeGlobalFilter[2].key }, true);
        component.ngOnChanges({ 'filterParam': change });

        fixture.whenStable().then(() => {
            expect(component.currentFilter.key).toEqual(fakeGlobalFilter[2].key);
        });
    });

    it('should change current filter when filterParam (index) changes', () => {
        component.filters = fakeGlobalFilter;
        component.currentFilter = null;
        const position = 1;

        const change = new SimpleChange(null, { index: position }, true);
        component.ngOnChanges({ 'filterParam': change });

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeGlobalFilter[position].name);
        });
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        const filter = { name: 'FakeInvolvedTasks' };
        component.filters = fakeGlobalFilter;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(filter);
        expect(component.currentFilter).toBe(fakeGlobalFilter[0]);
    });

    it('should display filter counter if property set to true', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filterCounters = fixture.debugElement.queryAll(By.css('.adf-filter-action-button__counter'));
            expect(component.filters.length).toBe(3);
            expect(filterCounters.length).toBe(1);
            expect(filterCounters[0].nativeElement.innerText).toContain('11');
        });
    }));

    it('should update filter counter when notification received', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(1);
            expect(Object.keys(component.counters$).length).toBe(1);
            expect(component.counters$['fake-involved-tasks']).toBeDefined();
        });
    }));

    it('should reset filter counter notification when filter is selected', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        let change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(1);

            component.filters = fakeGlobalFilter;
            component.currentFilter = null;

            change = new SimpleChange(null, { key: fakeGlobalFilter[0].key }, true);
            component.ngOnChanges({ 'filterParam': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
                expect(updatedFilterCounters.length).toBe(0);
            });
        });
    }));
});
