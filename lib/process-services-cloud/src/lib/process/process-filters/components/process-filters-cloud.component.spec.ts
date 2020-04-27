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
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFiltersCloudComponent } from './process-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { ProcessFiltersCloudModule } from '../process-filters-cloud.module';
import { FilterParamsModel } from '../../../task/task-filters/models/filter-cloud.model';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';

describe('ProcessFiltersCloudComponent', () => {

    let processFilterService: ProcessFilterCloudService;

    const fakeGlobalFilter = [
        new ProcessFilterCloudModel({
            name: 'FakeAllProcesses',
            icon: 'adjust',
            id: '10',
            status: ''
        }),
        new ProcessFilterCloudModel({
            name: 'FakeRunningProcesses',
            key: 'FakeRunningProcesses',
            icon: 'inbox',
            id: '11',
            status: 'RUNNING'
        }),
        new ProcessFilterCloudModel({
            name: 'FakeCompletedProcesses',
            key: 'completed-processes',
            icon: 'done',
            id: '12',
            status: 'COMPLETED'
        })
    ];

    const fakeGlobalFilterObservable =
        new Observable(function(observer) {
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

    let component: ProcessFiltersCloudComponent;
    let fixture: ComponentFixture<ProcessFiltersCloudComponent>;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, ProcessFiltersCloudModule],
        providers: [
            ProcessFilterCloudService,
            { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessFiltersCloudComponent);
        component = fixture.componentInstance;

        processFilterService = TestBed.get(ProcessFilterCloudService);
    });

    it('should attach specific icon for each filter if hasIcon is true', async(() => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);
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
            expect(filters[1].innerText).toContain('inbox');
            expect(filters[2].innerText).toContain('done');
        });
    }));

    it('should not attach icons for each filter if hasIcon is false', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));

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
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters = fixture.debugElement.queryAll(By.css('.adf-filters__entry'));
            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeAllProcesses');
            expect(filters[1].nativeElement.innerText).toContain('FakeRunningProcesses');
            expect(filters[2].nativeElement.innerText).toContain('FakeCompletedProcesses');
        });
    }));

    it('should emit an error with a bad response', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(mockErrorFilterPromise));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({'appName': change});

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('should emit success with the filters when filters are loaded', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters[0].name).toEqual('FakeAllProcesses');
            expect(component.filters[1].name).toEqual('FakeRunningProcesses');
            expect(component.filters[2].name).toEqual('FakeCompletedProcesses');
            done();
        });
    });

    it('should select the first filter as default', async(() => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeAllProcesses');
        });

    }));

    it('should select the filter based on the input by name param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ name: 'FakeRunningProcesses' });
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeRunningProcesses');
            done();
        });

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });
   });

    it('should select the filter based on the input by key param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ key: 'completed-processes' });
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
   });

    it('should select the filter based on the input by index param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ index: 2 });

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
   });

    it('should select the filter based on the input by id param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ id: '12' });

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
    });

    it('should emit an event when a filter is selected', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new FilterParamsModel({ id: '10' });

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeAllProcesses');
            done();
        });

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].name}_filter"]`);
        filterButton.click();
    });

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should not reload filters by appName null on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = null;

        const change = new SimpleChange(undefined, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).not.toHaveBeenCalledWith(appName);
    });

    it('should change current filter when filterParam (name) changes', () => {
        component.filters = fakeGlobalFilter;
        component.currentFilter = null;

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(fakeGlobalFilter[2].name);
        });

        const change = new SimpleChange(null, { name: fakeGlobalFilter[2].name }, true);
        component.ngOnChanges({ 'filterParam': change });
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        const filter = fakeGlobalFilter[1];
        component.filters = fakeGlobalFilter;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(<ProcessFilterCloudModel> {id: filter.id});
        expect(component.getCurrentFilter()).toBe(filter);
    });
});
