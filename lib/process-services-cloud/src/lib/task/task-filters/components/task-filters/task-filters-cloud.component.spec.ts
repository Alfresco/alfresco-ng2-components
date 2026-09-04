/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Component, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { first, NEVER, of, Subject, throwError } from 'rxjs';
import { PROCESS_FILTERS_SERVICE_TOKEN, TASK_FILTERS_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../../services/local-preference-cloud.service';
import { defaultTaskFiltersMock, fakeGlobalFilter, taskNotifications } from '../../mock/task-filters-cloud.mock';
import { TaskFilterCloudService } from '../../services/task-filter-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters-cloud.component';
import { TaskListCloudService } from '../../../task-list/services/task-list-cloud.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatNavListItemHarness } from '@angular/material/list/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TaskFilterCloudAdapter } from '../../../../models/filter-cloud-model';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TaskFilterCloudModel } from '../../models/filter-cloud.model';
import { MatIconHarness } from '@angular/material/icon/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FilterCountersCloudService } from '../../../../services/filter-counters-cloud.service';
import { FilterCounterEntityType } from '../../../../models/filter-counters-cloud.model';
import { TaskCloudEngineEvent } from '../../../../models/engine-event-cloud.model';

@Component({ selector: 'adf-cloud-dummy', template: '' })
class DummyComponent {}

describe('TaskFiltersCloudComponent', () => {
    let loader: HarnessLoader;
    let taskFilterService: TaskFilterCloudService;
    let taskListService: TaskListCloudService;
    let appConfigService: AppConfigService;

    let component: TaskFiltersCloudComponent;
    let fixture: ComponentFixture<TaskFiltersCloudComponent>;
    let getTaskFilterCounterSpy: jasmine.Spy;
    let getTaskListFiltersSpy: jasmine.Spy;
    let getTaskListCountSpy: jasmine.Spy;
    let getEngineEventsSpy: jasmine.Spy;
    let filterCountersService: FilterCountersCloudService;
    let getFilterCountersSpy: jasmine.Spy;
    let refreshFilterCountersSpy: jasmine.Spy;
    let router: Router;

    const configureTestingModule = async (searchApiMethod: 'GET' | 'POST') => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, TaskFiltersCloudComponent, ApolloTestingModule],
            providers: [
                { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService },
                { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService },
                provideRouter([{ path: 'task-list-cloud', component: DummyComponent }]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: of({
                            get: (param: string) => {
                                if (param === 'filterId') {
                                    return defaultTaskFiltersMock[0].id;
                                }
                                return null;
                            }
                        })
                    }
                }
            ]
        });
        taskFilterService = TestBed.inject(TaskFilterCloudService);
        taskListService = TestBed.inject(TaskListCloudService);
        filterCountersService = TestBed.inject(FilterCountersCloudService);
        getTaskFilterCounterSpy = spyOn(taskFilterService, 'getTaskFilterCounter').and.returnValue(of(11));
        getTaskListCountSpy = spyOn(taskListService, 'getTaskListCount').and.returnValue(of(11));
        getEngineEventsSpy = spyOn(filterCountersService, 'getEngineEvents').and.returnValue(of(taskNotifications));
        getTaskListFiltersSpy = spyOn(filterCountersService, 'getTaskFilters').and.returnValue(of(fakeGlobalFilter));
        getFilterCountersSpy = spyOn(filterCountersService, 'getFilterCounters').and.returnValue(
            of({ counters: { 'fake-involved-tasks': 11 }, batched: true })
        );
        refreshFilterCountersSpy = spyOn(filterCountersService, 'refreshFilterCounters');

        appConfigService = TestBed.inject(AppConfigService);

        fixture = TestBed.createComponent(TaskFiltersCloudComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        component.searchApiMethod = searchApiMethod;
        TestBed.inject(ActivatedRoute);
        router = TestBed.inject(Router);
        await RouterTestingHarness.create();
    };

    const bindAppName = async (appName = 'my-app-1') => {
        fixture.componentRef.setInput('appName', appName);
        fixture.detectChanges();
        await fixture.whenStable();
    };

    afterEach(() => {
        fixture.destroy();
    });

    describe('searchApiMethod set to GET', () => {
        beforeEach(async () => {
            await configureTestingModule('GET');
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

            const filterIcons = await loader.getAllHarnesses(MatIconHarness.with({ selector: '[data-automation-id="adf-filter-icon"]' }));
            expect(filterIcons.length).toBe(3);
            expect(await filterIcons[0].getName()).toContain('adjust');
            expect(await filterIcons[1].getName()).toContain('done');
            expect(await filterIcons[2].getName()).toContain('inbox');
        });

        it('should not attach icons for each filter if hasIcon is false', async () => {
            component.showIcons = false;
            const change = new SimpleChange(undefined, 'my-app-1', true);
            component.ngOnChanges({ appName: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const filterIcons = await loader.getAllHarnesses(MatIconHarness.with({ selector: '[data-automation-id="adf-filter-icon"]' }));
            expect(filterIcons.length).toBe(0);
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

            await bindAppName();

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

        it('should update filter counter when notification received', async () => {
            component.showIcons = true;
            await bindAppName();

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

        it('should reset filter counter notification when filter is selected', async () => {
            spyOn(appConfigService, 'get').and.returnValue(true);
            const change = new SimpleChange(null, { key: fakeGlobalFilter[0].key }, true);
            component.showIcons = true;
            await bindAppName();

            let updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(1);

            component.filters = fakeGlobalFilter;
            component.currentFilter = null;

            component.ngOnChanges({ filterParam: change });
            fixture.detectChanges();

            updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(0);
        });

        it('should refresh the filter counters when a filter is selected', async () => {
            component.showIcons = true;
            await bindAppName();

            const filterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="${fakeGlobalFilter[0].key}_filter"]`);
            filterButton.click();

            fixture.detectChanges();
            expect(refreshFilterCountersSpy).toHaveBeenCalledWith('my-app-1');
        });

        describe('Notifications config', () => {
            it('should read enableNotifications and notificationDebounceTime from app config on init', () => {
                const getSpy = spyOn(appConfigService, 'get').and.callThrough();
                component.appName = 'my-app-1';

                fixture.detectChanges();

                expect(getSpy).toHaveBeenCalledWith('notifications', true);
                expect(getSpy).toHaveBeenCalledWith('notificationDebounceTime', 3000);
            });

            it('should default notificationDebounceTime to 3000 when not set in app config', () => {
                component.appName = 'my-app-1';

                fixture.detectChanges();

                expect(component.notificationDebounceTime).toBe(3000);
            });

            it('should use notificationDebounceTime from app config', () => {
                spyOn(appConfigService, 'get').and.callFake((key: string, defaultValue: any) => {
                    if (key === 'notificationDebounceTime') {
                        return 5000;
                    }
                    return defaultValue;
                });
                component.appName = 'my-app-1';

                fixture.detectChanges();

                expect(component.notificationDebounceTime).toBe(5000);
            });

            it('should not subscribe to notifications when appName is missing', () => {
                getEngineEventsSpy.calls.reset();
                component.appName = '';

                fixture.detectChanges();

                expect(getEngineEventsSpy).not.toHaveBeenCalled();
            });

            it('should subscribe to the notifications of the bound app', () => {
                component.appName = 'my-app-1';

                fixture.detectChanges();

                expect(getEngineEventsSpy).toHaveBeenCalledWith('my-app-1', FilterCounterEntityType.TASK);
            });

            it('should emit the events of the debounced batch', fakeAsync(() => {
                const events$ = new Subject<TaskCloudEngineEvent[]>();
                getEngineEventsSpy.and.returnValue(events$.asObservable());
                const filterCounterUpdatedSpy = spyOn(component.filterCounterUpdated, 'emit');
                component.appName = 'my-app-1';

                fixture.detectChanges();

                events$.next(taskNotifications);

                expect(filterCounterUpdatedSpy).toHaveBeenCalledWith(taskNotifications);
                flush();
            }));
        });
    });

    describe('searchApiMethod set to POST', () => {
        beforeEach(async () => {
            await configureTestingModule('POST');
            component.showIcons = true;
        });

        it('should attach specific icon for each filter if hasIcon is true', async () => {
            await bindAppName();

            const filterIcons = await loader.getAllHarnesses(MatIconHarness.with({ selector: '[data-automation-id="adf-filter-icon"]' }));

            expect(component.filters.length).toBe(3);
            expect(filterIcons.length).toBe(3);
            expect(await filterIcons[0].getName()).toContain('adjust');
            expect(await filterIcons[1].getName()).toContain('done');
            expect(await filterIcons[2].getName()).toContain('inbox');
        });

        it('should not attach icons for each filter if showIcons is false', async () => {
            component.showIcons = false;
            await bindAppName();

            const filterIcons = await loader.getAllHarnesses(MatIconHarness.with({ selector: '[data-automation-id="adf-filter-icon"]' }));
            expect(filterIcons.length).toBe(0);
        });

        it('should display the filters', async () => {
            await bindAppName();

            const filters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry'));

            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeInvolvedTasks');
            expect(filters[1].nativeElement.innerText).toContain('FakeMyTasks1');
            expect(filters[2].nativeElement.innerText).toContain('FakeMyTasks2');
        });

        it('should not select any filter as default', async () => {
            await bindAppName();

            expect(component.currentFilter).toBeUndefined();
        });

        it('should emit filterClicked when a filter is clicked from the UI', async () => {
            await bindAppName();
            const spy = spyOn(component.filterClicked, 'emit');

            const filterButton = await loader.getHarness(
                MatNavListItemHarness.with({ selector: `[data-automation-id="${fakeGlobalFilter[0].key}_filter"]` })
            );
            await filterButton.click();

            expect(spy).toHaveBeenCalledWith(fakeGlobalFilter[0]);
        });

        it('should display filter counter if property set to true', async () => {
            await bindAppName();

            const filterCounters = fixture.debugElement.queryAll(By.css('.adf-task-filters__entry-counter'));

            expect(component.filters.length).toBe(3);
            expect(filterCounters.length).toBe(1);
            expect(filterCounters[0].nativeElement.innerText).toContain('11');
        });

        it('should update filter counter when notification received', async () => {
            await bindAppName();

            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));

            expect(updatedFilterCounters.length).toBe(1);
            expect(Object.keys(component.counters).length).toBe(3);
            expect(component.counters['fake-involved-tasks']).toBeDefined();
        });

        it('should not update filter counter when notifications are disabled from app.config.json', async () => {
            spyOn(appConfigService, 'get').and.returnValue(false);
            await bindAppName();

            expect(fixture.componentInstance.counters).toBeDefined();
            const updatedFilterCounters = fixture.debugElement.queryAll(By.css('span.adf-active'));
            expect(updatedFilterCounters.length).toBe(0);
        });

        it('should reset filter counter notification when filter is selected', async () => {
            await bindAppName();
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

        it('should refresh the filter counters when a filter is selected', async () => {
            await bindAppName();

            const filterButton = await loader.getHarness(
                MatNavListItemHarness.with({ selector: `[data-automation-id="${fakeGlobalFilter[0].key}_filter"]` })
            );
            await filterButton.click();

            expect(refreshFilterCountersSpy).toHaveBeenCalledWith('my-app-1');
        });

        it('should resolve the counters with the POST method when the batched endpoint is not available', async () => {
            getFilterCountersSpy.and.returnValue(of({ counters: {}, batched: false }));

            await bindAppName();

            expect(getTaskListCountSpy).toHaveBeenCalledWith(new TaskFilterCloudAdapter(fakeGlobalFilter[0]));
        });
    });

    describe('API agnostic', () => {
        beforeEach(async () => {
            await configureTestingModule('GET');
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

            await bindAppName();
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

            await bindAppName();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should select the task filter based on the input by id param', async () => {
            const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
            const change = new SimpleChange(null, { id: '12' }, true);

            await bindAppName();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should select the task filter based on the input by key param', async () => {
            const filterSelectedSpy = spyOn(component.filterSelected, 'emit');
            const change = new SimpleChange(null, { key: 'fake-my-task2' }, true);

            await bindAppName();
            component.ngOnChanges({ filterParam: change });

            expect(component.currentFilter).toEqual(fakeGlobalFilter[2]);
            expect(filterSelectedSpy).toHaveBeenCalledWith(fakeGlobalFilter[2]);
        });

        it('should not emit a filter clicked event when a filter is selected through the filterParam input (filterClicked emits only through a UI click action)', async () => {
            const filterClickedSpy = spyOn(component.filterClicked, 'emit');
            const change = new SimpleChange(null, { id: '10' }, true);

            await bindAppName();
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

        it('should load filters only once when appName is bound', async () => {
            await bindAppName();

            expect(getTaskListFiltersSpy).toHaveBeenCalledTimes(1);
        });

        it('should load filters on init when appName is not bound', () => {
            fixture.detectChanges();

            expect(getTaskListFiltersSpy).toHaveBeenCalledTimes(1);
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

        it('should resolve the counter only of the filters with a counter enabled', () => {
            const filterWithCounter = new TaskFilterCloudModel({ ...defaultTaskFiltersMock[0], showCounter: true });
            const filterWithoutCounter = new TaskFilterCloudModel({ ...defaultTaskFiltersMock[1], showCounter: false });
            getTaskFilterCounterSpy.calls.reset();

            component.filters = [filterWithCounter, filterWithoutCounter];
            component.updateFilterCounters();

            expect(getTaskFilterCounterSpy).toHaveBeenCalledTimes(1);
            expect(getTaskFilterCounterSpy).toHaveBeenCalledWith(filterWithCounter);
        });

        describe('Batched counters', () => {
            it('should read the counters without waiting for the filters', async () => {
                getTaskListFiltersSpy.and.returnValue(NEVER);

                await bindAppName();

                expect(getFilterCountersSpy).toHaveBeenCalledWith('my-app-1', FilterCounterEntityType.TASK, false);
            });

            it('should hold the counters until the filters they belong to arrive', async () => {
                const filters$ = new Subject<TaskFilterCloudModel[]>();
                getTaskListFiltersSpy.and.returnValue(filters$.asObservable());
                getFilterCountersSpy.and.returnValue(of({ counters: { 'fake-involved-tasks': 9 }, batched: true }));

                await bindAppName();
                expect(component.counters['fake-involved-tasks']).toBeUndefined();

                filters$.next(fakeGlobalFilter);
                fixture.detectChanges();

                expect(component.counters['fake-involved-tasks']).toBe(9);
            });

            it('should read the counters of the task filters of the bound app', async () => {
                await bindAppName();

                expect(getFilterCountersSpy).toHaveBeenCalledWith('my-app-1', FilterCounterEntityType.TASK, false);
            });

            it('should not ask for the batched count endpoint by default', async () => {
                await bindAppName();

                expect(component.useBatchedCounters).toBeFalse();
                expect(getFilterCountersSpy).toHaveBeenCalledWith('my-app-1', FilterCounterEntityType.TASK, false);
            });

            it('should ask for the batched count endpoint when the input is set', async () => {
                fixture.componentRef.setInput('useBatchedCounters', true);

                await bindAppName();

                expect(getFilterCountersSpy).toHaveBeenCalledWith('my-app-1', FilterCounterEntityType.TASK, true);
            });

            it('should read the counters again when the input changes', async () => {
                await bindAppName();
                getFilterCountersSpy.calls.reset();

                fixture.componentRef.setInput('useBatchedCounters', true);
                fixture.detectChanges();
                await fixture.whenStable();

                expect(getFilterCountersSpy).toHaveBeenCalledWith('my-app-1', FilterCounterEntityType.TASK, true);
            });

            it('should hold the counters resolved by the batched count request', async () => {
                getFilterCountersSpy.and.returnValue(of({ counters: { 'fake-involved-tasks': 9 }, batched: true }));

                await bindAppName();

                expect(component.counters['fake-involved-tasks']).toBe(9);
            });

            it('should emit the filters whose counter changed', async () => {
                getFilterCountersSpy.and.returnValue(of({ counters: { 'fake-involved-tasks': 9 }, batched: true }));
                const updatedFilterSpy = spyOn(component.updatedFilter, 'emit');

                await bindAppName();

                expect(updatedFilterSpy).toHaveBeenCalledWith('fake-involved-tasks');
            });

            it('should resolve the counter of a filter the batch left out on its own', async () => {
                getFilterCountersSpy.and.returnValue(of({ counters: {}, batched: true }));

                await bindAppName();

                expect(getTaskFilterCounterSpy).toHaveBeenCalledWith(fakeGlobalFilter[0]);
                expect(component.counters['fake-involved-tasks']).toBe(11);
            });

            it('should keep the counters of the other filters when one counter cannot be resolved', async () => {
                getTaskListFiltersSpy.and.returnValue(of([fakeGlobalFilter[0], { ...fakeGlobalFilter[1], showCounter: true }]));
                getFilterCountersSpy.and.returnValue(of({ counters: { 'fake-involved-tasks': 4 }, batched: true }));
                getTaskFilterCounterSpy.and.throwError('the query of the filter cannot be built');

                await bindAppName();

                expect(component.counters['fake-involved-tasks']).toBe(4);
                expect(component.counters['fake-my-task1']).toBe(0);
            });

            it('should resolve the counters one filter at a time when the batched endpoint is not available', async () => {
                getFilterCountersSpy.and.returnValue(of({ counters: {}, batched: false }));

                await bindAppName();

                expect(getTaskFilterCounterSpy).toHaveBeenCalled();
                expect(component.counters['fake-involved-tasks']).toBe(11);
            });

            it('should refresh the counters of every filter when a filter is clicked', async () => {
                await bindAppName();

                component.onFilterClick(fakeGlobalFilter[0]);

                expect(refreshFilterCountersSpy).toHaveBeenCalledWith('my-app-1');
            });

            it('should refresh the counter of the clicked filter alone when the batched endpoint is not available', async () => {
                getFilterCountersSpy.and.returnValue(of({ counters: {}, batched: false }));
                await bindAppName();
                getTaskFilterCounterSpy.calls.reset();

                component.onFilterClick(fakeGlobalFilter[0]);

                expect(refreshFilterCountersSpy).not.toHaveBeenCalled();
                expect(getTaskFilterCounterSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('Highlight Selected Filter', () => {
            const assignedTasksFilterKey = defaultTaskFiltersMock[0].key;

            it('Should highlight task filter on filter click', async () => {
                getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
                component.appName = 'mock-app-name';
                const appNameChange = new SimpleChange(null, 'mock-app-name', true);
                component.ngOnChanges({ appName: appNameChange });
                fixture.detectChanges();
                await fixture.whenStable();

                let filterLink = fixture.debugElement.query(By.css(`[data-automation-id="${assignedTasksFilterKey}_filter"]`));
                filterLink.nativeElement.click();
                fixture.detectChanges();
                await fixture.whenStable();

                expect(router.url).toBe(`/task-list-cloud?filterId=${defaultTaskFiltersMock[0].id}`);

                filterLink = fixture.debugElement.query(By.css(`[data-automation-id="${assignedTasksFilterKey}_filter"]`));
                expect(filterLink.nativeElement.classList).toContain('adf-active');
            });

            it('should add aria-current attribute with value "page" to the active filter', async () => {
                getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
                component.appName = 'mock-app-name';
                const appNameChange = new SimpleChange(null, 'mock-app-name', true);

                component.ngOnChanges({ appName: appNameChange });
                fixture.detectChanges();
                await fixture.whenStable();

                const filterLink = fixture.debugElement.query(By.css(`[data-automation-id="${assignedTasksFilterKey}_filter"]`));
                expect(filterLink.nativeElement.getAttribute('aria-current')).toBe('page');
            });

            it('should not have aria-current attribute when filter is not active', async () => {
                getTaskListFiltersSpy.and.returnValue(of(defaultTaskFiltersMock));
                component.appName = 'mock-app-name';
                const appNameChange = new SimpleChange(null, 'mock-app-name', true);

                component.ngOnChanges({ appName: appNameChange });
                fixture.detectChanges();
                await fixture.whenStable();

                const otherFilterLink = fixture.debugElement.query(By.css(`[data-automation-id="${defaultTaskFiltersMock[1].key}_filter"]`));
                expect(otherFilterLink.nativeElement.getAttribute('aria-current')).toBeNull();
            });
        });
    });
});
