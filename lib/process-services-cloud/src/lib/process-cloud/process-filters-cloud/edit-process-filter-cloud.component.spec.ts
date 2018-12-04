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

import { setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { EditProcessFilterCloudComponent } from './edit-process-filter-cloud.component';
import { ProcessCloudModule } from '../process-cloud.module';
import { ProcessFilterRepresentationModel } from '../models/process-filter-cloud.model';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';

describe('EditProcessFilterCloudComponent', () => {
    let component: EditProcessFilterCloudComponent;
    let service: ProcessFilterCloudService;
    let fixture: ComponentFixture<EditProcessFilterCloudComponent>;
    let dialog: MatDialog;

    let fakeFilter = new ProcessFilterRepresentationModel({
        name: 'FakeRunningProcess',
        icon: 'adjust',
        id: 10,
        query: { state: 'RUNNING', appName: 'app-name', processDefinitionId: 'process-def-id', assignment: 'fake-involved', order: 'ASC', sort: 'id' }
    });

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, ProcessCloudModule],
        providers: [MatDialog]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProcessFilterCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.get(ProcessFilterCloudService);
        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.returnValue({ afterClosed() { return of({
            action: ProcessFilterDialogCloudComponent.ACTION_SAVE,
            icon: 'icon',
            name: 'fake-name'
        }); }});
        spyOn(service, 'getProcessFilterById').and.returnValue(fakeFilter);
    });

    it('should create EditProcessFilterCloudComponent', () => {
        expect(component instanceof EditProcessFilterCloudComponent).toBeTruthy();
    });

    it('should fetch process instance filter by id', async(() => {
        let change = new SimpleChange(undefined, '10', true);
        component.ngOnChanges({ 'id': change });
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.processFilter.name).toEqual('FakeRunningProcess');
            expect(component.processFilter.icon).toEqual('adjust');
            expect(component.processFilter.query.state).toEqual('RUNNING');
            expect(component.processFilter.query.order).toEqual('ASC');
            expect(component.processFilter.query.sort).toEqual('id');
        });
    }));

    it('should display filter name as title', () => {
        let change = new SimpleChange(undefined, '10', true);
        component.ngOnChanges({ 'id': change });
        fixture.detectChanges();
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-sub-title-id');
        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeRunningProcess');
        expect(subTitle.innerText).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.TITLE');
    });

    describe('EditProcessFilter form', () => {

        beforeEach(() => {
            let change = new SimpleChange(undefined, '10', true);
            component.ngOnChanges({ 'id': change });
            fixture.detectChanges();
        });

        it('should define editProcessFilter form ', async(() => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.editProcessFilterForm).toBeDefined();
            });
        }));

        it('should create editProcessFilter form', async(() => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const stateController = component.editProcessFilterForm.get('state');
                const sortController = component.editProcessFilterForm.get('sort');
                const orderController = component.editProcessFilterForm.get('order');
                expect(component.editProcessFilterForm).toBeDefined();
                expect(stateController).toBeDefined();
                expect(sortController).toBeDefined();
                expect(orderController).toBeDefined();

                expect(stateController.value).toBe('RUNNING');
                expect(sortController.value).toBe('id');
                expect(orderController.value).toBe('ASC');
            });
        }));

        it('should disable save button if the process filter did not change', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should disable saveAs button if the process filter did not change', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-as-id');
                expect(saveButton.disabled).toBe(true);
            });
        }));

        it('should enable delete button if the process filter did not change', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                expect(deleteButton.disabled).toBe(false);
            });
        }));

        it('should able delete the filter', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                deleteButton.click();
            });
        }));

        it('should display current process filter details', async(() => {
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let stateElement = fixture.debugElement.nativeElement.querySelector('#adf-process-filter-state-id');
                let sortElement = fixture.debugElement.nativeElement.querySelector('#adf-process-filter-sort-id');
                let orderElement = fixture.debugElement.nativeElement.querySelector('#adf-process-filter-order-id');
                expect(stateElement).toBeDefined();
                expect(sortElement).toBeDefined();
                expect(orderElement).toBeDefined();
                expect(stateElement.innerText.trim()).toBe('RUNNING');
                expect(sortElement.innerText.trim()).toBe('ID');
                expect(orderElement.innerText.trim()).toBe('ASC');
            });
        }));

        it('should enable save button if the process filter changed', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
                const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                options[3].nativeElement.click();
                fixture.detectChanges();
                expect(saveButton.disabled).toBe(false);
            });
        });

        it('should be enable delete button if the process filter changed', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                const statusOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                statusOptions[3].nativeElement.click();
                fixture.detectChanges();
                expect(deleteButton.disabled).toBe(false);
            });
        });

        it('should display state drop down', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(statusOptions.length).toEqual(3);
            });
        });

        it('should display sort drop down', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const sortElement = fixture.debugElement.query(By.css('#adf-process-filter-sort-id .mat-select-trigger')).nativeElement;
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortOptions.length).toEqual(4);
            });
        });

        it('should display order drop down', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const orderElement = fixture.debugElement.query(By.css('#adf-process-filter-order-id .mat-select-trigger')).nativeElement;
            orderElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(orderOptions.length).toEqual(2);
            });
        });
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            let change = new SimpleChange(undefined, '10', true);
            component.ngOnChanges({ 'id': change });
        });

        it('should emit save event and save the filter on click of save button', async () => {
            const saveFilterSpy = spyOn(service, 'updateFilter').and.returnValue(fakeFilter);
            let saveSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-id');
                const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                stateOptions[2].nativeElement.click();
                fixture.detectChanges();
                saveButton.click();
                fixture.detectChanges();
                expect(saveFilterSpy).toHaveBeenCalled();
                expect(saveSpy).toHaveBeenCalled();
            });
        });

        it('should emit delete event and delete filter on click of delete button', async () => {
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.callThrough();
            let deleteSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let deleteButton = fixture.debugElement.nativeElement.querySelector('#adf-delete-id');
                deleteButton.click();
                fixture.detectChanges();
                expect(deleteFilterSpy).toHaveBeenCalled();
                expect(deleteSpy).toHaveBeenCalled();
            });
        });

        it('should emit saveAs event and add filter on click of saveAs button', async () => {
            const saveAsFilterSpy = spyOn(service, 'addFilter').and.callThrough();
            let saveAsSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-as-id');
                const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                stateOptions[2].nativeElement.click();
                fixture.detectChanges();
                saveButton.click();
                fixture.detectChanges();
                expect(saveAsFilterSpy).toHaveBeenCalled();
                expect(saveAsSpy).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalled();
            });
        });

        it('should able to open save dialog on click of saveAs button', async () => {
            fixture.detectChanges();
            let expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.query(By.css('#adf-process-filter-state-id .mat-select-trigger')).nativeElement;
            stateElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('#adf-save-as-id');
                const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                stateOptions[2].nativeElement.click();
                fixture.detectChanges();
                saveButton.click();
                fixture.detectChanges();
                expect(dialog.open).toHaveBeenCalled();
            });
        });
    });
});
