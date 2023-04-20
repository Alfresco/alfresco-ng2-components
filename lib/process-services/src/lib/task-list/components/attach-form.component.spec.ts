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

import { AttachFormComponent } from './attach-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TaskListService } from './../services/tasklist.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('AttachFormComponent', () => {
    let component: AttachFormComponent;
    let fixture: ComponentFixture<AttachFormComponent>;
    let element: HTMLElement;
    let taskService: TaskListService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AttachFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        taskService = TestBed.inject(TaskListService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show the attach button disabled', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = fixture.debugElement.query(By.css('#adf-attach-form-attach-button'));
        expect(attachButton.nativeElement.disabled).toBeTruthy();
    });

    it('should emit cancel event if clicked on Cancel Button ', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const emitSpy = spyOn(component.cancelAttachForm, 'emit');
        const el = fixture.nativeElement.querySelector('#adf-attach-form-cancel-button');
        el.click();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call attachFormToATask if clicked on attach Button', async () => {
        component.taskId = 1;
        component.attachFormControl.setValue(2);
        spyOn(taskService, 'attachFormToATask').and.returnValue(of(true));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-attach-form-attach-button')).toBeDefined();
        const el = fixture.nativeElement.querySelector('#adf-attach-form-attach-button');
        el.click();
        expect(taskService.attachFormToATask).toHaveBeenCalledWith(1, 2);
    });

    it('should render the attachForm enabled if the user select the different formId', async () => {
        component.taskId = 1;
        component.formId = 2;
        component.attachFormControl.setValue(3);

        fixture.detectChanges();
        await fixture.whenStable();

        spyOn(taskService, 'attachFormToATask').and.returnValue(of(true));

        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = fixture.debugElement.query(By.css('#adf-attach-form-attach-button'));
        expect(attachButton.nativeElement.disabled).toBeFalsy();
    });

    it('should render a disabled attachForm button if the user select the original formId', async () => {
        component.taskId = 1;
        component.formId = 2;
        component.attachFormControl.setValue(3);

        fixture.detectChanges();
        await fixture.whenStable();

        spyOn(taskService, 'attachFormToATask').and.returnValue(of(true));

        fixture.detectChanges();
        await fixture.whenStable();

        component.attachFormControl.setValue(2);

        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = fixture.debugElement.query(By.css('#adf-attach-form-attach-button'));
        expect(attachButton.nativeElement.disabled).toBeTruthy();
    });

    it('should show the adf-form of the selected form', async () => {
        component.taskId = 1;
        component.selectedFormId = 12;

        fixture.detectChanges();
        await fixture.whenStable();

        const formContainer = fixture.debugElement.nativeElement.querySelector('adf-form');
        expect(formContainer).toBeDefined();
        expect(formContainer).not.toBeNull();
    });

    it('should show the formPreview of the selected form', async () => {
        component.formKey = 12;

        fixture.detectChanges();
        await fixture.whenStable();

        const formContainer = fixture.debugElement.nativeElement.querySelector('.adf-form-container');
        expect(formContainer).toBeDefined();
        expect(formContainer).toBeNull();
    });

    it('should remove form if it is present', async () => {
        component.taskId = 1;
        component.attachFormControl.setValue(10);
        component.formKey = 12;
        spyOn(taskService, 'deleteForm').and.returnValue(of(null));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-attach-form-remove-button')).toBeDefined();
        const el = fixture.nativeElement.querySelector('#adf-attach-form-remove-button');
        el.click();
        expect(component.formId).toBeNull();
    });

    it('should emit success when a form is attached', async () => {
        component.taskId = 1;
        component.attachFormControl.setValue(10);

        spyOn(taskService, 'attachFormToATask').and.returnValue(of(
            {
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: null
            }
        ));

        fixture.detectChanges();
        await fixture.whenStable();

        const emitSpy = spyOn(component.success, 'emit');
        const el = fixture.nativeElement.querySelector('#adf-attach-form-attach-button');
        el.click();
        expect(emitSpy).toHaveBeenCalled();
    });
});
