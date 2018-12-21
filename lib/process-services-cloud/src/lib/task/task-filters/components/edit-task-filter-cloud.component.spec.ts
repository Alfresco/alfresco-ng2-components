/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { setupTestBed, IdentityUserService } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFilterCloudModel } from '../models/filter-cloud.model';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { EditTaskFilterCloudComponent } from './edit-task-filter-cloud.component';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';

describe('EditTaskFilterCloudComponent', () => {
    let component: EditTaskFilterCloudComponent;
    let service: TaskFilterCloudService;
    let identityService: IdentityUserService;
    let fixture: ComponentFixture<EditTaskFilterCloudComponent>;
    let dialog: MatDialog;

    let fakeFilter = new TaskFilterCloudModel({
        name: 'FakeInvolvedTasks',
        icon: 'adjust',
        id: 10,
        state: 'CREATED',
        appName: 'app-name',
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
        identityService = TestBed.get(IdentityUserService);
        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.returnValue({ afterClosed() { return of({
            action: TaskFilterDialogCloudComponent.ACTION_SAVE,
            icon: 'icon',
            name: 'fake-name'
        }); }});
        spyOn(service, 'getTaskFilterById').and.returnValue(fakeFilter);
    });

    it('should create EditTaskFilterCloudComponent', () => {
        expect(component instanceof EditTaskFilterCloudComponent).toBeTruthy();
    });

    it('should fetch task filter by taskId', async(() => {
        let change = new SimpleChange(undefined, '10', true);
        component.ngOnChanges({ 'id': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.taskFilter.name).toEqual('FakeInvolvedTasks');
            expect(component.taskFilter.icon).toEqual('adjust');
            expect(component.taskFilter.state).toEqual('CREATED');
            expect(component.taskFilter.order).toEqual('ASC');
            expect(component.taskFilter.sort).toEqual('id');
        });
    }));

    it('should display filter name as title', () => {
        let change = new SimpleChange(undefined, '10', true);
        component.ngOnChanges({ 'id': change });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText).toEqual('ADF_CLOUD_EDIT_TASK_FILTER.TITLE');
    });

    describe('EditTaskFilter form', () => {

        beforeEach(() => {
            let change = new SimpleChange(undefined, '10', true);
            component.ngOnChanges({ 'id': change });
            fixture.detectChanges();
        });

        it('should define editTaskFilter form ', () => {
             expect(component.editTaskFilterForm).toBeDefined();
        });

        it('should create editTaskFilter form with given input ', async(() => {
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
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should disable saveAs button if the task filter is not changed', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-as-id');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should enable delete button by default', async(() => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                expect(deleteButton.disabled).toBe(false);
            });
        }));

        it('should display current task filter details', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let stateElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-state-id');
                let assignmentElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-assignment-id');
                let sortElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-sort-id');
                let orderElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-order-id');
                expect(stateElement).toBeDefined();
                expect(assignmentElement).toBeDefined();
                expect(sortElement).toBeDefined();
                expect(orderElement).toBeDefined();
                expect(stateElement.innerText.trim()).toBe('ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STATUS');
                expect(sortElement.innerText.trim()).toBe('ADF_CLOUD_EDIT_TASK_FILTER.LABEL.COLUMN');
                expect(orderElement.innerText.trim()).toBe('ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DIRECTION');
            });
        }));

        it('should display state drop down', async(() => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
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
            const sortElement = fixture.debugElement.query(By.css('#adf-task-filter-sort-id .mat-select-trigger')).nativeElement;
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
            const orderElement = fixture.debugElement.query(By.css('#adf-task-filter-order-id .mat-select-trigger')).nativeElement;
            orderElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(orderOptions.length).toEqual(2);
            });
        }));
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            let change = new SimpleChange(undefined, '10', true);
            component.ngOnChanges({ 'id': change });
        });

        it('should emit save event and save the filter on click save button', async(() => {
            spyOn(identityService, 'getCurrentUserInfo').and.returnValue({username: 'currentUser'});
            const saveFilterSpy = spyOn(service, 'updateFilter').and.returnValue(fakeFilter);
            let saveSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[3].nativeElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
            saveButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveFilterSpy).toHaveBeenCalled();
                expect(saveSpy).toHaveBeenCalled();
            });
        }));

        it('should emit delete event and delete the filter on click of delete button', async(() => {
            spyOn(identityService, 'getCurrentUserInfo').and.returnValue({username: 'currentUser'});
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.callThrough();
            let deleteSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
            deleteButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(deleteFilterSpy).toHaveBeenCalled();
                expect(deleteSpy).toHaveBeenCalled();
            });
        }));

        it('should emit saveAs event and add filter on click saveAs button', async(() => {
            spyOn(identityService, 'getCurrentUserInfo').and.returnValue({username: 'currentUser'});
            const saveAsFilterSpy = spyOn(service, 'addFilter').and.callThrough();
            let saveAsSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-as-id');
            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[2].nativeElement.click();
            fixture.detectChanges();
            saveButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveAsFilterSpy).toHaveBeenCalled();
                expect(saveAsSpy).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalled();
            });
        }));
    });
});
