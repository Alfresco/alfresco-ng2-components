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
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { FilterParamsModel } from '../models/filter-cloud.model';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { fakeGlobalServiceFilters } from '../mock/task-filters-cloud.mock';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceTaskFilterCloudService } from '../services/service-task-filter-cloud.service';
import { ServiceTaskFiltersCloudComponent } from './service-task-filters-cloud.component';

describe('ServiceTaskFiltersCloudComponent', () => {

    let serviceTaskFilterCloudService: ServiceTaskFilterCloudService;

    const fakeGlobalFilterObservable =
        new Observable(function(observer) {
            observer.next(fakeGlobalServiceFilters);
            observer.complete();
        });

    const fakeGlobalFilterPromise = new Promise(function (resolve) {
        resolve(fakeGlobalServiceFilters);
    });

    const mockErrorFilterList = {
        error: 'wrong request'
    };

    const mockErrorFilterPromise = Promise.reject(mockErrorFilterList);

    let component: ServiceTaskFiltersCloudComponent;
    let fixture: ComponentFixture<ServiceTaskFiltersCloudComponent>;

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
        fixture = TestBed.createComponent(ServiceTaskFiltersCloudComponent);
        component = fixture.componentInstance;

        serviceTaskFilterCloudService = TestBed.inject(ServiceTaskFilterCloudService);
    });

    it('should attach specific icon for each filter if hasIcon is true', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
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
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));

        component.showIcons = false;
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
            expect(filters.length).toBe(0);
            done();
        });
    });

    it('should display the filters', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters = fixture.debugElement.queryAll(By.css('.adf-filters__entry'));
            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeServiceTasks');
            expect(filters[1].nativeElement.innerText).toContain('FakeMyServiceTasks1');
            expect(filters[2].nativeElement.innerText).toContain('FakeMyServiceTasks2');
        });
    }));

    it('should emit an error with a bad response', (done) => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(from(mockErrorFilterPromise));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({'appName': change});

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('should return the filter task list', (done) => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
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
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters[0].name).toEqual('FakeServiceTasks');
            expect(component.filters[1].name).toEqual('FakeMyServiceTasks1');
            expect(component.filters[2].name).toEqual('FakeMyServiceTasks2');
            done();
        });
    });

    it('should select the first filter as default', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeServiceTasks');
        });

    }));

    it('should select the task filter based on the input by name param', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ name: 'FakeMyServiceTasks1' });
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyServiceTasks1');
        });

    }));

    it('should select the default task filter if filter input does not exist', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ name: 'UnexistableFilter' });

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeServiceTasks');
        });

    }));

    it('should select the task filter based on the input by index param', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ index: 2 });

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyServiceTasks2');
        });

    }));

    it('should select the task filter based on the input by id param', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ id: 12 });
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyServiceTasks2');
        });

    }));

    it('should emit an event when a filter is selected', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ id: 12 });

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        spyOn(component, 'selectFilterAndEmit').and.stub();
        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalServiceFilters[1].key}_filter"]`);

        filterButton.click();
        expect(component.selectFilterAndEmit).toHaveBeenCalledWith(fakeGlobalServiceFilters[1]);
    }));

    it('should reset the filter when the param is undefined', async(() => {
        spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(fakeGlobalFilterObservable);
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
        component.filters = fakeGlobalServiceFilters;
        component.currentFilter = null;

        const change = new SimpleChange(null, { name: fakeGlobalServiceFilters[1].name }, true);
        component.ngOnChanges({ 'filterParam': change });

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeGlobalServiceFilters[1].name);
        });
    });

    it('should change current filter when filterParam (key) changes', () => {
        component.filters = fakeGlobalServiceFilters;
        component.currentFilter = null;

        const change = new SimpleChange(null, { key: fakeGlobalServiceFilters[2].key }, true);
        component.ngOnChanges({ 'filterParam': change });

        fixture.whenStable().then(() => {
            expect(component.currentFilter.key).toEqual(fakeGlobalServiceFilters[2].key);
        });
    });

    it('should change current filter when filterParam (index) changes', () => {
        component.filters = fakeGlobalServiceFilters;
        component.currentFilter = null;
        const position = 1;

        const change = new SimpleChange(null, { index: position }, true);
        component.ngOnChanges({ 'filterParam': change });

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeGlobalServiceFilters[position].name);
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
        const filter = new FilterParamsModel({ name: 'FakeMyServiceTasks2' });
        component.filters = fakeGlobalServiceFilters;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(filter);
        expect(component.getCurrentFilter()).toBe(fakeGlobalServiceFilters[2]);
    });
});
