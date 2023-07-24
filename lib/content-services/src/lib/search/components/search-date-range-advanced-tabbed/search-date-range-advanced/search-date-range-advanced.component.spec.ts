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
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { SearchDateRangeAdvancedComponent } from './search-date-range-advanced.component';
import { addDays, endOfToday, format, parse, startOfYesterday, subDays } from 'date-fns';
import { Validators } from '@angular/forms';

describe('SearchDateRangeAdvancedComponent', () => {
    let component: SearchDateRangeAdvancedComponent;
    let fixture: ComponentFixture<SearchDateRangeAdvancedComponent>;

    const startDateSampleValue = parse('05-Jun-23', 'dd-MMM-yy', new Date());
    const endDateSampleValue = parse('07-Jun-23', 'dd-MMM-yy', new Date());

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchDateRangeAdvancedComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        fixture = TestBed.createComponent(SearchDateRangeAdvancedComponent);
        component = fixture.componentInstance;
        component.field   = 'test-field';
        component.dateFormat = 'dd-MMM-yy';
        component.maxDate = 'today';
        component.form.setValue({
            dateRangeType: component.DateRangeType.ANY,
            inLastValueType: component.InLastDateType.DAYS,
            inLastValue: null,
            betweenStartDate: null,
            betweenEndDate: null
        });
        fixture.detectChanges();
    });

    const getElementBySelector = (selector: string) => fixture.debugElement.query(By.css(selector)).nativeElement;

    const enterValueInInputFieldAndTriggerEvent = (inputElementId: string, value: string, event = 'input') => {
        const inputField = getElementBySelector(`[data-automation-id="${inputElementId}"]`);
        inputField.value = value;
        inputField.dispatchEvent(new Event(event));
        fixture.detectChanges();
    };

    const selectDropdownOption = (itemId: string) => {
        const matSelect = fixture.debugElement.query(By.css('[data-automation-id="date-range-advanced-in-last-dropdown"]')).nativeElement;
        matSelect.click();
        fixture.detectChanges();
        const matOption = fixture.debugElement.query(By.css(`[data-automation-id="${itemId}"]`)).nativeElement;
        matOption.click();
        fixture.detectChanges();
    };

    it('should set values if initial value is provided', () => {
        let value: any = {
            dateRangeType: component.DateRangeType.ANY
        };
        component.initialValue = value;
        component.ngOnInit();
        expect(component.form.controls.dateRangeType.value).toEqual(component.DateRangeType.ANY);

        value = {
            dateRangeType: component.DateRangeType.IN_LAST,
            inLastValueType: component.InLastDateType.WEEKS,
            inLastValue: '5'
        };
        component.initialValue = value;
        component.ngOnInit();
        expect(component.form.controls.dateRangeType.value).toEqual(component.DateRangeType.IN_LAST);
        expect(component.form.controls.inLastValueType.value).toEqual(component.InLastDateType.WEEKS);
        expect(component.form.controls.inLastValue.value).toEqual('5');

        value = {
            dateRangeType: component.DateRangeType.BETWEEN,
            betweenStartDate: startOfYesterday(),
            betweenEndDate: endOfToday()
        };
        component.initialValue = value;
        component.ngOnInit();
        expect(component.form.controls.dateRangeType.value).toEqual(component.DateRangeType.BETWEEN);
        expect(component.form.controls.betweenStartDate.value).toEqual(startOfYesterday());
        expect(component.form.controls.betweenEndDate.value).toEqual(endOfToday());
    });

    it('should not have any validators on any input fields when anytime option is selected', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.ANY);
        fixture.detectChanges();
        expect(component.form.controls.inLastValue.validator).toBeNull();
        expect(component.form.controls.betweenStartDate.validator).toBeNull();
        expect(component.form.controls.betweenEndDate.validator).toBeNull();
    });

    it('should set the required validator on in last input field and remove validators from between input fields when In the last option is selected', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        expect(component.form.controls.inLastValue.hasValidator(Validators.required)).toBeTrue();
        expect(component.form.controls.betweenStartDate.validator).toBeNull();
        expect(component.form.controls.betweenEndDate.validator).toBeNull();
    });

    it('should set the validators on in between input fields and remove validator from in last input fields when Between option is selected', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        expect(component.form.controls.betweenStartDate.hasValidator(Validators.required)).toBeTrue();
        expect(component.form.controls.betweenEndDate.hasValidator(Validators.required)).toBeTrue();
        expect(component.form.controls.betweenEndDate.hasValidator(component.endDateValidator)).toBeTrue();
        expect(component.form.controls.inLastValue.validator).toBeNull();
    });

    it('should not be able to set zero or negative values in In the last input field', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-in-last-input', '-5');
        let inLastInputFieldValue = getElementBySelector('[data-automation-id="date-range-advanced-in-last-input"]').value;
        expect(inLastInputFieldValue).toBe('5');

        enterValueInInputFieldAndTriggerEvent('date-range-advanced-in-last-input', '0');
        inLastInputFieldValue = getElementBySelector('[data-automation-id="date-range-advanced-in-last-input"]').value;
        expect(inLastInputFieldValue).toBe('');
    });

    it('should give an invalid date error when manually setting a start date and an end date that are not in the correct format', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-between-start-input', 'invalid-date-input', 'change');
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-between-end-input', 'invalid-date-input', 'change');
        expect(component.form.controls.betweenStartDate.errors.invalidDate).toBeTrue();
        expect(component.form.controls.betweenEndDate.errors.invalidDate).toBeTrue();
    });

    it('should give an invalid date error when manually setting a start Date that is after the end date', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        component.form.controls.betweenEndDate.setValue(new Date());
        const startDate = format(addDays(component.form.controls.betweenEndDate.value, 3), component.dateFormat);
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-between-start-input', startDate, 'change');
        expect(component.form.controls.betweenEndDate.errors.invalidDate).toBeTrue();
    });

    it('should give an invalid date error when manually setting an end Date that is before the start date', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        component.form.controls.betweenStartDate.setValue(new Date());
        const endDate = format(subDays(component.form.controls.betweenStartDate.value, 3), component.dateFormat);
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-between-end-input', endDate, 'change');
        expect(component.form.controls.betweenEndDate.errors.invalidDate).toBeTrue();
    });

    it('should give an invalid date error when setting an endDate that is after the max date', () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        const endDate = format(addDays(component.convertedMaxDate, 3), component.dateFormat);
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-between-end-input', endDate, 'change');
        expect(component.form.controls.betweenEndDate.errors.invalidDate).toBeTrue();
    });

    it('should emit valid as false when form is invalid', () => {
        spyOn(component.valid, 'emit');
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-in-last-input', '');
        selectDropdownOption('date-range-advanced-in-last-option-weeks');
        expect(component.valid.emit).toHaveBeenCalledWith(false);

        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        expect(component.valid.emit).toHaveBeenCalledWith(false);
    });

    it('should emit valid as true when form is valid', () => {
        spyOn(component.valid, 'emit');
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-in-last-input', '5');
        selectDropdownOption('date-range-advanced-in-last-option-weeks');
        expect(component.valid.emit).toHaveBeenCalledWith(true);

        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        component.betweenStartDateFormControl.setValue(startDateSampleValue);
        component.betweenEndDateFormControl.setValue(endDateSampleValue);
        fixture.detectChanges();
        expect(component.valid.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit values when form is invalid', () => {
        spyOn(component.changed, 'emit');
        let value = {
            dateRangeType: component.DateRangeType.IN_LAST,
            inLastValueType: component.InLastDateType.WEEKS,
            inLastValue: '',
            betweenStartDate: undefined,
            betweenEndDate: undefined
        };
        let dateRangeTypeRadioButton = getElementBySelector('[data-automation-id="date-range-advanced-in-last"] .mat-radio-input');
        dateRangeTypeRadioButton.click();
        selectDropdownOption('date-range-advanced-in-last-option-weeks');
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-in-last-input', '');
        expect(component.changed.emit).not.toHaveBeenCalledWith(value);

        component.form.patchValue({
            dateRangeType: component.DateRangeType.ANY,
            inLastValueType: component.InLastDateType.DAYS,
            inLastValue: undefined,
            betweenStartDate: undefined,
            betweenEndDate: undefined
        });

        value = {
            dateRangeType: component.DateRangeType.BETWEEN,
            inLastValueType: component.InLastDateType.DAYS,
            inLastValue: undefined,
            betweenStartDate: '',
            betweenEndDate: ''
        };
        dateRangeTypeRadioButton = getElementBySelector('[data-automation-id="date-range-advanced-between"] .mat-radio-input');
        dateRangeTypeRadioButton.click();
        fixture.detectChanges();
        expect(component.changed.emit).not.toHaveBeenCalledWith(value);
    });

    it('should emit values when form is valid', () => {
        spyOn(component.changed, 'emit');
        let value = {
            dateRangeType: component.DateRangeType.IN_LAST,
            inLastValueType: component.InLastDateType.WEEKS,
            inLastValue: 5,
            betweenStartDate: null,
            betweenEndDate: null
        };
        let dateRangeTypeRadioButton = getElementBySelector('[data-automation-id="date-range-advanced-in-last"] .mat-radio-input');
        dateRangeTypeRadioButton.click();
        selectDropdownOption('date-range-advanced-in-last-option-weeks');
        enterValueInInputFieldAndTriggerEvent('date-range-advanced-in-last-input', '5');
        fixture.detectChanges();
        expect(component.changed.emit).toHaveBeenCalledWith(value);

        component.form.patchValue({
            dateRangeType: component.DateRangeType.ANY,
            inLastValueType: component.InLastDateType.DAYS,
            inLastValue: undefined,
            betweenStartDate: undefined,
            betweenEndDate: undefined
        });

        value = {
            dateRangeType: component.DateRangeType.BETWEEN,
            inLastValueType: component.InLastDateType.DAYS,
            inLastValue: undefined,
            betweenStartDate: startDateSampleValue,
            betweenEndDate: endDateSampleValue
        };
        dateRangeTypeRadioButton = getElementBySelector('[data-automation-id="date-range-advanced-between"] .mat-radio-input');
        dateRangeTypeRadioButton.click();
        component.betweenStartDateFormControl.setValue(startDateSampleValue);
        component.betweenEndDateFormControl.setValue(endDateSampleValue);
        fixture.detectChanges();
        expect(component.changed.emit).toHaveBeenCalledWith(value);
    });
});
