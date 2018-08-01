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

import { AttachFormComponent } from './attach-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TaskListService } from './../services/tasklist.service';
import { of } from 'rxjs';

describe('AttachFormComponent', () => {
    let component: AttachFormComponent;
    let fixture: ComponentFixture<AttachFormComponent>;
    let element: HTMLElement;
    let taskService: TaskListService;

    setupTestBed({
        imports: [
            ProcessTestingModule
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AttachFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        taskService = TestBed.get(TaskListService);
        fixture.detectChanges();
    }));

    it('should emit cancel event if clicked on Cancel Button ', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.cancelAttachForm, 'emit');
            const el = fixture.nativeElement.querySelector('#adf-no-form-cancel-button');
            el.click();
            expect(emitSpy).toHaveBeenCalled();
        });
    }));

    it('should call attachFormToATask if clicked on Complete Button', async(() => {
        component.taskId = 1;
        component.formId = 2;
        spyOn(taskService, 'attachFormToATask').and.returnValue(of(true));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#adf-no-form-attach-form-button')).toBeDefined();
            const el = fixture.nativeElement.querySelector('#adf-no-form-attach-form-button');
            el.click();
            expect(taskService.attachFormToATask).toHaveBeenCalledWith(1, 2);
        });
    }));

    it('should show the adf-form of the selected form', async(() => {
        component.taskId = 1;
        component.formKey = 12;
        fixture.detectChanges();
        const formContainer = fixture.debugElement.nativeElement.querySelector('adf-form');
        fixture.whenStable().then(() => {
            expect(formContainer).toBeDefined();
            expect(formContainer).not.toBeNull();
        });
    }));

    it('should show the formPreview of the selected form', async(() => {
        component.formKey = 12;
        fixture.detectChanges();
        const formContainer = fixture.debugElement.nativeElement.querySelector('.adf-form-container');
        fixture.whenStable().then(() => {
            expect(formContainer).toBeDefined();
            expect(formContainer).toBeNull();
        });
    }));

    it('should remove form if it is present', (done) => {
        component.taskId = 1;
        component.formId = 10;
        component.formKey = 12;
        spyOn(taskService, 'deleteForm').and.returnValue(of({}));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#adf-no-form-remove-button')).toBeDefined();
            const el = fixture.nativeElement.querySelector('#adf-no-form-remove-button');
            el.click();
            expect(component.formId).toBeNull();
            done();
        });
    });

    it('should emit success when form is changed', async(() => {
        component.taskId = 1;
        component.formId = 10;

        spyOn(taskService, 'attachFormToATask').and.returnValue(of(
            {
                id: 91,
                name: 'fakeName',
                formKey: 1204,
                assignee: null
            }
        ));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.success, 'emit');
            const el = fixture.nativeElement.querySelector('#adf-no-form-attach-form-button');
            el.click();
            expect(emitSpy).toHaveBeenCalled();
        });
    }));
});
