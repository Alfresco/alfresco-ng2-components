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
import { FormFieldModel } from '../core/form-field.model';
import { AmountWidgetComponent, ADF_AMOUNT_SETTINGS } from './amount.widget';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { FormBaseModule } from '../../../form-base.module';
import { FormFieldTypes } from '../core/form-field-types';
import { CoreTestingModule } from '../../../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormModel } from '../core/form.model';
import { By } from '@angular/platform-browser';

describe('AmountWidgetComponent', () => {

    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            FormBaseModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
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

    describe('when tooltip is set', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.AMOUNT,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const amountInput = fixture.nativeElement.querySelector('input');
            amountInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
          });

        it('should hide tooltip', async () => {
            const amountInput = fixture.nativeElement.querySelector('input');
            amountInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            amountInput.dispatchEvent(new Event('mouseleave'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
            expect(tooltipElement).toBeFalsy();
        });
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.AMOUNT,
                required: true
            });
        });

        it('should be marked as invalid after interaction', async () => {
            const amount = fixture.nativeElement.querySelector('input');
            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            amount.dispatchEvent(new Event('blur'));

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
});

describe('AmountWidgetComponent - rendering', () => {

    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            FormBaseModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('[C289915] - Should be able to display different currency icons', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            id: 'TestAmount1',
            name: 'Test Amount',
            type: 'amount',
            currency: '$'
        });
        fixture.detectChanges();

        let widgetPrefix = fixture.nativeElement.querySelector('div.mat-form-field-prefix');
        expect(widgetPrefix.textContent.trim()).toBe('$');

        widget.field.currency = '£';
        widget.ngOnInit();
        fixture.detectChanges();

        widgetPrefix = fixture.nativeElement.querySelector('div.mat-form-field-prefix');
        expect(widgetPrefix.textContent.trim()).toBe('£');

        widget.field.currency = '€';
        widget.ngOnInit();
        fixture.detectChanges();

        widgetPrefix = fixture.nativeElement.querySelector('div.mat-form-field-prefix');
        expect(widgetPrefix.textContent.trim()).toBe('€');
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

        const widgetPlaceholder = fixture.nativeElement.querySelector('label.mat-form-field-label');
        expect(widgetPlaceholder.textContent).toBe('Check Placeholder Text');
        const widgetLabel = fixture.nativeElement.querySelector('label.adf-label');
        expect(widgetLabel.textContent).toBe('Test Amount*');
        const widgetPrefix = fixture.nativeElement.querySelector('div.mat-form-field-prefix');
        expect(widgetPrefix.textContent.trim()).toBe('$');
        expect(widget.field.isValid).toBe(false);
        const widgetById: HTMLInputElement = fixture.nativeElement.querySelector('#TestAmount1');
        expect(widgetById).toBeDefined();
        expect(widgetById).not.toBeNull();

        widgetById.value = '90';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(true, 'amount widget with a valid field');

        widgetById.value = 'gdfgdf';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(false, 'amount widget with an invalid field');
        const errorWidget = fixture.nativeElement.querySelector('error-widget .adf-error-text');
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

        const widgetLabel = fixture.nativeElement.querySelector('label.adf-label');
        expect(widgetLabel.textContent).toBe('Test Amount*');
        const widgetPrefix = fixture.nativeElement.querySelector('div.mat-form-field-prefix');
        expect(widgetPrefix.textContent.trim()).toBe('£');
        expect(widget.field.isValid).toBe(false);
        const widgetById: HTMLInputElement = fixture.nativeElement.querySelector('#TestAmount1');
        expect(widgetById).toBeDefined();
        expect(widgetById).not.toBeNull();

        widgetById.value = '8';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(false, 'amount widget field is valid');
        let errorMessage: HTMLElement = fixture.nativeElement.querySelector('.adf-error-text');
        expect(errorMessage.textContent.trim()).toContain('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');

        widgetById.value = '99';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(false, 'amount widget field is valid');
        errorMessage = fixture.nativeElement.querySelector('.adf-error-text');
        expect(errorMessage.textContent.trim()).toContain('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN');

        widgetById.value = '80';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(true, 'amount widget field is invalid');

        widgetById.value = '80.67';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(true, 'amount widget field is invalid');

        widgetById.value = 'incorrect format';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(false, 'amount widget field is valid');
        errorMessage = fixture.nativeElement.querySelector('.adf-error-text');
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

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).not.toBeNull();
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

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
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

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });
    });
});

describe('AmountWidgetComponent settings', () => {
    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            FormBaseModule
        ],
        providers: [
            {
                provide: ADF_AMOUNT_SETTINGS,
                useValue: {
                    showReadonlyPlaceholder: true
                }
            }
        ]
    });

    beforeEach(() => {
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
