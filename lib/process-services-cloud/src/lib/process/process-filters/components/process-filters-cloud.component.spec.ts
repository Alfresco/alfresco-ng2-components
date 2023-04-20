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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFiltersCloudComponent } from './process-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { ProcessFiltersCloudModule } from '../process-filters-cloud.module';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TranslateModule } from '@ngx-translate/core';
import { mockProcessFilters } from '../mock/process-filters-cloud.mock';

describe('ProcessFiltersCloudComponent', () => {
    let processFilterService: ProcessFilterCloudService;
    let component: ProcessFiltersCloudComponent;
    let fixture: ComponentFixture<ProcessFiltersCloudComponent>;
    let getProcessFiltersSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            ProcessFiltersCloudModule
        ],
        providers: [
            { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessFiltersCloudComponent);
        component = fixture.componentInstance;

        processFilterService = TestBed.inject(ProcessFilterCloudService);
        getProcessFiltersSpy = spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should attach specific icon for each filter if hasIcon is true', async () => {
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({appName: change});

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filters.length).toBe(3);
        const filters = fixture.nativeElement.querySelectorAll('.adf-icon');
        expect(filters.length).toBe(3);
        expect(filters[0].innerText).toContain('adjust');
        expect(filters[1].innerText).toContain('inbox');
        expect(filters[2].innerText).toContain('done');
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
        component.ngOnChanges({appName: change});

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const filters = fixture.debugElement.queryAll(By.css('.adf-process-filters__entry'));
        expect(component.filters.length).toBe(3);
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('FakeAllProcesses');
        expect(filters[1].nativeElement.innerText).toContain('FakeRunningProcesses');
        expect(filters[2].nativeElement.innerText).toContain('FakeCompletedProcesses');
    });

    it('should emit an error with a bad response', async () => {
        const mockErrorFilterList = {
            error: 'wrong request'
        };
        getProcessFiltersSpy.and.returnValue(throwError(mockErrorFilterList));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        await component.error.subscribe((err) => {
            expect(err).toBeDefined();
        });

        component.ngOnChanges({appName: change});
        fixture.detectChanges();
    });

    it('should emit success with the filters when filters are loaded', async () => {
        const successSpy = spyOn(component.success, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ appName: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(successSpy).toHaveBeenCalledWith(mockProcessFilters);
        expect(component.filters).toBeDefined();
        expect(component.filters[0].name).toEqual('FakeAllProcesses');
        expect(component.filters[1].name).toEqual('FakeRunningProcesses');
        expect(component.filters[2].name).toEqual('FakeCompletedProcesses');
    });

    it('should not select any filter as default', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ appName: change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeUndefined();
    });

    it('should not select any process filter if filter input does not exist', async () => {
        const change = new SimpleChange(null, { name: 'nonexistentFilter' }, true);
        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBeUndefined();
    });

    it('should select the filter based on the input by name param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { name: 'FakeRunningProcesses' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(mockProcessFilters[1]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[1]);
   });

    it('should select the filter based on the input by key param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { key: 'completed-processes' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(mockProcessFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[2]);
   });

    it('should select the filter based on the input by index param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { index: 2 }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(mockProcessFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[2]);
   });

    it('should select the filter based on the input by id param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { id: '12' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(mockProcessFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[2]);
    });

    it('should filterClicked emit when a filter is clicked from the UI', async () => {
        const filterClickedSpy = spyOn(component.filterClicked, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${mockProcessFilters[0].key}_filter"]`);
        filterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(mockProcessFilters[0]);
        expect(filterClickedSpy).toHaveBeenCalledWith(mockProcessFilters[0]);
    });

    it('should reset the filter when the param is undefined', () => {
        const change = new SimpleChange(mockProcessFilters[0], undefined, false);
        component.currentFilter = mockProcessFilters[0];
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(undefined);
    });

    it('should not emit a filter clicked event when a filter is selected through the filterParam input (filterClicked emits only through a UI click action)', async () => {
        const filterClickedSpy = spyOn(component.filterClicked, 'emit');
        const change = new SimpleChange(null, { id: '10' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBe(mockProcessFilters[0]);
        expect(filterClickedSpy).not.toHaveBeenCalled();
    });

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should not reload filters by appName null on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = null;

        const change = new SimpleChange(undefined, appName, true);
        component.ngOnChanges({ appName: change });

        expect(component.getFilters).not.toHaveBeenCalledWith(appName);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        const filter = mockProcessFilters[1];
        component.filters = mockProcessFilters;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter({ id: filter.id });
        expect(component.getCurrentFilter()).toBe(filter);
    });

    describe('Highlight Selected Filter', () => {

        const allProcessesFilterKey = mockProcessFilters[0].key;
        const runningProcessesFilterKey = mockProcessFilters[1].key;
        const completedProcessesFilterKey = mockProcessFilters[2].key;

        const getActiveFilterElement = (filterKey: string): Element => {
            const activeFilter = fixture.debugElement.query(By.css(`.adf-active`));
            return activeFilter.nativeElement.querySelector(`[data-automation-id="${filterKey}_filter"]`);
        };

        const clickOnFilter = async (filterKey: string) => {
            fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${filterKey}_filter"]`).click();
            fixture.detectChanges();
            await fixture.whenStable();
        };

        it('should apply active CSS class on filter click', async () => {
            component.appName = 'mock-app-name';
            const appNameChange = new SimpleChange(null, 'mock-app-name', true);
            component.ngOnChanges({ appName: appNameChange });
            fixture.detectChanges();
            await fixture.whenStable();

            await clickOnFilter(allProcessesFilterKey);

            expect(getActiveFilterElement(allProcessesFilterKey)).toBeDefined();
            expect(getActiveFilterElement(runningProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedProcessesFilterKey)).toBeNull();

            await clickOnFilter(runningProcessesFilterKey);

            expect(getActiveFilterElement(allProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(runningProcessesFilterKey)).toBeDefined();
            expect(getActiveFilterElement(completedProcessesFilterKey)).toBeNull();

            await clickOnFilter(completedProcessesFilterKey);

            expect(getActiveFilterElement(allProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(runningProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedProcessesFilterKey)).toBeDefined();
        });

        it('Should apply active CSS class when filterParam input changed', async () => {
            fixture.detectChanges();
            component.ngOnChanges({ filterParam: new SimpleChange(null, { key: allProcessesFilterKey }, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getActiveFilterElement(allProcessesFilterKey)).toBeDefined();
            expect(getActiveFilterElement(runningProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedProcessesFilterKey)).toBeNull();

            component.ngOnChanges({ filterParam: new SimpleChange(null, { key: runningProcessesFilterKey }, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getActiveFilterElement(allProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(runningProcessesFilterKey)).toBeDefined();
            expect(getActiveFilterElement(completedProcessesFilterKey)).toBeNull();

            component.ngOnChanges({ filterParam: new SimpleChange(null, { key: completedProcessesFilterKey }, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getActiveFilterElement(allProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(runningProcessesFilterKey)).toBeNull();
            expect(getActiveFilterElement(completedProcessesFilterKey)).toBeDefined();
        });
    });
});
