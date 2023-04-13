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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { setupTestBed } from '@alfresco/adf-core';
import { from, of } from 'rxjs';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { ProcessFilterService } from '../services/process-filter.service';
import { ProcessFiltersComponent } from './process-filters.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { fakeProcessFilters } from '../../mock/process/process-filters.mock';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessFiltersComponent', () => {

    let filterList: ProcessFiltersComponent;
    let fixture: ComponentFixture<ProcessFiltersComponent>;
    let processFilterService: ProcessFilterService;
    let appsProcessService: AppsProcessService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessFiltersComponent);
        filterList = fixture.componentInstance;
        processFilterService = TestBed.inject(ProcessFilterService);
        appsProcessService = TestBed.inject(AppsProcessService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should return the filter task list', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        await filterList.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(filterList.filters).toBeDefined();
            expect(filterList.filters.length).toEqual(3);
            expect(filterList.filters[0].name).toEqual('FakeCompleted');
            expect(filterList.filters[1].name).toEqual('FakeAll');
            expect(filterList.filters[2].name).toEqual('Running');
        });

        spyOn(filterList, 'getFiltersByAppId').and.callThrough();

        filterList.ngOnChanges({ appId: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(filterList.getFiltersByAppId).toHaveBeenCalled();
    });

    it('should select the Running process filter', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        await filterList.success.subscribe(() => {
            filterList.selectRunningFilter();
            expect(filterList.currentFilter.name).toEqual('Running');
        });

        filterList.ngOnChanges({ appId: change });

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should emit the selected filter based on the filterParam input', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));
        filterList.filterParam = new FilterProcessRepresentationModel({ id: 10 });
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        await filterList.filterSelected.subscribe((filter) => {
            expect(filter.name).toEqual('FakeCompleted');
        });

        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should filterClicked emit when a filter is clicked from the UI', async  () => {
        filterList.filters = fakeProcessFilters;
        spyOn(filterList.filterClicked, 'emit');

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeProcessFilters[0].name}_filter"]`);
        filterButton.click();

        expect(filterList.filterClicked.emit).toHaveBeenCalledWith(fakeProcessFilters[0]);
    });

    it('should reset selection when filterParam is a filter that does not exist', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        const nonExistingFilterParam = { name: 'non-existing-filter' };
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        filterList.currentFilter = nonExistingFilterParam;
        filterList.filterParam = new FilterProcessRepresentationModel(nonExistingFilterParam);

        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(filterList.currentFilter).toBe(undefined);
    });

    it('should return the filter task list, filtered By Name', async () => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(Promise.resolve({ id: 1 })));
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        const change = new SimpleChange(null, 'test', true);
        filterList.ngOnChanges({ appName: change });

        await filterList.success.subscribe((res) => {
            const deployApp: any = appsProcessService.getDeployedApplicationsByName;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
        });

        fixture.detectChanges();
    });

    it('should emit an error with a bad response of getProcessFilters', async () => {
        const mockErrorFilterPromise = Promise.reject({
            error: 'wrong request'
        });
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(from(mockErrorFilterPromise));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ appId: change });

        await filterList.error.subscribe((err) => {
            expect(err).toBeDefined();
        });

        fixture.detectChanges();
    });

    it('should emit an error with a bad response of getDeployedApplicationsByName', async () => {
        const mockErrorFilterPromise = Promise.reject({
            error: 'wrong request'
        });
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(mockErrorFilterPromise));

        const appId = 'fake-app';
        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ appName: change });

        await filterList.error.subscribe((err) => {
            expect(err).toBeDefined();
        });

        fixture.detectChanges();
    });

    it('should emit an event when a filter is selected', async () => {
        const currentFilter = new FilterProcessRepresentationModel({
            id: 10,
            name: 'FakeCompleted',
            filter: { state: 'open', assignment: 'fake-involved' }
        });

        await filterList.filterClicked.subscribe((filter) => {
            expect(filter).toBeDefined();
            expect(filter).toEqual(currentFilter);
            expect(filterList.currentFilter).toEqual(currentFilter);
        });

        filterList.selectFilter(currentFilter);
    });

    it('should reload filters by appId on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();
        const appId = '1';

        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ appId: change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppId').and.stub();
        const appId = null;

        const change = new SimpleChange(null, appId, true);
        filterList.ngOnChanges({ appId: change });

        expect(filterList.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(filterList, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        filterList.ngOnChanges({ appName: change });

        expect(filterList.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        const filter = new FilterProcessRepresentationModel({
            name: 'FakeAll',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        expect(filterList.currentFilter).toBeUndefined();
        filterList.selectFilter(filter);
        expect(filterList.getCurrentFilter()).toBe(filter);
    });

    it('should select the filter passed as input by id', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        filterList.filterParam = new FilterProcessRepresentationModel({ id: 20 });

        const appId = 1;
        const change = new SimpleChange(null, appId, true);

        filterList.ngOnChanges({ appId: change });

        await fixture.whenStable();
        expect(filterList.filters).toBeDefined();
        expect(filterList.filters.length).toEqual(3);
        expect(filterList.currentFilter).toBeDefined();
        expect(filterList.currentFilter.name).toEqual('FakeAll');
    });

    it('should select the filter passed as input by name', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        filterList.filterParam = new FilterProcessRepresentationModel({ name: 'FakeAll' });

        const appId = 1;
        const change = new SimpleChange(null, appId, true);

        filterList.ngOnChanges({ appId: change });

        await fixture.whenStable();
        expect(filterList.filters).toBeDefined();
        expect(filterList.filters.length).toEqual(3);
        expect(filterList.currentFilter).toBeDefined();
        expect(filterList.currentFilter.name).toEqual('FakeAll');
    });

    it('should attach specific icon for each filter if hasIcon is true', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));
        filterList.showIcon = true;
        const change = new SimpleChange(undefined, 1, true);
        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(filterList.filters.length).toBe(3);
        const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('dashboard');
        expect(filters[1].nativeElement.innerText).toContain('shuffle');
        expect(filters[2].nativeElement.innerText).toContain('check_circle');
    });

    it('should not attach icons for each filter if hasIcon is false', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));
        filterList.showIcon = false;
        const change = new SimpleChange(undefined, 1, true);
        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();
        const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(filters.length).toBe(0);
    });
});
