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

    const mockErrorFilterList = {
        error: 'wrong request'
    };

    let component: ProcessFiltersCloudComponent;
    let fixture: ComponentFixture<ProcessFiltersCloudComponent>;

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
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should attach specific icon for each filter if hasIcon is true', async(() => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));
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
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

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
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));
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

    it('should emit an error with a bad response', async (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(throwError(mockErrorFilterList));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should emit success with the filters when filters are loaded', async (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters[0].name).toEqual('FakeAllProcesses');
            expect(component.filters[1].name).toEqual('FakeRunningProcesses');
            expect(component.filters[2].name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should select the first filter as default', async(() => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });

        component.success.subscribe(() => {
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeAllProcesses');
        });

    }));

    it('should select the filter based on the input by name param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

        component.filterParam = { name: 'FakeRunningProcesses' };
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.filterSelected.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeRunningProcesses');
            done();
        });

        fixture.detectChanges();
        component.ngOnChanges({ 'appName': change });
   });

    it('should select the filter based on the input by key param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

        component.filterParam = { key: 'completed-processes' };
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        fixture.detectChanges();

        component.filterSelected.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
   });

    it('should select the filter based on the input by index param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

        component.filterParam = { index: 2 };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        fixture.detectChanges();

        component.filterSelected.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
   });

    it('should select the filter based on the input by id param', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

        component.filterParam = { id: '12' };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        fixture.detectChanges();

        component.filterSelected.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeCompletedProcesses');
            done();
        });

        component.ngOnChanges({ 'appName': change });
    });

    it('should filterClicked emit when a filter is clicked from the UI', (done) => {
        spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));

        component.filterParam = { id: '10' };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();

        component.filterClicked.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeAllProcesses');
            done();
        });

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${mockProcessFilters[0].key}_filter"]`);
        filterButton.click();
    });

    it('should not emit a filter click event on binding changes', () => {
        spyOn(component, 'selectFilterAndEmit').and.callThrough();

        const change = new SimpleChange(null, undefined, false);
        component.ngOnChanges({ 'filterParam': change });
        fixture.detectChanges();

        expect(component.selectFilterAndEmit).toHaveBeenCalled();
        expect(component.currentFilter).not.toBeDefined();
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
        component.filters = mockProcessFilters;
        component.currentFilter = null;

        fixture.whenStable().then(() => {
            expect(component.currentFilter.name).toEqual(mockProcessFilters[2].name);
        });

        const change = new SimpleChange(null, { name: mockProcessFilters[2].name }, true);
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
        const filter = mockProcessFilters[1];
        component.filters = mockProcessFilters;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter({ id: filter.id });
        expect(component.getCurrentFilter()).toBe(filter);
    });
});
