/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextWidgetComponent', () => {
    const form = new FormModel({ taskId: 'fake-task-id' });

    let loader: HarnessLoader;
    let widget: TextWidgetComponent;
    let fixture: ComponentFixture<TextWidgetComponent>;
    let element: HTMLElement;
    let errorWidget: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(),
                      NoopAnimationsModule,
                      MatInputModule,
                      MatFormFieldModule,
                      MatTooltipModule,
                      FormsModule,
                      MatIconModule]
        });
        fixture = TestBed.createComponent(TextWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('when template is ready', () => {
        describe('and no mask is configured on text element', () => {
            it('should raise ngModelChange event', async () => {
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                expect(widget.field.value).toBe('');

                const input = await loader.getHarness(MatInputHarness);
                await input.setValue('TEXT');

                expect(widget.field.value).toBe('TEXT');
            });

            it('should be able to set label property', () => {
                widget.field = new FormFieldModel(form, {
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
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'Your name here'
                });
                fixture.detectChanges();
                await fixture.whenStable();

                const inputField = await loader.getHarness(MatInputHarness.with({placeholder: 'Your name here'}));
                expect(inputField).toBeTruthy();
            });

            it('should be able to set min/max length properties for Text widget', async () => {
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    minLength: 5,
                    maxLength: 10
                });
                fixture.detectChanges();

                const input = await loader.getHarness(MatInputHarness);
                await input.setValue('TEXT');

                errorWidget = element.querySelector('.adf-error-text');
                expect(errorWidget.innerHTML).toBe('FORM.FIELD.VALIDATOR.AT_LEAST_LONG');
                expect(widget.field.isValid).toBe(false);

                await input.setValue('TEXT VALUE');

                errorWidget = element.querySelector('.adf-error-text');
                expect(widget.field.isValid).toBe(true);

                await input.setValue('TEXT VALUE TOO LONG');
                expect(widget.field.isValid).toBe(false);

                errorWidget = element.querySelector('.adf-error-text');
                expect(errorWidget.innerHTML).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
            });

            it('should be able to set regex pattern property for Text widget', async () => {
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    regexPattern: '[0-9]'
                });
                fixture.detectChanges();

                const input = await loader.getHarness(MatInputHarness);
                await input.setValue('TEXT');
                expect(widget.field.isValid).toBe(false);

                await input.setValue('8');
                expect(widget.field.isValid).toBe(true);

                await input.setValue('8XYZ');
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
                const input = await loader.getHarness(MatInputHarness);
                await (await input.host()).hover();

                const tooltip = await (await input.host()).getAttribute('title');
                expect(tooltip).toBe('my custom tooltip');
            });
        });

        describe('when is required', () => {
            beforeEach(() => {
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    required: true
                });
            });

            it('should be marked as invalid after interaction', async () => {
                const input = await loader.getHarness(MatInputHarness);
                expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

                await (await input.host()).blur();

                expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
            });

            it('should be able to display label with asterisk', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const asterisk = element.querySelector('.adf-asterisk');

                expect(asterisk).toBeTruthy();
                expect(asterisk.textContent).toEqual('*');
            });
        });

        describe('and no mask is configured on text element', () => {
            beforeEach(() => {
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: true
                });

                fixture.detectChanges();
            });

            it('should be disabled on readonly forms', async () => {
                const input = await loader.getHarness(MatInputHarness);
                expect(await input.isDisabled()).toBe(true);
            });
        });

        describe('and mask is configured on text element', () => {
            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(form, {
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

            it('should show text widget', async () => {
                expect(await loader.hasHarness(MatInputHarness)).toBe(true);
            });

            it('should show the field placeholder', async () => {
                const inputField = await loader.getHarness(MatInputHarness.with({placeholder: 'simple placeholder'}));
                expect(inputField).toBeTruthy();
            });

            it('should show the field placeholder when clicked', async () => {
                const input = await loader.getHarness(MatInputHarness);
                await (await input.host()).click();

                const inputField = await loader.getHarness(MatInputHarness.with({placeholder: 'simple placeholder'}));
                expect(inputField).toBeTruthy();
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
                widget.field = new FormFieldModel(form, {
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
            beforeEach(() => {
                widget.field = new FormFieldModel(form, {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { inputMask: '##-##0,00%', inputMaskPlaceholder: 'Phone : (__) ___-___' },
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'simple placeholder'
                });

                fixture.detectChanges();
            });

            it('should show the input mask placeholder', async () => {
                const inputField = await loader.getHarness(MatInputHarness.with({placeholder: 'Phone : (__) ___-___'}));
                expect(inputField).toBeTruthy();
            });

            it('should show the input mask placeholder when clicked', async () => {
                const input = await loader.getHarness(MatInputHarness);
                await (await input.host()).click();

                const inputField = await loader.getHarness(MatInputHarness.with({placeholder: 'Phone : (__) ___-___'}));
                expect(inputField).toBeTruthy();
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
                widget.field = new FormFieldModel(form, {
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
