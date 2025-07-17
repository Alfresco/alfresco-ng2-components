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
import { DateCloudWidgetComponent } from './date-cloud.widget';
import { FormFieldModel, FormModel, FormFieldTypes, DEFAULT_DATE_FORMAT, UnitTestingUtils } from '@alfresco/adf-core';
import { DateAdapter } from '@angular/material/core';
import { isEqual, subDays, addDays } from 'date-fns';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('DateCloudWidgetComponent', () => {
    let widget: DateCloudWidgetComponent;
    let fixture: ComponentFixture<DateCloudWidgetComponent>;
    let element: HTMLElement;
    let adapter: DateAdapter<Date>;
    let form: FormModel;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DateCloudWidgetComponent]
        });

        form = new FormModel();

        fixture = TestBed.createComponent(DateCloudWidgetComponent);
        adapter = fixture.debugElement.injector.get(DateAdapter);

        loader = TestbedHarnessEnvironment.loader(fixture);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    it('should not call onFieldChanged on init', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();
        expect(widget.onFieldChanged).not.toHaveBeenCalled();
    });

    it('should call onFieldChanged when date changes', () => {
        const spy = spyOn(widget, 'onFieldChanged').and.callThrough();
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9-9-9999',
            type: 'date'
        });
        const newDate = new Date('12/12/2012');

        widget.field = field;
        fixture.detectChanges();
        widget.dateInputControl.setValue(newDate);

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0].value).toBe(newDate);
    });

    it('should setup min value for date picker', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue
        });

        fixture.detectChanges();

        const expected = adapter.parse(minValue, DEFAULT_DATE_FORMAT);
        expect(isEqual(widget.minDate, expected)).toBeTrue();
    });

    it('should date field be present', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.DATE,
            minValue
        });

        fixture.detectChanges();

        expect(element.querySelector('#data-widget')).toBeDefined();
        expect(element.querySelector('#data-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        const maxValue = '1982-03-13';
        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.DATE,
            maxValue
        });
        fixture.detectChanges();

        const expected = adapter.parse(maxValue, DEFAULT_DATE_FORMAT);
        expect(isEqual(widget.maxDate, expected)).toBeTrue();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        const field = new FormFieldModel(form, {
            type: FormFieldTypes.DATE,
            id: 'date-field-id',
            name: 'date-name',
            value: '9999-9-9',
            readOnly: 'false'
        });

        widget.field = field;

        fixture.detectChanges();

        widget.dateInputControl.setValue(new Date('9999-9-9'));

        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    describe('template check', () => {
        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible date widget', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-9-9',
                type: FormFieldTypes.DATE
            });

            fixture.detectChanges();

            const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement).not.toBeNull();

            expect(dateElement?.value).toContain('9-9-9999');
        });

        it('should show the correct format type', async () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: new Date('12-30-9999'),
                type: FormFieldTypes.DATE,
                dateDisplayFormat: 'yyyy-dd-MM'
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement.value).toContain('9999-30-12');
        });

        it('should disable date button when is readonly', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-9-9',
                type: FormFieldTypes.DATE,
                readOnly: false
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;
            fixture.detectChanges();

            let dateButton = element.querySelector<HTMLButtonElement>('button');
            expect(dateButton.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = element.querySelector<HTMLButtonElement>('button');
            expect(dateButton.disabled).toBeTruthy();
        });

        it('should set isValid to false when the value is not a correct date value', () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: 'aa',
                type: FormFieldTypes.DATE,
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;

            fixture.detectChanges();

            widget.dateInputControl.setValue(new Date('invalid date'));

            fixture.detectChanges();

            expect(widget.field.isValid).toBeFalsy();
        });
    });

    it('should display always the json value', () => {
        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: new Date('12-30-9999'),
            type: FormFieldTypes.DATE,
            readOnly: false,
            dateDisplayFormat: 'MM-dd-yyyy'
        });
        widget.field = field;

        fixture.detectChanges();

        const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
        expect(dateElement).toBeDefined();
        expect(dateElement.value).toContain('12-30-9999');

        dateElement.value = '03-02-2020';
        dateElement.dispatchEvent(new Event('input'));

        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();

        expect(dateElement.value).toContain('03-02-2020');
    });

    describe('when form model has left labels', () => {
        it('should have left labels classes on leftLabels true', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'date-id',
                name: 'date-name',
                value: '',
                type: FormFieldTypes.DATE,
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
                id: 'date-id',
                name: 'date-name',
                value: '',
                type: FormFieldTypes.DATE,
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
                id: 'date-id',
                name: 'date-name',
                value: '',
                type: FormFieldTypes.DATE,
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

    describe('Set dynamic dates', () => {
        const todayString = '22-02-2022';

        beforeEach(() => {
            const todayStringReversed = '2022-02-22';
            spyOn(adapter, 'today').and.returnValue(new Date(todayStringReversed));
        });

        describe('Minimum date range value and date', () => {
            it('should set minimum date range date to today if minimum date range value is 0', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: 0,
                    maxDateRangeValue: null
                });

                fixture.detectChanges();

                const expectedMinDate = adapter.today();

                expect(adapter.compareDate(widget.minDate, expectedMinDate)).toEqual(0);
                expect(widget.field.minValue).toBe(todayString);
            });

            it('should set minimum date range date to null if minimum date range value is null', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: null,
                    maxDateRangeValue: null
                });

                fixture.detectChanges();

                expect(widget.minDate).toBeNull();
                expect(widget.field.minValue).toBeNull();
            });

            it('should set minimum date range date to today minus abs(minDateRangeValue) if minimum date range value is negative', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: -2,
                    maxDateRangeValue: null
                });

                fixture.detectChanges();

                const expectedMinDate = subDays(adapter.today(), 2);

                expect(adapter.compareDate(widget.minDate, expectedMinDate)).toEqual(0);
                expect(widget.field.minValue).toBe('20-02-2022');
            });

            it('should set minimum date range date to today plus minDateRangeValue if minimum date range value is positive', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: 2,
                    maxDateRangeValue: null
                });

                fixture.detectChanges();

                const expectedMinDate = addDays(adapter.today(), 2);

                expect(adapter.compareDate(widget.minDate, expectedMinDate)).toEqual(0);
                expect(widget.field.minValue).toBe('24-02-2022');
            });
        });

        describe('Maximum date range value and date', () => {
            it('should set maximum date range date to today if maximum date range value is 0', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: null,
                    maxDateRangeValue: 0
                });

                fixture.detectChanges();

                const expectedMaxDate = adapter.today();

                expect(adapter.compareDate(widget.maxDate, expectedMaxDate)).toEqual(0);
                expect(widget.field.maxValue).toBe(todayString);
            });

            it('should set maximum date range date to null if maximum date range value is null', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: null,
                    maxDateRangeValue: null
                });

                fixture.detectChanges();

                expect(widget.maxDate).toBeNull();
                expect(widget.field.maxValue).toBeNull();
            });

            it('should set maximum date range date to today minus abs(maxDateRangeValue) if maximum date range value is negative', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: null,
                    maxDateRangeValue: -2
                });

                fixture.detectChanges();

                const expectedMaxDate = subDays(adapter.today(), 2);

                expect(adapter.compareDate(widget.maxDate, expectedMaxDate)).toEqual(0);
                expect(widget.field.maxValue).toBe('20-02-2022');
            });

            it('should set maximum date range date to today plus maxDateRangeValue if maximum date range value is positive', () => {
                widget.field = new FormFieldModel(form, {
                    type: FormFieldTypes.DATE,
                    dynamicDateRangeSelection: true,
                    minDateRangeValue: null,
                    maxDateRangeValue: 2
                });

                fixture.detectChanges();

                const expectedMaxDate = addDays(adapter.today(), 2);

                expect(adapter.compareDate(widget.maxDate, expectedMaxDate)).toEqual(0);
                expect(widget.field.maxValue).toBe('24-02-2022');
            });
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DATE,
                required: true
            });
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            const formField = await testingUtils.getMatFormField();
            const formControl = await formField.getControl();

            expect(formControl.isRequired).toBeTruthy();

            const inputField = await testingUtils.getByCSS('.adf-input').nativeElement;
            expect(inputField.hasAttribute('required')).toBeTruthy();
        });

        it('should be invalid after user interaction without typing', () => {
            fixture.detectChanges();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dateCloudInput = fixture.nativeElement.querySelector('input');
            dateCloudInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();
        });

        it('should be valid when field is hidden with empty value', () => {
            widget.field.isVisible = false;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeTrue();
            expect(widget.dateInputControl.valid).toBeTrue();
            expect(widget.field.validationSummary.message).toBe('');
        });

        it('should be invalid when field is hidden with empty value', () => {
            widget.field.isVisible = true;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeFalse();
            expect(widget.dateInputControl.valid).toBeFalse();
            expect(widget.field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
        });
    });
});
