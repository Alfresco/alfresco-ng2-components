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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlfrescoApiService, setupTestBed } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
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
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { DateCloudFilterType } from '../../../../models/date-cloud-filter.model';
import { AssignmentType, TaskFilterCloudModel, TaskStatusFilter } from '../../models/filter-cloud.model';
import { PeopleCloudModule } from '../../../../people/people-cloud.module';
import { ProcessDefinitionCloud } from '../../../../models/process-definition-cloud.model';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import {
    mockAlfrescoApi,
    mockCompletedDateFilter,
    mockCreatedDateFilter,
    mockDateFilterFromTo,
    mockDateFilterStartEnd,
    mockDefaultTaskFilter,
    mockDueDateFilter,
    mockTaskFilterIdChange,
    mockTaskFilterResponse,
    mockTaskFilterResponseWithProcessInstanceIdNull
} from '../../mock/edit-task-filter-cloud.mock';
import { mockFoodUsers } from '../../../../people/mock/people-cloud.mock';
import { mockFoodGroups } from '../../../../group/mock/group-cloud.mock';
import { SimpleChanges } from '@angular/core';
import { TaskFilterDialogCloudComponent } from '../task-filter-dialog/task-filter-dialog-cloud.component';

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
    const afterClosedSubject = new Subject<any>();

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            TaskFiltersCloudModule,
            PeopleCloudModule,
            MatIconTestingModule
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
        const dialogRefMock: any = {
            afterClosed: () =>  afterClosedSubject
        };
        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mockAlfrescoApi);
        getTaskFilterSpy = spyOn(service, 'getTaskFilterById').and.returnValue(of(fakeFilter));
        getRunningApplicationsSpy = spyOn(appsService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should fetch task filter by taskId', async () => {
        component.ngOnChanges({ id: mockTaskFilterIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(getTaskFilterSpy).toHaveBeenCalled();
        expect(component.taskFilter.name).toEqual('FakeInvolvedTasks');
        expect(component.taskFilter.icon).toEqual('adjust');
        expect(component.taskFilter.status).toEqual(TaskStatusFilter.CREATED);
        expect(component.taskFilter.order).toEqual('ASC');
        expect(component.taskFilter.sort).toEqual('id');
    });

    describe('processInstanceId filter', () => {

        const cssSelector = {
            processInstanceIdInput: '[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'
        };

        function expandFilterPanel(){
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
        }

        function getProcessInstanceIdInputElement(){
            return fixture.debugElement.query(By.css(cssSelector.processInstanceIdInput)).nativeElement;
        }

        it('should set processInstanceId filter when id changes', async () => {
            getTaskFilterSpy.and.returnValue(of(mockTaskFilterResponse));
            component.processInstanceId = 'fakeProcessInstanceId';
            component.filterProperties = [ 'appName', 'processInstanceId', 'sort', 'order'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            await fixture.whenStable();
            expandFilterPanel();
            expect(getProcessInstanceIdInputElement().value).toEqual('fakeProcessInstanceId');
        });

        it('should processInstanceId filter be empty string if processInstanceId is null', async () => {
            getTaskFilterSpy.and.returnValue(of(mockTaskFilterResponseWithProcessInstanceIdNull));
            component.processInstanceId = null;
            component.filterProperties = [ 'appName', 'processInstanceId', 'sort', 'order'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            await fixture.whenStable();
            expandFilterPanel();
            expect(getProcessInstanceIdInputElement().value).toEqual('');
        });

        it('should processInstanceId filter be empty string if processInstanceId is undefined', async () => {
            getTaskFilterSpy.and.returnValue(of(mockTaskFilterResponseWithProcessInstanceIdNull));
            component.processInstanceId = undefined;
            component.filterProperties = [ 'appName', 'processInstanceId', 'sort', 'order'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            await fixture.whenStable();
            expandFilterPanel();
            expect(getProcessInstanceIdInputElement().value).toEqual('');
        });

        it('should processInstanceId filter be set with the processInstanceId from response if processInstanceId input is null', async () => {
            getTaskFilterSpy.and.returnValue(of(mockTaskFilterResponse));
            component.processInstanceId = null;
            component.filterProperties = [ 'appName', 'processInstanceId', 'sort', 'order'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            await fixture.whenStable();
            expandFilterPanel();
            expect(getProcessInstanceIdInputElement().value).toEqual('fakeProcessInstanceIdFromResponse');
        });

        it('should processInstanceId filter be set with the processInstanceId from response if processInstanceId input is undefined', async () => {
            getTaskFilterSpy.and.returnValue(of(mockTaskFilterResponse));
            component.processInstanceId = undefined;
            component.filterProperties = [ 'appName', 'processInstanceId', 'sort', 'order'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            await fixture.whenStable();
            expandFilterPanel();
            expect(getProcessInstanceIdInputElement().value).toEqual('fakeProcessInstanceIdFromResponse');
        });

    });

    it('should fetch process definitions when processDefinitionName filter property is set', async () => {
        const processSpy = spyOn(taskService, 'getProcessDefinitions').and.returnValue(of([new ProcessDefinitionCloud({ id: 'fake-id', name: 'fake-name' })]));
        fixture.detectChanges();
        component.filterProperties = ['processDefinitionName'];
        fixture.detectChanges();
        component.ngOnChanges({ id: mockTaskFilterIdChange });
        fixture.detectChanges();
        const controller = component.editTaskFilterForm.get('processDefinitionName');

        fixture.detectChanges();
        await fixture.whenStable();

        expect(processSpy).toHaveBeenCalled();
        expect(controller).toBeDefined();
    });

    it('should display filter name as title', async () => {
        component.ngOnChanges({ id: mockTaskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
    });

    it('should not display filter name if showFilterName is false', async () => {
        component.showTaskFilterName = false;
        component.ngOnChanges({ id: mockTaskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        expect(title).toBeNull();
    });

    it('should not display mat-spinner if isloading set to false', async () => {
        component.ngOnChanges({ id: mockTaskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-task-filter-loading-margin');

        expect(matSpinnerElement).toBeNull();
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
    });

    it('should display mat-spinner if isloading set to true', async () => {
        component.isLoading = true;
        component.ngOnChanges({ id: mockTaskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-task-filter-loading-margin');
        expect(matSpinnerElement).toBeDefined();
    });

    describe('EditTaskFilter form', () => {

        beforeEach(() => {
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
        });

        it('should create editTaskFilter form with default user task properties', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const stateController = component.editTaskFilterForm.get('status');
            const sortController = component.editTaskFilterForm.get('sort');
            const orderController = component.editTaskFilterForm.get('order');
            const assigneeController = component.editTaskFilterForm.get('assignee');
            expect(component.editTaskFilterForm).toBeDefined();
            expect(assigneeController).toBeDefined();
            expect(stateController.value).toBe(TaskStatusFilter.CREATED);
            expect(sortController.value).toBe('id');
            expect(orderController.value).toBe('ASC');
            expect(assigneeController.value).toBe('fake-involved');
        });

        describe('Save & Delete buttons', () => {
            it('should disable save and delete button for default task filters', async () => {
                getTaskFilterSpy.and.returnValue(of(mockDefaultTaskFilter));

                component.ngOnChanges({ id: mockTaskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toBe(true);
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(deleteButton.disabled).toBe(true);
            });

            it('should enable delete button for custom task filters', async () => {
                component.ngOnChanges({ id: mockTaskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toBe(true);
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(deleteButton.disabled).toBe(false);
            });

            it('should enable save button if the filter is changed for custom task filters', (done) => {
                component.ngOnChanges({ id: mockTaskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editTaskFilterForm.valueChanges
                    .pipe(debounceTime(500))
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

            it('should disable save button if the filter is not changed for custom filter', async () => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toBe(true);
            });
        });

        describe('SaveAs button', () => {
            it('should disable saveAs button if the process filter is not changed for default filter', async () => {
                getTaskFilterSpy.and.returnValue(of(mockDefaultTaskFilter));
                component.ngOnChanges({ id: mockTaskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toEqual(true);
            });

            it('should disable saveAs button if the process filter is not changed for custom filter', async () => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toEqual(true);
            });

            it('should enable saveAs button if the filter values are changed for default filter', (done) => {
                getTaskFilterSpy.and.returnValue(of(mockDefaultTaskFilter));

                component.ngOnChanges({ id: mockTaskFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editTaskFilterForm.valueChanges
                    .pipe(debounceTime(500))
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
                    .pipe(debounceTime(500))
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

        it('should display current task filter details', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"]');
            const assigneeElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-assignee"]');
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
            expect(assigneeElement).toBeDefined();
            expect(stateElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.CREATED');
            expect(sortElement.textContent.trim()).toBe('id');
            expect(orderElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.DIRECTION.ASCENDING');
        });

        it('should display all the statuses that are defined in the task filter', () => {

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"]');
            stateElement.click();
            fixture.detectChanges();

            const statusOptions = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-edit-task-property-options-status"]'));

            expect(statusOptions[0].nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.ALL');
            expect(statusOptions[1].nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.CREATED');
            expect(statusOptions[2].nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.ASSIGNED');
            expect(statusOptions[3].nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.SUSPENDED');
            expect(statusOptions[4].nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.CANCELLED');
            expect(statusOptions[5].nativeElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.STATUS.COMPLETED');
        });

        it('should display sort drop down', async () => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortOptions.length).toEqual(4);
        });

        it('should display order drop down', async () => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
            orderElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(orderOptions.length).toEqual(2);
        });

        it('should able to build a editTaskFilter form with default properties if input is empty', async () => {
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            component.filterProperties = [];
            fixture.detectChanges();
            const statusController = component.editTaskFilterForm.get('status');
            const sortController = component.editTaskFilterForm.get('sort');
            const orderController = component.editTaskFilterForm.get('order');

            await fixture.whenStable();

            expect(component.taskFilterProperties.length).toBe(4);
            expect(component.editTaskFilterForm).toBeDefined();
            expect(statusController.value).toBe(TaskStatusFilter.CREATED);
            expect(sortController.value).toBe('id');
            expect(orderController.value).toBe('ASC');
        });

        it('should able to fetch running applications when appName property defined in the input', async () => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            const appController = component.editTaskFilterForm.get('appName');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getRunningApplicationsSpy).toHaveBeenCalled();
            expect(appController).toBeDefined();
            expect(appController.value).toBe('mock-app-name');
        });

        it('should fetch data in completedBy filter', async () => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedBy'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            const appController = component.editTaskFilterForm.get('completedBy');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(appController).toBeDefined();
            expect(JSON.stringify(appController.value)).toBe(JSON.stringify({
                id: 'mock-id',
                username: 'testCompletedByUser'
            }));
        });

        it('should show completedBy filter', async () => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedBy'];
            fixture.detectChanges();
            component.ngOnChanges({ id: mockTaskFilterIdChange });

            fixture.detectChanges();
            await fixture.whenStable();

            const peopleCloudComponent = fixture.debugElement.nativeElement.querySelector('adf-cloud-people');
            expect(peopleCloudComponent).toBeTruthy();
        });

        it('should update form on completed by user is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedBy'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('completedBy');
            startedDateTypeControl.setValue('hruser');

            component.onChangedUser(mockFoodUsers, {
                key: 'completedBy',
                label: '',
                type: 'people',
                value: null,
                selectionMode: 'single'
            });

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.completedBy).toEqual(mockFoodUsers[0]);
                done();
            });
            component.onFilterChange();
        });

        it('should set the correct started date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'dueDateRange'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('dueDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.dueDateFrom).toEqual(mockDateFilterFromTo.startFrom);
                expect(component.changedTaskFilter.dueDateTo).toEqual(mockDateFilterFromTo.startTo);
                done();
            });
            component.onFilterChange();
        });

        it('should have correct options on dueDate filters', () => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'dueDateRange'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
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
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('dueDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(mockDateFilterStartEnd, mockDueDateFilter);

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.dueDateFrom).toEqual(mockDateFilterStartEnd.startDate);
                expect(component.changedTaskFilter.dueDateTo).toEqual(mockDateFilterStartEnd.endDate);
                expect(component.changedTaskFilter.dueDateType).toEqual(DateCloudFilterType.RANGE);
                done();
            });
            component.onFilterChange();
        });

        it('should set the correct completed date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('completedDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.completedFrom).toEqual(mockDateFilterFromTo.startFrom);
                expect(component.changedTaskFilter.completedTo).toEqual(mockDateFilterFromTo.startTo);
                done();
            });
            component.onFilterChange();
        });

        it('should update form on date range when completed value is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('completedDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(mockDateFilterStartEnd, mockCompletedDateFilter);

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.completedFrom).toEqual(mockDateFilterStartEnd.startDate);
                expect(component.changedTaskFilter.completedTo).toEqual(mockDateFilterStartEnd.endDate);
                done();
            });
            component.onFilterChange();
        });

        it('should set the correct created date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'createdDateRange'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('createdDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.createdFrom).toEqual(mockDateFilterStartEnd.startDate);
                expect(component.changedTaskFilter.createdTo).toEqual(mockDateFilterStartEnd.endDate);
                done();
            });

            component.onFilterChange();
        });

        it('should show the task assignment filter', () => {
            component.appName = 'fake';
            component.filterProperties = ['assignment'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            const assignmentComponent = fixture.debugElement.nativeElement.querySelector('adf-cloud-task-assignment-filter');
            expect(assignmentComponent).toBeTruthy();
        });

        it('should filter by user assignment', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['assignment'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            component.onAssignedUsersChange(mockFoodUsers);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.assignedUsers).toEqual(mockFoodUsers);
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                done();
            });
            component.onFilterChange();
        });

        it('should update form on date range when createdDate value is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'createdDateRange'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const startedDateTypeControl: AbstractControl = component.editTaskFilterForm.get('createdDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(mockDateFilterStartEnd, mockCreatedDateFilter);

            fixture.detectChanges();
            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.createdFrom).toEqual(mockDateFilterStartEnd.startDate);
                expect(component.changedTaskFilter.createdTo).toEqual(mockDateFilterStartEnd.endDate);
                done();
            });

            component.onFilterChange();
        });

        it('should filter by candidateGroups assignment', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['assignment'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            component.onAssignedGroupsChange(mockFoodGroups);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.candidateGroups).toEqual(mockFoodGroups);
                expect(component.changedTaskFilter.assignedUsers).toBeNull();
                done();
            });
            component.onFilterChange();
        });
    });

    describe('assignment type change', () => {

        beforeEach(() => {
            component.appName = 'fake';
            component.filterProperties = ['assignment', 'status'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
        });

        it('should UNASSIGNED assignment type set status to CREATED', (done) => {
            component.onAssignmentTypeChange(AssignmentType.UNASSIGNED);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.status).toEqual(TaskStatusFilter.CREATED);
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                done();
            });
            component.onFilterChange();
        });

        it('should NONE assignment type set status to ALL', (done) => {
            component.onAssignmentTypeChange(AssignmentType.NONE);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.status).toEqual(null);
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                done();
            });
            component.onFilterChange();
        });

        it('should ASSIGNED_TO status set assignment type to ASSIGNED', (done) => {
            component.onAssignmentTypeChange(AssignmentType.ASSIGNED_TO);

            component.filterChange.subscribe(() => {
                expect(component.changedTaskFilter.status).toEqual(TaskStatusFilter.ASSIGNED);
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                expect(component.changedTaskFilter.candidateGroups).toBeNull();
                done();
            });
            component.onFilterChange();
        });
    });

    describe('sort properties', () => {

        it('should display default sort properties', async () => {
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortController = component.editTaskFilterForm.get('sort');
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortController.value).toBe('id');
            expect(sortOptions.length).toEqual(4);
        });

        it('should display sort properties when sort properties are specified', async () => {
            component.sortProperties = ['id', 'name', 'processInstanceId'];
            getTaskFilterSpy.and.returnValue(of({
                sort: 'my-custom-sort',
                processInstanceId: 'process-instance-id',
                priority: '12'
            }));
            fixture.detectChanges();

            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortController = component.editTaskFilterForm.get('sort');
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(component.sortProperties.length).toBe(3);
            expect(sortController.value).toBe('my-custom-sort');
            expect(sortOptions.length).toEqual(3);
        });

        it('should display default sort properties if input is empty', async () => {
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            component.sortProperties = [];
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortController = component.editTaskFilterForm.get('sort');
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortController.value).toBe('id');
            expect(sortOptions.length).toEqual(4);
        });
    });

    describe('filter actions', () => {

        it('should display default filter actions', async () => {
            component.toggleFilterActions = true;
            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(component.taskFilterActions.map(action => action.actionType)).toEqual(['save', 'saveAs', 'delete']);
            expect(component.taskFilterActions.length).toBe(3);
            expect(saveButton.disabled).toBe(true);
            expect(saveAsButton.disabled).toBe(true);
            expect(deleteButton.disabled).toBe(false);
        });

        it('should display filter actions when input actions are specified', async () => {
            component.actions = ['save'];
            fixture.detectChanges();

            component.ngOnChanges({ id: mockTaskFilterIdChange });
            fixture.detectChanges();

            component.toggleFilterActions = true;
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            expect(component.taskFilterActions.map(action => action.actionType)).toEqual(['save']);
            expect(component.taskFilterActions.length).toBe(1);
            expect(saveButton.disabled).toBeTruthy();
            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(saveAsButton).toBeFalsy();
            expect(deleteButton).toBeFalsy();
        });

        it('should set the correct lastModifiedTo date', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'lastModified'];
            component.ngOnChanges({ id: mockTaskFilterIdChange });
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
            component.changedTaskFilter = { name: 'mock-filter-name' } as TaskFilterCloudModel;
            component.ngOnChanges({ id: mockTaskFilterIdChange } as SimpleChanges);
            spyOn(component.action, 'emit').and.stub();
            component.toggleFilterActions = true;
        });

        it('should emit save event and save the filter on click save button', fakeAsync(() => {
            spyOn(service, 'updateFilter').and.returnValue(of([new TaskFilterCloudModel({ name: 'mock-filter-name' })]));
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            tick();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            tick();
            const sortOptions = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-edit-task-property-options-sort"] .mat-option-ripple'));
            sortOptions[3].nativeElement.click();
            fixture.detectChanges();
            tick(550);

            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            saveButton.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick();

            expect(service.updateFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
        }));

        it('should emit delete event and delete the filter on click of delete button', async () => {
            spyOn(service, 'deleteFilter').and.returnValue(of(null));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(deleteButton.getAttribute('disabled')).toBeNull();
            deleteButton.click();
            expect(service.deleteFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
        });

        it('should emit saveAs event and add filter on click saveAs button', async () => {
            spyOn(service, 'addFilter').and.returnValue(of(null));
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();

            const sortOptions = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-edit-task-property-options-sort"] .mat-option-ripple'));
            sortOptions[3].nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            saveButton.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            afterClosedSubject.next({
                action: TaskFilterDialogCloudComponent.ACTION_SAVE,
                icon: 'icon',
                name: 'fake-name'
            });
            await fixture.whenStable();

            expect(service.addFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
            expect(dialog.open).toHaveBeenCalled();
        });

        it('should call restore default filters service on deletion of last filter', async () => {
            spyOn(service, 'deleteFilter').and.returnValue(of([]));
            const restoreDefaultFiltersSpy = spyOn(component, 'restoreDefaultTaskFilters').and.returnValue(of([]));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(deleteButton.disabled).toBe(false);
            deleteButton.click();
            expect(service.deleteFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
            expect(restoreDefaultFiltersSpy).toHaveBeenCalled();
        });

        it('should not call restore default filters service on deletion of first filter', async () => {
            spyOn(service, 'deleteFilter').and.returnValue(of([new TaskFilterCloudModel({ name: 'mock-filter-name' })]));
            const restoreDefaultFiltersSpy = spyOn(component, 'restoreDefaultTaskFilters').and.returnValue(of([]));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(deleteButton.disabled).toBe(false);
            deleteButton.click();
            expect(service.deleteFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
            expect(restoreDefaultFiltersSpy).not.toHaveBeenCalled();
        });
    });
});
