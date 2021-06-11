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
        expect(filters[1].innerText).toContain('done');
        expect(filters[2].innerText).toContain('inbox');
    });

    it('should not attach icons for each filter if hasIcon is false', async () => {
        component.showIcons = false;
        const change = new SimpleChange(undefined, 'my-app-1', true);
        component.ngOnChanges({'appName': change});

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

        const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));
        expect(component.filters.length).toBe(3);
        expect(filters.length).toBe(3);
        expect(filters[0].nativeElement.innerText).toContain('FakeServiceTasks');
        expect(filters[1].nativeElement.innerText).toContain('FakeMyServiceTasks1');
        expect(filters[2].nativeElement.innerText).toContain('FakeMyServiceTasks2');
    });

    it('should emit an error with a bad response', (done) => {
        const mockErrorFilterList = {
            error: 'wrong request'
        };
        getTaskListFiltersSpy.and.returnValue(throwError(mockErrorFilterList));

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        component.ngOnChanges({'appName': change});
        fixture.detectChanges();
    });

    it('should return the filter task list', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filters).toBeDefined();
        expect(component.filters.length).toEqual(3);
    });

    it('should return the filter task list, filtered By Name', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filters).toBeDefined();
        expect(component.filters[0].name).toEqual('FakeServiceTasks');
        expect(component.filters[1].name).toEqual('FakeMyServiceTasks1');
        expect(component.filters[2].name).toEqual('FakeMyServiceTasks2');
    });

    it('should select the first service task filter as default', async () => {
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeDefined();
        expect(component.currentFilter.name).toEqual('FakeServiceTasks');
    });

    it('should select the task filter based on the input by name param', async () => {
        component.filterParam = { name: 'FakeMyServiceTasks1' };
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeDefined();
        expect(component.currentFilter.name).toEqual('FakeMyServiceTasks1');
    });

    it('should select the default task filter if filter input does not exist', async () => {
        component.filterParam = { name: 'UnexistableFilter' };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeDefined('current filter not found');
        expect(component.currentFilter.name).toEqual('FakeServiceTasks');
    });

    it('should select the task filter based on the input by index param', async () => {
        component.filterParam = { index: 2 };

        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeDefined();
        expect(component.currentFilter.name).toEqual('FakeMyServiceTasks2');
    });

    it('should select the task filter based on the input by id param', async () => {
        component.filterParam = { id: '12' };
        const appName = 'my-app-1';
        const change = new SimpleChange(null, appName, true);

        component.ngOnChanges({ 'appName': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBeDefined();
        expect(component.currentFilter.name).toEqual('FakeMyServiceTasks2');
    });

    it('should emit the selected filter based on the filterParam input', async () => {
        spyOn(component.filterSelected, 'emit');

        const filterParam = { id: '10' };
        const change = new SimpleChange(null, filterParam, true);
        component.filterParam = filterParam;

        component.ngOnChanges({ 'filterParam': change });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filterSelected.emit).toHaveBeenCalledWith(fakeGlobalServiceFilters[0]);
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

    it('should reset the filter when the param is undefined', async () => {
        component.currentFilter = null;

        const filterName = undefined;
        const change = new SimpleChange(null, filterName, false);
        component.ngOnChanges({ 'filterParam': change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.currentFilter).toBe(fakeGlobalServiceFilters[0]);
    });

    it('should reload filters by appName on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'my-app-1';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFilters).toHaveBeenCalledWith(appName);
    });

    it('should change current filter when filterParam (name) changes', () => {
        component.filters = fakeGlobalServiceFilters;
        component.currentFilter = null;

        const name = fakeGlobalServiceFilters[1].name;
        const change = new SimpleChange(null, { name }, true);

        component.ngOnChanges({ 'filterParam': change });

        expect(component.currentFilter).toBeDefined('current filter not found');
        expect(component.currentFilter.name).toEqual(name);
    });

    it('should change current filter when filterParam (key) changes', () => {
        component.filters = fakeGlobalServiceFilters;
        component.currentFilter = null;

        const key = fakeGlobalServiceFilters[2].key;
        const change = new SimpleChange(null, { key }, true);

        component.ngOnChanges({ 'filterParam': change });

        expect(component.currentFilter.key).toEqual(key);
    });

    it('should change current filter when filterParam (index) changes', () => {
        component.filters = fakeGlobalServiceFilters;
        component.currentFilter = null;

        const change = new SimpleChange(null, { index: 1 }, true);
        component.ngOnChanges({ 'filterParam': change });

        expect(component.currentFilter.name).toEqual(fakeGlobalServiceFilters[1].name);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFilters').and.stub();
        const appName = 'fake-app-name';

        const change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

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
