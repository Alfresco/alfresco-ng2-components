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

import { setupTestBed } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';

import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance } from '../../../app/mock/app-model.mock';
import { TaskFilterCloudModel } from '../models/filter-cloud.model';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { EditTaskFilterCloudComponent } from './edit-task-filter-cloud.component';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';

describe('EditTaskFilterCloudComponent', () => {
    let component: EditTaskFilterCloudComponent;
    let service: TaskFilterCloudService;
    let appsService: AppsProcessCloudService;
    let fixture: ComponentFixture<EditTaskFilterCloudComponent>;
    let dialog: MatDialog;
    let getTaskFilterSpy: jasmine.Spy;
    let getRunningApplicationsSpy: jasmine.Spy;

    let fakeFilter = new TaskFilterCloudModel({
        name: 'FakeInvolvedTasks',
        icon: 'adjust',
        id: 'mock-task-filter-id',
        state: 'CREATED',
        appName: 'mock-app-name',
        processDefinitionId: 'process-def-id',
        assignment: 'fake-involved',
        order: 'ASC',
        sort: 'id'
    });

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, TaskFiltersCloudModule],
        providers: [MatDialog]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditTaskFilterCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TaskFilterCloudService);
        appsService = TestBed.get(AppsProcessCloudService);
        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.returnValue({ afterClosed() { return of({
            action: TaskFilterDialogCloudComponent.ACTION_SAVE,
            icon: 'icon',
            name: 'fake-name'
        }); }});
        getTaskFilterSpy = spyOn(service, 'getTaskFilterById').and.returnValue(fakeFilter);
        getRunningApplicationsSpy = spyOn(appsService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        fixture.detectChanges();
    });

    it('should create EditTaskFilterCloudComponent', () => {
        expect(component instanceof EditTaskFilterCloudComponent).toBeTruthy();
    });

    it('should fetch task filter by taskId', async(() => {
        let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIDchange});
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getTaskFilterSpy).toHaveBeenCalled();
            expect(component.taskFilter.name).toEqual('FakeInvolvedTasks');
            expect(component.taskFilter.icon).toEqual('adjust');
            expect(component.taskFilter.state).toEqual('CREATED');
            expect(component.taskFilter.order).toEqual('ASC');
            expect(component.taskFilter.sort).toEqual('id');
        });
    }));

    it('should display filter name as title', () => {
        let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIDchange});
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
    });

    describe('EditTaskFilter form', () => {

        beforeEach(() => {
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({'id': taskFilterIDchange});
            fixture.detectChanges();
        });

        it('should defined editTaskFilter form ', () => {
             expect(component.editTaskFilterForm).toBeDefined();
        });

        it('should create editTaskFilter form with default properties', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const stateController = component.editTaskFilterForm.get('state');
                const sortController = component.editTaskFilterForm.get('sort');
                const orderController = component.editTaskFilterForm.get('order');
                const assignmentController = component.editTaskFilterForm.get('assignment');
                expect(component.editTaskFilterForm).toBeDefined();
                expect(stateController).toBeDefined();
                expect(sortController).toBeDefined();
                expect(orderController).toBeDefined();
                expect(assignmentController).toBeDefined();

                expect(stateController.value).toBe('CREATED');
                expect(sortController.value).toBe('id');
                expect(orderController.value).toBe('ASC');
                expect(assignmentController.value).toBe('fake-involved');
            });
        }));

        it('should disable save button if the task filter is not changed', async(() => {
            component.toggleFilterActions = true;
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should disable saveAs button if the task filter is not changed', async(() => {
            component.toggleFilterActions = true;
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should enable delete button by default', async(() => {
            component.toggleFilterActions = true;
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(deleteButton.disabled).toBe(false);
            });
        }));

        it('should display current task filter details', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                let stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-state"]');
                let assignmentElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-assignment"]');
                let sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
                let orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
                expect(stateElement).toBeDefined();
                expect(assignmentElement).toBeDefined();
                expect(sortElement).toBeDefined();
                expect(orderElement).toBeDefined();
                expect(stateElement.textContent.trim()).toBe('CREATED');
                expect(sortElement.textContent.trim()).toBe('Id');
                expect(orderElement.textContent.trim()).toBe('ASC');
            });
        }));

        it('should display state drop down', async(() => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-state"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(statusOptions.length).toEqual(7);
            });
        }));

        it('should display sort drop down', async(() => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortOptions.length).toEqual(5);
            });
        }));

        it('should display order drop down', async(() => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-order"]');
            orderElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(orderOptions.length).toEqual(2);
            });
        }));

        it('should able to build a editTaskFilter form with default properties if input is empty', async(() => {
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            component.filterProperties = [];
            fixture.detectChanges();
            const stateController = component.editTaskFilterForm.get('state');
            const sortController = component.editTaskFilterForm.get('sort');
            const orderController = component.editTaskFilterForm.get('order');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.taskFilterProperties).toBeDefined();
                expect(component.taskFilterProperties.length).toBe(4);
                expect(component.editTaskFilterForm).toBeDefined();
                expect(stateController).toBeDefined();
                expect(sortController).toBeDefined();
                expect(orderController).toBeDefined();
                expect(stateController.value).toBe('CREATED');
                expect(sortController.value).toBe('id');
                expect(orderController.value).toBe('ASC');
            });
        }));
    });

    describe('Task filterProperties', () => {

        beforeEach(() => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority'];
            fixture.detectChanges();
        });

        it('should able to fetch running applications when appName property defined in the input', async(() => {
            fixture.detectChanges();
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            const appController = component.editTaskFilterForm.get('appName');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getRunningApplicationsSpy).toHaveBeenCalled();
                expect(appController).toBeDefined();
                expect(appController.value).toBe('mock-app-name');
            });
        }));

        it('should able to build a editTaskFilter form with given input properties', async(() => {
            getTaskFilterSpy.and.returnValue({ appName: 'mock-app-name', processInstanceId: 'process-instance-id', priority: '12' });
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            const appController = component.editTaskFilterForm.get('appName');
            const priorityController = component.editTaskFilterForm.get('priority');
            const processInsIdController = component.editTaskFilterForm.get('processInstanceId');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.taskFilterProperties).toBeDefined();
                expect(component.editTaskFilterForm).toBeDefined();
                expect(component.taskFilterProperties.length).toBe(3);
                expect(appController).toBeDefined();
                expect(priorityController).toBeDefined();
                expect(processInsIdController).toBeDefined();
                expect(appController.value).toBe('mock-app-nam');
                expect(priorityController.value).toBe('12');
            });
        }));
    });

    describe('sort properties', () => {

        it('should display default sort properties', async(() => {
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortController = component.editTaskFilterForm.get('sort');
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortController).toBeDefined();
                expect(sortController.value).toBe('id');
                expect(sortOptions.length).toEqual(5);
            });
        }));

        it('should display sort properties when sort properties are specified', async(() => {
            component.sortProperties = ['id', 'name', 'processInstanceId'];
            getTaskFilterSpy.and.returnValue({ sort: 'my-custom-sort', processInstanceId: 'process-instance-id', priority: '12' });
            fixture.detectChanges();
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"]');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortController = component.editTaskFilterForm.get('sort');
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortController).toBeDefined();
                expect(component.sortProperties).toBeDefined();
                expect(component.sortProperties.length).toBe(3);
                expect(sortController.value).toBe('my-custom-sort');
                expect(sortOptions.length).toEqual(3);
            });
        }));
    });


    describe('filter actions', () => {

        it('should display default filter actions', async(() => {
            component.toggleFilterActions = true;
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(component.taskFilterActions).toBeDefined();
                expect(component.taskFilterActions.length).toBe(3);
                expect(saveButton).toBeDefined();
                expect(saveAsButton).toBeDefined();
                expect(deleteButton).toBeDefined();
                expect(saveButton.disabled).toBeTruthy();
                expect(saveAsButton.disabled).toBeTruthy(false);
                expect(deleteButton.disabled).toBe(false);
            });
        }));

        it('should display filter actions when input actions are specified', async(() => {
            component.actions = ['save'];
            fixture.detectChanges();
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            fixture.detectChanges();
            component.toggleFilterActions = true;
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(component.taskFilterActions).toBeDefined();
                expect(component.taskFilterActions.length).toBe(1);
                expect(saveButton).toBeDefined();
                expect(saveButton.disabled).toBeTruthy();
            });
        }));
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            let taskFilterIDchange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIDchange});
            fixture.detectChanges();

        });

        it('should emit save event and save the filter on click save button', async(() => {
            component.toggleFilterActions = true;
            const saveFilterSpy = spyOn(service, 'updateFilter').and.returnValue(fakeFilter);
            let saveSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[3].nativeElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            saveButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveFilterSpy).toHaveBeenCalled();
                expect(saveSpy).toHaveBeenCalled();
            });
        }));

        it('should emit delete event and delete the filter on click of delete button', async(() => {
            component.toggleFilterActions = true;
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.callThrough();
            let deleteSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            let deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            deleteButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(deleteFilterSpy).toHaveBeenCalled();
                expect(deleteSpy).toHaveBeenCalled();
            });
        }));

        it('should emit saveAs event and add filter on click saveAs button', async(() => {
            component.toggleFilterActions = true;
            const saveAsFilterSpy = spyOn(service, 'addFilter').and.callThrough();
            let saveAsSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            let stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[2].nativeElement.click();
            fixture.detectChanges();
            saveAsButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveAsFilterSpy).toHaveBeenCalled();
                expect(saveAsSpy).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalled();
            });
        }));
    });
});
