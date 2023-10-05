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
import { DateWidgetComponent } from './date.widget';
import { CoreTestingModule } from '../../../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldTypes } from '../core/form-field-types';
import { isSameDay } from 'date-fns';
import { DateFnsUtils } from '../../../../common';

describe('DateWidgetComponent', () => {
    let widget: DateWidgetComponent;
    let fixture: ComponentFixture<DateWidgetComponent>;
    let element: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ]
        });
        fixture = TestBed.createComponent(DateWidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
    });

    it('[C310333] - should be able to set a placeholder', () => {
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            placeholder: 'My Placeholder'
        });

        expect(widget.field.placeholder).toBe('My Placeholder');
    });

    it('should setup min value for date picker', () => {
        const minValue = '13-03-1982';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue
        });

        widget.ngOnInit();

        const expectedMinDate = DateFnsUtils.parseDate(minValue, widget.field.dateDisplayFormat);
        expect(isSameDay(widget.minDate, expectedMinDate)).toBeTruthy();
    });

    it('should date field be present', () => {
        const minValue = '13-03-1982';
        widget.field = new FormFieldModel(null, {
            minValue
        });

        fixture.detectChanges();

        expect(element.querySelector('#data-widget')).toBeDefined();
        expect(element.querySelector('#data-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        const maxValue = '31-03-1982';
        widget.field = new FormFieldModel(null, {
            maxValue
        });
        widget.ngOnInit();

        const expectedMaxDate = DateFnsUtils.parseDate(maxValue, widget.field.dateDisplayFormat);
        expect(isSameDay(widget.maxDate, expectedMaxDate)).toBeTruthy();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        const field = new FormFieldModel(new FormModel(), {
            id: 'date-field-id',
            name: 'date-name',
            value: '9-9-9999',
            type: 'date',
            readOnly: 'false'
        });
        widget.field = field;
        widget.onDateChange({
            value: moment('12/12/2012', widget.field.dateDisplayFormat)
        } as any);

        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DATE,
                required: true
            });

            fixture.detectChanges();
        });

        it('should be marked as invalid after interaction', () => {
            const dateInput = fixture.nativeElement.querySelector('input');
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

            dateInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
        });
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
                value: '9-9-9999',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement).not.toBeNull();

            expect(dateElement?.value).toContain('9-9-9999');
        });

        it('[C310335] - Should be able to change display format for Date widget', async () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value:  '12-30-9999',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.dateDisplayFormat = DateFnsUtils.convertMomentToDateFnsFormat('MM-DD-YYYY');

            fixture.detectChanges();
            await fixture.whenStable();

            let dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement?.value).toContain('12-30-9999');

            widget.field.value = '05.06.2019';
            widget.field.dateDisplayFormat = DateFnsUtils.convertMomentToDateFnsFormat('DD.MM.YYYY');

            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
            expect(dateElement?.value).toContain('05.06.2019');
        });

        it('should disable date button when is readonly', () => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999',
                type: 'date',
                readOnly: 'false'
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
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;
            fixture.detectChanges();

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
        field.dateDisplayFormat = DateFnsUtils.convertMomentToDateFnsFormat('MM-DD-YYYY');
        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        const dateElement = element.querySelector<HTMLInputElement>('#date-field-id');
        expect(dateElement?.value).toContain('12-30-9999');

        widget.field.value = '03-02-2020';

        fixture.componentInstance.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(dateElement?.value).toContain('03-02-2020');
    });

    describe('format label', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                name: 'Date',
                dateDisplayFormat: 'd-M-yyyy'
            });
            fixture.detectChanges();
        });

        it('should format label correctly', () => {
            const result = widget.formatDateLabel(widget.field);

            expect(result).toBe('Date (D-M-YYYY)');
        });
    });
});
