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
import { DateCloudWidgetComponent } from './date-cloud.widget';
import { setupTestBed, FormFieldModel, FormModel, FormFieldTypes } from '@alfresco/adf-core';
import moment from 'moment';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DATE_FORMAT_CLOUD } from '../../../../models/date-format-cloud.model';
import { By } from '@angular/platform-browser';

describe('DateWidgetComponent', () => {

    let widget: DateCloudWidgetComponent;
    let fixture: ComponentFixture<DateCloudWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DateCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should setup min value for date picker', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue
        });

        widget.ngOnInit();

        const expected = moment(minValue, DATE_FORMAT_CLOUD);
        expect(widget.minDate.isSame(expected)).toBeTruthy();
    });

    it('should date field be present', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            minValue
        });

        fixture.detectChanges();

        expect(element.querySelector('#data-widget')).toBeDefined();
        expect(element.querySelector('#data-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        const maxValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            maxValue
        });
        widget.ngOnInit();

        const expected = moment(maxValue, DATE_FORMAT_CLOUD);
        expect(widget.maxDate.isSame(expected)).toBeTruthy();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        const field = new FormFieldModel(new FormModel(), {
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-9-9',
            type: 'date',
            readOnly: 'false'
        });

        widget.field = field;
        const todayDate = moment().format(DATE_FORMAT_CLOUD);
        widget.onDateChanged({ value: todayDate });

        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    describe('template check', () => {

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible date widget', async () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-9-9',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(element.querySelector('#date-field-id')).toBeDefined();
            expect(element.querySelector('#date-field-id')).not.toBeNull();
            const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement.value).toContain('9-9-9999');
        });

        it('should show the correct format type', async () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-30-12',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.dateDisplayFormat = 'YYYY-DD-MM';
            widget.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(element.querySelector('#date-field-id')).toBeDefined();
            expect(element.querySelector('#date-field-id')).not.toBeNull();
            const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement.value).toContain('9999-30-12');
        });

        it('should disable date button when is readonly', async () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-9-9',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;
            fixture.detectChanges();
            await fixture.whenStable();

            let dateButton = element.querySelector<HTMLButtonElement>('button');
            expect(dateButton.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();
            await fixture.whenStable();

            dateButton = element.querySelector<HTMLButtonElement> ('button');
            expect(dateButton.disabled).toBeTruthy();
        });

        it('should set isValid to false when the value is not a correct date value', async () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: 'aa',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.field.isValid).toBeFalsy();
        });
    });

    it('should display always the json value', async () => {
        const field = new FormFieldModel(new FormModel(), {
            id: 'date-field-id',
            name: 'date-name',
            value: '12-30-9999',
            type: 'date',
            readOnly: 'false'
        });
        field.isVisible = true;
        field.dateDisplayFormat = 'MM-DD-YYYY';
        widget.field = field;
        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#date-field-id')).toBeDefined();
        expect(element.querySelector('#date-field-id')).not.toBeNull();
        const dateElement: any = element.querySelector('#date-field-id');
        expect(dateElement.value).toContain('12-30-9999');

        widget.field.value = '03-02-2020';

        fixture.detectChanges();
        await fixture.whenStable();

        expect(dateElement.value).toContain('03-02-2020');
    });

    describe('when form model has left labels', () => {

        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'date-id',
                name: 'date-name',
                value: '',
                type: FormFieldTypes.DATE,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const leftDatePicker = element.querySelector('.adf-left-label-input-datepicker');
            expect(leftDatePicker).not.toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).not.toBeNull();
        });

        it('should not have left labels classes on leftLabels false', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                id: 'date-id',
                name: 'date-name',
                value: '',
                type: FormFieldTypes.DATE,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const leftDatePicker = element.querySelector('.adf-left-label-input-datepicker');
            expect(leftDatePicker).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should not have left labels classes on leftLabels not present', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'date-id',
                name: 'date-name',
                value: '',
                type: FormFieldTypes.DATE,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const leftDatePicker = element.querySelector('.adf-left-label-input-datepicker');
            expect(leftDatePicker).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });
    });

    describe('Set dynamic dates', () => {
        it('should min date equal to the today date minus minimum date range value', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                minDateRangeValue: 4
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const todayDate = moment().format(DATE_FORMAT_CLOUD);
            const expected = moment(todayDate).subtract(widget.field.minDateRangeValue, 'days');
            expect(widget.minDate).toEqual(expected);
        });

        it('should min date and max date be undefined if dynamic min and max date are not set', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.minDate).toBeUndefined();
            expect(widget.maxDate).toBeUndefined();
        });

        it('should max date be undefined if only minimum date range value is set', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                minDateRangeValue: 4
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.maxDate).toBeUndefined();
        });

        it('should min date be undefined if only maximum date range value is set', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                maxDateRangeValue: 4
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.minDate).toBeUndefined();
        });

        it('should max date equal to the today date plus maximum date range value', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                maxDateRangeValue: 5
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const todayDate = moment().format(DATE_FORMAT_CLOUD);
            const expected = moment(todayDate).add(widget.field.maxDateRangeValue, 'days');
            expect(widget.maxDate).toEqual(expected);
        });

        it('should maxDate and minDate be undefined if minDateRangeValue and maxDateRangeValue are null', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                maxDateRangeValue: null,
                minDateRangeValue: null
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.maxDate).toBeUndefined();
            expect(widget.minDate).toBeUndefined();
        });

        it('should minDate be undefined if minDateRangeValue is null and maxDateRangeValue is greater than 0', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                maxDateRangeValue: 15,
                minDateRangeValue: null
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.maxDate).not.toBeUndefined();
            expect(widget.minDate).toBeUndefined();
        });

        it('should maxDate be undefined if maxDateRangeValue is null and minDateRangeValue is greater than 0', async () => {
            widget.field = new FormFieldModel(null, {
                dynamicDateRangeSelection: true,
                maxDateRangeValue: null,
                minDateRangeValue: 10
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.minDate).not.toBeUndefined();
            expect(widget.maxDate).toBeUndefined();
        });

        describe('check date validation by dynamic date ranges', () => {
            it('should minValue be equal to today date minus minDateRangeValue', async () => {
                spyOn(widget, 'getTodaysFormattedDate').and.returnValue('2022-07-22');
                widget.field = new FormFieldModel(null, {
                    dynamicDateRangeSelection: true,
                    maxDateRangeValue: null,
                    minDateRangeValue: 1,
                    maxValue: null,
                    minValue: null
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const expectedMinValueString = '2022-07-21';

                expect(widget.field.minValue).toEqual(expectedMinValueString);
                expect(widget.maxDate).toBeUndefined();
                expect(widget.field.maxValue).toBeNull();
            });

            it('should maxValue be equal to today date plus maxDateRangeValue', async () => {
                spyOn(widget, 'getTodaysFormattedDate').and.returnValue('2022-07-22');
                widget.field = new FormFieldModel(null, {
                    dynamicDateRangeSelection: true,
                    maxDateRangeValue: 8,
                    minDateRangeValue: null,
                    maxValue: null,
                    minValue: null
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const expectedMaxValueString = '2022-07-30';

                expect(widget.field.maxValue).toEqual(expectedMaxValueString);
                expect(widget.minDate).toBeUndefined();
                expect(widget.field.minValue).toBeNull();
            });

            it('should maxValue and minValue be null if maxDateRangeValue and minDateRangeValue are null', async () => {
                spyOn(widget, 'getTodaysFormattedDate').and.returnValue('2022-07-22');
                widget.field = new FormFieldModel(null, {
                    dynamicDateRangeSelection: true,
                    maxDateRangeValue: null,
                    minDateRangeValue: null,
                    maxValue: null,
                    minValue: null
                });

                fixture.detectChanges();
                await fixture.whenStable();

                expect(widget.minDate).toBeUndefined();
                expect(widget.maxDate).toBeUndefined();
                expect(widget.field.minValue).toBeNull();
                expect(widget.field.maxValue).toBeNull();
            });

            it('should maxValue and minValue not be null if maxDateRangeVale and minDateRangeValue are not null', async () => {
                spyOn(widget, 'getTodaysFormattedDate').and.returnValue('2022-07-22');
                widget.field = new FormFieldModel(null, {
                    dynamicDateRangeSelection: true,
                    maxDateRangeValue: 8,
                    minDateRangeValue: 10,
                    maxValue: null,
                    minValue: null
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const expectedMaxValueString = '2022-07-30';
                const expectedMinValueString = '2022-07-12';

                expect(widget.field.maxValue).toEqual(expectedMaxValueString);
                expect(widget.field.minValue).toEqual(expectedMinValueString);
            });
        });
    });

    describe('when tooltip is set', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DATE,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const dateCloudInput = fixture.nativeElement.querySelector('input');
            dateCloudInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
          });

        it('should hide tooltip', async () => {
            const dateCloudInput = fixture.nativeElement.querySelector('input');
            dateCloudInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            dateCloudInput.dispatchEvent(new Event('mouseleave'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
            expect(tooltipElement).toBeFalsy();
        });
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DATE,
                required: true
            });
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });

        it('should be invalid after user interaction without typing', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dateCloudInput = fixture.nativeElement.querySelector('input');
            dateCloudInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();
        });
    });
});
