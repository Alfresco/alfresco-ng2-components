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
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance } from '../../../app/mock/app-model.mock';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { EditTaskFilterCloudComponent } from './edit-task-filter-cloud.component';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';
import { fakeFilter, fakeAllTaskFilter } from '../mock/task-filters-cloud.mock';
import { AbstractControl } from '@angular/forms';
import moment from 'moment-es6';

describe('EditTaskFilterCloudComponent', () => {
    let component: EditTaskFilterCloudComponent;
    let service: TaskFilterCloudService;
    let appsService: AppsProcessCloudService;
    let fixture: ComponentFixture<EditTaskFilterCloudComponent>;
    let dialog: MatDialog;
    let getTaskFilterSpy: jasmine.Spy;
    let getRunningApplicationsSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, TaskFiltersCloudModule],
        providers: [
            MatDialog,
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
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
        getTaskFilterSpy = spyOn(service, 'getTaskFilterById').and.returnValue(of(fakeFilter));
        getRunningApplicationsSpy = spyOn(appsService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        fixture.detectChanges();
    });

    it('should create EditTaskFilterCloudComponent', () => {
        expect(component instanceof EditTaskFilterCloudComponent).toBeTruthy();
    });

    it('should fetch task filter by taskId', () => {
        const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange});
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

    it('should display filter name as title', async(() => {
        const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
        component.ngOnChanges({ 'id': taskFilterIdChange});
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
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
            expect(title).toBeDefined();
            expect(subTitle).toBeDefined();
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
            component.ngOnChanges({'id': taskFilterIdChange});
            fixture.detectChanges();
        });

        it('should defined editTaskFilter form ', () => {
             expect(component.editTaskFilterForm).toBeDefined();
        });

        it('should create editTaskFilter form with default properties', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const stateController = component.editTaskFilterForm.get('status');
                const sortController = component.editTaskFilterForm.get('sort');
                const orderController = component.editTaskFilterForm.get('order');
                const assigneeController = component.editTaskFilterForm.get('assignee');
                expect(component.editTaskFilterForm).toBeDefined();
                expect(stateController).toBeDefined();
                expect(sortController).toBeDefined();
                expect(orderController).toBeDefined();
                expect(assigneeController).toBeDefined();

                expect(stateController.value).toBe('CREATED');
                expect(sortController.value).toBe('id');
                expect(orderController.value).toBe('ASC');
                expect(assigneeController.value).toBe('fake-involved');
            });
        }));

        it('should disable save button if the task filter is not changed', async(() => {
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should disable saveAs button if the task filter is not changed', async(() => {
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should enable delete button by default', async(() => {
            component.toggleFilterActions = true;
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(deleteButton.disabled).toBe(false);
            });
        }));

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
                expect(stateElement).toBeDefined();
                expect(assigneeElement).toBeDefined();
                expect(sortElement).toBeDefined();
                expect(orderElement).toBeDefined();
                expect(stateElement.textContent.trim()).toBe('CREATED');
                expect(sortElement.textContent.trim()).toBe('Id');
                expect(orderElement.textContent.trim()).toBe('ASC');
            });
        }));

        it('should display status drop down', async(() => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(statusOptions.length).toEqual(5);
            });
        }));

        it('should select \'All\' option in Task Status if All filter is set', async(() => {

            getTaskFilterSpy.and.returnValue(of(fakeAllTaskFilter));

            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-status"]');
            stateElement.click();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(stateElement.textContent.trim()).toBe('ALL');
            });
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
            component.ngOnChanges({ 'id': taskFilterIdChange});
            component.filterProperties = [];
            fixture.detectChanges();
            const stateController = component.editTaskFilterForm.get('status');
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

        it('should able to fetch running applications when appName property defined in the input', async(() => {
            component.filterProperties = ['appName', 'processInstanceId', 'priority'];
            fixture.detectChanges();
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
            const appController = component.editTaskFilterForm.get('appName');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(getRunningApplicationsSpy).toHaveBeenCalled();
                expect(appController).toBeDefined();
                expect(appController.value).toBe('mock-app-name');
            });
        }));
    });

    describe('sort properties', () => {

        it('should display default sort properties', async(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
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
                expect(sortController).toBeDefined();
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
            component.ngOnChanges({ 'id': taskFilterIdChange});
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
                expect(sortController).toBeDefined();
                expect(component.sortProperties).toBeDefined();
                expect(component.sortProperties.length).toBe(3);
                expect(sortController.value).toBe('my-custom-sort');
                expect(sortOptions.length).toEqual(3);
            });
        }));

        it('should display default sort properties if input is empty', async(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
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
                expect(sortController).toBeDefined();
                expect(sortController.value).toBe('id');
                expect(sortOptions.length).toEqual(4);
            });
        }));
    });

    describe('filter actions', () => {

        it('should display default filter actions', async(() => {
            component.toggleFilterActions = true;
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
            fixture.detectChanges();
            component.toggleFilterActions = true;
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
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

        it('should display default filter actions if input is empty', async(() => {
            component.toggleFilterActions = true;
            component.actions = [];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
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

        it('should set the correct lastModifiedTo date', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'lastModified'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
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
                expect(component.changedTaskFilter.lastModifiedTo.toISOString()).toEqual(lastModifiedToFilter.toISOString());
                done();
            });
            component.onFilterChange();
        });
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange});
            fixture.detectChanges();

        });

        it('should emit save event and save the filter on click save button', async(() => {
            component.toggleFilterActions = true;
            const saveFilterSpy = spyOn(service, 'updateFilter');
            const saveSpy: jasmine.Spy = spyOn(component.action, 'emit');
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
            saveButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveFilterSpy).toHaveBeenCalled();
                expect(saveSpy).toHaveBeenCalled();
            });
        }));

        it('should emit delete event and delete the filter on click of delete button', async(() => {
            component.toggleFilterActions = true;
            const deleteFilterSpy = spyOn(service, 'deleteFilter');
            const deleteSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
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
            const saveAsSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-task-property-sort"] .mat-select-trigger');
            sortElement.click();
            fixture.detectChanges();
            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            sortOptions[2].nativeElement.click();
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
