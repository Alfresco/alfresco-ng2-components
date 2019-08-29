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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { AppsProcessService } from '@alfresco/adf-core';
import { from } from 'rxjs';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessFilterService } from '../services/process-filter.service';
import { ProcessFiltersComponent } from './process-filters.component';
import { CoreModule, setupTestBed } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('ProcessFiltersComponent', () => {

    let filterList: ProcessFiltersComponent;
    let fixture: ComponentFixture<ProcessFiltersComponent>;
    let processFilterService: ProcessFilterService;
    let appsProcessService: AppsProcessService;
    let fakeGlobalFilterPromise;
    let mockErrorFilterPromise;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [ProcessFiltersComponent],
        providers: [AppsProcessService, ProcessFilterService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessFiltersComponent);
        filterList = fixture.componentInstance;

        fakeGlobalFilterPromise = Promise.resolve([
            new FilterProcessRepresentationModel({
                id: 10,
                name: 'FakeInvolvedTasks',
                icon: 'glyphicon-th',
                filter: { state: 'open', assignment: 'fake-involved' }
            }),
            new FilterProcessRepresentationModel({
                id: 20,
                name: 'FakeMyTasks',
                icon: 'glyphicon-random',
                filter: { state: 'open', assignment: 'fake-assignee' }
            }),
            new FilterProcessRepresentationModel({
                id: 30,
                name: 'Running',
                icon: 'glyphicon-ok-sign',
                filter: { state: 'open', assignment: 'fake-running' }
            })
        ]);

        mockErrorFilterPromise = Promise.reject({
            error: 'wrong request'
        });

        processFilterService = TestBed.get(ProcessFilterService);
        appsProcessService = TestBed.get(AppsProcessService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should return the filter task list', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);
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

        fixture.detectChanges();
    });

    it('should select the Running process filter', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.currentFilter).toBeUndefined();

        filterList.success.subscribe(() => {
            filterList.selectRunningFilter();
            expect(filterList.currentFilter.name).toEqual('Running');
            done();
        });

        fixture.detectChanges();
    });

    it('should emit an event when a filter is selected', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.currentFilter).toBeUndefined();

        filterList.filterSelected.subscribe((filter) => {
            expect(filter.name).toEqual('FakeInvolvedTasks');
            done();
        });

        fixture.detectChanges();
        filterList.selectRunningFilter();
    });

    it('should return the filter task list, filtered By Name', (done) => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(Promise.resolve({ id: 1 })));
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));

        const change = new SimpleChange(null, 'test', true);
        filterList.ngOnChanges({ 'appName': change });

        filterList.success.subscribe((res) => {
            const deployApp: any = appsProcessService.getDeployedApplicationsByName;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        fixture.detectChanges();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(mockErrorFilterPromise));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        filterList.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        fixture.detectChanges();
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(mockErrorFilterPromise));

        const appId = 'fake-app';
        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appName': change });

        filterList.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        fixture.detectChanges();
    });

    it('should emit an event when a filter is selected', (done) => {
        const currentFilter = new FilterProcessRepresentationModel({
            id: 10,
            name: 'FakeInvolvedTasks',
            filter: { state: 'open', assignment: 'fake-involved' }
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

        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();
        const appId = null;

        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ 'appId': change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        filterList.ngOnChanges({ 'appName': change });

        expect(filterList.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        const filter = new FilterProcessRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        expect(filterList.currentFilter).toBeUndefined();
        filterList.selectFilter(filter);
        expect(filterList.getCurrentFilter()).toBe(filter);
    });

    it('should select the filter passed as input by id', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterProcessRepresentationModel({ id: 20 });

        const appId = 1;
        const change = new SimpleChange(null, appId, true);

        filterList.ngOnChanges({ 'appId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(3);
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeMyTasks');
            done();
        });
    });

    it('should select the filter passed as input by name', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterProcessRepresentationModel({ name: 'FakeMyTasks' });

        const appId = 1;
        const change = new SimpleChange(null, appId, true);

        filterList.ngOnChanges({ 'appId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(3);
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeMyTasks');
            done();
        });
    });

    it('should select first filter if filterParam is empty', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));

        filterList.filterParam = new FilterProcessRepresentationModel({});

        const appId = 1;
        const change = new SimpleChange(null, appId, true);

        filterList.ngOnChanges({ 'appId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(3);
            expect(filterList.currentFilter).toBeDefined();
            expect(filterList.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });
    });

    it('should attach specific icon for each filter if hasIcon is true', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        filterList.showIcon = true;
        const change = new SimpleChange(undefined, 1, true);
        filterList.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(filterList.filters.length).toBe(3);
            const filters: any = fixture.debugElement.queryAll(By.css('.adf-filters__entry-icon'));
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('dashboard');
            expect(filters[1].nativeElement.innerText).toContain('shuffle');
            expect(filters[2].nativeElement.innerText).toContain('check_circle');
            done();
        });
    });

    it('should not attach icons for each filter if hasIcon is false', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(fakeGlobalFilterPromise));
        filterList.showIcon = false;
        const change = new SimpleChange(undefined, 1, true);
        filterList.ngOnChanges({ 'appId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const filters: any = fixture.debugElement.queryAll(By.css('.adf-filters__entry-icon'));
            expect(filters.length).toBe(0);
            done();
        });
    });
});
