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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../../services/local-preference-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { AppsProcessCloudService } from '../../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance, fakeApplicationInstanceWithEnvironment } from '../../../../app/mock/app-model.mock';
import { TaskFiltersCloudModule } from '../../task-filters-cloud.module';
import { ServiceTaskFilterCloudService } from '../../services/service-task-filter-cloud.service';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { fakeServiceFilter } from '../../mock/task-filters-cloud.mock';
import { TranslateModule } from '@ngx-translate/core';
import { EditServiceTaskFilterCloudComponent } from './edit-service-task-filter-cloud.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ProcessDefinitionCloud } from '../../../../models/process-definition-cloud.model';
import { TaskFilterDialogCloudComponent } from '../task-filter-dialog/task-filter-dialog-cloud.component';
import { fakeEnvironmentList } from '../../../../common/mock/environment.mock';
import { mockApplicationTaskFilterProperties } from '../../mock/edit-task-filter-cloud.mock';

describe('EditServiceTaskFilterCloudComponent', () => {
    let component: EditServiceTaskFilterCloudComponent;
    let service: ServiceTaskFilterCloudService;
    let appsService: AppsProcessCloudService;
    let fixture: ComponentFixture<EditServiceTaskFilterCloudComponent>;
    let dialog: MatDialog;
    let getTaskFilterSpy: jasmine.Spy;
    let getRunningApplicationsSpy: jasmine.Spy;
    let taskService: TaskCloudService;
    const afterClosedSubject = new Subject<any>();

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            TaskFiltersCloudModule,
            MatIconTestingModule
        ],
        providers: [
            MatDialog,
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditServiceTaskFilterCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ServiceTaskFilterCloudService);
        appsService = TestBed.inject(AppsProcessCloudService);
        taskService = TestBed.inject(TaskCloudService);
        dialog = TestBed.inject(MatDialog);
        const dialogRefMock: any = {
            afterClosed: () =>  afterClosedSubject
        };
        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
        getTaskFilterSpy = spyOn(service, 'getTaskFilterById').and.returnValue(of(fakeServiceFilter));
        getRunningApplicationsSpy = spyOn(appsService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should fetch task filter by taskId', async () => {
        const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ id: taskFilterIdChange });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(getTaskFilterSpy).toHaveBeenCalled();
        expect(component.taskFilter.name).toEqual('FakeInvolvedTasks');
        expect(component.taskFilter.icon).toEqual('adjust');
        expect(component.taskFilter.status).toEqual('COMPLETED');
        expect(component.taskFilter.order).toEqual('ASC');
        expect(component.taskFilter.sort).toEqual('id');
    });

    it('should fetch process definitions when processDefinitionName filter property is set', async () => {
        const processSpy = spyOn(taskService, 'getProcessDefinitions').and.returnValue(of([
            new ProcessDefinitionCloud({ id: 'fake-id', name: 'fake-name' })
        ]));
        fixture.detectChanges();
        component.filterProperties = ['processDefinitionName'];
        fixture.detectChanges();
        const taskFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: taskFilterIdChange });
        fixture.detectChanges();
        const controller = component.editTaskFilterForm.get('processDefinitionName');

        fixture.detectChanges();
        await fixture.whenStable();

        expect(processSpy).toHaveBeenCalled();
        expect(controller).toBeDefined();
    });

    it('should display filter name as title', async () => {
        const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ id: taskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
    });

    it('should not display filter name if showFilterName is false', async () => {
        const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
        component.showTaskFilterName = false;
        component.ngOnChanges({ id: taskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        expect(title).toBeNull();
    });

    it('should not display mat-spinner if isloading set to false', async () => {
        const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
        component.ngOnChanges({ id: taskFilterIdChange });

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
        const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
        component.ngOnChanges({ id: taskFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-task-filter-loading-margin');
        expect(matSpinnerElement).toBeDefined();
    });

    describe('EditServiceTaskFilter form', () => {

        beforeEach(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
            fixture.detectChanges();
        });

        it('should create editTaskFilter form with default user task properties', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const appNameController = component.editTaskFilterForm.get('appName');
            const statusController = component.editTaskFilterForm.get('status');
            const sortController = component.editTaskFilterForm.get('sort');
            const orderController = component.editTaskFilterForm.get('order');
            const activityNameController = component.editTaskFilterForm.get('activityName');
            expect(component.editTaskFilterForm).toBeDefined();
            expect(appNameController.value).toBe('mock-app-name');
            expect(statusController.value).toBe('COMPLETED');
            expect(sortController.value).toBe('id');
            expect(orderController.value).toBe('ASC');
            expect(activityNameController.value).toBe('fake-activity');
        });

        describe('Save & Delete buttons', () => {
            it('should disable save and delete button for default task filters', async () => {
                getTaskFilterSpy.and.returnValue(of({
                    name: 'ADF_CLOUD_SERVICE_TASK_FILTERS.ALL_SERVICE_TASKS',
                    id: 'filter-id',
                    key: 'all-fake-task',
                    icon: 'adjust',
                    sort: 'startDate',
                    status: 'ALL',
                    order: 'DESC'
                }));

                const taskFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ id: taskFilterIdChange });
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
                const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
                component.ngOnChanges({ id: taskFilterIdChange });
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
                const taskFilterIdChange = new SimpleChange(null, 'mock-task-filter-id', true);
                component.ngOnChanges({ id: taskFilterIdChange });
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
                component.ngOnChanges({ id: taskFilterIdChange });
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
                component.ngOnChanges({ id: taskFilterIdChange });
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
            expect(stateElement.textContent.trim()).toBe('ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.COMPLETED');
            expect(sortElement.textContent.trim()).toBe('id');
            expect(orderElement.textContent.trim()).toBe('ADF_CLOUD_TASK_FILTERS.DIRECTION.ASCENDING');
        });

        it('should display all the statuses that are defined in the task filter', async () => {
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"]');
            stateElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const statusOptions = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-edit-task-property-options-status"]'));

            expect(statusOptions[0].nativeElement.textContent.trim()).toBe('ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.ALL');
            expect(statusOptions[1].nativeElement.textContent.trim()).toBe('ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.STARTED');
            expect(statusOptions[2].nativeElement.textContent.trim()).toBe('ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.COMPLETED');
            expect(statusOptions[3].nativeElement.textContent.trim()).toBe('ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.CANCELLED');
            expect(statusOptions[4].nativeElement.textContent.trim()).toBe('ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.ERROR');
        });

        it('should display sort drop down', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortOptions.length).toEqual(4);
        });

        it('should display order drop down', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
            orderElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(orderOptions.length).toEqual(2);
        });

        it('should have floating labels when values are present', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const inputLabelsNodes = document.querySelectorAll('mat-form-field');
            inputLabelsNodes.forEach(labelNode => {
                expect(labelNode.getAttribute('ng-reflect-float-label')).toBe('auto');
            });
        });

        it('should able to build a editTaskFilter form with default properties if input is empty', async () => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
            component.filterProperties = [];

            fixture.detectChanges();
            await fixture.whenStable();

            const stateController = component.editTaskFilterForm.get('status');
            const sortController = component.editTaskFilterForm.get('sort');
            const orderController = component.editTaskFilterForm.get('order');
            const activityNameController = component.editTaskFilterForm.get('activityName');

            expect(component.taskFilterProperties.length).toBe(5);
            expect(component.editTaskFilterForm).toBeDefined();
            expect(stateController.value).toBe('COMPLETED');
            expect(sortController.value).toBe('id');
            expect(orderController.value).toBe('ASC');
            expect(activityNameController.value).toBe('fake-activity');
        });

        it('should able to fetch running applications when appName property defined in the input', async () => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority'];
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
            const appController = component.editTaskFilterForm.get('appName');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getRunningApplicationsSpy).toHaveBeenCalled();
            expect(appController).toBeDefined();
            expect(appController.value).toBe('mock-app-name');
        });
    });

    describe('sort properties', () => {

        it('should display default sort properties', async () => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
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
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ id: taskFilterIdChange });
            fixture.detectChanges();
            spyOn(component.action, 'emit').and.callThrough();
        });

        it('should emit save event and save the filter on click save button', async () => {
            component.toggleFilterActions = true;
            spyOn(service, 'updateFilter').and.returnValue(of(null));
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
            await fixture.whenStable();
            fixture.detectChanges();
            expect(saveButton.disabled).toBe(false);
            saveButton.click();
            expect(service.updateFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
        });

        it('should emit delete event and delete the filter on click of delete button', async () => {
            component.toggleFilterActions = true;
            spyOn(service, 'deleteFilter').and.returnValue(of(null));
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            await fixture.whenStable();
            fixture.detectChanges();
            expect(deleteButton.disabled).toBe(false);
            deleteButton.click();
            expect(service.deleteFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
        });

        it('should emit saveAs event and add filter on click saveAs button', async () => {
            component.toggleFilterActions = true;
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
            await fixture.whenStable();
            fixture.detectChanges();
            expect(deleteButton.disabled).toBe(false);
            deleteButton.click();
            expect(service.deleteFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
            expect(restoreDefaultFiltersSpy).toHaveBeenCalled();
        });

        it('should not call restore default filters service on deletion of first filter', async () => {
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
            await fixture.whenStable();
            fixture.detectChanges();
            expect(deleteButton.disabled).toBe(false);
            deleteButton.click();
            expect(service.deleteFilter).toHaveBeenCalled();
            expect(component.action.emit).toHaveBeenCalled();
            expect(restoreDefaultFiltersSpy).not.toHaveBeenCalled();
        });
    });

    it('should add environment name to each application selector option label', () => {
        component.appName = fakeApplicationInstance[0].name;
        component.environmentList = fakeEnvironmentList;

        getRunningApplicationsSpy.and.returnValue(of(fakeApplicationInstanceWithEnvironment));
        spyOn(component, 'createTaskFilterProperties').and.returnValue(mockApplicationTaskFilterProperties);

        const filteredProperties = component.createAndFilterProperties();
        expect(filteredProperties[0].options[0].label).toBe('application-new-1 (test-env-name-1)');
    });
});
