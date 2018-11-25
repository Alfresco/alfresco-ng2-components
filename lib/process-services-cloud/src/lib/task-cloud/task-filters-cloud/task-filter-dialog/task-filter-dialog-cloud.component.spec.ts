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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';
import { setupTestBed } from '@alfresco/adf-core';
import { TaskCloudModule } from '../../task-cloud.module';
import { ProcessServiceCloudTestingModule } from './../../../testing/process-service-cloud.testing.module';

describe('TaskFilterDialogComponent', () => {

    let component: TaskFilterDialogCloudComponent;
    let fixture: ComponentFixture<TaskFilterDialogCloudComponent>;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
    };

    const mockDialogData = {
        data: {name: 'Mock-name'}
    };

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, TaskCloudModule],
        providers: [
            { provide: MatDialogRef, useValue: mockDialogRef },
            { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFilterDialogCloudComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create TaskFilterDialogCloudComponent', () => {
        expect(component instanceof TaskFilterDialogCloudComponent).toBeTruthy();
    });

    it('should get data from MAT_DIALOG_DATA as an input to the dialog', () => {
        const data = component.data;
        expect(data).toEqual(mockDialogData);
    });

    it('should defined filterForm', () => {
        expect(component.filterForm).toBeDefined();
        expect(component.filterForm.get('name').value).toEqual('');
    });

    it('should able enter filter name', () => {
        expect(component.filterForm).toBeDefined();
        expect(component.filterForm.get('name').value).toEqual('');
    });

    it('should able click on save button', () => {
        let saveButton = fixture.debugElement.nativeElement.querySelectorAll('#adf-save-button-id');
        saveButton.click();
        fixture.detectChanges();
        expect(component.filterForm).toBeDefined();
        expect(component.filterForm.get('name').value).toEqual('');
    });
});
