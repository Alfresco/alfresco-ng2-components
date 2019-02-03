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
import { from, Observable } from 'rxjs';
import { FilterParamsModel } from '../models/filter-cloud.model';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { fakeGlobalFilter } from '../mock/task-filters-cloud.mock';

describe('TaskFiltersCloudComponent', () => {

    let taskFilterService: TaskFilterCloudService;

    let fakeGlobalFilterObservable =
        new Observable(function(observer) {
            observer.next(fakeGlobalFilter);
            observer.complete();
        });

    let fakeGlobalFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalFilter);
    });

    let mockErrorFilterList = {
        error: 'wrong request'
    };

    let mockErrorFilterPromise = Promise.reject(mockErrorFilterList);

    let component: TaskFiltersCloudComponent;
    let fixture: ComponentFixture<TaskFiltersCloudComponent>;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, TaskFiltersCloudModule],
        providers: [TaskFilterCloudService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFiltersCloudComponent);
        component = fixture.componentInstance;

        taskFilterService = TestBed.get(TaskFilterCloudService);
    });

    it('should attach specific icon for each filter if hasIcon is true', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        let change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.filters.length).toBe(3);
            let filters = fixture.nativeElement.querySelectorAll('.adf-filters__entry-icon');
            expect(filters.length).toBe(3);
            expect(filters[0].innerText).toContain('adjust');
            expect(filters[1].innerText).toContain('done');
            expect(filters[2].innerText).toContain('inbox');
        });
    }));

    it('should not attach icons for each filter if hasIcon is false', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.showIcons = false;
        let change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let filters: any = fixture.debugElement.queryAll(By.css('.adf-filters__entry-icon'));
            expect(filters.length).toBe(0);
            done();
        });
    });

    it('should display the filters', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        let change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let filters = fixture.debugElement.queryAll(By.css('mat-list-item[class*="adf-filters__entry"]'));
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
        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({'appName': change});

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('should return the filter task list', (done) => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
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
        let change = new SimpleChange(null, appName, true);
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
        let change = new SimpleChange(null, appName, true);

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

        component.filterParam = new FilterParamsModel({ name: 'FakeMyTasks1' });
        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

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

        component.filterParam = new FilterParamsModel({ name: 'UnexistableFilter' });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

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

        component.filterParam = new FilterParamsModel({ index: 2 });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

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

        component.filterParam = new FilterParamsModel({ id: 12 });
        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks2');
        });

    }));

    it('should emit an event when a filter is selected', async(() => {
        spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ id: 12 });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        spyOn(component, 'selectFilterAndEmit').and.stub();
        let filterButton = fixture.debugElement.nativeElement.querySelector('span[data-automation-id="fake-my-tast1-filter"]');
        filterButton.click();
        expect(component.selectFilterAndEmit).toHaveBeenCalledWith({id: fakeGlobalFilter[1].id});
    }));

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        let change = new SimpleChange(null, appName, true);
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

        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        let filter = new FilterParamsModel({ name: 'FakeInvolvedTasks' });
        component.filters = fakeGlobalFilter;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(filter);
        expect(component.getCurrentFilter()).toBe(fakeGlobalFilter[0]);
    });
});
