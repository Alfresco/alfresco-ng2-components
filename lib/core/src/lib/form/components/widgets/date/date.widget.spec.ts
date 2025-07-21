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
import { DateAdapter } from '@angular/material/core';
import { UnitTestingUtils } from '../../../../testing';
import { FormFieldModel, FormFieldTypes, FormModel } from '../core';
import { DateWidgetComponent } from './date.widget';
import { DEFAULT_DATE_FORMAT } from '../../../../common';
import { isEqual } from 'date-fns';

describe('DateWidgetComponent', () => {
    let widget: DateWidgetComponent;
    let fixture: ComponentFixture<DateWidgetComponent>;
    let adapter: DateAdapter<Date>;
    let form: FormModel;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DateWidgetComponent]
        });

        form = new FormModel();
        fixture = TestBed.createComponent(DateWidgetComponent);
        adapter = fixture.debugElement.injector.get(DateAdapter);
        widget = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
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

    it('[C310333] - should be able to set a placeholder', () => {
        widget.field = new FormFieldModel(form, {
            id: 'date-id',
            name: 'date-name',
            placeholder: 'My Placeholder'
        });

        expect(widget.field.placeholder).toBe('My Placeholder');
    });

    it('should setup min value for date picker', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue
        });

        widget.ngOnInit();

        const expected = adapter.parse(minValue, DEFAULT_DATE_FORMAT);
        expect(isEqual(widget.minDate, expected)).toBeTrue();
    });

    it('should validate min date value constraint', () => {
        const minValue = '1982-03-13';

        const field = new FormFieldModel(form, {
            id: 'date-id',
            type: 'date',
            name: 'date-name',
            dateDisplayFormat: 'DD-MM-YYYY',
            minValue
        });

        widget.field = field;
        fixture.detectChanges();

        widget.dateInputControl.setValue(new Date('1982/03/12'));

        fixture.detectChanges();

        expect(widget.field.isValid).toBeFalsy();
        expect(field.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
        expect(field.validationSummary.attributes.get('minValue')).toBe('13-03-1982');
    });

    it('should validate max date value constraint', () => {
        const maxValue = '1982-03-13';

        const field = new FormFieldModel(form, {
            id: 'date-id',
            type: 'date',
            name: 'date-name',
            dateDisplayFormat: 'DD-MM-YYYY',
            maxValue
        });

        widget.field = field;
        fixture.detectChanges();

        widget.dateInputControl.setValue(new Date('2023/03/13'));

        fixture.detectChanges();

        expect(widget.field.isValid).toBeFalsy();
        expect(field.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN');
        expect(field.validationSummary.attributes.get('maxValue')).toBe('13-03-1982');
    });

    it('should date field be present', () => {
        const minValue = '13-03-1982';
        widget.field = new FormFieldModel(form, {
            minValue
        });

        fixture.detectChanges();

        expect(testingUtils.getByCSS('#data-widget')).toBeDefined();
        expect(testingUtils.getByCSS('#data-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        const maxValue = '1982-03-31';
        widget.field = new FormFieldModel(form, {
            maxValue
        });
        fixture.detectChanges();

        const expected = adapter.parse(maxValue, DEFAULT_DATE_FORMAT) as Date;
        expect(adapter.compareDate(widget.maxDate, expected)).toBe(0);
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        const field = new FormFieldModel(form, {
            id: 'date-field-id',
            name: 'date-name',
            value: '9-9-9999',
            type: 'date'
        });

        widget.field = field;

        fixture.detectChanges();

        widget.dateInputControl.setValue(new Date('12/12/2012'));

        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DATE,
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

    describe('template check', () => {
        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible date widget', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: new Date('9-9-9999'),
                type: FormFieldTypes.DATE
            });

            fixture.detectChanges();

            const dateElement = testingUtils.getByCSS('#date-field-id').nativeElement;

            expect(dateElement).not.toBeNull();
            expect(dateElement?.value).toContain('9-9-9999');
        });

        it('[C310335] - Should be able to change display format for Date widget', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: new Date('12-30-9999'),
                type: FormFieldTypes.DATE,
                dateDisplayFormat: 'dd.MM.yyyy'
            });

            fixture.detectChanges();

            const dateElement = testingUtils.getByCSS('#date-field-id').nativeElement;

            expect(dateElement?.value).toContain('30.12.9999');
        });

        it('should disable date button when is readonly', () => {
            widget.field = new FormFieldModel(form, {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999',
                type: FormFieldTypes.DATE
            });

            fixture.detectChanges();

            let dateButton = testingUtils.getByCSS('button').nativeElement;

            expect(dateButton).toBeDefined();
            expect(dateButton.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = testingUtils.getByCSS('button').nativeElement;

            expect(dateButton).toBeDefined();
            expect(dateButton.disabled).toBeTruthy();
        });

        it('should set isValid to false when the value is not a correct date value', () => {
            widget.field = new FormFieldModel(form, {
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
            dateDisplayFormat: 'MM-dd-yyyy'
        });

        widget.field = field;

        fixture.detectChanges();

        const dateElement = testingUtils.getByCSS('#date-field-id').nativeElement;

        expect(dateElement).toBeDefined();
        expect(dateElement.value).toContain('12-30-9999');

        dateElement.value = '03-02-2020';
        dateElement.dispatchEvent(new Event('input'));

        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();

        expect(dateElement.value).toContain('03-02-2020');
    });
});
