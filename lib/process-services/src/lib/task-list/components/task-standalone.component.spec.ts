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

import { TaskStandaloneComponent } from './task-standalone.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('TaskStandaloneComponent', () => {
    let component: TaskStandaloneComponent;
    let fixture: ComponentFixture<TaskStandaloneComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskStandaloneComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show Completed message if isCompleted is true', async () => {
        component.isCompleted = true;
        fixture.detectChanges();

        const completedFormElement = fixture.debugElement.nativeElement.querySelector('#adf-completed-form-message');
        const completedFormSubElement = fixture.debugElement.nativeElement.querySelector('.adf-no-form-submessage');

        await fixture.whenStable();

        expect(element.querySelector('#adf-no-form-message')).toBeNull();
        expect(completedFormElement).toBeDefined();
        expect(completedFormElement.innerText.trim()).toBe('ADF_TASK_LIST.STANDALONE_TASK.COMPLETE_TASK_MESSAGE');
        expect(completedFormSubElement).toBeDefined();
        expect(completedFormSubElement.innerText).toBe('ADF_TASK_LIST.STANDALONE_TASK.COMPLETE_TASK_SUB_MESSAGE');
        expect(element.querySelector('.adf-no-form-mat-card-actions')).toBeDefined();
    });

    it('should show No form message if isCompleted is false', async () => {
        component.isCompleted = false;
        fixture.detectChanges();
        const noFormElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-message');

        await fixture.whenStable();

        expect(noFormElement).toBeDefined();
        expect(noFormElement.innerText).toBe('ADF_TASK_LIST.STANDALONE_TASK.NO_FORM_MESSAGE');
        expect(element.querySelector('#adf-completed-form-message')).toBeNull();
        expect(element.querySelector('.adf-no-form-submessage')).toBeNull();
    });

    it('should hide Cancel button by default', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-no-form-cancel-button')).toBeNull();
    });

    it('should emit cancel event if clicked on Cancel Button ', async () => {
        component.hideCancelButton = false;
        component.isCompleted = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const emitSpy = spyOn(component.cancel, 'emit');
        const el = fixture.nativeElement.querySelector('#adf-no-form-cancel-button');
        el.click();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should hide Cancel button if hideCancelButton is true', async () => {
        component.hideCancelButton = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-no-form-cancel-button')).toBeNull();
    });

    it('should hide Cancel button if isCompleted is true', async () => {
        component.isCompleted = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-no-form-cancel-button')).toBeNull();
    });

    it('should emit complete event if clicked on Complete Button', async () => {
        component.hasCompletePermission = true;
        component.isCompleted = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const emitSpy = spyOn(component.complete, 'emit');
        expect(element.querySelector('#adf-no-form-complete-button')).toBeDefined();
        const el = fixture.nativeElement.querySelector('#adf-no-form-complete-button');
        el.click();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should hide Complete button if isCompleted is true', async () => {
        component.isCompleted = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-no-form-complete-button')).toBeNull();
    });

    it('should hide Complete button if hasCompletePermission is false', async () => {
        component.hasCompletePermission = false;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-no-form-complete-button')).toBeNull();
    });
});
