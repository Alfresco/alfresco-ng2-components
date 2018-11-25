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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { EditTaskFiltersCloudComponent } from './edit-task-filters-cloud.component';
import { setupTestBed } from '@alfresco/adf-core';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { FilterRepresentationModel } from '../models/filter-cloud.model';
import { TaskCloudModule } from './../task-cloud.module';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('EditTaskFiltersCloudComponent', () => {
    let component: EditTaskFiltersCloudComponent;
    let taskFilterService: TaskFilterCloudService;
    let fixture: ComponentFixture<EditTaskFiltersCloudComponent>;

    let fakeFilter = new FilterRepresentationModel({
        name: 'FakeInvolvedTasks',
        icon: 'adjust',
        id: 10,
        query: { state: 'CREATED', assignment: 'fake-involved', order: 'ASC', sort: 'id' }
    });

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, TaskCloudModule],
        providers: [TaskFilterCloudService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditTaskFiltersCloudComponent);
        component = fixture.componentInstance;
        taskFilterService = TestBed.get(TaskFilterCloudService);
        spyOn(taskFilterService, 'addFilter');
        fixture.detectChanges();
    });

    it('should create EditTaskFiltersCloudComponent', () => {
        expect(component instanceof EditTaskFiltersCloudComponent).toBeTruthy();
    });

    it('should get the taskFilter as a input', async(() => {
        let change = new SimpleChange(undefined, fakeFilter, true);
        component.ngOnChanges({ 'taskFilter': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.taskFilter.name).toEqual('FakeInvolvedTasks');
            expect(component.taskFilter.icon).toEqual('adjust');
            expect(component.taskFilter.query.state).toEqual('CREATED');
            expect(component.taskFilter.query.order).toEqual('ASC');
            expect(component.taskFilter.query.sort).toEqual('id');
        });
    }));

    it('should display filter name as title', () => {
        let change = new SimpleChange(undefined, fakeFilter, true);
        component.ngOnChanges({ 'taskFilter': change });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-task-filter-sub-title-id');
        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeInvolvedTasks');
        expect(subTitle.innerText).toEqual('Customize your filter');
    });

    describe('EditTaskFilter form', () => {

        beforeEach(() => {
            let change = new SimpleChange(undefined, fakeFilter, true);
            component.ngOnChanges({ 'taskFilter': change });
            fixture.detectChanges();
        });

        it('should defined editTaskFilter form ', async(() => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.editTaskFilter).toBeDefined();
            });
        }));

        it('should create editTaskFilter form with given input ', async(() => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const stateController = component.editTaskFilter.get('state');
                const sortController = component.editTaskFilter.get('sort');
                const orderController = component.editTaskFilter.get('order');
                const assignmentController = component.editTaskFilter.get('assignment');
                expect(component.editTaskFilter).toBeDefined();
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

        it('should disable save as button if the task filter did not change', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should enable delete button if the task filter did not change', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                expect(deleteButton.disabled).toBe(false);
            });
        }));

        it('should display current task filter details', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let stateElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-state-id');
                let assignmentElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-assignment-id');
                let sortElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-sort-id');
                let orderElement = fixture.debugElement.nativeElement.querySelector('#adf-task-filter-order-id');
                expect(stateElement).toBeDefined();
                expect(assignmentElement).toBeDefined();
                expect(sortElement).toBeDefined();
                expect(orderElement).toBeDefined();
                expect(stateElement.innerText.trim()).toBe('CREATED');
                expect(assignmentElement.innerText.trim()).toBe('fake-involved');
                expect(sortElement.innerText.trim()).toBe('ID');
                expect(orderElement.innerText.trim()).toBe('ASC');
            });
        }));

        it('should enable saveAs button if the task filter changed', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const trigger = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
                const inquiryOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                inquiryOptions[3].nativeElement.click();
                fixture.detectChanges();
                expect(saveButton.disabled).toBe(false);
            });
        });

        it('should disable delete button if the task filter changed', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const trigger = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                const inquiryOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                inquiryOptions[3].nativeElement.click();
                fixture.detectChanges();
                expect(deleteButton.disabled).toBe(false);
            });
        });

        it('should display state drop down', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const trigger = fixture.debugElement.query(By.css('#adf-task-filter-state-id .mat-select-trigger')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const inquiryOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(inquiryOptions.length).toEqual(8);
            });
        });

        it('should display sort drop down', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const trigger = fixture.debugElement.query(By.css('#adf-task-filter-sort-id .mat-select-trigger')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const inquiryOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(inquiryOptions.length).toEqual(6);
            });
        });

        it('should display order drop down', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const trigger = fixture.debugElement.query(By.css('#adf-task-filter-order-id .mat-select-trigger')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const inquiryOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(inquiryOptions.length).toEqual(3);
            });
        });
    });
});
