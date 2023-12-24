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
import { FormModel } from '../core/form.model';
import { DateTimeWidgetComponent } from './date-time.widget';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldTypes } from '../core/form-field-types';
import { DateFieldValidator, DateTimeFieldValidator } from '../core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { addMinutes } from 'date-fns';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DateTimeWidgetComponent', () => {
    let loader: HarnessLoader;
    let widget: DateTimeWidgetComponent;
    let fixture: ComponentFixture<DateTimeWidgetComponent>;
    let element: HTMLElement;
    let form: FormModel;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(),
                      HttpClientModule,
                      NoopAnimationsModule,
                      MatDialogModule,
                      MatMenuModule,
                      MatFormFieldModule,
                      MatNativeDatetimeModule,
                      MatDatepickerModule,
                      MatButtonModule,
                      MatDatetimepickerModule,
                      MatTooltipModule]
        });
        fixture = TestBed.createComponent(DateTimeWidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;

        form = new FormModel();
        form.fieldValidators = [new DateFieldValidator(), new DateTimeFieldValidator()];
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should setup min value for date picker', async () => {
        const minValue = '1982-03-13T10:00:00Z';
        widget.field = new FormFieldModel(form, {
            id: 'date-id',
            name: 'date-name',
            type: 'datetime',
            minValue
        });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(widget.minDate.toISOString()).toBe(`1982-03-13T10:00:00.000Z`);
    });

    it('should date field be present', () => {
        widget.field = new FormFieldModel(form, {
            id: 'date-id',
            name: 'date-name',
            type: 'datetime'
        });
        fixture.detectChanges();

        expect(element.querySelector('#data-time-widget')).toBeDefined();
        expect(element.querySelector('#data-time-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', async () => {
        const maxValue = '1982-03-13T10:00:00Z';
        widget.field = new FormFieldModel(null, {
            maxValue
        });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(widget.maxDate.toISOString()).toBe('1982-03-13T10:00:00.000Z');
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;
        widget.onDateChanged({ value: new Date('1982-03-13T10:00:00.000Z') } as any);

        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    it('should validate the initial datetime value', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;

        fixture.whenStable();
        await fixture.whenStable();

        expect(field.isValid).toBeTrue();
    });

    it('should validate the updated datetime value', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;

        fixture.whenStable();
        await fixture.whenStable();

        let expectedDate = new Date('9999-09-12T09:10:00.000Z');
        expectedDate = addMinutes(expectedDate, expectedDate.getTimezoneOffset());
        widget.onDateChanged({ value: expectedDate} as any);

        expect(field.value).toBe('9999-09-12T09:10:00.000Z');
        expect(field.isValid).toBeTrue();
    });

    it('should forwad the incorrect datetime input for further validation', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        widget.onDateChanged({
            value: null,
            targetElement: {
                value: '123abc'
            }
        } as any);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(field.value).toBe('123abc');
        expect(field.isValid).toBeFalse();
        expect(field.validationSummary.message).toBe('D-M-YYYY hh:mm A');
    });
    // eslint-disable-next-line
    xit('should process direct keyboard input', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;

        fixture.whenStable();
        await fixture.whenStable();

        widget.onValueChanged({ target: { value: '9999-09-12T09:10:00.000Z' } } as any);

        expect(field.value).toBe('9999-09-12T09:10:00.000Z');
        expect(field.isValid).toBeTrue();
    });

    it('should fail validating incorrect keyboard input', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        widget.onValueChanged({
            target: {
                value: '123abc'
            }
        } as any);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(field.value).toBe('123abc');
        expect(field.isValid).toBeFalse();
        expect(field.validationSummary.message).toBe('D-M-YYYY hh:mm A');
    });

    it('should allow empty dates when not required', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-09-12T09:00:00.000Z',
            type: 'datetime'
        });

        widget.field = field;

        fixture.whenStable();
        await fixture.whenStable();

        widget.onDateChanged({ value: null, targetElement: { value: '' } } as any);

        expect(field.value).toBe('');
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
            const input = await loader.getHarness(MatInputHarness);
            await (await input.host()).hover();

            const tooltip = await loader.getHarness(MatTooltipHarness);
            expect(await tooltip.getTooltipText()).toBe('my custom tooltip');
        });

        it('should hide tooltip', async () => {
            const input = await loader.getHarness(MatInputHarness);
            await (await input.host()).hover();
            await (await input.host()).mouseAway();

            const tooltip = await loader.getHarness(MatTooltipHarness);
            expect(await tooltip.isOpen()).toBe(false);
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
            const dateTimeInput = fixture.nativeElement.querySelector('input');
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

            dateTimeInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', () => {
            fixture.detectChanges();

            const asterisk = element.querySelector<HTMLElement>('.adf-asterisk');

            expect(asterisk).not.toBeNull();
            expect(asterisk?.textContent).toEqual('*');
        });
    });

    describe('template check', () => {
        it('should show visible date widget', async () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-11-30T10:30:00.000Z',
                type: 'datetime'
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const input = await loader.getHarness(MatInputHarness);
            expect(await input.getValue()).toBe('30-11-9999 10:30 AM');
        });

        it('should show the correct format type', async () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-12-30T10:30:00.000Z',
                dateDisplayFormat: 'MM-DD-YYYY HH:mm A',
                type: 'datetime'
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const input = await loader.getHarness(MatInputHarness);
            expect(await input.getValue()).toBe('12-30-9999 10:30 AM');
        });

        it('should disable date button when is readonly', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-12-30T10:30:00.000Z',
                dateDisplayFormat: 'MM-DD-YYYY HH:mm A',
                type: 'datetime'
            });
            fixture.detectChanges();

            let dateButton = element.querySelector<HTMLButtonElement>('button');
            expect(dateButton).not.toBeNull();
            expect(dateButton?.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = element.querySelector<HTMLButtonElement>('button');
            expect(dateButton).not.toBeNull();
            expect(dateButton?.disabled).toBeTruthy();
        });
    });

    it('should display always the json value', async () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'datetime-field-name',
            value: '9999-12-30T10:30:00.000Z',
            type: 'datetime',
            dateDisplayFormat: 'MM-DD-YYYY HH:mm A'
        });
        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        const input = await loader.getHarness(MatInputHarness);
        expect(await input.getValue()).toBe('12-30-9999 10:30 AM');

        widget.field.value = '2020-03-02T00:00:00.000Z';

        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(await input.getValue()).toBe('03-02-2020 00:00 AM');
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

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const leftDatePicker = element.querySelector('.adf-left-label-input-datepicker');
            expect(leftDatePicker).not.toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
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

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const leftDatePicker = element.querySelector('.adf-left-label-input-datepicker');
            expect(leftDatePicker).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
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

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const leftDatePicker = element.querySelector('.adf-left-label-input-datepicker');
            expect(leftDatePicker).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });
    });
});
