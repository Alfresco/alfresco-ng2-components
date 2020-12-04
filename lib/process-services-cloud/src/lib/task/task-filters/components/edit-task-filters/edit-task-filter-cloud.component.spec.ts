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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AlfrescoApiService, IdentityUserModel, setupTestBed } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../../services/local-preference-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { AppsProcessCloudService } from '../../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance } from '../../../../app/mock/app-model.mock';
import { TaskFiltersCloudModule } from '../../task-filters-cloud.module';
import { EditTaskFilterCloudComponent } from './edit-task-filter-cloud.component';
import { TaskFilterCloudService } from '../../services/task-filter-cloud.service';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { fakeFilter } from '../../mock/task-filters-cloud.mock';
import { AbstractControl } from '@angular/forms';
import moment from 'moment-es6';
import { TranslateModule } from '@ngx-translate/core';
import { DateCloudFilterType } from '../../../../models/date-cloud-filter.model';
import { TaskFilterCloudModel } from '../../models/filter-cloud.model';
import { PeopleCloudModule } from '../../../../people/people-cloud.module';

describe('EditTaskFilterCloudComponent', () => {
    let component: EditTaskFilterCloudComponent;
    let service: TaskFilterCloudService;
    let appsService: AppsProcessCloudService;
    let fixture: ComponentFixture<EditTaskFilterCloudComponent>;
    let dialog: MatDialog;
    let alfrescoApiService: AlfrescoApiService;
    let getTaskFilterSpy: jasmine.Spy;
    let getRunningApplicationsSpy: jasmine.Spy;
    let taskService: TaskCloudService;

    const mock = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(fakeApplicationInstance)
        }
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            TaskFiltersCloudModule,
            PeopleCloudModule
        ],
        providers: [
            MatDialog,
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditTaskFilterCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(TaskFilterCloudService);
        appsService = TestBed.inject(AppsProcessCloudService);
        taskService = TestBed.inject(TaskCloudService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        dialog = TestBed.inject(MatDialog);
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: of({
                action: EditTaskFilterCloudComponent.ACTION_SAVE,
                icon: 'icon',
                name: 'fake-name'
            })
        });
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
        getTaskFilterSpy = spyOn(service, 'getTaskFilterById').and.returnValue(of(fakeFilter));
        getRunningApplicationsSpy = spyOn(appsService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should fetch task filter by taskId', () => {
        const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getTaskFilterSpy).toHaveBeenCalled();
            expect(component.taskFilter.name).toEqual('FakeInvolvedTasks');
            expect(component.taskFilter.icon).toEqual('adjust');
            expect(component.taskFilter.status).toEqual('CREATED');
            expect(component.taskFilter.order).toEqual('ASC');
            expect(component.taskFilter.sort).toEqual('id');
        });
    });

    it('should fetch process definitions when processDefinitionName filter property is set', async(() => {
        const processSpy = spyOn(taskService, 'getProcessDefinitions').and.returnValue(of([{ id: 'fake-id', name: 'fake-name' }]));
        fixture.detectChanges();
        component.filterProperties = ['processDefinitionName'];
        fixture.detectChanges();
        const taskFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange });
        fixture.detectChanges();
        const controller = component.editTaskFilterForm.get('processDefinitionName');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(processSpy).toHaveBeenCalled();
            expect(controller).toBeDefined();
        });
    }));

    it('should display filter name as title', async(() => {
        const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
    }));

    it('should not display filter name if showFilterName is false', async(() => {
        const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
        component.showTaskFilterName = false;
        component.ngOnChanges({ 'id': taskFilterIdChange });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');

        fixture.whenStable().then(() => {
            expect(title).toBeNull();
        });
    }));

    it('should not display mat-spinner if isloading set to false', async(() => {
        const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-task-filter-loading-margin');

        fixture.whenStable().then(() => {
            expect(matSpinnerElement).toBeNull();
            expect(title.innerText).toEqual('FakeInvolvedTasks');
            expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
        });
    }));

    it('should display mat-spinner if isloading set to true', async(() => {
        component.isLoading = true;
        const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange });
        fixture.detectChanges();

        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-task-filter-loading-margin');

        fixture.whenStable().then(() => {
            expect(matSpinnerElement).toBeDefined();
        });
    }));

    describe('EditTaskFilter form', () => {

        beforeEach(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
        });

        it('should defined editTaskFilter form ', () => {
            expect(component.editTaskFilterForm).toBeDefined();
        });

        it('should create editTaskFilter form with default user task properties', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const stateController = component.editTaskFilterForm.get('status');
                const sortController = component.editTaskFilterForm.get('sort');
                const orderController = component.editTaskFilterForm.get('order');
                const assigneeController = component.editTaskFilterForm.get('assignee');
                expect(component.editTaskFilterForm).toBeDefined();
                expect(assigneeController).toBeDefined();
                expect(stateController.value).toBe('CREATED');
                expect(sortController.value).toBe('id');
                expect(orderController.value).toBe('ASC');
                expect(assigneeController.value).toBe('fake-involved');
            });
        }));

        describe('Save & Delete buttons', () => {
            it('should disable save and delete button for default task filters', async(() => {
                getTaskFilterSpy.and.returnValue(of({
                    name: 'ADF_CLOUD_TASK_FILTERS.MY_TASKS',
                    id: 'filter-id',
                    key: 'all-fake-task',
                    icon: 'adjust',
                    sort: 'startDate',
                    status: 'ALL',
                    order: 'DESC'
                }));

                const taskFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ 'id': taskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                    expect(saveButton.disabled).toBe(true);
                    const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                    expect(deleteButton.disabled).toBe(true);
                });
            }));

            it('should enable delete button for custom task filters', async(() => {
                const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
                component.ngOnChanges({ 'id': taskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                    expect(saveButton.disabled).toBe(true);
                    const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                    expect(deleteButton.disabled).toBe(false);
                });
            }));

            it('should enable save button if the filter is changed for custom task filters', (done) => {
                const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
                component.ngOnChanges({ 'id': taskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editTaskFilterForm.valueChanges
                    .pipe(debounceTime(300))
                    .subscribe(() => {
                        const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                        fixture.detectChanges();
                        expect(saveButton.disabled).toBe(false);
                        done();
                    });

                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
                stateElement.click();
                fixture.detectChanges();
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                sortOptions[3].nativeElement.click();
                fixture.detectChanges();
            });

            it('should disable save button if the filter is not changed for custom filter', async(() => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                    expect(saveButton.disabled).toBe(true);
                });
            }));
        });

        describe('SaveAs button', () => {
            it('should disable saveAs button if the process filter is not changed for default filter', async(() => {
                getTaskFilterSpy.and.returnValue(of({
                    name: 'ADF_CLOUD_TASK_FILTERS.MY_TASKS',
                    id: 'filter-id',
                    key: 'all-fake-task',
                    icon: 'adjust',
                    sort: 'startDate',
                    status: 'ALL',
                    order: 'DESC'
                }));

                const taskFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ 'id': taskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                    expect(saveButton.disabled).toEqual(true);
                });
            }));

            it('should disable saveAs button if the process filter is not changed for custom filter', async(() => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                    expect(saveButton.disabled).toEqual(true);
                });
            }));

            it('should enable saveAs button if the filter values are changed for default filter', (done) => {
                getTaskFilterSpy.and.returnValue(of({
                    name: 'ADF_CLOUD_TASK_FILTERS.MY_TASKS',
                    id: 'filter-id',
                    key: 'all-fake-task',
                    icon: 'adjust',
                    sort: 'startDate',
                    status: 'ALL',
                    order: 'DESC'
                }));

                const taskFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ 'id': taskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editTaskFilterForm.valueChanges
                    .pipe(debounceTime(300))
                    .subscribe(() => {
                        const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                        fixture.detectChanges();
                        expect(saveButton.disabled).toEqual(false);
                        done();
                    });

                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
                stateElement.click();
                fixture.detectChanges();

                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                sortOptions[3].nativeElement.click();
                fixture.detectChanges();
            });

            it('should enable saveAs button if the filter values are changed for custom filter', (done) => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editTaskFilterForm.valueChanges
                    .pipe(debounceTime(300))
                    .subscribe(() => {
                        const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                        fixture.detectChanges();
                        expect(saveButton.disabled).toEqual(false);
                        done();
                    });

                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
                stateElement.click();
                fixture.detectChanges();

                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                sortOptions[3].nativeElement.click();
                fixture.detectChanges();
            });
        });

        it('should display current task filter details', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"]');
                const assigneeElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-assignee"]');
                const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
                const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
                expect(assigneeElement).toBeDefined();
                expect(stateElement.textContent.trim()).toBe('CREATED');
                expect(sortElement.textContent.trim()).toBe('Id');
                expect(orderElement.textContent.trim()).toBe('ASC');
            });
        }));

        it('should display all the statuses that are defined in the task filter', async(() => {

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"]');
            stateElement.click();
            fixture.detectChanges();

            const statusOptions = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-edit-task-property-options-status"]'));

            expect(statusOptions[0].nativeElement.textContent.trim()).toBe('ALL');
            expect(statusOptions[1].nativeElement.textContent.trim()).toBe('CREATED');
            expect(statusOptions[2].nativeElement.textContent.trim()).toBe('ASSIGNED');
            expect(statusOptions[3].nativeElement.textContent.trim()).toBe('SUSPENDED');
            expect(statusOptions[4].nativeElement.textContent.trim()).toBe('CANCELLED');
            expect(statusOptions[5].nativeElement.textContent.trim()).toBe('COMPLETED');
        }));

        it('should display sort drop down', async(() => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortOptions.length).toEqual(4);
            });
        }));

        it('should display order drop down', async(() => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
            orderElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(orderOptions.length).toEqual(2);
            });
        }));

        it('should able to build a editTaskFilter form with default properties if input is empty', async(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            component.filterProperties = [];
            fixture.detectChanges();
            const stateController = component.editTaskFilterForm.get('status');
            const sortController = component.editTaskFilterForm.get('sort');
            const orderController = component.editTaskFilterForm.get('order');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.taskFilterProperties.length).toBe(4);
                expect(component.editTaskFilterForm).toBeDefined();
                expect(stateController.value).toBe('CREATED');
                expect(sortController.value).toBe('id');
                expect(orderController.value).toBe('ASC');
            });
        }));

        it('should able to fetch running applications when appName property defined in the input', async(() => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority'];
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            const appController = component.editTaskFilterForm.get('appName');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getRunningApplicationsSpy).toHaveBeenCalled();
                expect(appController).toBeDefined();
                expect(appController.value).toBe('mock-app-name');
            });
        }));

        it('should fetch data in completedBy filter', async(() => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedBy'];
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            const appController = component.editTaskFilterForm.get('completedBy');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(appController).toBeDefined();
                expect(JSON.stringify(appController.value)).toBe(JSON.stringify({
                    id: 'mock-id',
                    username: 'testCompletedByUser'
                }));
            });
        }));

        it('should show completedBy filter', async(() => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedBy'];
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const peopleCloudComponent = fixture.debugElement.nativeElement.querySelector('adf-cloud-people');
                expect(peopleCloudComponent).toBeTruthy();
            });
        }));

        it('should update form on completed by user is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedBy'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const mockUser: IdentityUserModel[] = [{
                id: 'id',
                username: 'test'
            }];

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('completedBy');
            startedDateTypeControl.setValue('hruser');

            component.onChangedUser(mockUser, {
                key: 'completedBy',
                label: '',
                type: 'people',
                value: null,
                selectionMode: 'single'
            });

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.completedBy).toEqual(mockUser[0]);
                done();
            });
            component.onFilterChange();
        });

        it('should set the correct started date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'dueDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('dueDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);
            const dateFilter = {
                startFrom: moment().startOf('day').toISOString(true),
                startTo: moment().endOf('day').toISOString(true)
            };

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.dueDateFrom).toEqual(dateFilter.startFrom);
                expect(component.changedTaskFilter.dueDateTo).toEqual(dateFilter.startTo);
                done();
            });
            component.onFilterChange();
        });

        it('should have correct options on dueDate filters', () => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'dueDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-dueDateRange"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();

            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortOptions.length).toEqual(5);
            sortOptions[1].nativeElement.click('TODAY');
            sortOptions[2].nativeElement.click('TOMOROW');
            sortOptions[3].nativeElement.click('NEXT_7_DAYS');
            sortOptions[4].nativeElement.click('RANGE');
        });

        it('should update form on date range value is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'dueDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const dateFilter = {
                startDate: moment().startOf('day').toISOString(true),
                endDate: moment().endOf('day').toISOString(true)
            };

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('dueDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(dateFilter, {
                key: 'dueDateRange',
                label: '',
                type: 'date-range',
                value: '',
                attributes: {
                    dateType: 'dueDateType',
                    from: '_dueDateFrom',
                    to: '_dueDateTo'
                }
            });

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.dueDateFrom).toEqual(dateFilter.startDate);
                expect(component.changedTaskFilter.dueDateTo).toEqual(dateFilter.endDate);
                expect(component.changedTaskFilter.dueDateType).toEqual(DateCloudFilterType.RANGE);
                done();
            });
            component.onFilterChange();
        });

        it('should set the correct completed date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('completedDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);
            const dateFilter = {
                startFrom: moment().startOf('day').toISOString(true),
                startTo: moment().endOf('day').toISOString(true)
            };

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.completedFrom).toEqual(dateFilter.startFrom);
                expect(component.changedTaskFilter.completedTo).toEqual(dateFilter.startTo);
                done();
            });
            component.onFilterChange();
        });

        it('should update form on date range when completed value is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const dateFilter = {
                startDate: moment().startOf('day').toISOString(true),
                endDate: moment().endOf('day').toISOString(true)
            };

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('completedDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(dateFilter, {
                key: 'completedDateType',
                label: '',
                type: 'date-range',
                value: '',
                attributes: {
                    dateType: 'completedDateType',
                    from: '_completedFrom',
                    to: '_completedTo'
                }
            });

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.completedFrom).toEqual(dateFilter.startDate);
                expect(component.changedTaskFilter.completedTo).toEqual(dateFilter.endDate);
                done();
            });
            component.onFilterChange();
        });

        it('should set the correct created date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'createdDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('createdDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);
            const dateFilter = {
                startDate: moment().startOf('day').toISOString(true),
                endDate: moment().endOf('day').toISOString(true)
            };

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.createdFrom).toEqual(dateFilter.startDate);
                expect(component.changedTaskFilter.createdTo).toEqual(dateFilter.endDate);
                done();
            });

            component.onFilterChange();
        });

        it('should show the task assignment filter', () => {
            component.appName = 'fake';
            component.filterProperties = ['assignment'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            const assignmentComponent = fixture.debugElement.nativeElement.querySelector('adf-cloud-task-assignment-filter');
            expect(assignmentComponent).toBeTruthy();
        });

        it('should filter by user assignment', (done) => {
            const identityUserMock = { firstName: 'fake-identity-first-name', username: 'username', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };
            component.appName = 'fake';
            component.filterProperties = ['assignment'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            component.onAssignedChange(identityUserMock);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.assignee).toEqual(identityUserMock.username);
                done();
            });
            component.onFilterChange();
        });

        it('should update form on date range when createdDate value is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'createdDateRange'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const dateFilter = {
                startDate: moment().startOf('day').toISOString(true),
                endDate: moment().endOf('day').toISOString(true)
            };

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('createdDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(dateFilter, {
                key: 'createdDateType',
                label: '',
                type: 'date-range',
                value: '',
                attributes: {
                    dateType: 'createdDateType',
                    from: '_createdFrom',
                    to: '_createdTo'
                }
            });

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.createdFrom).toEqual(dateFilter.startDate);
                expect(component.changedTaskFilter.createdTo).toEqual(dateFilter.endDate);
                done();
            });

            component.onFilterChange();
        });

        it('should filter by candidateGroups assignment', (done) => {
            const identityGroupsMock = [
                { name: 'group1'},
                { name: 'group2'}
            ];
            component.appName = 'fake';
            component.filterProperties = ['assignment'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            component.onAssignedGroupsChange(identityGroupsMock);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.candidateGroups).toEqual(identityGroupsMock);
                done();
            });
            component.onFilterChange();
        });
    });

    describe('sort properties', () => {

        it('should display default sort properties', async(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortController = component.editTaskFilterForm.get('sort');
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortController.value).toBe('id');
                expect(sortOptions.length).toEqual(4);
            });
        }));

        it('should display sort properties when sort properties are specified', async(() => {
            component.sortProperties = ['id', 'name', 'processInstanceId'];
            getTaskFilterSpy.and.returnValue(of({
                sort: 'my-custom-sort',
                processInstanceId: 'process-instance-id',
                priority: '12'
            }));
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortController = component.editTaskFilterForm.get('sort');
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(component.sortProperties.length).toBe(3);
                expect(sortController.value).toBe('my-custom-sort');
                expect(sortOptions.length).toEqual(3);
            });
        }));

        it('should display default sort properties if input is empty', async(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            component.sortProperties = [];
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortController = component.editTaskFilterForm.get('sort');
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortController.value).toBe('id');
                expect(sortOptions.length).toEqual(4);
            });
        }));
    });

    describe('filter actions', () => {

        it('should display default filter actions', async(() => {
            component.toggleFilterActions = true;
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(component.taskFilterActions.map(action => action.actionType)).toEqual(['save', 'saveAs', 'delete']);
                expect(component.taskFilterActions.length).toBe(3);
                expect(saveButton.disabled).toBe(true);
                expect(saveAsButton.disabled).toBe(true);
                expect(deleteButton.disabled).toBe(false);
            });
        }));

        it('should display filter actions when input actions are specified', async(() => {
            component.actions = ['save'];
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            component.toggleFilterActions = true;
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(component.taskFilterActions.map(action => action.actionType)).toEqual(['save']);
                expect(component.taskFilterActions.length).toBe(1);
                expect(saveButton.disabled).toBeTruthy();
                const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(saveAsButton).toBeFalsy();
                expect(deleteButton).toBeFalsy();
            });
        }));

        it('should set the correct lastModifiedTo date', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'lastModified'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const lastModifiedToControl: AbstractControl = component.editTaskFilterForm.get('lastModifiedTo');
            lastModifiedToControl.setValue(new Date().toISOString());
            const lastModifiedToFilter = moment(lastModifiedToControl.value);
            lastModifiedToFilter.set({
                hour: 23,
                minute: 59,
                second: 59
            });

            component.filterChange.subscribe(() => {
                if (component.changedTaskFilter instanceof TaskFilterCloudModel) {
                    expect(component.changedTaskFilter.lastModifiedTo).toEqual(lastModifiedToFilter.toISOString(true));
                }
                done();
            });
            component.onFilterChange();
        });
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();
            spyOn(component.action, 'emit').and.callThrough();
        });

        it('should emit save event and save the filter on click save button', async(() => {
            component.toggleFilterActions = true;
            spyOn(service, 'updateFilter').and.returnValue(of({}));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            sortOptions[3].nativeElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(saveButton.disabled).toBe(false);
                saveButton.click();
                expect(service.updateFilter).toHaveBeenCalled();
                expect(component.action.emit).toHaveBeenCalled();
            });
        }));

        it('should emit delete event and delete the filter on click of delete button', async(() => {
            component.toggleFilterActions = true;
            spyOn(service, 'deleteFilter').and.returnValue(of({}));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(deleteButton.disabled).toBe(false);
                deleteButton.click();
                expect(service.deleteFilter).toHaveBeenCalled();
                expect(component.action.emit).toHaveBeenCalled();
            });
        }));

        it('should emit saveAs event and add filter on click saveAs button', async(() => {
            component.toggleFilterActions = true;
            spyOn(service, 'addFilter').and.returnValue(of({}));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            sortElement.click();
            fixture.detectChanges();
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            sortOptions[2].nativeElement.click();
            fixture.detectChanges();
            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(saveAsButton.disabled).toBe(false);
                saveAsButton.click();
                expect(service.addFilter).toHaveBeenCalled();
                expect(component.action.emit).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalled();
            });
        }));

        it('should call restore default filters service on deletion of last filter', async(() => {
            component.toggleFilterActions = true;
            spyOn(service, 'deleteFilter').and.returnValue(of([]));
            const restoreDefaultFiltersSpy = spyOn(component, 'restoreDefaultTaskFilters').and.returnValue(of([]));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(deleteButton.disabled).toBe(false);
                deleteButton.click();
                expect(service.deleteFilter).toHaveBeenCalled();
                expect(component.action.emit).toHaveBeenCalled();
                expect(restoreDefaultFiltersSpy).toHaveBeenCalled();
            });
        }));

        it('should not call restore default filters service on deletion of first filter', async(() => {
            component.toggleFilterActions = true;
            spyOn(service, 'deleteFilter').and.returnValue(of([{ name: 'mock-filter-name' }]));
            const restoreDefaultFiltersSpy = spyOn(component, 'restoreDefaultTaskFilters').and.returnValue(of([]));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(deleteButton.disabled).toBe(false);
                deleteButton.click();
                expect(service.deleteFilter).toHaveBeenCalled();
                expect(component.action.emit).toHaveBeenCalled();
                expect(restoreDefaultFiltersSpy).not.toHaveBeenCalled();
            });
        }));
    });
});
