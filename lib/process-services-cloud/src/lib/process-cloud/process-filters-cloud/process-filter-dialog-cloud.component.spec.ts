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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from './../../testing/process-service-cloud.testing.module';
import { ProcessCloudModule } from '../process-cloud.module';

describe('ProcessFilterDialogCloudComponent', () => {
    let component: ProcessFilterDialogCloudComponent;
    let fixture: ComponentFixture<ProcessFilterDialogCloudComponent>;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
    };

    const mockDialogData = {
        data: {name: 'Mock-Title'}
    };

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, ProcessCloudModule],
        providers: [
            { provide: MatDialogRef, useValue: mockDialogRef },
            { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
          ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessFilterDialogCloudComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ProcessFilterDialogCloudComponent', () => {
        expect(component instanceof ProcessFilterDialogCloudComponent).toBeTruthy();
    });

    it('should get data from MAT_DIALOG_DATA as an input to the dialog', () => {
        fixture.detectChanges();
        const mockData = component.data;
        fixture.detectChanges();
        expect(mockData).toEqual(mockDialogData);
        expect(mockData.data.name).toEqual('Mock-Title');
    });

    it('should display title', () => {
        fixture.detectChanges();
        let titleElement = fixture.debugElement.nativeElement.querySelector(
            '#adf-process-filter-dialog-title'
        );
        expect(titleElement.textContent).toEqual(' ADF_CLOUD_EDIT_PROCESS_FILTER.DIALOG.TITLE ');
    });

    it('should enable save button if form is valid', async(() => {
        fixture.detectChanges();
        let saveButton = fixture.debugElement.nativeElement.querySelector(
            '#adf-save-button-id'
        );
        const inputElement = fixture.debugElement.nativeElement.querySelector(
            '#adf-filter-name-id'
        );
        inputElement.value = 'My custom Name';
        inputElement.dispatchEvent(new Event('input'));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(saveButton).toBeDefined();
            expect(saveButton.disabled).toBeFalsy();
        });
    }));

    it('should disable save button if form is not valid', async(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.nativeElement.querySelector(
            '#adf-filter-name-id'
        );
        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input'));
        fixture.whenStable().then(() => {
            let saveButton = fixture.debugElement.nativeElement.querySelector(
                '#adf-save-button-id'
            );
            fixture.detectChanges();
            expect(saveButton).toBeDefined();
            expect(saveButton.disabled).toBe(true);
        });
    }));

    it('should able to close dialog on click of save button if form is valid', async(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.nativeElement.querySelector(
            '#adf-filter-name-id'
        );
        inputElement.value = 'My custom Name';
        inputElement.dispatchEvent(new Event('input'));
        fixture.whenStable().then(() => {
            let saveButton = fixture.debugElement.nativeElement.querySelector(
                '#adf-save-button-id'
            );
            fixture.detectChanges();
            saveButton.click();
            expect(saveButton).toBeDefined();
            expect(saveButton.disabled).toBeFalsy();
            expect(component.dialogRef.close).toHaveBeenCalled();
        });
    }));

    it('should able close dialog on click of cancel button', () => {
        component.data = { data: { name: '' } };
        let cancelButton = fixture.debugElement.nativeElement.querySelector(
            '#adf-cancel-button-id'
        );
        fixture.detectChanges();
        cancelButton.click();
        expect(cancelButton).toBeDefined();
        expect(cancelButton.disabled).toBeFalsy();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });
});
