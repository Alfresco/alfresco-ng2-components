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
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { By } from '@angular/platform-browser';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { fakeGlobalServiceFilters } from '../mock/task-filters-cloud.mock';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceTaskFilterCloudService } from '../services/service-task-filter-cloud.service';
import { ServiceTaskFiltersCloudComponent } from './service-task-filters-cloud.component';

describe('ServiceTaskFiltersCloudComponent', () => {
    let serviceTaskFilterCloudService: ServiceTaskFilterCloudService;
    let getTaskListFiltersSpy: jasmine.Spy;

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
        getTaskListFiltersSpy = spyOn(serviceTaskFilterCloudService, 'getTaskListFilters').and.returnValue(of(fakeGlobalServiceFilters));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should attach specific icon for each filter if hasIcon is true', async () => {
        const change = new SimpleChange(undefined, 'my-app-1', true);

        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filters.length).toBe(3);

        const filters = fixture.nativeElement.querySelectorAll('.adf-icon');
        expect(filters.length).toBe(3);
        expect(filters[0].innerText).toContain('adjust');
        expect(filters[1].innerText).toContain('done');
        expect(filters[2].innerText).toContain('inbox');
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

        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        component.showIcons = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));
        expect(component.filters.length).toBe(3);
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('FakeServiceTasks');
        expect(filters[1].nativeElement.innerText).toContain('FakeMyServiceTasks1');
        expect(filters[2].nativeElement.innerText).toContain('FakeMyServiceTasks2');
    });

    it('should emit an error with a bad response', async () => {
        const mockErrorFilterList = {
            error: 'wrong request'
        };
        getTaskListFiltersSpy.and.returnValue(throwError(mockErrorFilterList));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        await component.error.subscribe((err) => {
            expect(err).toBeDefined();
        });

        component.ngOnChanges({ appName: change });
        fixture.detectChanges();
    });

    it('should not select any filter as default', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ appName: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeUndefined();
    });

    it('should select the service task filter based on the input by name param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { name: 'FakeMyServiceTasks1' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalServiceFilters[1]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalServiceFilters[1]);
    });

    it('should not select any service task filter if filter input does not exist', async () => {
        const change = new SimpleChange(null, { name: 'nonexistentFilter' }, true);
        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBeUndefined();
    });

    it('should select the service task filter based on the input by index param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { index: 2 }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toEqual(fakeGlobalServiceFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalServiceFilters[2]);
    });

    it('should select the service task filter based on the input by id param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { id: '12' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalServiceFilters[2]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalServiceFilters[2]);
    });

    it('should select the service task filter based on the input by key param', async () => {
        const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
        const change = new SimpleChange(null, { key: 'fake-involved-tasks' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toEqual(fakeGlobalServiceFilters[0]);
        expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalServiceFilters[0]);
    });

    it('should filterClicked emit when a filter is clicked from the UI', async () => {
        spyOn(component.filterClicked, 'emit');

        fixture.detectChanges();
        await fixture.whenStable();

        const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalServiceFilters[0].key}_filter"]`);
        filterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filterClicked.emit).toHaveBeenCalledWith(fakeGlobalServiceFilters[0]);
    });

    it('should not emit a filter clicked event when a filter is selected through the filterParam input (filterClicked emits only through a UI click action)', async () => {
        const filterClickedSpy = spyOn(component.filterClicked, 'emit');
        const change = new SimpleChange(null, { id: '10' }, true);

        fixture.detectChanges();
        await fixture.whenStable();
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBe(fakeGlobalServiceFilters[0]);
        expect(filterClickedSpy).not.toHaveBeenCalled();
    });

    it('should reset the filter when the param is undefined', () => {
        const change = new SimpleChange(null, undefined, false);
        component.currentFilter = fakeGlobalServiceFilters[0];
        component.ngOnChanges({ filterParam: change });

        expect(component.currentFilter).toBe(undefined);
    });

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ appName: change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        const filter = { name: 'FakeMyServiceTasks2' };
        component.filters = fakeGlobalServiceFilters;

        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(filter);
        expect(component.currentFilter).toBe(fakeGlobalServiceFilters[2]);
    });
});
