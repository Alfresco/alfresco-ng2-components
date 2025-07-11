/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { from, of, throwError } from 'rxjs';
import { AppsProcessService } from '../../../services/apps-process.service';
import { ProcessFilterService } from '../../services/process-filter.service';
import { ProcessFiltersComponent } from './process-filters.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { ProcessInstanceFilterRepresentation, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

const fakeProcessFilters: UserProcessInstanceFilterRepresentation[] = [
    {
        id: 10,
        name: 'FakeCompleted',
        icon: 'glyphicon-th',
        filter: { state: 'open', assignment: 'fake-involved' }
    },
    {
        id: 20,
        name: 'FakeAll',
        icon: 'glyphicon-random',
        filter: { state: 'open', assignment: 'fake-assignee' }
    },
    {
        id: 30,
        name: 'Running',
        icon: 'glyphicon-ok-sign',
        filter: { state: 'open', assignment: 'fake-running' }
    }
];

describe('ProcessFiltersComponent', () => {
    let filterList: ProcessFiltersComponent;
    let fixture: ComponentFixture<ProcessFiltersComponent>;
    let processFilterService: ProcessFilterService;
    let appsProcessService: AppsProcessService;
    let router: Router;
    let getProcessFiltersSpy: jasmine.Spy;
    let getDeployedApplicationsByNameSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
        });

        processFilterService = TestBed.inject(ProcessFilterService);
        getProcessFiltersSpy = spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(fakeProcessFilters));

        appsProcessService = TestBed.inject(AppsProcessService);
        getDeployedApplicationsByNameSpy = spyOn(appsProcessService, 'getDeployedApplicationsByName').and.returnValue(
            from(Promise.resolve({ id: 1 }))
        );

        router = TestBed.inject(Router);

        fixture = TestBed.createComponent(ProcessFiltersComponent);
        filterList = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should return the filter task list', async () => {
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        let lastValue: ProcessInstanceFilterRepresentation[];
        filterList.success.subscribe((res) => (lastValue = res));

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

    it('should emit the selected filter based on the filterParam input', async () => {
        filterList.filterParam = { id: 10 } as any;
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        let lastValue: UserProcessInstanceFilterRepresentation;
        filterList.filterSelected.subscribe((filter) => (lastValue = filter));

        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(lastValue.name).toEqual('FakeCompleted');
    });

    it('should filterClicked emit when a filter is clicked from the UI', async () => {
        filterList.filters = fakeProcessFilters;
        spyOn(filterList.filterClicked, 'emit');

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeProcessFilters[0].name}_filter"]`);
        filterButton.click();

        expect(filterList.filterClicked.emit).toHaveBeenCalledWith(fakeProcessFilters[0]);
    });

    it('should reset selection when filterParam is a filter that does not exist', async () => {
        const nonExistingFilterParam = { name: 'non-existing-filter' };
        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        filterList.currentFilter = nonExistingFilterParam;
        filterList.filterParam = nonExistingFilterParam as any;

        filterList.ngOnChanges({ appId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(filterList.currentFilter).toBe(undefined);
    });

    it('should return the filter task list, filtered By Name', () => {
        const change = new SimpleChange(null, 'test', true);
        filterList.ngOnChanges({ appName: change });

        fixture.detectChanges();
        expect(getDeployedApplicationsByNameSpy.calls.count()).toEqual(1);
    });

    it('should emit an error with a bad response of getProcessFilters', () => {
        getProcessFiltersSpy.and.returnValue(throwError(() => new Error('error')));

        const appId = '1';
        const change = new SimpleChange(null, appId, true);

        let lastValue: any;
        filterList.error.subscribe((err) => (lastValue = err));

        filterList.ngOnChanges({ appId: change });

        expect(lastValue).toBeDefined();
    });

    it('should emit an error with a bad response of getDeployedApplicationsByName', () => {
        getDeployedApplicationsByNameSpy.and.returnValue(throwError(() => new Error('wrong request')));

        const appId = 'fake-app';
        const change = new SimpleChange(null, appId, true);

        let lastValue: any;
        filterList.error.subscribe((err) => (lastValue = err));

        filterList.ngOnChanges({ appName: change });

        fixture.detectChanges();
        expect(lastValue).toBeDefined();
    });

    it('should emit an event when a filter is selected', async () => {
        const currentFilter: UserProcessInstanceFilterRepresentation = {
            id: 10,
            name: 'FakeCompleted',
            filter: { state: 'open', assignment: 'fake-involved' }
        };

        let lastValue: UserProcessInstanceFilterRepresentation;
        filterList.filterClicked.subscribe((filter) => (lastValue = filter));

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
        const filter: UserProcessInstanceFilterRepresentation = {
            name: 'FakeAll',
            filter: { state: 'open', assignment: 'fake-assignee' }
        };
        expect(filterList.currentFilter).toBeUndefined();
        filterList.selectFilter(filter);
        expect(filterList.getCurrentFilter()).toBe(filter);
    });

    it('should select the filter passed as input by id', async () => {
        filterList.filterParam = { id: 20 } as any;

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
        filterList.filterParam = { name: 'FakeAll' } as any;

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
