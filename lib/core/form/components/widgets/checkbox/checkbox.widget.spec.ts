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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { CheckboxWidgetComponent } from './checkbox.widget';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { FormBaseModule } from 'core/form/form-base.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderService } from 'core/services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreTestingModule } from '../../../../testing';

describe('CheckboxWidgetComponent', () => {

    let widget: CheckboxWidgetComponent;
    let fixture: ComponentFixture<CheckboxWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            FormBaseModule,
            MatCheckboxModule
        ],
        providers: [
            { provide: TranslateLoader, useClass: TranslateLoaderService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckboxWidgetComponent);

        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    describe('when template is ready', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                id: 'check-id',
                name: 'check-name',
                value: '',
                type: FormFieldTypes.BOOLEAN,
                readOnly: false,
                required: true
            });
        });

        it('should be marked as invalid when required', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('.adf-invalid')).not.toBeNull();
            });
        }));

        it('should be checked if boolean true is passed', async(() => {
            widget.field.value = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const checkbox = fixture.debugElement.nativeElement.querySelector('mat-checkbox input');
                expect(checkbox.getAttribute('aria-checked')).toBe('true');
            });
        }));

        it('should not be checked if false is passed', async(() => {
            widget.field.value = false;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const checkbox = fixture.debugElement.nativeElement.querySelector('mat-checkbox input');
                expect(checkbox.getAttribute('aria-checked')).toBe('false');
            });
        }));
   });
});
