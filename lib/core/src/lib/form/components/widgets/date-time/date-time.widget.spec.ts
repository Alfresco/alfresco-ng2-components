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
import { FormModel } from '../core/form.model';
import { DateTimeWidgetComponent } from './date-time.widget';
import { FormFieldTypes } from '../core/form-field-types';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { addMinutes } from 'date-fns';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NoopTranslateModule } from '../../../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../../../testing/unit-testing-utils';

describe('DateTimeWidgetComponent', () => {
    let loader: HarnessLoader;
    let widget: DateTimeWidgetComponent;
    let fixture: ComponentFixture<DateTimeWidgetComponent>;
    let form: FormModel;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopTranslateModule,
                NoopAnimationsModule,
                MatDialogModule,
                MatNativeDatetimeModule,
                MatDatepickerModule,
                MatDatetimepickerModule,
                DateTimeWidgetComponent
            ]
        });
        fixture = TestBed.createComponent(DateTimeWidgetComponent);
        widget = fixture.componentInstance;
        form = new FormModel();
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should not call onFieldChanged on init', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();
        expect(widget.onFieldChanged).not.toHaveBeenCalled();
    });

    it('should call onFieldChanged when datetime changes', () => {
        const spy = spyOn(widget, 'onFieldChanged').and.callThrough();
        const field = new FormFieldModel(form, {
            id: 'date-id',
            name: 'date-name',
            type: FormFieldTypes.DATETIME
        });
        const newDate = new Date('1982-03-13T10:00:00.000Z');

        widget.field = field;
        fixture.detectChanges();
        widget.datetimeInputControl.setValue(newDate);

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0].value).toBe(newDate);
    });

    it('should setup min value for date picker', () => {
        const minValue = '1982-03-13T10:00:00Z';
        widget.field = new FormFieldModel(form, {
            id: 'date-id',
            name: 'date-name',
            type: FormFieldTypes.DATETIME,
            minValue
        });

        fixture.detectChanges();

        expect(widget.minDate.toISOString()).toBe(`1982-03-13T10:00:00.000Z`);
    });

    it('should date field be present', () => {
        widget.field = new FormFieldModel(form, {
            id: 'date-id',
            name: 'date-name',
            type: FormFieldTypes.DATETIME
        });
        fixture.detectChanges();

        expect(testingUtils.getByCSS('#data-time-widget')).toBeDefined();
        expect(testingUtils.getByCSS('#data-time-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        const maxValue = '1982-03-13T10:00:00Z';
        widget.field = new FormFieldModel(null, {
            maxValue
        });
        fixture.detectChanges();

        expect(widget.maxDate.toISOString()).toBe('1982-03-13T10:00:00.000Z');
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.detectChanges();

        widget.datetimeInputControl.setValue(new Date('1982-03-13T10:00:00.000Z'));

        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    it('should validate the initial datetime value', () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.detectChanges();

        expect(field.isValid).toBeTrue();
    });

    it('should validate the updated datetime value', () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.detectChanges();

        let expectedDate = new Date('9999-09-12T09:10:00.000Z');
        expectedDate = addMinutes(expectedDate, expectedDate.getTimezoneOffset());
        widget.datetimeInputControl.setValue(expectedDate);

        expect(field.value).toEqual(new Date('9999-09-12T09:10:00.000Z'));
        expect(field.isValid).toBeTrue();
    });

    it('should forwad the incorrect datetime input for further validation', () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.detectChanges();

        widget.datetimeInputControl.setValue(new Date('123abc'));

        fixture.detectChanges();

        expect(widget.datetimeInputControl.invalid).toBeTrue();
        expect(field.isValid).toBeFalse();
        expect(field.validationSummary.message).toBe('D-M-YYYY hh:mm A');
    });
    // eslint-disable-next-line
    xit('should process direct keyboard input', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.whenStable();
        await fixture.whenStable();

        await testingUtils.fillMatInput('9999-09-12T09:10:00.000Z');

        expect(field.value).toEqual(new Date('9999-09-12T09:10:00.000Z'));
        expect(field.isValid).toBeTrue();
    });

    it('should fail validating incorrect keyboard input', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.detectChanges();

        await testingUtils.fillMatInput('123abc');

        expect(widget.datetimeInputControl.invalid).toBeTrue();
        expect(field.value).toBe(null);
        expect(field.isValid).toBeFalse();
        expect(field.validationSummary.message).toBe('D-M-YYYY hh:mm A');
    });

    it('should allow empty dates when not required', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: FormFieldTypes.DATETIME
        });

        widget.field = field;

        fixture.whenStable();
        await fixture.whenStable();

        await testingUtils.fillMatInput(null);

        expect(widget.datetimeInputControl.value).toBe(null);
        expect(widget.datetimeInputControl.valid).toBeTrue();
        expect(field.value).toBe(null);
        expect(field.isValid).toBeTrue();
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DATETIME,
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
                type: FormFieldTypes.DATETIME,
                required: true
            });
        });

        it('should be marked as invalid after interaction', () => {
            fixture.detectChanges();
            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();

            testingUtils.blurByCSS('input');
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-invalid')).toBeTruthy();
        });

        it('should be valid when field is hidden with empty value', () => {
            widget.field.isVisible = false;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeTrue();
            expect(widget.datetimeInputControl.valid).toBeTrue();
            expect(widget.field.validationSummary.message).toBe('');
        });

        it('should be invalid when field is hidden with empty value', () => {
            widget.field.isVisible = true;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeFalse();
            expect(widget.datetimeInputControl.valid).toBeFalse();
            expect(widget.field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
        });

        it('should be able to display label with asterisk and input field is required', async () => {
            const formField = await testingUtils.getMatFormField();
            const formControl = await formField.getControl();

            expect(formControl.isRequired).toBeTruthy();

            const inputField = testingUtils.getByCSS('.adf-input').nativeElement;
            expect(inputField.hasAttribute('required')).toBeTruthy();
        });
    });

    describe('template check', () => {
        it('should show visible date widget', async () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-11-30T10:30:00.000Z',
                type: FormFieldTypes.DATETIME
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(await testingUtils.getMatInputValue()).toBe('30-11-9999 10:30 AM');
        });

        it('should show the correct format type', async () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-12-30T10:30:00.000Z',
                dateDisplayFormat: 'MM-DD-YYYY HH:mm A',
                type: FormFieldTypes.DATETIME
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(await testingUtils.getMatInputValue()).toBe('12-30-9999 10:30 AM');
        });

        it('should disable date button when is readonly', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-12-30T10:30:00.000Z',
                dateDisplayFormat: 'MM-DD-YYYY HH:mm A',
                type: FormFieldTypes.DATETIME
            });
            fixture.detectChanges();

            let dateButton = testingUtils.getByCSS('button').nativeElement;

            expect(dateButton).not.toBeNull();
            expect(dateButton?.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = testingUtils.getByCSS('button').nativeElement;

            expect(dateButton).not.toBeNull();
            expect(dateButton?.disabled).toBeTruthy();
        });
    });

    it('should display always the json value', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'datetime-field-name',
            value: '9999-12-30T10:30:00.000Z',
            type: FormFieldTypes.DATETIME,
            dateDisplayFormat: 'MM-DD-YYYY HH:mm A'
        });
        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        const input = await testingUtils.getMatInput();
        expect(await input.getValue()).toBe('12-30-9999 10:30 AM');

        widget.field.value = '2020-03-02T00:00:00.000Z';

        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(await input.getValue()).toBe('03-02-2020 00:00 AM');
    });

    it('should display value with specified format when format of provided datetime is different', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'datetime-field-name',
            value: '9999-12-30T10:30:00.000Z',
            type: FormFieldTypes.DATETIME,
            dateDisplayFormat: 'MM/DD/YYYY HH;mm A'
        });
        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        const input = await testingUtils.getMatInput();
        expect(await input.getValue()).toBe('12/30/9999 10;30 AM');

        widget.field.value = '2020-03-02T00:00:00.000Z';

        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(await input.getValue()).toBe('03/02/2020 00;00 AM');
    });

    describe('when form model has left labels', () => {
        it('should have left labels classes on leftLabels true', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'datetime-id',
                name: 'datetime-name',
                value: '',
                type: FormFieldTypes.DATETIME,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();

            const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const leftDatePicker = testingUtils.getByCSS('.adf-left-label-input-datepicker');
            expect(leftDatePicker).not.toBeNull();

            const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
            expect(adfLeftLabel).not.toBeNull();
        });

        it('should not have left labels classes on leftLabels false', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                id: 'datetime-id',
                name: 'datetime-name',
                value: '',
                type: FormFieldTypes.DATETIME,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();

            const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const leftDatePicker = testingUtils.getByCSS('.adf-left-label-input-datepicker');
            expect(leftDatePicker).toBeNull();

            const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should not have left labels classes on leftLabels not present', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'datetime-id',
                name: 'datetime-name',
                value: '',
                type: FormFieldTypes.DATETIME,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();

            const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const leftDatePicker = testingUtils.getByCSS('.adf-left-label-input-datepicker');
            expect(leftDatePicker).toBeNull();

            const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should open date-time picker when enter key is pressed', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task' }), {
                id: 'datetime-id',
                name: 'datetime-name',
                value: '',
                type: FormFieldTypes.DATETIME,
                readOnly: false,
                required: true
            });

            await testingUtils.focusMatInput();
            await testingUtils.sendKeysToMatInput([TestKey.ENTER]);

            expect(testingUtils.getByDataAutomationId('adf-date-time-widget-picker')).toBeTruthy();
        });

        it('should be able to display label with asterisk when leftlable is true', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'datetime-id',
                name: 'datetime-name',
                value: '',
                type: FormFieldTypes.DATETIME,
                readOnly: false,
                required: true
            });
            fixture.detectChanges();
            const asterisk = testingUtils.getByCSS('.adf-asterisk').nativeElement;

            expect(asterisk).not.toBeNull();
            expect(asterisk?.textContent).toEqual('*');
        });
    });
});
