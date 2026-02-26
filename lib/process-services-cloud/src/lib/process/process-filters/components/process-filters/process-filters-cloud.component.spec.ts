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

import { Component, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { first, of, throwError } from 'rxjs';
import { ProcessFilterCloudService } from '../../services/process-filter-cloud.service';
import { ProcessFiltersCloudComponent } from './process-filters-cloud.component';
import { By } from '@angular/platform-browser';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../../services/local-preference-cloud.service';
import { mockProcessFilters } from '../../mock/process-filters-cloud.mock';
import { AppConfigService, AppConfigServiceMock } from '@alfresco/adf-core';
import { ProcessListCloudService } from '../../../process-list/services/process-list-cloud.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconHarness } from '@angular/material/icon/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({ selector: 'adf-cloud-dummy', template: '' })
class DummyComponent {}

const ProcessFilterCloudServiceMock = {
    getProcessFilters: () => of(mockProcessFilters),
    getProcessNotificationSubscription: () => of([]),
    filterKeyToBeRefreshed$: of(mockProcessFilters[0].key)
};

describe('ProcessFiltersCloudComponent', () => {
    let processFilterService: ProcessFilterCloudService;
    let component: ProcessFiltersCloudComponent;
    let fixture: ComponentFixture<ProcessFiltersCloudComponent>;
    let getProcessFiltersSpy: jasmine.Spy;
    let getProcessNotificationSubscriptionSpy: jasmine.Spy;
    let loader: HarnessLoader;
    let router: Router;

    const configureTestingModule = async (searchApiMethod: 'GET' | 'POST') => {
        TestBed.configureTestingModule({
            imports: [ProcessFiltersCloudComponent, ApolloTestingModule],
            providers: [
                { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService },
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                {
                    provide: ProcessListCloudService,
                    useValue: {
                        getProcessCounter: () => of(10),
                        getProcessListCount: () => of(10)
                    }
                },
                { provide: ProcessFilterCloudService, useValue: ProcessFilterCloudServiceMock },
                provideRouter([{ path: 'process-list-cloud', component: DummyComponent }]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: of({
                            get: (param: string) => {
                                if (param === 'filterId') {
                                    return 'fake-process-filter-id';
                                }
                                return null;
                            }
                        })
                    }
                }
            ]
        });
        fixture = TestBed.createComponent(ProcessFiltersCloudComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        component.searchApiMethod = searchApiMethod;

        processFilterService = TestBed.inject(ProcessFilterCloudService);
        TestBed.inject(ActivatedRoute);
        router = TestBed.inject(Router);
        await RouterTestingHarness.create();
        getProcessFiltersSpy = spyOn(processFilterService, 'getProcessFilters').and.returnValue(of(mockProcessFilters));
        getProcessNotificationSubscriptionSpy = spyOn(processFilterService, 'getProcessNotificationSubscription').and.returnValue(of([]));
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
            expect(await filterIcons[1].getName()).toContain('inbox');
            expect(await filterIcons[2].getName()).toContain('done');
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

            const filters = fixture.debugElement.queryAll(By.css('.adf-process-filters__entry'));
            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeAllProcesses');
            expect(filters[1].nativeElement.innerText).toContain('FakeRunningProcesses');
            expect(filters[2].nativeElement.innerText).toContain('FakeCompletedProcesses');
            expect(Object.keys(component.counters).length).toBe(3);
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
            expect(Object.keys(component.counters).length).toBe(3);
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

        describe('Highlight Selected Filter', () => {
            const allProcessesFilterKey = mockProcessFilters[0].key;

            it('should apply active CSS class on filter click', async () => {
                component.enableNotifications = true;
                component.appName = 'mock-app-name';
                const appNameChange = new SimpleChange(null, 'mock-app-name', true);
                component.ngOnChanges({ appName: appNameChange });
                fixture.detectChanges();
                await fixture.whenStable();

                const link = fixture.debugElement.query(By.css(`[data-automation-id="${allProcessesFilterKey}_filter"]`)).nativeElement;
                expect(link.getAttribute('href')).toBe('/process-list-cloud?filter=10');

                link.click();
                fixture.detectChanges();
                await fixture.whenStable();
                expect(router.url).toBe('/process-list-cloud?filter=10');
            });
        });
    });

    describe('searchApiMethod set to POST', () => {
        beforeEach(async () => {
            await configureTestingModule('POST');
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
            expect(await filterIcons[1].getName()).toContain('inbox');
            expect(await filterIcons[2].getName()).toContain('done');
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

            const filters = fixture.debugElement.queryAll(By.css('.adf-process-filters__entry'));
            expect(component.filters.length).toBe(3);
            expect(filters.length).toBe(3);
            expect(filters[0].nativeElement.innerText).toContain('FakeAllProcesses');
            expect(filters[1].nativeElement.innerText).toContain('FakeRunningProcesses');
            expect(filters[2].nativeElement.innerText).toContain('FakeCompletedProcesses');
            expect(Object.keys(component.counters).length).toBe(3);
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
            expect(Object.keys(component.counters).length).toBe(3);
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
    });

    describe('API agnostic', () => {
        beforeEach(async () => {
            await configureTestingModule('GET');
        });

        it('should emit an error with a bad response', () => {
            getProcessFiltersSpy.and.returnValue(throwError('wrong request'));

            const appName = 'my-app-1';
            const change = new SimpleChange(null, appName, true);

            let lastValue: any;
            component.error.subscribe((err) => (lastValue = err));

            component.ngOnChanges({ appName: change });
            fixture.detectChanges();
            expect(lastValue).toBeDefined();
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

        it('should remove key from set of updated filters when received refreshed filter key', async () => {
            const filterKeyTest = 'filter-key-test';
            component.updatedFiltersSet.add(filterKeyTest);

            expect(component.updatedFiltersSet.size).toBe(1);
            processFilterService.filterKeyToBeRefreshed$ = of(filterKeyTest);
            fixture.detectChanges();

            expect(component.updatedFiltersSet.has(filterKeyTest)).toBeFalsy();
        });

        it('should call fetchProcessFilterCounter only if filter.showCounter is true', () => {
            const filterWithCounter = { ...mockProcessFilters[0], showCounter: true };
            const filterWithoutCounter = { ...mockProcessFilters[1], showCounter: false };
            const fetchSpy = spyOn<any>(component, 'fetchProcessFilterCounter').and.returnValue(of(42));

            component.filters = [filterWithCounter, filterWithoutCounter];
            component.updateFilterCounters();

            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(filterWithCounter);
            expect(fetchSpy).not.toHaveBeenCalledWith(filterWithoutCounter);
        });

        describe('Highlight Selected Filter', () => {
            it('should make subscription', () => {
                component.enableNotifications = true;
                component.appName = 'mock-app-name';
                const appNameChange = new SimpleChange(null, 'mock-app-name', true);
                component.ngOnChanges({ appName: appNameChange });
                fixture.detectChanges();
                expect(getProcessNotificationSubscriptionSpy).toHaveBeenCalled();
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
                    expect(component.currentFiltersValues[fakeFilterKey]).toBe(5);
                    done();
                });
                component.checkIfFilterValuesHasBeenUpdated(fakeFilterKey, 5);
                fixture.detectChanges();
            });
        });
    });
});
