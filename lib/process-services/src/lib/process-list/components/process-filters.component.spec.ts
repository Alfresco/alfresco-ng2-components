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
import { from, of, throwError } from 'rxjs';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { ProcessFilterService } from '../services/process-filter.service';
import { ProcessFiltersComponent } from './process-filters.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { fakeProcessFilters } from '../../mock/process/process-filters.mock';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessInstanceFilterRepresentation, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';

describe('ProcessFiltersComponent', () => {

    let filterList: ProcessFiltersComponent;
    let fixture: ComponentFixture<ProcessFiltersComponent>;
    let processFilterService: ProcessFilterService;
    let appsProcessService: AppsProcessService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ProcessTestingModule,
                RouterTestingModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(ProcessFiltersComponent);
        filterList = fixture.componentInstance;
        processFilterService = TestBed.inject(ProcessFilterService);
        appsProcessService = TestBed.inject(AppsProcessService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should return the filter task list', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        let lastValue: ProcessInstanceFilterRepresentation[];
        filterList.success.subscribe((res) => lastValue = res);

        spyOn(filterList, 'getFiltersByAppId').and.callThrough();

        filterList.ngOnChanges({ appId: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(filterList.getFiltersByAppId).toHaveBeenCalled();

        expect(lastValue).toBeDefined();
        expect(lastValue).toEqual(filterList.filters);
        expect(filterList.filters).toBeDefined();
        expect(filterList.filters.length).toEqual(3);
        expect(filterList.filters[0].name).toEqual('FakeCompleted');
        expect(filterList.filters[1].name).toEqual('FakeAll');
        expect(filterList.filters[2].name).toEqual('Running');
    });

    it('should select the Running process filter', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        filterList.ngOnChanges({ appId: change });

        fixture.detectChanges();
        await fixture.whenStable();

        filterList.selectRunningFilter();
        expect(filterList.currentFilter.name).toEqual('Running');
    });

    it('should emit the selected filter based on the filterParam input', async () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));
        filterList.filterParam = new FilterProcessRepresentationModel({ id: 10 });
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        let lastValue: UserProcessInstanceFilterRepresentation;
        filterList.filterSelected.subscribe((filter) => lastValue = filter);

        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(lastValue.name).toEqual('FakeCompleted');
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

    it('should return the filter task list, filtered By Name', () => {
        const deployApp = spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(from(Promise.resolve({ id: 1 })));
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        const change = new SimpleChange(null, 'test', true);
        filterList.ngOnChanges({ appName: change });

        fixture.detectChanges();
        expect(deployApp.calls.count()).toEqual(1);
    });

    it('should emit an error with a bad response of getProcessFilters', () => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(throwError('error'));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        let lastValue: any;
        filterList.error.subscribe((err) => lastValue = err);

        filterList.ngOnChanges({ appId: change });

        expect(lastValue).toBeDefined();
    });

    it('should emit an error with a bad response of getDeployedApplicationsByName', () => {
        spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(throwError('wrong request'));

        const appId = 'fake-app';
        const change = new SimpleChange(null, appId, true);

        let lastValue: any;
        filterList.error.subscribe((err) => lastValue = err);

        filterList.ngOnChanges({ appName: change });

        fixture.detectChanges();
        expect(lastValue).toBeDefined();
    });

    it('should emit an event when a filter is selected', async () => {
        const currentFilter = new FilterProcessRepresentationModel({
            id: 10,
            name: 'FakeCompleted',
            filter: { state: 'open', assignment: 'fake-involved' }
        });

        let lastValue: UserProcessInstanceFilterRepresentation;
        filterList.filterClicked.subscribe((filter) => lastValue = filter);

        filterList.selectFilter(currentFilter);
        expect(lastValue).toBeDefined();
        expect(lastValue).toEqual(currentFilter);
        expect(filterList.currentFilter).toEqual(currentFilter);
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

    it('should set isProcessActive to true when activeRoute includes "processes"', () => {
        const navigationStartEvent = new NavigationStart(1, 'processes/123');
        spyOn(router.events, 'pipe').and.returnValue(of(navigationStartEvent));
        fixture.detectChanges();
        expect(filterList.isProcessActive).toBe(true);
    });

    it('should set isProcessActive to false when activeRoute does not include "processes"', () => {
        const navigationStartEvent = new NavigationStart(1, 'other-route');
        spyOn(router.events, 'pipe').and.returnValue(of(navigationStartEvent));
        fixture.detectChanges();
        expect(filterList.isProcessActive).toBe(false);
    });
});
