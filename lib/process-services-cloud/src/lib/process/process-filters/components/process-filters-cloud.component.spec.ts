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
        component.ngOnChanges({'appName': change});

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
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(filters.length).toBe(0);
    });

    it('should display the filters', async () => {
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const filters = fixture.debugElement.queryAll(By.css('.adf-filters__entry'));
        expect(component.filters.length).toBe(3);
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('FakeAllProcesses');
        expect(filters[1].nativeElement.innerText).toContain('FakeRunningProcesses');
        expect(filters[2].nativeElement.innerText).toContain('FakeCompletedProcesses');
    });

    it('should emit an error with a bad response', (done) => {
        const mockErrorFilterList = {
            error: 'wrong request'
        };
        getProcessFiltersSpy.and.returnValue(throwError(mockErrorFilterList));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
    });

    it('should emit success with the filters when filters are loaded', async () => {
        const successSpy = spyOn(component.success, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });
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

        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeUndefined();
    });

    it('should select the filter based on the input by name param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.filterParam = { name: 'FakeRunningProcesses' };
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(mockProcessFilters[1]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[1]);
   });

    it('should select the filter based on the input by key param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.filterParam = { key: 'completed-processes' };
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(mockProcessFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[2]);
   });

    it('should select the filter based on the input by index param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.filterParam = { index: 2 };
        component.ngOnChanges({ 'appName': change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(mockProcessFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[2]);
   });

    it('should select the filter based on the input by id param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.filterParam = { id: '12' };
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(mockProcessFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(mockProcessFilters[2]);
    });

    it('should filterClicked emit when a filter is clicked from the UI', async () => {
        const filterClickedSpy = spyOn(component.filterClicked, 'emit');
        component.filterParam = { id: '10' };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${mockProcessFilters[0].key}_filter"]`);
        filterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(mockProcessFilters[0]);
        expect(filterClickedSpy).toHaveBeenCalledWith(mockProcessFilters[0]);
    });

    it('should reset the filter when the param is undefined', async () => {
        const change = new SimpleChange(mockProcessFilters[0], undefined, false);
        component.currentFilter = mockProcessFilters[0];
        component.ngOnChanges({ 'filterParam': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(undefined);
    });

    it('should not emit a filter clicked event when a filter is selected through the filterParam input (filterClicked emits only through a UI click action)', () => {
        const filterClickedSpy = spyOn(component.filterClicked, 'emit');
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);
        component.filterParam = { id: '10' };

        component.ngOnChanges({ 'filterParam': change });
        fixture.detectChanges();

        expect(component.currentFilter).toBe(mockProcessFilters[0]);
        expect(filterClickedSpy).not.toHaveBeenCalled();
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
