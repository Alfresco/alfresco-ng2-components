/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NoopTranslateModule } from '../../../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../../../testing/unit-testing-utils';

describe('TextWidgetComponent', () => {
    const form = new FormModel({ taskId: 'fake-task-id' });

    let loader: HarnessLoader;
    let widget: TextWidgetComponent;
    let fixture: ComponentFixture<TextWidgetComponent>;
    let errorWidget: HTMLElement;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAnimationsModule, TextWidgetComponent]
        });
        fixture = TestBed.createComponent(TextWidgetComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
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

                await testingUtils.fillMatInput('TEXT');

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
                expect(testingUtils.getInnerTextByCSS('label')).toBe('text-name');
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

                expect(await testingUtils.getMatInputByPlaceholder('Your name here')).toBeTruthy();
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

                await testingUtils.fillMatInput('TEXT');

                errorWidget = testingUtils.getByCSS('.adf-error-text').nativeElement;
                expect(errorWidget.innerHTML).toBe('FORM.FIELD.VALIDATOR.AT_LEAST_LONG');
                expect(widget.field.isValid).toBe(false);

                await testingUtils.fillMatInput('TEXT VALUE');

                errorWidget = testingUtils.getByCSS('.adf-error-text')?.nativeElement;
                expect(widget.field.isValid).toBe(true);

                await testingUtils.fillMatInput('TEXT VALUE TOO LONG');
                expect(widget.field.isValid).toBe(false);

                errorWidget = testingUtils.getByCSS('.adf-error-text').nativeElement;
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

                await testingUtils.fillMatInput('TEXT');
                expect(widget.field.isValid).toBe(false);

                await testingUtils.fillMatInput('8');
                expect(widget.field.isValid).toBe(true);

                await testingUtils.fillMatInput('8XYZ');
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
                const host = await testingUtils.getMatInputHost();
                await host.hover();

                const tooltip = await host.getAttribute('title');
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
                expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();

                await testingUtils.blurMatInput();

                expect(testingUtils.getByCSS('.adf-invalid')).toBeTruthy();
            });

            it('should be able to display label with asterisk and input field is required', async () => {
                const formField = await testingUtils.getMatFormField();
                const formControl = await formField.getControl();

                expect(formControl.isRequired).toBeTruthy();

                const inputField = testingUtils.getByCSS('.adf-input').nativeElement;
                expect(inputField.hasAttribute('required')).toBeTruthy();
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
                const input = await testingUtils.getMatInput();
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
                inputElement = testingUtils.getByCSS('#text-id').nativeElement;
            });

            it('should show text widget', async () => {
                expect(await testingUtils.checkIfMatInputExists()).toBe(true);
            });

            it('should show the field placeholder', async () => {
                expect(await testingUtils.checkIfMatInputExistsWithPlaceholder('simple placeholder')).toBeTrue();
            });

            it('should show the field placeholder when clicked', async () => {
                await testingUtils.clickMatInput();

                expect(await testingUtils.checkIfMatInputExistsWithPlaceholder('simple placeholder')).toBeTruthy();
            });

            it('should prevent text to be written if is not allowed by the mask on keyUp event', async () => {
                expect(testingUtils.getByCSS('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                widget.field.value = 'F';
                const event: any = new Event('keyup');
                event.keyCode = '70';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id').nativeElement.value).toBe('');
            });

            it('should prevent text to be written if is not allowed by the mask on input event', async () => {
                expect(testingUtils.getByCSS('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                widget.field.value = 'F';
                inputElement.dispatchEvent(new Event('input'));

                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id').nativeElement.value).toBe('');
            });

            it('should allow masked configured value on keyUp event', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id')).not.toBeNull();

                inputElement.value = '1';
                widget.field.value = '1';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id').nativeElement.value).toBe('1');
            });

            it('should auto-fill masked configured value on keyUp event', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id')).not.toBeNull();

                inputElement.value = '12345678';
                widget.field.value = '12345678';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id').nativeElement.value).toBe('12-345,67%');
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
                inputElement = testingUtils.getByCSS('#text-id').nativeElement;
            });

            afterEach(() => {
                fixture.destroy();
                TestBed.resetTestingModule();
            });

            it('should be able to apply the mask reversed', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id')).not.toBeNull();

                inputElement.value = '1234';
                widget.field.value = '1234';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(testingUtils.getByCSS('#text-id').nativeElement.value).toBe('12,34%');
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
                expect(await testingUtils.checkIfMatInputExistsWithPlaceholder('Phone : (__) ___-___')).toBeTrue();
            });

            it('should show the input mask placeholder when clicked', async () => {
                await testingUtils.clickMatInput();

                expect(await testingUtils.checkIfMatInputExistsWithPlaceholder('Phone : (__) ___-___')).toBeTrue();
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

                const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
                expect(widgetContainer).not.toBeNull();

                const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
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

                const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
                expect(widgetContainer).toBeNull();

                const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
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

                const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
                expect(widgetContainer).toBeNull();

                const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
                expect(adfLeftLabel).toBeNull();
            });
        });

        it('should be able to display label with asterisk', async () => {
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

            const asterisk = testingUtils.getByCSS('.adf-asterisk').nativeElement;

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });
});
