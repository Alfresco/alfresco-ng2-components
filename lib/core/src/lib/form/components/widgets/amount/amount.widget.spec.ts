/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormFieldModel } from '../core/form-field.model';
import { AmountWidgetComponent, ADF_AMOUNT_SETTINGS } from './amount.widget';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { UnitTestingUtils } from '../../../../testing/unit-testing-utils';
import { firstValueFrom, of } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { FormFieldEvent } from '../../../events/form-field.event';
import { TranslationService } from '../../../../translation/translation.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FormRendererComponent } from '../../form-renderer.component';
import { FORM_RULES_MANAGER, FormInvocationProvider } from '../../../models/form-rules.model';
import {
    bindFormState,
    commitFormState,
    currentFormWrite,
    FormInvocationRequest,
    FormResetResult,
    FormWriteContext
} from '../../../models/form-state.model';
import { provideFormInstanceReset } from '../../../services/provide-form-instance-reset';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

describe('AmountWidgetComponent', () => {
    let loader: HarnessLoader;
    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AmountWidgetComponent],
            providers: [{ provide: TranslationService, useValue: { getLocale: () => 'en-US' } }]
        });

        fixture = TestBed.createComponent(AmountWidgetComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    describe('event tracking', () => {
        let eventSpy: jasmine.Spy;

        beforeEach(() => {
            eventSpy = spyOn(widget, 'event').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {});
            fixture.detectChanges();
        });

        it('should call event method only once when widget is clicked', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });
            fixture.debugElement.nativeElement.dispatchEvent(clickEvent);

            expect(eventSpy).toHaveBeenCalledTimes(1);
            expect(eventSpy).toHaveBeenCalledWith(clickEvent);
        });
    });

    it('should setup currency from field', () => {
        const currency = 'UAH';
        widget.field = new FormFieldModel(null, {
            currency
        });

        widget.ngOnInit();
        expect(widget.currency).toBe(currency);
    });

    it('should setup default currency', () => {
        widget.field = null;
        widget.ngOnInit();
        expect(widget.currency).toBe(AmountWidgetComponent.DEFAULT_CURRENCY);
    });

    it('should setup empty placeholder in readOnly mode', () => {
        widget.field = new FormFieldModel(null, {
            readOnly: true,
            placeholder: '1234'
        });

        widget.ngOnInit();
        expect(widget.placeholder).toBe('');
    });

    it('should setup placeholder when readOnly is false', () => {
        widget.field = new FormFieldModel(null, {
            readOnly: false,
            placeholder: '1234'
        });

        widget.ngOnInit();
        expect(widget.placeholder).toBe('1234');
    });

    it('it should return locale based on browser', () => {
        const expectedLanguage = 'en-US';
        widget.enableDisplayBasedOnLocale = true;
        widget.field = new FormFieldModel(null, { id: 1, name: 'test', value: 25, currency: 'USD' });
        widget.setInitialValues();
        fixture.detectChanges();

        expect(widget.locale).toBe(expectedLanguage);
    });

    it('should set initial values when enableDisplayBasedOnLocale is enabled', () => {
        widget.field = new FormFieldModel(null, { id: 1, name: 'test', value: 25, currency: 'USD' });
        widget.enableDisplayBasedOnLocale = true;
        widget.currency = 'USD';
        widget.setInitialValues();

        expect(widget.amountWidgetValue).toBe('$25');
        expect(widget.decimalProperty).toBe('1.0-0');
        expect(widget.valueAsNumber).toBe(25);
    });

    it('should set initial values with correct currency', () => {
        widget.field = new FormFieldModel(null, { id: 2, name: 'test', value: 25, currency: 'GBP' });
        widget.enableDisplayBasedOnLocale = true;
        widget.currency = 'GBP';
        widget.setInitialValues();

        expect(widget.amountWidgetValue).toBe('£25');
        expect(widget.decimalProperty).toBe('1.0-0');
    });

    it('should set initial values with correct currency icon', () => {
        widget.field = new FormFieldModel(null, { id: 2, name: 'test', value: 25, currency: '¥' });
        widget.enableDisplayBasedOnLocale = true;
        widget.currency = '¥';
        widget.setInitialValues();

        expect(widget.amountWidgetValue).toBe('¥25');
        expect(widget.decimalProperty).toBe('1.0-0');
    });

    it('should set initial values without currency', () => {
        widget.field = new FormFieldModel(null, { id: 3, name: 'test', value: 25, currency: '' });
        widget.enableDisplayBasedOnLocale = true;
        widget.currency = '';
        widget.currencyDisplay = '';
        widget.setInitialValues();

        expect(widget.amountWidgetValue).toBe('25');
        expect(widget.decimalProperty).toBe('1.0-0');
    });

    it('should set initial values when enableDisplayBasedOnLocale is disabled', () => {
        widget.field = new FormFieldModel(null, { id: 4, name: 'test', value: 25, enableFractions: false, className: '' });
        widget.enableDisplayBasedOnLocale = false;
        widget.setInitialValues();

        expect(widget.amountWidgetValue.toString()).toBe('25');
    });

    it('should transform value from number to string', () => {
        widget.enableDisplayBasedOnLocale = true;
        widget.valueAsNumber = 123456;
        widget.amountWidgetOnFocus();
        expect(widget.amountWidgetValue).toBe('123456');

        widget.valueAsNumber = 123456.11;
        widget.amountWidgetOnFocus();
        expect(widget.amountWidgetValue).toBe('123456.11');

        widget.valueAsNumber = 0;
        widget.amountWidgetOnFocus();
        expect(widget.amountWidgetValue).toBe('0');

        widget.valueAsNumber = undefined;
        widget.amountWidgetOnFocus();
        expect(widget.amountWidgetValue).toBe(null);
    });

    it('should update field.value on change', () => {
        widget.field = new FormFieldModel(null, { id: 5, name: 'test', value: 25 });
        const mockValue = '1234.12';
        widget.amountWidgetValue = mockValue;
        widget.onFieldChangedAmountWidget();

        expect(widget.field.value).toBe(mockValue);
    });

    it('should transform values on blur', () => {
        widget.enableDisplayBasedOnLocale = true;
        widget.amountWidgetValue = '1234.56';
        widget.amountWidgetOnBlur();

        expect(widget.valueAsNumber).toBe(1234.56);
        expect(widget.amountWidgetValue).toBe('$1,234.56');

        widget.amountWidgetValue = '';
        widget.amountWidgetOnBlur();

        expect(widget.valueAsNumber).toBe(null);
        expect(widget.amountWidgetValue).toBe(null);
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.AMOUNT,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const host = await testingUtils.input.getHost();
            await host.hover();

            const tooltip = await host.getAttribute('title');
            expect(tooltip).toBe('my custom tooltip');
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.AMOUNT,
                required: true
            });
        });

        it('should be marked as invalid after interaction', async () => {
            const host = await testingUtils.input.getHost();

            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();
            await host.blur();
            expect(testingUtils.getByCSS('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk and input field is required', async () => {
            const formField = await testingUtils.formField.get();
            const formControl = await formField.getControl();

            expect(formControl.isRequired).toBeTruthy();

            const inputField = testingUtils.getByCSS('.adf-input').nativeElement;
            expect(inputField.hasAttribute('required')).toBeTruthy();
        });
    });
});

describe('AmountWidgetComponent - rendering', () => {
    let loader: HarnessLoader;
    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;
    let testingUtils: UnitTestingUtils;
    let formService: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AmountWidgetComponent],
            providers: [{ provide: TranslationService, useValue: { getLocale: () => 'en-US' } }]
        });
        fixture = TestBed.createComponent(AmountWidgetComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
        formService = TestBed.inject(FormService);
    });

    it('[C289915] - Should be able to display different currency icons', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            id: 'TestAmount1',
            name: 'Test Amount',
            type: 'amount',
            currency: '$'
        });
        fixture.detectChanges();

        const field = await testingUtils.formField.get();
        expect(await field.getPrefixText()).toBe('$');

        widget.field.currency = '£';
        widget.ngOnInit();
        fixture.detectChanges();

        expect(await field.getPrefixText()).toBe('£');

        widget.field.currency = '€';
        widget.ngOnInit();
        fixture.detectChanges();

        expect(await field.getPrefixText()).toBe('€');
    });

    it('[C309692] - Should be possible to set the General Properties for Amount Widget', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            id: 'TestAmount1',
            name: 'Test Amount',
            type: 'amount',
            required: true,
            colspan: 2,
            placeholder: 'Check Placeholder Text',
            minValue: null,
            maxValue: null,
            visibilityCondition: null,
            params: {
                existingColspan: 1,
                maxColspan: 2
            },
            enableFractions: false,
            currency: '$'
        });
        fixture.detectChanges();
        await fixture.whenStable();

        const field = await testingUtils.formField.get();
        const inputField = await testingUtils.input.getByPlaceholder('Check Placeholder Text');
        expect(inputField).toBeTruthy();
        expect(await field.getPrefixText()).toBe('$');

        const widgetLabel = testingUtils.getByDataAutomationId('adf-amount-widget-label').nativeElement;
        expect(widgetLabel.textContent.trim()).toBe('Test Amount');
        expect(widget.field.isValid).toBe(false);

        const input = await testingUtils.input.get();
        await input.setValue('90');
        expect(widget.field.isValid).toBe(true);

        await input.setValue('gdfgdf');
        expect(widget.field.isValid).toBe(false);

        const formField = await testingUtils.formField.get();
        const errors = await formField.getTextErrors();
        expect(errors[0]).toContain('FORM.FIELD.VALIDATOR.INVALID_NUMBER');
    });

    it('[C309693] - Should be possible to set the Advanced Properties for Amount Widget', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            id: 'TestAmount1',
            name: 'Test Amount',
            type: 'amount',
            required: true,
            colspan: 2,
            placeholder: 'Check Placeholder Text',
            minValue: 10,
            maxValue: 90,
            visibilityCondition: null,
            params: {
                existingColspan: 1,
                maxColspan: 2
            },
            enableFractions: true,
            currency: '£'
        });
        fixture.detectChanges();
        await fixture.whenStable();

        const widgetLabel = testingUtils.getByDataAutomationId('adf-amount-widget-label').nativeElement;
        expect(widgetLabel.textContent.trim()).toBe('Test Amount');

        const field = await testingUtils.formField.get();
        expect(await field.getPrefixText()).toBe('£');

        expect(widget.field.isValid).toBe(false);

        const input = await testingUtils.input.get();
        await input.setValue('8');
        expect(widget.field.isValid).toBe(false);

        const formField = await testingUtils.formField.get();
        let errors = await formField.getTextErrors();
        expect(errors[0].trim()).toContain('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');

        await input.setValue('99');
        expect(widget.field.isValid).toBe(false);
        errors = await formField.getTextErrors();
        expect(errors[0].trim()).toContain('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN');

        await input.setValue('80');
        expect(widget.field.isValid).toBe(true);

        await input.setValue('80.67');
        expect(widget.field.isValid).toBe(true);

        await input.setValue('incorrect format');
        expect(widget.field.isValid).toBe(false);
        errors = await formField.getTextErrors();
        expect(errors[0].trim()).toContain('FORM.FIELD.VALIDATOR.INVALID_NUMBER');
    });

    describe('when validation runs without amount interaction', () => {
        const validatorTranslations = {
            FORM: {
                FIELD: {
                    VALIDATOR: {
                        NOT_LESS_THAN: "Can't be less than {{ minValue }}",
                        NOT_GREATER_THAN: "Can't be greater than {{ maxValue }}"
                    }
                }
            }
        };
        let amountField: FormFieldModel;
        let form: FormModel;

        beforeEach(async () => {
            const translateService = TestBed.inject(TranslateService);
            translateService.setTranslation('en', validatorTranslations);
            await firstValueFrom(translateService.use('en'));

            form = new FormModel({ taskId: '<id>' }, undefined, false, formService);
            amountField = new FormFieldModel(form, {
                id: 'amount-id',
                type: FormFieldTypes.AMOUNT,
                value: 1,
                minValue: '10'
            });
            form.fieldsCache = [amountField];
            amountField.validate();
            fixture.componentRef.setInput('field', amountField);
            fixture.detectChanges();
        });

        it('should render updated parameters after direct revalidation', async () => {
            const formField = await testingUtils.formField.get();
            let errors = await formField.getTextErrors();
            expect(errors[0]).toContain("Can't be less than 10");

            amountField.value = 10;
            amountField.minValue = '1';
            amountField.maxValue = '5';
            amountField.validate();
            fixture.detectChanges();

            errors = await formField.getTextErrors();
            expect(errors[0]).toContain("Can't be greater than 5");
            expect(errors[0]).not.toContain('{{');
        });

        it('should render updated parameters after sibling field revalidation', async () => {
            const siblingField = new FormFieldModel(form, {
                id: 'sibling-id',
                type: FormFieldTypes.TEXT,
                value: 'before'
            });
            form.fieldsCache = [amountField, siblingField];
            amountField.value = 10;
            amountField.minValue = '1';
            amountField.maxValue = '5';

            siblingField.value = 'after';
            form.onFormFieldChanged(siblingField);
            fixture.detectChanges();

            const formField = await testingUtils.formField.get();
            const errors = await formField.getTextErrors();
            expect(errors[0]).toContain("Can't be greater than 5");
            expect(errors[0]).not.toContain('{{');
        });
    });

    describe('when form model has left labels', () => {
        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'amount-id',
                name: 'amount-name',
                value: '',
                type: FormFieldTypes.AMOUNT,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('.adf-left-label-input-container')).not.toBeNull();
            expect(testingUtils.getByCSS('.adf-left-label')).not.toBeNull();
        });

        it('should not have left labels classes on leftLabels false', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                id: 'amount-id',
                name: 'amount-name',
                value: '',
                type: FormFieldTypes.AMOUNT,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('.adf-left-label-input-container')).toBeNull();
            expect(testingUtils.getByCSS('.adf-left-label')).toBeNull();
        });

        it('should not have left labels classes on leftLabels not present', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'amount-id',
                name: 'amount-name',
                value: '',
                type: FormFieldTypes.AMOUNT,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('.adf-left-label-input-container')).toBeNull();
            expect(testingUtils.getByCSS('.adf-left-label')).toBeNull();
        });

        it('should be able to display label with  manually when left-labels are true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'amount-id',
                name: 'amount-name',
                value: '',
                type: FormFieldTypes.AMOUNT,
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

    describe('Test widget with ADF_AMOUNT_SETTINGS as observable', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
        });

        describe('set module for enableDisplayBasedOnLocale = true', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'TestAmount1',
                name: 'Test Amount',
                type: 'amount',
                currency: 'USD',
                enableFractions: true,
                value: '1234.55'
            });

            beforeEach(async () => {
                TestBed.configureTestingModule({
                    imports: [AmountWidgetComponent],
                    providers: [
                        { provide: ADF_AMOUNT_SETTINGS, useValue: of({ enableDisplayBasedOnLocale: true }) },
                        { provide: TranslationService, useValue: { getLocale: () => 'en-US' } }
                    ]
                });
                fixture = TestBed.createComponent(AmountWidgetComponent);
                widget = fixture.componentInstance;
                fixture.componentRef.setInput('field', mockField);
                loader = TestbedHarnessEnvironment.loader(fixture);
                testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
                fixture.detectChanges();
            });

            it('should set enableDisplayBasedOnLocale to true', () => {
                expect(widget.enableDisplayBasedOnLocale).toBeTrue();
                expect(widget.decimalProperty).toBe('1.2-2');
                expect(widget.locale).toBe('en-US');
                expect(widget.valueAsNumber).toBe('1234.55');
                expect(widget.amountWidgetValue).toBe('$1,234.55');
            });

            it('should not display prefix with currency when enableDisplayBasedOnLocale = true', async () => {
                const field = await testingUtils.formField.get();
                expect(await field.getPrefixText()).toBe('');
            });
        });
    });

    describe('AmountWidgetComponent - subscribeToFieldChanges', () => {
        it('should subscribe to formFieldValueChanged events for the specific field', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'amount-1',
                name: 'Test Amount',
                type: 'amount',
                value: '100'
            });
            const subscriptionSpy = spyOn(formService.formFieldValueChanged, 'subscribe').and.callThrough();
            widget.field = mockField;
            widget.subscribeToFieldChanges();

            expect(subscriptionSpy).toHaveBeenCalled();
        });

        it('should update value when field value changes and input is not in focus with enableDisplayBasedOnLocale enabled', async () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'amount-1',
                name: 'Test Amount',
                type: 'amount',
                value: '100',
                currency: 'USD'
            });
            widget.field = mockField;
            widget.enableDisplayBasedOnLocale = true;
            widget.isInputInFocus = false;
            widget.currency = 'USD';
            widget.decimalProperty = '1.0-0';
            widget.ngOnInit();

            const updateValueSpy = spyOn(widget, 'updateValue').and.callThrough();
            mockField.restoreRuntimeValue('200');
            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, mockField));
            await fixture.whenStable();

            expect(updateValueSpy).toHaveBeenCalledWith('200');
            expect(widget.amountWidgetValue).toBe('$200');
        });

        it('should update amountWidgetValue when field value changes and input is not in focus with enableDisplayBasedOnLocale disabled', () => {
            const updateValueSpy = spyOn(widget, 'updateValue').and.callThrough();
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'amount-1',
                name: 'Test Amount',
                type: 'amount',
                value: '100'
            });
            widget.field = mockField;
            widget.enableDisplayBasedOnLocale = false;
            widget.isInputInFocus = false;
            widget.ngOnInit();

            mockField.restoreRuntimeValue('200');
            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, mockField));

            expect(updateValueSpy).not.toHaveBeenCalled();
            expect(widget.amountWidgetValue).toBe('200');
        });

        it('should not update value with formService.formFieldValueChanged when input is in focus', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'amount-1',
                name: 'Test Amount',
                type: 'amount',
                value: '100'
            });
            widget.field = mockField;
            widget.enableDisplayBasedOnLocale = true;
            widget.isInputInFocus = true;
            widget.amountWidgetValue = '100';
            widget.ngOnInit();
            const updateValueSpy = spyOn(widget, 'updateValue');
            mockField.restoreRuntimeValue('200');
            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, mockField));

            expect(updateValueSpy).not.toHaveBeenCalled();
            expect(widget.amountWidgetValue).toBe('100');
        });

        it('should not react to events from different fields', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'amount-1',
                name: 'Test Amount',
                type: 'amount',
                value: '100',
                enableFractions: false
            });
            const otherField = new FormFieldModel(new FormModel(), {
                id: 'amount-2',
                name: 'Other Amount',
                type: 'amount',
                value: '200'
            });
            widget.field = mockField;
            widget.currency = 'USD';
            widget.enableDisplayBasedOnLocale = true;
            widget.isInputInFocus = false;
            widget.amountWidgetValue = '100';
            widget.ngOnInit();

            const updateValueSpy = spyOn(widget, 'updateValue').and.callThrough();

            formService.formFieldValueChanged.next(new FormFieldEvent(otherField.form, otherField));

            expect(updateValueSpy).not.toHaveBeenCalled();
        });

        it('should use field.value when updating without enableDisplayBasedOnLocale and input not in focus', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'amount-1',
                name: 'Test Amount',
                type: 'amount',
                value: '100'
            });
            widget.field = mockField;
            widget.enableDisplayBasedOnLocale = false;
            widget.isInputInFocus = false;
            widget.ngOnInit();

            mockField.value = '300';
            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, mockField));

            expect(widget.amountWidgetValue).toBe('300');
        });
    });

    describe('Test widget with different setting for enableDisplayBasedOnLocale', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
        });

        describe('set module for enableDisplayBasedOnLocale = true', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'TestAmount1',
                name: 'Test Amount',
                type: 'amount',
                currency: 'USD',
                enableFractions: true,
                value: '1234.55'
            });

            beforeEach(async () => {
                TestBed.configureTestingModule({
                    imports: [AmountWidgetComponent],
                    providers: [
                        { provide: ADF_AMOUNT_SETTINGS, useValue: { enableDisplayBasedOnLocale: true } },
                        { provide: TranslationService, useValue: { getLocale: () => 'en-US' } }
                    ]
                });
                fixture = TestBed.createComponent(AmountWidgetComponent);
                widget = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
                testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
                fixture.componentRef.setInput('field', mockField);
                fixture.detectChanges();
            });

            it('should not display prefix with currency when enableDisplayBasedOnLocale = true', async () => {
                const field = await testingUtils.formField.get();
                expect(await field.getPrefixText()).toBe('');
            });

            it('should call method on focus and change input value', async () => {
                const focusSpy = spyOn(widget, 'amountWidgetOnFocus').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.input.get();
                const fieldValueBeforeFocus = await field.getValue();
                await field.focus();
                const fieldValue = await field.getValue();

                expect(field).toBeDefined();
                expect(widget.field.value).toBe('1234.55');
                expect(fieldValueBeforeFocus).toBe('$1,234.55');
                expect(focusSpy).toHaveBeenCalled();
                expect(fieldValue).toBe('1234.55');
            });

            it('should transform value on blur', async () => {
                const newValue = '456789';
                const blurSpy = spyOn(widget, 'amountWidgetOnBlur').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.input.get();
                const fieldValueBeforeBlur = await field.getValue();
                await field.setValue(newValue);
                await field.blur();
                const fieldValue = await field.getValue();

                expect(field).toBeDefined();
                expect(widget.field.value).toBe(newValue);
                expect(fieldValueBeforeBlur).toBe('$1,234.55');
                expect(blurSpy).toHaveBeenCalled();
                expect(widget.valueAsNumber).toBe(parseFloat(newValue));
                expect(widget.amountWidgetValue).toBe('$456,789.00');
                expect(fieldValue).toBe('$456,789.00');
            });
        });

        describe('set module for enableDisplayBasedOnLocale = true for German locale', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'TestAmount1',
                name: 'Test Amount',
                type: 'amount',
                currency: 'USD',
                enableFractions: true,
                value: '1234.55'
            });

            beforeEach(async () => {
                TestBed.configureTestingModule({
                    imports: [AmountWidgetComponent],
                    providers: [
                        { provide: ADF_AMOUNT_SETTINGS, useValue: { enableDisplayBasedOnLocale: true } },
                        { provide: TranslationService, useValue: { getLocale: () => 'de-DE' } }
                    ]
                });
                fixture = TestBed.createComponent(AmountWidgetComponent);
                widget = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
                testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
                fixture.componentRef.setInput('field', mockField);
                fixture.detectChanges();
            });

            it('should call method on focus and change input value', async () => {
                const focusSpy = spyOn(widget, 'amountWidgetOnFocus').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.input.get();
                const fieldValueBeforeFocus = await field.getValue();
                await field.focus();
                const fieldValue = await field.getValue();
                const expectedValue = '1.234,55 $'.replace(' ', '\u00A0');
                expect(field).toBeDefined();
                expect(widget.field.value).toBe('1234.55');
                expect(fieldValueBeforeFocus).toBe(expectedValue);
                expect(focusSpy).toHaveBeenCalled();
                expect(fieldValue).toBe('1234.55');
            });

            it('should transform value on blur', async () => {
                const newValue = '456789';
                const blurSpy = spyOn(widget, 'amountWidgetOnBlur').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.input.get();
                const fieldValueBeforeBlur = await field.getValue();
                await field.setValue(newValue);
                await field.blur();
                const fieldValue = await field.getValue();
                const expectedValue = '1.234,55 $'.replace(' ', '\u00A0');
                const expectedValueAfterBlur = '456.789,00 $'.replace(' ', '\u00A0');

                expect(field).toBeDefined();
                expect(widget.field.value).toBe(newValue);
                expect(fieldValueBeforeBlur).toBe(expectedValue);
                expect(blurSpy).toHaveBeenCalled();
                expect(widget.valueAsNumber).toBe(parseFloat(newValue));
                expect(widget.amountWidgetValue).toBe(expectedValueAfterBlur);
                expect(fieldValue).toBe(expectedValueAfterBlur);
            });
        });
        describe('set module for enableDisplayBasedOnLocale = false', () => {
            const mockField = new FormFieldModel(new FormModel(), {
                id: 'TestAmount1',
                name: 'Test Amount',
                type: 'amount',
                currency: 'USD',
                enableFractions: true,
                value: '1234.55'
            });
            beforeEach(async () => {
                TestBed.configureTestingModule({
                    imports: [AmountWidgetComponent],
                    providers: [{ provide: ADF_AMOUNT_SETTINGS, useValue: { enableDisplayBasedOnLocale: false } }]
                });
                fixture = TestBed.createComponent(AmountWidgetComponent);
                widget = fixture.componentInstance;

                fixture.componentRef.setInput('field', mockField);
                loader = TestbedHarnessEnvironment.loader(fixture);
                testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
                fixture.detectChanges();
            });

            it('should display prefix with currency when enableDisplayBasedOnLocale = true', async () => {
                const field = await testingUtils.formField.get();
                expect(await field.getPrefixText()).toBe('USD');
            });

            it('should call method on focus and not change input value', async () => {
                const focusSpy = spyOn(widget, 'amountWidgetOnFocus').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.input.get();
                const fieldValueBeforeFocus = await field.getValue();
                await field.focus();
                const fieldValue = await field.getValue();

                expect(field).toBeDefined();
                expect(widget.field.value).toBe('1234.55');
                expect(widget.valueAsNumber).toBeUndefined();
                expect(fieldValueBeforeFocus).toBe('1234.55');
                expect(focusSpy).toHaveBeenCalled();
                expect(fieldValue).toBe('1234.55');
            });

            it('should call method on blur and not change input value', async () => {
                const newValue = '456789';
                const blurSpy = spyOn(widget, 'amountWidgetOnBlur').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.input.get();
                const fieldValueBeforeBlur = await field.getValue();
                await field.setValue(newValue);
                await field.blur();
                const fieldValue = await field.getValue();

                expect(field).toBeDefined();
                expect(widget.field.value).toBe(newValue);
                expect(widget.valueAsNumber).toBe(Number(newValue));
                expect(fieldValueBeforeBlur).toBe('1234.55');
                expect(blurSpy).toHaveBeenCalled();
                expect(widget.valueAsNumber).toBe(Number(newValue));
                expect(widget.amountWidgetValue).toBe('456789');
                expect(fieldValue).toBe('456789');
            });
        });
    });

    describe('placeholder', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'amount-field',
                name: 'Amount',
                type: FormFieldTypes.AMOUNT
            });
            widget.currency = 'USD';
            widget.currencyDisplay = 'symbol';
            widget.locale = 'en-US';
        });

        it('should return empty string when showPlaceholder is false', () => {
            widget.field.placeholder = 'Test';
            (widget as any).showPlaceholder = false;
            expect(widget.placeholder).toBe('');
        });

        it('should return the raw placeholder when enableDisplayBasedOnLocale is false', () => {
            const placeholderText = 'Enter amount here';
            widget.field.placeholder = placeholderText;
            widget.enableDisplayBasedOnLocale = false;
            expect(widget.placeholder).toBe(placeholderText);
        });

        it('should return the original placeholder when it is empty or only spaces', () => {
            const placeholderText = '   ';
            widget.field.placeholder = placeholderText;
            widget.enableDisplayBasedOnLocale = true;
            expect(widget.placeholder).toBe(placeholderText);
        });

        it('should return the original placeholder when it is non-numeric', () => {
            const placeholderText = 'Amount due';
            widget.field.placeholder = placeholderText;
            widget.enableDisplayBasedOnLocale = true;
            expect(widget.placeholder).toBe(placeholderText);
        });

        it('should format numeric placeholder when enableDisplayBasedOnLocale is true', () => {
            widget.field.placeholder = '1234.56';
            widget.enableDisplayBasedOnLocale = true;
            expect(widget.placeholder).toBe('$1,234.56');
        });

        it('should format numeric placeholder with different currency', () => {
            widget.field.placeholder = '5000';
            widget.currency = 'EUR';
            widget.locale = 'de-DE';
            widget.enableDisplayBasedOnLocale = true;
            const expectedValue = '5.000,00 €'.replace(' ', '\u00A0');
            expect(widget.placeholder).toBe(expectedValue);
        });

        it('should format numeric placeholder with decimal digits', () => {
            widget.field.placeholder = '1234.11';
            widget.currency = 'USD';
            widget.currencyDisplay = 'symbol';
            widget.decimalProperty = widget.showDecimalDigits;

            widget.enableDisplayBasedOnLocale = true;
            widget.locale = 'de-DE';

            const expected = '1.234,11 $'.replace(' ', '\u00A0');
            expect(widget.placeholder).toBe(expected);
        });

        it('should format numeric placeholder without decimal digits', () => {
            widget.field.placeholder = '1234.11';
            widget.currency = 'USD';
            widget.currencyDisplay = 'symbol';
            widget.decimalProperty = widget.notShowDecimalDigits;

            widget.enableDisplayBasedOnLocale = true;
            widget.locale = 'de-DE';

            const expected = '1.234 $'.replace(' ', '\u00A0');
            expect(widget.placeholder).toBe(expected);
        });

        it('should format numeric placeholder without decimal digits and rounding', () => {
            widget.field.placeholder = '1234.55';
            widget.currency = 'USD';
            widget.currencyDisplay = 'symbol';
            widget.decimalProperty = widget.notShowDecimalDigits;

            widget.enableDisplayBasedOnLocale = true;
            widget.locale = 'de-DE';

            const expected = '1.235 $'.replace(' ', '\u00A0');
            expect(widget.placeholder).toBe(expected);
        });
    });

    describe('checkIfEmptyStringOrOnlySpaces', () => {
        it('should return true for null', () => {
            expect(widget.checkIfEmptyStringOrOnlySpaces(null)).toBe(true);
        });

        it('should return true for undefined', () => {
            expect(widget.checkIfEmptyStringOrOnlySpaces(undefined)).toBe(true);
        });

        it('should return true for empty string', () => {
            expect(widget.checkIfEmptyStringOrOnlySpaces('')).toBe(true);
        });

        it('should return true for string with only spaces', () => {
            expect(widget.checkIfEmptyStringOrOnlySpaces('   ')).toBe(true);
        });

        it('should return true for string with tabs and newlines', () => {
            expect(widget.checkIfEmptyStringOrOnlySpaces('\t\n  ')).toBe(true);
        });

        it('should return false for string with non-whitespace characters', () => {
            expect(widget.checkIfEmptyStringOrOnlySpaces('test')).toBe(false);
            expect(widget.checkIfEmptyStringOrOnlySpaces(' test ')).toBe(false);
            expect(widget.checkIfEmptyStringOrOnlySpaces('123')).toBe(false);
        });
    });
});

describe('AmountWidgetComponent settings', () => {
    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AmountWidgetComponent],
            providers: [
                {
                    provide: ADF_AMOUNT_SETTINGS,
                    useValue: {
                        showReadonlyPlaceholder: true
                    }
                }
            ]
        });
        fixture = TestBed.createComponent(AmountWidgetComponent);

        widget = fixture.componentInstance;
    });

    it('should display placeholder via injected settings', () => {
        const field: any = {
            readOnly: true,
            placeholder: 'some placeholder'
        };
        widget.field = field;
        expect(widget.placeholder).toBe('some placeholder');
    });
});

describe('AmountWidgetComponent reset through the form renderer', () => {
    for (const locale of [false, true]) {
        describe(`locale display ${locale}`, () => {
            let service: FormService;
            let manager: { initialize: jasmine.Spy; destroy: jasmine.Spy; rulesOnlyProvider?: FormInvocationProvider };

            beforeEach(() => {
                manager = { initialize: jasmine.createSpy('initialize'), destroy: jasmine.createSpy('destroy') };
                TestBed.configureTestingModule({
                    imports: [FormRendererComponent],
                    providers: [
                        { provide: FORM_RULES_MANAGER, useValue: manager },
                        { provide: TranslationService, useValue: { getLocale: () => 'en-US' } },
                        { provide: ADF_AMOUNT_SETTINGS, useValue: { enableDisplayBasedOnLocale: locale } }
                    ]
                });
                service = TestBed.inject(FormService);
            });

            function mount(value?: number) {
                const form = new FormModel(
                    {
                        id: 'same-definition',
                        version: 1,
                        fields: [
                            {
                                id: 'container',
                                type: 'container',
                                numberOfColumns: 1,
                                fields: { 1: [{ id: 'amount', type: 'amount', currency: 'USD', ...(value === undefined ? {} : { value }) }] }
                            }
                        ],
                        outcomes: [{ id: 'clear', name: 'Clear', executionMode: 'rules-only', skipValidation: true }]
                    },
                    undefined,
                    false,
                    service
                );
                const fixture = TestBed.createComponent(FormRendererComponent);
                fixture.componentRef.setInput('formDefinition', form);
                fixture.detectChanges();
                const widget = fixture.debugElement.query(By.directive(AmountWidgetComponent)).componentInstance as AmountWidgetComponent;
                const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
                return {
                    fixture,
                    form,
                    widget,
                    input,
                    field: form.getFieldById('amount'),
                    outcome: form.outcomes.find((item) => item.id === 'clear')
                };
            }

            async function settle(...fixtures: ComponentFixture<FormRendererComponent<unknown>>[]) {
                for (const fixture of fixtures) {
                    fixture.detectChanges();
                    await fixture.whenStable();
                    fixture.detectChanges();
                }
            }

            for (const focused of [false, true]) {
                it(`should keep the mounted state through a reset and a marked write when focused is ${focused}`, async () => {
                    const a = mount(10);
                    const b = mount(700);
                    await settle(a.fixture, b.fixture);
                    a.form.changeFieldValue('amount', 100);
                    await settle(a.fixture);
                    if (focused) {
                        a.input.dispatchEvent(new FocusEvent('focus'));
                        a.input.value = '999';
                        a.input.dispatchEvent(new Event('input'));
                        await settle(a.fixture);
                    }
                    const bBefore = {
                        value: b.field.value,
                        display: b.input.value,
                        cache: b.widget.amountWidgetValue,
                        number: b.widget.valueAsNumber,
                        serialized: b.form.values.amount
                    };
                    const fields = spyOn(service.formFieldValueChanged, 'next').and.callThrough();
                    const rules = spyOn(service.formRulesEvent, 'next').and.callThrough();
                    const reset = spyOn(a.form, 'resetToDefaults').and.callThrough();
                    let captured: FormInvocationRequest;
                    manager.rulesOnlyProvider = {
                        enabled: true,
                        execute: async (request) => {
                            captured = request;
                            expect(request.form).toBe(a.form);
                            expect(request.renderer).toBe(a.fixture.componentInstance);
                            const result = await request.reset();
                            expect(result.status).toBe('complete');
                            expect(a.field.value).toBe(10);
                            expect(a.form.values.amount).toBe(10);
                            expect(a.widget.valueAsNumber).toBe(10);
                            expect(a.widget.amountWidgetValue).toBe(locale && !focused ? '$10' : '10');
                            a.fixture.detectChanges();
                            expect(a.input.value).toBe(locale && !focused ? '$10' : '10');
                            expect(fields).not.toHaveBeenCalled();
                            expect(rules).not.toHaveBeenCalled();
                            request.form.changeFieldValue('amount', 42, request);
                            a.fixture.detectChanges();
                            expect(a.widget.valueAsNumber).toBe(42);
                            expect(a.widget.amountWidgetValue).toBe(locale && !focused ? '$42' : '42');
                            expect(a.input.value).toBe(locale && !focused ? '$42' : '42');
                            return result;
                        }
                    };
                    const terminal = jasmine.createSpy('terminal');
                    const result = await new Promise<FormResetResult>((resolve) => {
                        expect(
                            a.fixture.componentInstance.dispatchRulesOnlyOutcome(a.outcome, (completed) => {
                                terminal(completed);
                                expect(a.field.value).toBe(42);
                                expect(a.form.values.amount).toBe(42);
                                expect(a.widget.valueAsNumber).toBe(42);
                                expect(a.input.value).toBe(locale && !focused ? '$42' : '42');
                                resolve(completed);
                            })
                        ).toBeTrue();
                    });
                    expect(result.status).toBe('complete');
                    expect(reset).toHaveBeenCalledOnceWith(
                        jasmine.objectContaining({ form: a.form, renderer: a.fixture.componentInstance }),
                        jasmine.objectContaining({ editableFields: jasmine.any(Set) })
                    );
                    expect(terminal).toHaveBeenCalledTimes(1);
                    expect(fields).toHaveBeenCalledTimes(1);
                    const event = fields.calls.mostRecent().args[0];
                    expect(event.form).toBe(a.form);
                    expect(event.field).toBe(a.field);
                    expect(event.writeContext).toBe(captured);
                    expect(rules).not.toHaveBeenCalled();
                    expect({
                        value: b.field.value,
                        display: b.input.value,
                        cache: b.widget.amountWidgetValue,
                        number: b.widget.valueAsNumber,
                        serialized: b.form.values.amount
                    }).toEqual(bBefore);
                    if (focused) {
                        a.input.dispatchEvent(new FocusEvent('blur'));
                        await settle(a.fixture);
                    }
                    expect(a.input.value).toBe(locale ? '$42' : '42');
                    expect(a.form.values.amount).toBe(42);
                    a.input.dispatchEvent(new FocusEvent('focus'));
                    a.input.value = '56';
                    a.input.dispatchEvent(new Event('input'));
                    await settle(a.fixture);
                    a.input.dispatchEvent(new FocusEvent('blur'));
                    await settle(a.fixture);
                    expect(a.field.value).toBe('56');
                    expect(a.form.values.amount).toBe(56);
                    expect(a.widget.valueAsNumber).toBe(56);
                    expect(a.widget.amountWidgetValue).toBe(locale ? '$56' : '56');
                    expect(a.input.value).toBe(locale ? '$56' : '56');
                    expect(b.field.value).toBe(bBefore.value);
                    expect(b.input.value).toBe(bBefore.display);
                    expect(b.form.values.amount).toBe(bBefore.serialized);
                });

                for (const value of [undefined, 0]) {
                    it(`should keep the ${value === undefined ? 'empty' : 'zero'} reset value when focused is ${focused}`, async () => {
                        const mounted = mount(value);
                        await settle(mounted.fixture);
                        mounted.form.changeFieldValue('amount', 100);
                        await settle(mounted.fixture);
                        if (focused) {
                            mounted.input.dispatchEvent(new FocusEvent('focus'));
                            mounted.input.value = '999';
                            mounted.input.dispatchEvent(new Event('input'));
                            await settle(mounted.fixture);
                        }
                        const fields = spyOn(service.formFieldValueChanged, 'next').and.callThrough();
                        const rules = spyOn(service.formRulesEvent, 'next').and.callThrough();
                        manager.rulesOnlyProvider = { enabled: true, execute: (request) => request.reset() };
                        const result = await new Promise<FormResetResult>((resolve) => {
                            mounted.fixture.componentInstance.dispatchRulesOnlyOutcome(mounted.outcome, resolve);
                        });
                        expect(result.status).toBe('complete');
                        expect(mounted.field.value).toBe(value ?? null);
                        if (value === undefined) {
                            expect(mounted.form.values.amount).toBeNaN();
                        } else {
                            expect(mounted.form.values.amount).toBe(0);
                        }
                        expect(JSON.parse(JSON.stringify(mounted.form.values)).amount).toBe(value ?? null);
                        expect(mounted.widget.valueAsNumber).toBe(value ?? null);
                        expect(mounted.widget.amountWidgetValue).toBe(value === undefined ? null : locale && !focused ? '$0' : '0');
                        await settle(mounted.fixture);
                        expect(mounted.input.value).toBe(value === undefined ? '' : locale && !focused ? '$0' : '0');
                        expect(fields).not.toHaveBeenCalled();
                        expect(rules).not.toHaveBeenCalled();
                        if (focused) {
                            mounted.input.dispatchEvent(new FocusEvent('blur'));
                            await settle(mounted.fixture);
                        }
                        expect(mounted.input.value).toBe(value === undefined ? '' : locale ? '$0' : '0');
                        expect(mounted.field.value).toBe(value ?? null);
                        if (value === undefined) {
                            expect(mounted.form.values.amount).toBeNaN();
                        } else {
                            expect(mounted.form.values.amount).toBe(0);
                        }
                        expect(JSON.parse(JSON.stringify(mounted.form.values)).amount).toBe(value ?? null);
                        expect(mounted.widget.valueAsNumber).toBe(value ?? null);
                    });
                }
            }
        });
    }
});

describe('AmountWidgetComponent when form instance reset is disabled', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent],
            providers: [
                { provide: FORM_RULES_MANAGER, useValue: { initialize: jasmine.createSpy('initialize'), destroy: jasmine.createSpy('destroy') } },
                { provide: TranslationService, useValue: { getLocale: () => 'en-US' } },
                provideFormInstanceReset(() => false)
            ]
        });
        service = TestBed.inject(FormService);
    });

    function mount() {
        const form = new FormModel(
            {
                id: 'definition',
                fields: [
                    {
                        id: 'container',
                        type: 'container',
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'amount', type: 'amount', currency: 'USD', value: 100 }] }
                    }
                ]
            },
            undefined,
            false,
            service
        );
        const fixture = TestBed.createComponent(FormRendererComponent);
        fixture.componentRef.setInput('formDefinition', form);
        fixture.detectChanges();
        const widget = fixture.debugElement.query(By.directive(AmountWidgetComponent)).componentInstance as AmountWidgetComponent;
        return { form, widget, field: form.getFieldById('amount') };
    }

    it('should keep handling input after the form state is bound to another owner', () => {
        const { form, widget, field } = mount();
        expect(service.formState.captureMount(field)).toBeUndefined();

        bindFormState(form, {}, {});
        widget.amountWidgetValue = '250';
        widget.onFieldChangedAmountWidget();

        expect(field.value).toBe('250');
    });

    it('should follow value changes published for another field instance with the same id', () => {
        const { widget } = mount();
        const sameId = new FormFieldModel(new FormModel(), { id: 'amount', type: 'amount', value: '300' });

        service.formFieldValueChanged.next(new FormFieldEvent(sameId.form, sameId));

        expect(widget.amountWidgetValue).toBe(sameId.value);
    });

    it('should leave valueAsNumber unchanged when the amount is edited', () => {
        const { widget, field } = mount();
        widget.valueAsNumber = 100;
        widget.amountWidgetValue = '250';

        widget.onFieldChangedAmountWidget();

        expect(field.value).toBe('250');
        expect(widget.valueAsNumber).toBe(100);
    });
});

describe('AmountWidgetComponent state projection', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AmountWidgetComponent],
            providers: [{ provide: TranslationService, useValue: { getLocale: () => 'en-US' } }]
        });
        service = TestBed.inject(FormService);
    });

    function mount(locale: boolean, value: number) {
        const form = new FormModel(
            { id: 'same-definition', fields: [{ id: 'amount', type: 'amount', value, currency: 'USD' }] },
            undefined,
            false,
            service
        );
        const fixture = TestBed.createComponent(AmountWidgetComponent);
        const field = form.getFieldById('amount');
        fixture.componentRef.setInput('field', field);
        fixture.componentInstance.enableDisplayBasedOnLocale = locale;
        const context: FormWriteContext = {
            form,
            renderer: {},
            generation: {},
            invocation: {},
            documentVersion: '1',
            outcomeId: 'clear',
            isCurrent: () => true
        };
        bindFormState(form, context.renderer, context.generation);
        fixture.detectChanges();
        return { form, fixture, field, context };
    }

    async function settle(...fixtures: ComponentFixture<AmountWidgetComponent>[]) {
        for (const fixture of fixtures) {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
        }
    }

    for (const locale of [false, true]) {
        for (const focused of [false, true]) {
            it(`should project a silent commit and a marked write only into the bound widget when locale display is ${locale} and focus is ${focused}`, async () => {
                const a = mount(locale, 100);
                const b = mount(locale, 700);
                await settle(a.fixture, b.fixture);
                const widget = a.fixture.componentInstance;
                const input: HTMLInputElement = a.fixture.nativeElement.querySelector('input');
                const bInput: HTMLInputElement = b.fixture.nativeElement.querySelector('input');
                const bBefore = {
                    display: bInput.value,
                    cache: b.fixture.componentInstance.amountWidgetValue,
                    number: b.fixture.componentInstance.valueAsNumber,
                    serialized: b.form.values.amount
                };
                if (focused) {
                    input.dispatchEvent(new FocusEvent('focus'));
                    input.value = '999';
                    input.dispatchEvent(new Event('input'));
                    await settle(a.fixture);
                }
                const events: FormFieldEvent[] = [];
                const subscription = service.formFieldValueChanged.subscribe((event) => events.push(event));
                const rules = spyOn(service.formRulesEvent, 'next').and.callThrough();
                expect(commitFormState(a.field, 10, a.context)).toBeTrue();
                await settle(a.fixture, b.fixture);
                expect(events.length).toBe(0);
                expect(rules).not.toHaveBeenCalled();
                expect(widget.valueAsNumber).toBe(10);
                expect(widget.amountWidgetValue).toBe(locale && !focused ? '$10' : '10');
                expect(input.value).toBe(locale && !focused ? '$10' : '10');
                expect(a.form.values.amount).toBe(10);
                a.form.changeFieldValue('amount', 42, a.context);
                await settle(a.fixture, b.fixture);
                expect(events.length).toBe(1);
                expect(events[0].form).toBe(a.form);
                expect(events[0].field).toBe(a.field);
                expect(events[0].writeContext).toBe(a.context);
                expect(currentFormWrite(a.field)).toBeUndefined();
                expect(a.field.value).toBe(42);
                expect(a.form.values.amount).toBe(42);
                expect(widget.valueAsNumber).toBe(42);
                expect(widget.amountWidgetValue).toBe(locale && !focused ? '$42' : '42');
                expect(input.value).toBe(locale && !focused ? '$42' : '42');
                expect(b.field.value).toBe(700);
                expect(bInput.value).toBe(bBefore.display);
                expect(b.fixture.componentInstance.amountWidgetValue).toBe(bBefore.cache);
                expect(b.fixture.componentInstance.valueAsNumber).toBe(bBefore.number);
                expect(b.form.values.amount).toBe(bBefore.serialized);
                if (focused) {
                    input.dispatchEvent(new FocusEvent('blur'));
                }
                await settle(a.fixture);
                expect(input.value).toBe(locale ? '$42' : '42');
                expect(a.form.values.amount).toBe(42);
                input.dispatchEvent(new FocusEvent('focus'));
                input.value = '56';
                input.dispatchEvent(new Event('input'));
                await settle(a.fixture);
                expect(a.form.values.amount).toBe(56);
                expect(input.value).toBe('56');
                input.dispatchEvent(new FocusEvent('blur'));
                await settle(a.fixture);
                expect(input.value).toBe(locale ? '$56' : '56');
                expect(widget.amountWidgetValue).toBe(locale ? '$56' : '56');
                expect(a.field.value).toBe('56');
                expect(a.form.values.amount).toBe(56);
                expect(a.field.isValid).toBeTrue();
                expect(widget.valueAsNumber).toBe(56);
                expect(bInput.value).toBe(bBefore.display);
                subscription.unsubscribe();
            });
        }
    }

    it('should reject commits and writes without notification when the generation is stale or the write is cancelled', async () => {
        const a = mount(true, 100);
        const publish = spyOn(service.formFieldValueChanged, 'next').and.callThrough();
        bindFormState(a.form, a.context.renderer, {});
        expect(commitFormState(a.field, 10, a.context)).toBeFalse();
        a.form.changeFieldValue('amount', 42, a.context);
        bindFormState(a.form, a.context.renderer, a.context.generation);
        const cancelled = { ...a.context, isCurrent: () => false };
        a.form.changeFieldValue('amount', 42, cancelled);
        expect(commitFormState(a.field, 10, cancelled)).toBeFalse();
        await settle(a.fixture);
        expect(a.field.value).toBe(100);
        expect(publish).not.toHaveBeenCalled();
    });

    it('should not project a marked write when an earlier observer invalidates it', async () => {
        let valid = true;
        const subscription = service.formFieldValueChanged.subscribe((event) => {
            if (event.writeContext) {
                valid = false;
            }
        });
        const a = mount(true, 100);
        const context = { ...a.context, isCurrent: () => valid };
        a.form.changeFieldValue('amount', 42, context);
        await settle(a.fixture);
        expect(a.form.values.amount).toBe(42);
        expect(a.fixture.componentInstance.amountWidgetValue).toBe('$100');
        expect(a.fixture.componentInstance.valueAsNumber).toBe(100);
        subscription.unsubscribe();
    });

    for (const locale of [false, true]) {
        it(`should project a zero commit into a focused input when locale display is ${locale}`, async () => {
            const a = mount(locale, 100);
            const widget = a.fixture.componentInstance;
            const input: HTMLInputElement = a.fixture.nativeElement.querySelector('input');
            input.dispatchEvent(new FocusEvent('focus'));
            expect(commitFormState(a.field, 0, a.context)).toBeTrue();
            await settle(a.fixture);
            expect(widget.valueAsNumber).toBe(0);
            expect(widget.amountWidgetValue).toBe('0');
            expect(input.value).toBe('0');
            expect(a.form.values.amount).toBe(0);
        });

        it(`should project an empty commit into a focused input without restoring the draft on blur when locale display is ${locale}`, async () => {
            const a = mount(locale, 100);
            const widget = a.fixture.componentInstance;
            const input: HTMLInputElement = a.fixture.nativeElement.querySelector('input');
            input.dispatchEvent(new FocusEvent('focus'));
            expect(commitFormState(a.field, null, a.context)).toBeTrue();
            await settle(a.fixture);
            expect(widget.valueAsNumber).toBeNull();
            expect(widget.amountWidgetValue).toBeNull();
            expect(input.value).toBe('');
            expect(a.form.values.amount).toBeNaN();
            input.dispatchEvent(new FocusEvent('blur'));
            await settle(a.fixture);
            expect(input.value).toBe('');
        });
    }

    it('should keep the focused draft for an ordinary write and stop projecting when destroyed', async () => {
        const a = mount(true, 100);
        await settle(a.fixture);
        const widget = a.fixture.componentInstance;
        a.fixture.nativeElement.querySelector('input').dispatchEvent(new FocusEvent('focus'));
        a.form.changeFieldValue('amount', 25);
        await settle(a.fixture);
        expect(widget.amountWidgetValue).toBe('100');
        expect(a.form.values.amount).toBe(25);
        a.fixture.destroy();
        commitFormState(a.field, 10, a.context);
        expect(widget.amountWidgetValue).toBe('100');
    });

    it('should keep the numeric value current when a genuine edit follows a marked write with locale display disabled', async () => {
        const a = mount(false, 100);
        a.form.changeFieldValue('amount', 42, a.context);
        await settle(a.fixture);
        const input: HTMLInputElement = a.fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new FocusEvent('focus'));
        input.value = '56';
        input.dispatchEvent(new Event('input'));
        await settle(a.fixture);
        expect(a.form.values.amount).toBe(56);
        expect(a.fixture.componentInstance.amountWidgetValue).toBe('56');
        expect(a.fixture.componentInstance.valueAsNumber).toBe(56);
    });

    for (const locale of [false, true]) {
        for (const focused of [false, true]) {
            it(`should ignore a stale widget mount when the form is rebound and locale display is ${locale} and focus is ${focused}`, async () => {
                const old = mount(locale, 100);
                const oldWidget = old.fixture.componentInstance;
                const oldInput: HTMLInputElement = old.fixture.nativeElement.querySelector('input');
                if (focused) {
                    oldInput.dispatchEvent(new FocusEvent('focus'));
                    oldInput.value = '999';
                    oldInput.dispatchEvent(new Event('input'));
                }
                await settle(old.fixture);
                const oldState = {
                    display: oldInput.value,
                    cache: oldWidget.amountWidgetValue,
                    number: oldWidget.valueAsNumber
                };
                const currentContext = { ...old.context, renderer: {}, generation: {}, invocation: {} };
                bindFormState(old.form, currentContext.renderer, currentContext.generation);
                const currentFixture = TestBed.createComponent(AmountWidgetComponent);
                const currentWidget = currentFixture.componentInstance;
                currentFixture.componentRef.setInput('field', old.field);
                currentWidget.enableDisplayBasedOnLocale = locale;
                currentFixture.detectChanges();
                const currentInput: HTMLInputElement = currentFixture.nativeElement.querySelector('input');
                if (focused) {
                    currentInput.dispatchEvent(new FocusEvent('focus'));
                }
                expect(commitFormState(old.field, 10, currentContext)).toBeTrue();
                old.form.changeFieldValue('amount', 42, currentContext);
                await settle(old.fixture, currentFixture);
                expect(oldInput.value).toBe(oldState.display);
                expect(oldWidget.amountWidgetValue).toBe(oldState.cache);
                expect(oldWidget.valueAsNumber).toBe(oldState.number);
                expect(currentInput.value).toBe(locale && !focused ? '$42' : '42');
                expect(currentWidget.amountWidgetValue).toBe(locale && !focused ? '$42' : '42');
                expect(currentWidget.valueAsNumber).toBe(42);
                expect(old.field.value).toBe(42);
                expect(old.form.values.amount).toBe(42);
                expect(commitFormState(old.field, 1000, old.context)).toBeFalse();
                old.form.changeFieldValue('amount', 1000, old.context);
                expect(old.form.values.amount).toBe(42);
                old.form.changeFieldValue('amount', 25);
                await settle(old.fixture, currentFixture);
                expect(oldInput.value).toBe(oldState.display);
                expect(oldWidget.amountWidgetValue).toBe(oldState.cache);
                expect(oldWidget.valueAsNumber).toBe(oldState.number);
                expect(old.form.values.amount).toBe(25);
                const publish = spyOn(service.formFieldValueChanged, 'next').and.callThrough();
                const rules = spyOn(service.formRulesEvent, 'next').and.callThrough();
                const touched = spyOn(oldWidget, 'markAsTouched').and.callThrough();
                oldInput.dispatchEvent(new FocusEvent('focus'));
                oldInput.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
                oldInput.value = '888';
                oldInput.dispatchEvent(new Event('input', { bubbles: true }));
                oldInput.dispatchEvent(new FocusEvent('blur'));
                oldInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
                await settle(old.fixture, currentFixture);
                expect(old.form.values.amount).toBe(25);
                expect(publish).not.toHaveBeenCalled();
                expect(rules).not.toHaveBeenCalled();
                expect(touched).not.toHaveBeenCalled();
                currentInput.dispatchEvent(new FocusEvent('focus'));
                currentInput.value = '56';
                currentInput.dispatchEvent(new Event('input', { bubbles: true }));
                currentInput.dispatchEvent(new FocusEvent('blur'));
                await settle(old.fixture, currentFixture);
                expect(old.form.values.amount).toBe(56);
                expect(currentWidget.valueAsNumber).toBe(56);
                expect(currentInput.value).toBe(locale ? '$56' : '56');
                expect(publish).toHaveBeenCalledTimes(1);
                expect(rules.calls.allArgs().filter(([event]) => event.type === 'fieldValueChanged').length).toBe(1);
            });
        }
    }

    it('should not project commits when the widget was initialized before the form was bound', async () => {
        const form = new FormModel({ fields: [{ id: 'amount', type: 'amount', value: 100, currency: 'USD' }] }, undefined, false, service);
        const fixture = TestBed.createComponent(AmountWidgetComponent);
        const field = form.getFieldById('amount');
        fixture.componentRef.setInput('field', field);
        fixture.componentInstance.enableDisplayBasedOnLocale = true;
        fixture.detectChanges();
        await settle(fixture);
        const context: FormWriteContext = {
            form,
            renderer: {},
            generation: {},
            invocation: {},
            documentVersion: '1',
            outcomeId: 'clear',
            isCurrent: () => true
        };
        bindFormState(form, context.renderer, context.generation);
        expect(commitFormState(field, 10, context)).toBeTrue();
        form.changeFieldValue('amount', 42, context);
        await settle(fixture);
        expect(form.values.amount).toBe(42);
        expect(fixture.componentInstance.amountWidgetValue).toBe('$100');
        expect(fixture.componentInstance.valueAsNumber).toBe(100);
        expect(fixture.nativeElement.querySelector('input').value).toBe('$100');
    });
});

@Component({
    selector: 'adf-test-on-push-amount',
    template: '@if (field(); as field) {<amount-widget [field]="field" />}',
    imports: [AmountWidgetComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
class OnPushAmountComponent {
    readonly field = signal<FormFieldModel | undefined>(undefined);
}

@Component({
    selector: 'adf-test-on-push-amount-host',
    template: '<adf-test-on-push-amount />',
    imports: [OnPushAmountComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
class OnPushAmountHostComponent {}

describe('AmountWidgetComponent state projection inside an OnPush host', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OnPushAmountHostComponent],
            providers: [{ provide: TranslationService, useValue: { getLocale: () => 'en-US' } }]
        });
    });

    it('should render a committed value when the OnPush host was not otherwise marked for check', async () => {
        const service = TestBed.inject(FormService);
        const form = new FormModel(
            { id: 'on-push', fields: [{ id: 'amount', type: 'amount', value: 100, currency: 'USD' }] },
            undefined,
            false,
            service
        );
        const field = form.getFieldById('amount');
        const fixture = TestBed.createComponent(OnPushAmountHostComponent);
        fixture.detectChanges();
        fixture.debugElement.query(By.directive(OnPushAmountComponent)).componentInstance.field.set(field);
        const context: FormWriteContext = {
            form,
            renderer: {},
            generation: {},
            invocation: {},
            documentVersion: '1',
            outcomeId: 'clear',
            isCurrent: () => true
        };
        bindFormState(form, context.renderer, context.generation);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.value).toBe('100');

        expect(commitFormState(field, 25, context)).toBeTrue();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(input.value).toBe('25');
    });
});
