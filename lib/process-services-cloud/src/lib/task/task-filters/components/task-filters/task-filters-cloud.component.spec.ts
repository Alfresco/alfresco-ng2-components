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

import { AppConfigService, NoopAuthModule } from '@alfresco/adf-core';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { first, of, throwError } from 'rxjs';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../../services/local-preference-cloud.service';
import { defaultTaskFiltersMock, fakeGlobalFilter, taskNotifications } from '../../mock/task-filters-cloud.mock';
import { TaskFilterCloudService } from '../../services/task-filter-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters-cloud.component';
import { TaskListCloudService } from '../../../task-list/services/task-list-cloud.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatActionListItemHarness } from '@angular/material/list/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TaskFilterCloudAdapter } from '../../../../models/filter-cloud-model';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TaskFilterCloudModel } from '../../models/filter-cloud.model';

describe('TaskFiltersCloudComponent', () => {
    let loader: HarnessLoader;
    let taskFilterService: TaskFilterCloudService;
    let taskListService: TaskListCloudService;
    let appConfigService: AppConfigService;

    let component: TaskFiltersCloudComponent;
    let fixture: ComponentFixture<TaskFiltersCloudComponent>;
    let getTaskFilterCounterSpy: jasmine.Spy;
    let getTaskListFiltersSpy: jasmine.Spy;
    let getTaskListCounterSpy: jasmine.Spy;

    const configureTestingModule = (searchApiMethod: 'GET' | 'POST') => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, TaskFiltersCloudComponent, ApolloTestingModule],
            providers: [{ provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }]
        });
        taskFilterService = TestBed.inject(TaskFilterCloudService);
        taskListService = TestBed.inject(TaskListCloudService);
        getTaskFilterCounterSpy = spyOn(taskFilterService, 'getTaskFilterCounter').and.returnValue(of(11));
        getTaskListCounterSpy = spyOn(taskListService, 'getTaskListCounter').and.returnValue(of(11));
        spyOn(taskFilterService, 'getTaskNotificationSubscription').and.returnValue(of(taskNotifications));
        getTaskListFiltersSpy = spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(of(fakeGlobalFilter));

        appConfigService = TestBed.inject(AppConfigService);

        fixture = TestBed.createComponent(TaskFiltersCloudComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        component.searchApiMethod = searchApiMethod;
    };

    afterEach(() => {
        fixture.destroy();
    });

    describe('searchApiMethod set to GET', () => {
        beforeEach(() => {
            configureTestingModule('GET');
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
            expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
            expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
            expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
        });

        it('should display the task filters', async () => {
            const appName = 'my-app-1';
            const change = new SimpleChange(null, appName, true);

            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));
            expect(component.filters).toEqual(fakeGlobalFilter);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
            expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
            expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
        });

        it('should not select any filter as default', async () => {
            const appName = 'my-app-1';
            const change = new SimpleChange(null, appName, true);

            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.currentFilter).toBeUndefined();
        });

        it('should filterClicked emit when a filter is clicked from the UI', async () => {
            spyOn(component.filterClicked, 'emit');

            fixture.detectChanges();
            await fixture.whenStable();

            const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].key}_filter"]`);
            filterButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.filterClicked.emit).toHaveBeenCalledWith(fakeGlobalFilter[0]);
        });

        it('should display filter counter if property set to true', async () => {
            const change = new SimpleChange(undefined, 'my-app-1', true);
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            component.showIcons = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const filterCounters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry-counter'));
            expect(component.filters.length).toBe(3);
            expect(filterCounters.length).toBe(1);
            expect(filterCounters[0].nativeElement.innerText).toContain('11');
        });

        it('should update filter counter when notification received', () => {
            component.appName = 'my-app-1';
            component.showIcons = true;
            fixture.detectChanges();

            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(1);
            expect(Object.keys(component.counters).length).toBe(3);
            expect(component.counters['fake-involved-tasks']).toBeDefined();
        });

        it('should not update filter counter when notifications are disabled from app.config.json', fakeAsync(() => {
            spyOn(appConfigService, 'get').and.returnValue(false);
            component.appName = 'my-app-1';
            component.showIcons = true;
            fixture.detectChanges();

            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(0);
        }));

        it('should reset filter counter notification when filter is selected', () => {
            spyOn(appConfigService, 'get').and.returnValue(true);
            const change = new SimpleChange(null, { key: fakeGlobalFilter[0].key }, true);
            component.appName = 'my-app-1';
            component.showIcons = true;
            fixture.detectChanges();

            let updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(1);

            component.filters = fakeGlobalFilter;
            component.currentFilter = null;

            component.ngOnChanges({ filterParam: change });
            fixture.detectChanges();

            updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(0);
        });

        it('should update filter counter when filter is selected', () => {
            component.appName = 'my-app-1';
            component.showIcons = true;
            fixture.detectChanges();

            const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].key}_filter"]`);
            filterButton.click();

            fixture.detectChanges();
            expect(getTaskFilterCounterSpy).toHaveBeenCalledWith(fakeGlobalFilter[0]);
        });
    });

    describe('searchApiMethod set to POST', () => {
        beforeEach(() => {
            configureTestingModule('POST');
            component.showIcons = true;
            component.appName = 'my-app-1';
        });

        it('should attach specific icon for each filter if hasIcon is true', () => {
            fixture.detectChanges();

            const filters = fixture.nativeElement.querySelectorAll('.adf-icon');

            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].innerText).toContain('adjust');
            expect(filters[1].innerText).toContain('done');
            expect(filters[2].innerText).toContain('inbox');
        });

        it('should not attach icons for each filter if showIcons is false', () => {
            component.showIcons = false;
            fixture.detectChanges();

            const filters: any = fixture.debugElement.queryAll(By.css('.adf-icon'));

            expect(filters.length).toBe(0);
        });

        it('should display the filters', () => {
            fixture.detectChanges();

            const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));

            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
            expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
            expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
        });

        it('should not select any filter as default', () => {
            fixture.detectChanges();

            expect(component.currentFilter).toBeUndefined();
        });

        it('should emit filterClicked when a filter is clicked from the UI', async () => {
            fixture.detectChanges();
            const spy = spyOn(component.filterClicked, 'emit');

            const filterButton = await loader.getHarness(
                MatActionListItemHarness.with({ selector: `[data-automation-id="${fakeGlobalFilter[0].key}_filter"]` })
            );
            await filterButton.click();

            expect(spy).toHaveBeenCalledWith(fakeGlobalFilter[0]);
        });

        it('should display filter counter if property set to true', () => {
            fixture.detectChanges();

            const filterCounters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry-counter'));

            expect(component.filters.length).toBe(3);
            expect(filterCounters.length).toBe(1);
            expect(filterCounters[0].nativeElement.innerText).toContain('11');
        });

        it('should update filter counter when notification received', () => {
            fixture.detectChanges();

            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));

            expect(updatedFilterCounters.length).toBe(1);
            expect(Object.keys(component.counters).length).toBe(3);
            expect(component.counters['fake-involved-tasks']).toBeDefined();
        });

        it('should not update filter counter when notifications are disabled from app.config.json', () => {
            spyOn(appConfigService, 'get').and.returnValue(false);
            fixture.detectChanges();

            expect(fixture.componentInstance.counters).toBeDefined();
            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(0);
        });

        it('should reset filter counter notification when filter is selected', () => {
            fixture.detectChanges();
            spyOn(appConfigService, 'get').and.returnValue(true);
            const change = new SimpleChange(null, { key: fakeGlobalFilter[0].key }, true);

            let updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(1);

            component.filters = fakeGlobalFilter;
            component.currentFilter = null;

            component.ngOnChanges({ filterParam: change });
            fixture.detectChanges();

            updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(0);
        });

        it('should update filter counter when filter is selected', async () => {
            fixture.detectChanges();

            const filterButton = await loader.getHarness(
                MatActionListItemHarness.with({ selector: `[data-automation-id="${fakeGlobalFilter[0].key}_filter"]` })
            );
            await filterButton.click();

            expect(getTaskListCounterSpy).toHaveBeenCalledWith(new TaskFilterCloudAdapter(fakeGlobalFilter[0]));
        });
    });

    describe('API agnostic', () => {
        beforeEach(() => {
            configureTestingModule('GET');
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

            component.ngOnChanges({ appName: change });
        });

        it('should select the task filter based on the input by name param', async () => {
            const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
            const change = new SimpleChange(null, { name: 'FakeMyTasks2' }, true);

            fixture.detectChanges();
            await fixture.whenStable();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should not select any task filter if filter input does not exist', async () => {
            const change = new SimpleChange(null, { name: 'nonexistentFilter' }, true);
            fixture.detectChanges();
            await fixture.whenStable();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toBeUndefined();
        });

        it('should select the task filter based on the input by index param', async () => {
            const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
            const change = new SimpleChange(null, { index: 2 }, true);

            fixture.detectChanges();
            await fixture.whenStable();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should select the task filter based on the input by id param', async () => {
            const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
            const change = new SimpleChange(null, { id: '12' }, true);

            fixture.detectChanges();
            await fixture.whenStable();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should select the task filter based on the input by key param', async () => {
            const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
            const change = new SimpleChange(null, { key: 'fake-my-task2' }, true);

            fixture.detectChanges();
            await fixture.whenStable();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should not emit a filter clicked event when a filter is selected through the filterParam input (filterClicked emits only through a UI click action)', async () => {
            const filterClickedSpy = spyOn(component.filterClicked, 'emit');
            const change = new SimpleChange(null, { id: '10' }, true);

            fixture.detectChanges();
            await fixture.whenStable();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toBe(fakeGlobalFilter[0]);
            expect(filterClickedSpy).not.toHaveBeenCalled();
        });

        it('should reset the filter when the param is undefined', () => {
            const change = new SimpleChange(fakeGlobalFilter[0], undefined, false);
            component.currentFilter = fakeGlobalFilter[0];
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(undefined);
        });

        it('should reload filters by appName on binding changes', () => {
            spyOn(component, 'getFilters').and.stub();
            const appName = 'my-app-1';

            const change = new SimpleChange(null, appName, true);
            component.ngOnChanges({ appName: change });

            expect(component.getFilters).toHaveBeenCalledWith(appName);
        });

        it('should emit filter key when filter counter is set for first time', () => {
            component.currentFiltersValues = {};
            const fakeFilterKey = 'testKey';
            const fakeFilterValue = 10;
            const updatedFilterSpy = spyOn(component.updatedFilter, 'emit');
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, fakeFilterValue);
            fixture.detectChanges();
            expect(component.currentFiltersValues).not.toEqual({});
            expect(component.currentFiltersValues[fakeFilterKey]).toBe(fakeFilterValue);
            expect(updatedFilterSpy).toHaveBeenCalled();
        });
        it('should not emit filter key when filter counter has not changed', fakeAsync(() => {
            component.currentFiltersValues = {};
            const fakeFilterKey = 'testKey';
            const fakeFilterValue = 10;

            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, fakeFilterValue);
            fixture.detectChanges();
            expect(component.currentFiltersValues).not.toEqual({});
            expect(component.currentFiltersValues[fakeFilterKey]).toBe(fakeFilterValue);

            component.updatedFilter.pipe(first()).subscribe(() => {
                fail('Should not have been called if the filterKey value is already there');
            });

            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, fakeFilterValue);
            fixture.detectChanges();

            expect(component.currentFiltersValues[fakeFilterKey]).toBe(fakeFilterValue);
            flush();
        }));

        it('should emit filter key when filter counter is increased', (done) => {
            component.currentFiltersValues = {};
            const fakeFilterKey = 'testKey';
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 10);
            component.updatedFilter.pipe(first()).subscribe((updatedFilter: string) => {
                expect(updatedFilter).toBe(fakeFilterKey);
                expect(component.currentFiltersValues[fakeFilterKey]).toBe(20);
                done();
            });
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 20);
            fixture.detectChanges();
        });
        it('should emit filter key when filter counter is decreased', (done) => {
            component.currentFiltersValues = {};
            const fakeFilterKey = 'testKey';
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 10);
            component.updatedFilter.pipe(first()).subscribe((updatedFilter: string) => {
                expect(updatedFilter).toBe(fakeFilterKey);
                done();
            });
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 5);
            fixture.detectChanges();
        });

        it('should remove key from set of updated filters when received refreshed filter key', async () => {
            const filterKeyTest = 'filter-key-test';
            component.updatedCountersSet.add(filterKeyTest);

            expect(component.updatedCountersSet.size).toBe(1);

            taskFilterService.filterKeyToBeRefreshed$ = of(filterKeyTest);
            fixture.detectChanges();

            expect(component.updatedCountersSet.has(filterKeyTest)).toBeFalsy();
        });

        it('should remove key from set of updated filters when clicked on filter', async () => {
            const filter = defaultTaskFiltersMock[1];
            component.updatedCountersSet.add(filter.key);
            fixture.detectChanges();

            expect(component.updatedCountersSet.has(filter.key)).toBeTruthy();

            component.onFilterClick(filter);
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.updatedCountersSet.has(filter.key)).toBeFalsy();
        });

        it('should add key to set of updated filters when value has changed', () => {
            component.updatedCountersSet = new Set();
            const fakeFilterKey = 'testKey';
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 10);
            component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 20);

            expect(component.updatedCountersSet.size).toBe(1);
            expect(component.updatedCountersSet.has(fakeFilterKey)).toBe(true);
        });

        it('should call fetchTaskFilterCounter only if filter.showCounter is true', () => {
            const filterWithCounter = new TaskFilterCloudModel({ ...defaultTaskFiltersMock[0], showCounter: true });
            const filterWithoutCounter = new TaskFilterCloudModel({ ...defaultTaskFiltersMock[1], showCounter: false });
            const fetchSpy = spyOn<any>(component, 'fetchTaskFilterCounter').and.returnValue(of(42));

            component.filters = [filterWithCounter, filterWithoutCounter];
            component.updateFilterCounters();

            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(filterWithCounter);
            expect(fetchSpy).not.toHaveBeenCalledWith(filterWithoutCounter);
        });

        describe('Highlight Selected Filter', () => {
            const assignedTasksFilterKey = defaultTaskFiltersMock[1].key;
            const queuedTasksFilterKey = defaultTaskFiltersMock[0].key;
            const completedTasksFilterKey = defaultTaskFiltersMock[2].key;

            const getActiveFilterElement = (filterKey: string): Element => {
                const activeFilter = fixture.debugElement.query(By.css(`.adf-active`));
                return activeFilter.nativeElement.querySelector(`[data-automation-id="${filterKey}_filter"]`);
            };

            const clickOnFilter = async (filterKey: string) => {
                fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${filterKey}_filter"]`).click();
                fixture.detectChanges();
                await fixture.whenStable();
            };

            it('Should highlight task filter on filter click', async () => {
                getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
                component.appName = 'mock-app-name';
                const appNameChange = new SimpleChange(null, 'mock-app-name', true);
                component.ngOnChanges({ appName: appNameChange });
                fixture.detectChanges();
                await fixture.whenStable();

                await clickOnFilter(assignedTasksFilterKey);

                expect(getActiveFilterElement(assignedTasksFilterKey)).toBeDefined();
                expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

                await clickOnFilter(queuedTasksFilterKey);

                expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(queuedTasksFilterKey)).toBeDefined();
                expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

                await clickOnFilter(completedTasksFilterKey);

                expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(completedTasksFilterKey)).toBeDefined();
            });

            it('Should highlight task filter when filterParam input changed', async () => {
                getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
                fixture.detectChanges();

                component.ngOnChanges({ filterParam: new SimpleChange(null, { key: assignedTasksFilterKey }, true) });
                fixture.detectChanges();
                await fixture.whenStable();

                expect(getActiveFilterElement(assignedTasksFilterKey)).toBeDefined();
                expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

                component.ngOnChanges({ filterParam: new SimpleChange(null, { key: queuedTasksFilterKey }, true) });
                fixture.detectChanges();
                await fixture.whenStable();

                expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(queuedTasksFilterKey)).toBeDefined();
                expect(getActiveFilterElement(completedTasksFilterKey)).toBeNull();

                component.ngOnChanges({ filterParam: new SimpleChange(null, { key: completedTasksFilterKey }, true) });
                fixture.detectChanges();
                await fixture.whenStable();

                expect(getActiveFilterElement(assignedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(queuedTasksFilterKey)).toBeNull();
                expect(getActiveFilterElement(completedTasksFilterKey)).toBeDefined();
            });
        });
    });
});
