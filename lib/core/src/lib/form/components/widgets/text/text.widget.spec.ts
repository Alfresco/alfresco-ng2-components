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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { TextWidgetComponent } from './text.widget';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CoreTestingModule } from '../../../../testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

const enterValueInTextField = (element: HTMLInputElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('input'));
};

describe('TextWidgetComponent', () => {

    let widget: TextWidgetComponent;
    let fixture: ComponentFixture<TextWidgetComponent>;
    let element: HTMLElement;
    let errorWidget: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            MatInputModule,
            FormsModule,
            MatIconModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    describe('when template is ready', () => {

        describe('and no mask is configured on text element', () => {

            it('should raise ngModelChange event', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                expect(widget.field.value).toBe('');

                enterValueInTextField(element.querySelector('#text-id'), 'TEXT');
                await fixture.whenStable();
                fixture.detectChanges();
                expect(widget.field).not.toBeNull();
                expect(widget.field.value).not.toBeNull();
                expect(widget.field.value).toBe('TEXT');
            });

            it('should be able to set label property', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                const textWidgetLabel = element.querySelector('label');
                expect(textWidgetLabel.innerText).toBe('text-name');
            });

            it('should be able to set a placeholder for Text widget', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'Your name here'
                });
                fixture.detectChanges();
                await fixture.whenStable();

                const label = element.querySelector<HTMLElement>('label.mat-form-field-label[for="text-id"]');
                expect(label.innerText).toBe('Your name here');
            });

            it('should be able to set min/max length properties for Text widget', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    minLength: 5,
                    maxLength: 10
                });
                fixture.detectChanges();
                enterValueInTextField(element.querySelector('#text-id'), 'TEXT');
                fixture.detectChanges();

                await fixture.whenStable();
                errorWidget = element.querySelector('.adf-error-text');
                expect(errorWidget).toBeDefined();
                expect(errorWidget.innerHTML).toBe('FORM.FIELD.VALIDATOR.AT_LEAST_LONG');

                expect(widget.field.isValid).toBe(false);

                enterValueInTextField(element.querySelector('#text-id'), 'TEXT VALUE');

                await fixture.whenStable();
                fixture.detectChanges();

                errorWidget = element.querySelector('.adf-error-text');

                expect(widget.field.isValid).toBe(true);

                enterValueInTextField(element.querySelector('#text-id'), 'TEXT VALUE TOO LONG');

                fixture.detectChanges();
                await fixture.whenStable();

                expect(widget.field.isValid).toBe(false);

                errorWidget = element.querySelector('.adf-error-text');
                expect(errorWidget.innerHTML).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
            });

            it('should be able to set regex pattern property for Text widget', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    regexPattern: '[0-9]'
                });
                fixture.detectChanges();
                enterValueInTextField(element.querySelector('#text-id'), 'TEXT');

                await fixture.whenStable();
                expect(widget.field.isValid).toBe(false);

                enterValueInTextField(element.querySelector('#text-id'), '8');

                await fixture.whenStable();
                expect(widget.field.isValid).toBe(true);

                enterValueInTextField(element.querySelector('#text-id'), '8XYZ');

                await fixture.whenStable();
                expect(widget.field.isValid).toBe(false);
            });
        });

        describe('when tooltip is set', () => {

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                    type: FormFieldTypes.TEXT,
                    tooltip: 'my custom tooltip'
                });
                fixture.detectChanges();
            });

            it('should show tooltip', async () => {
                const textInput = fixture.nativeElement.querySelector('input');
                textInput.dispatchEvent(new Event('mouseenter'));
                await fixture.whenStable();
                fixture.detectChanges();

                const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
                expect(tooltipElement).toBeTruthy();
                expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
              });

            it('should hide tooltip', async () => {
                const textInput = fixture.nativeElement.querySelector('input');
                textInput.dispatchEvent(new Event('mouseenter'));
                await fixture.whenStable();
                fixture.detectChanges();

                textInput.dispatchEvent(new Event('mouseleave'));
                await fixture.whenStable();
                fixture.detectChanges();

                const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
                expect(tooltipElement).toBeFalsy();
            });
        });

        describe('when is required', () => {

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    required: true
                });
            });

            it('should be marked as invalid after interaction', async () => {
                const textInput = fixture.nativeElement.querySelector('input');
                expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

                textInput.dispatchEvent(new Event('blur'));

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
            });

            it('should be able to display label with asterisk', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

                expect(asterisk).toBeTruthy();
                expect(asterisk.textContent).toEqual('*');
            });
        });

        describe('and no mask is configured on text element', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: true
                });

                fixture.detectChanges();
                inputElement = element.querySelector<HTMLInputElement>('#text-id');
            });

            it('should be disabled on readonly forms', async () => {
                await fixture.whenStable();
                fixture.detectChanges();

                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.disabled).toBeTruthy();
            });

        });

        describe('and mask is configured on text element', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { inputMask: '##-##0,00%' },
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'simple placeholder'
                });

                fixture.detectChanges();
                inputElement = element.querySelector<HTMLInputElement>('#text-id');
            });

            it('should show text widget', () => {
                expect(element.querySelector('#text-id')).toBeDefined();
                expect(element.querySelector('#text-id')).not.toBeNull();
            });

            it('should show the field placeholder', () => {
                const label = element.querySelector<HTMLElement>('label.mat-form-field-label[for="text-id"]');
                expect(label.innerText).toBe('simple placeholder');
            });

            it('should show the field placeholder when clicked', async () => {
                inputElement.click();
                fixture.detectChanges();
                await fixture.whenStable();

                const label = element.querySelector<HTMLElement>('label.mat-form-field-label[for="text-id"]');
                expect(label.innerText).toBe('simple placeholder');
            });

            it('should prevent text to be written if is not allowed by the mask on keyUp event', async () => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                widget.field.value = 'F';
                const event: any = new Event('keyup');
                event.keyCode = '70';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                inputElement = element.querySelector<HTMLInputElement>('#text-id');
                expect(inputElement.value).toBe('');
            });

            it('should prevent text to be written if is not allowed by the mask on input event', async () => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                widget.field.value = 'F';
                inputElement.dispatchEvent(new Event('input'));

                fixture.detectChanges();
                await fixture.whenStable();

                inputElement = element.querySelector<HTMLInputElement>('#text-id');
                expect(inputElement.value).toBe('');
            });

            it('should allow masked configured value on keyUp event', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '1';
                widget.field.value = '1';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                const textEle = element.querySelector<HTMLInputElement>('#text-id');
                expect(textEle.value).toBe('1');
            });

            it('should auto-fill masked configured value on keyUp event', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '12345678';
                widget.field.value = '12345678';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                const textEle = element.querySelector<HTMLInputElement>('#text-id');
                expect(textEle.value).toBe('12-345,67%');
            });
        });

        describe('when the mask is reversed ', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { existingColspan: 1, maxColspan: 2, inputMask: '#.##0,00%', inputMaskReversed: true },
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                inputElement = element.querySelector<HTMLInputElement>('#text-id');
            });

            afterEach(() => {
                fixture.destroy();
                TestBed.resetTestingModule();
            });

            it('should be able to apply the mask reversed', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '1234';
                widget.field.value = '1234';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                const textEle = element.querySelector<HTMLInputElement>('#text-id');
                expect(textEle.value).toBe('12,34%');
            });
        });

        describe('and a mask placeholder is configured', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { inputMask: '##-##0,00%', inputMaskPlaceholder: 'Phone : (__) ___-___' },
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'simple placeholder'
                });

                fixture.detectChanges();
                inputElement = element.querySelector<HTMLInputElement>('#text-id');
            });

            it('should show the input mask placeholder', () => {
                const label = element.querySelector<HTMLElement>('label.mat-form-field-label[for="text-id"]');
                expect(label.innerText).toBe('Phone : (__) ___-___');
            });

            it('should show the input mask placeholder when clicked', async () => {
                inputElement.click();
                fixture.detectChanges();
                await fixture.whenStable();

                const label = element.querySelector<HTMLElement>('label.mat-form-field-label[for="text-id"]');
                expect(label.innerText).toBe('Phone : (__) ___-___');
            });
        });

        describe('when form model has left labels', () => {

            it('should have left labels classes on leftLabels true', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    required: true
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const widgetContainer = element.querySelector('.adf-left-label-input-container');
                expect(widgetContainer).not.toBeNull();

                const adfLeftLabel = element.querySelector('.adf-left-label');
                expect(adfLeftLabel).not.toBeNull();
            });

            it('should not have left labels classes on leftLabels false', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    required: true
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const widgetContainer = element.querySelector('.adf-left-label-input-container');
                expect(widgetContainer).toBeNull();

                const adfLeftLabel = element.querySelector('.adf-left-label');
                expect(adfLeftLabel).toBeNull();
            });

            it('should not have left labels classes on leftLabels not present', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    required: true
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const widgetContainer = element.querySelector('.adf-left-label-input-container');
                expect(widgetContainer).toBeNull();

                const adfLeftLabel = element.querySelector('.adf-left-label');
                expect(adfLeftLabel).toBeNull();
            });
        });
    });
});
