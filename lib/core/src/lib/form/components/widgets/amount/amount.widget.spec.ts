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
import { FormFieldModel } from '../core/form-field.model';
import { AmountWidgetComponent, ADF_AMOUNT_SETTINGS } from './amount.widget';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { UnitTestingUtils } from '../../../../testing/unit-testing-utils';
import { of } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { FormFieldEvent } from '../../../events/form-field.event';
import { TranslationService } from '../../../../translation/translation.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

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

    it('should setup placeholder when enableDisplayBasedOnLocale is true', () => {
        widget.enableDisplayBasedOnLocale = true;
        widget.field = new FormFieldModel(null, {
            readOnly: false,
            placeholder: '1234',
            currency: 'USD'
        });

        widget.ngOnInit();
        expect(widget.placeholder).toBe('$1,234');
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
            const host = await testingUtils.getMatInputHost();
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
            const host = await testingUtils.getMatInputHost();

            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();
            await host.blur();
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

        const field = await testingUtils.getMatFormField();
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

        const field = await testingUtils.getMatFormField();
        const inputField = await testingUtils.getMatInputByPlaceholder('Check Placeholder Text');
        expect(inputField).toBeTruthy();
        expect(await field.getPrefixText()).toBe('$');

        const widgetLabel = testingUtils.getByCSS('.adf-label').nativeElement;
        expect(widgetLabel.textContent.trim()).toBe('Test Amount');
        expect(widget.field.isValid).toBe(false);

        const input = await testingUtils.getMatInput();
        await input.setValue('90');
        expect(widget.field.isValid).toBe(true);

        await input.setValue('gdfgdf');
        expect(widget.field.isValid).toBe(false);

        const errorWidget = testingUtils.getByCSS('error-widget .adf-error-text').nativeElement;
        expect(errorWidget.textContent).toBe('FORM.FIELD.VALIDATOR.INVALID_NUMBER');
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

        const widgetLabel = testingUtils.getByCSS('.adf-label').nativeElement;
        expect(widgetLabel.textContent.trim()).toBe('Test Amount');

        const field = await testingUtils.getMatFormField();
        expect(await field.getPrefixText()).toBe('£');

        expect(widget.field.isValid).toBe(false);

        const input = await testingUtils.getMatInput();
        await input.setValue('8');
        expect(widget.field.isValid).toBe(false);

        let errorMessage = testingUtils.getByCSS('.adf-error-text').nativeElement;
        expect(errorMessage.textContent.trim()).toContain('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');

        await input.setValue('99');
        expect(widget.field.isValid).toBe(false);
        errorMessage = testingUtils.getByCSS('.adf-error-text').nativeElement;
        expect(errorMessage.textContent.trim()).toContain('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN');

        await input.setValue('80');
        expect(widget.field.isValid).toBe(true);

        await input.setValue('80.67');
        expect(widget.field.isValid).toBe(true);

        await input.setValue('incorrect format');
        expect(widget.field.isValid).toBe(false);
        errorMessage = testingUtils.getByCSS('.adf-error-text').nativeElement;
        expect(errorMessage.textContent.trim()).toContain('FORM.FIELD.VALIDATOR.INVALID_NUMBER');
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
                const field = await testingUtils.getMatFormField();
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
            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, { ...mockField, value: '200' } as FormFieldModel));
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

            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, { ...mockField, value: '200' } as FormFieldModel));

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
            formService.formFieldValueChanged.next(new FormFieldEvent(mockField.form, { ...mockField, value: '200' } as FormFieldModel));

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
                const field = await testingUtils.getMatFormField();
                expect(await field.getPrefixText()).toBe('');
            });

            it('should call method on focus and change input value', async () => {
                const focusSpy = spyOn(widget, 'amountWidgetOnFocus').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.getMatInput();
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

                const field = await testingUtils.getMatInput();
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

                const field = await testingUtils.getMatInput();
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

                const field = await testingUtils.getMatInput();
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
                const field = await testingUtils.getMatFormField();
                expect(await field.getPrefixText()).toBe('USD');
            });

            it('should call method on focus and not change input value', async () => {
                const focusSpy = spyOn(widget, 'amountWidgetOnFocus').and.callThrough();
                fixture.detectChanges();

                const field = await testingUtils.getMatInput();
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

                const field = await testingUtils.getMatInput();
                const fieldValueBeforeBlur = await field.getValue();
                await field.setValue(newValue);
                await field.blur();
                const fieldValue = await field.getValue();

                expect(field).toBeDefined();
                expect(widget.field.value).toBe(newValue);
                expect(widget.valueAsNumber).toBeUndefined();
                expect(fieldValueBeforeBlur).toBe('1234.55');
                expect(blurSpy).toHaveBeenCalled();
                expect(widget.valueAsNumber).toBeUndefined();
                expect(widget.amountWidgetValue).toBe('456789');
                expect(fieldValue).toBe('456789');
            });
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
