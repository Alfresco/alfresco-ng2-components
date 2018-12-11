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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { from, Observable } from 'rxjs';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFiltersCloudComponent } from './process-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { ProcessCloudModule } from '../process-cloud.module';

describe('ProcessFiltersCloudComponent', () => {

    let processFilterService: ProcessFilterCloudService;

    let fakeGlobalFilter = [
        new ProcessFilterCloudModel({
            name: 'FakeAllProcesses',
            icon: 'adjust',
            id: '10',
            state: ''
        }),
        new ProcessFilterCloudModel({
            name: 'FakeRunningProcesses',
            icon: 'inbox',
            id: '11',
            state: 'RUNNING'
        }),
        new ProcessFilterCloudModel({
            name: 'FakeCompletedProcesses',
            key: 'completed-processes',
            icon: 'done',
            id: '12',
            state: 'COMPLETED'
        })
    ];

    let fakeGlobalFilterObservable =
        new Observable(function(observer) {
            observer.next(fakeGlobalFilter);
            observer.complete();
        });

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

    let component: ProcessFiltersCloudComponent;
    let fixture: ComponentFixture<ProcessFiltersCloudComponent>;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, ProcessCloudModule],
        providers: [ProcessFilterCloudService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessFiltersCloudComponent);
        component = fixture.componentInstance;

        processFilterService = TestBed.get(ProcessFilterCloudService);
    });

    it('should attach specific icon for each filter if hasIcon is true', async(() => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);
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
            expect(filters[1].innerText).toContain('inbox');
            expect(filters[2].innerText).toContain('done');
        });
    }));

    it('should not attach icons for each filter if hasIcon is false', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));

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
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);
        let change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
        component.showIcons = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let filters = fixture.debugElement.queryAll(By.css('mat-list-item[class*="adf-filters__entry"]'));
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
        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({'appName': change});

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('should emit success with the filters when filters are loaded', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
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
        let change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeAllProcesses');
        });

    }));

    it('should be able to fetch and select the default filters if the input filter is not valid', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalEmptyFilterPromise));
        spyOn(component, 'createFilters').and.callThrough();

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.createFilters).not.toHaveBeenCalled();
            done();
        });
    });

    it('should select the filter based on the input by name param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new ProcessFilterCloudModel({ name: 'FakeRunningProcesses' });
        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

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

        component.filterParam = new ProcessFilterCloudModel({ key: 'completed-processes' });
        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });

    });

    it('should select the default filter if filter input does not exist', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new ProcessFilterCloudModel({ name: 'UnexistableFilter' });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);

        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeAllProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });

    });

    it('should select the filter based on the input by index param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(fakeGlobalFilterObservable);

        component.filterParam = new ProcessFilterCloudModel({ index: 2 });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
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

        component.filterParam = new ProcessFilterCloudModel({ id: '12' });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
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

        component.filterParam = new ProcessFilterCloudModel({ id: '10' });

        const appName = 'my-app-1';
        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();

        component.filterClick.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeRunningProcesses');
            done();
        });

        let filterButton = fixture.debugElement.nativeElement.querySelector('span[data-automation-id="FakeRunningProcesses_filter"]');
        filterButton.click();
    });

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should not reload filters by appName null on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = null;

        let change = new SimpleChange(undefined, appName, true);
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

        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        let filter = fakeGlobalFilter[1];
        component.filters = fakeGlobalFilter;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(<ProcessFilterCloudModel> {id: filter.id});
        expect(component.getCurrentFilter()).toBe(filter);
    });
});
