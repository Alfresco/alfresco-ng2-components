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
import { endOfDay, endOfToday, formatISO, startOfDay, startOfYesterday } from 'date-fns';
import { Validators } from '@angular/forms';

describe('SearchDateRangeAdvancedComponent', () => {
    let component: SearchDateRangeAdvancedComponent;
    let fixture: ComponentFixture<SearchDateRangeAdvancedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchDateRangeAdvancedComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchDateRangeAdvancedComponent);
        component = fixture.componentInstance;
        component.field   = 'test-field';
        component.dateFormat = 'dd-MMM-yy';
        fixture.detectChanges();
        component.form.setValue({
            dateRangeType: component.DateRangeType.ANY,
            inLastValueType: component.InLastDateType.DAYS,
            inLastValue: null,
            betweenStartDate: null,
            betweenEndDate: null
        });
        spyOn(component.updatedQuery, 'emit');
        spyOn(component.updatedDisplayValue, 'emit');
    });

    const getElementByDataAutomationId = (dataAutomationId) => {
        return fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`)).nativeElement;
    }

    const enterValueInInputField = async (inputElementId: string, value: string) => {
        const inputField = getElementByDataAutomationId(inputElementId);
        inputField.value = value;
        inputField.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();
    }

    const selectDropdownOption = async (itemId: string) => {
        const matSelect = fixture.debugElement.query(By.css('[data-automation-id="date-range-advanced-in-last-dropdown"]')).nativeElement;
        matSelect.click();
        fixture.detectChanges();
        const matOption = fixture.debugElement.query(By.css(`[data-automation-id="${itemId}"]`)).nativeElement;
        matOption.click();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    it('should not set any date filter in context when Anytime option is selected', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.ANY);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.updatedQuery.emit).toHaveBeenCalledWith('');
    });

    it('should set proper date filter in context when In the last option is selected', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '5');
        await selectDropdownOption('date-range-advanced-in-last-option-days');
        fixture.detectChanges();
        let query = 'test-field:[NOW/DAY-5DAYS TO NOW/DAY+1DAY]';
        expect(component.updatedQuery.emit).toHaveBeenCalledWith(query);

        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '3');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks');
        fixture.detectChanges();
        query = 'test-field:[NOW/DAY-3WEEKS TO NOW/DAY+1DAY]';
        expect(component.updatedQuery.emit).toHaveBeenCalledWith(query);

        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '6');
        await selectDropdownOption('date-range-advanced-in-last-option-months');
        fixture.detectChanges();
        query = 'test-field:[NOW/DAY-6MONTHS TO NOW/DAY+1DAY]';
        expect(component.updatedQuery.emit).toHaveBeenCalledWith(query);
    });

    it('should not set any date filter in context and set error on field when In the last or Between option is selected, but no value is provided', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        fixture.detectChanges();
        expect(component.updatedQuery.emit).toHaveBeenCalledWith('');
        expect(component.form.controls.inLastValue.errors['required']).toBe(true);

        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.updatedQuery.emit).toHaveBeenCalledWith('');
        expect(component.form.controls.betweenStartDate.errors['required']).toBe(true);
        expect(component.form.controls.betweenEndDate.errors['required']).toBe(true );
    });

    it('should set proper date filter in context when Between option is selected', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-between-start-input', '6/5/2023');
        await enterValueInInputField('date-range-advanced-between-end-input', '6/10/2023');
        fixture.detectChanges();
        let query = `test-field:['${formatISO(startOfDay(component.form.controls.betweenStartDate.value))}' TO '${formatISO(endOfDay(component.form.controls.betweenEndDate.value))}']`;
        expect(component.updatedQuery.emit).toHaveBeenCalledWith(query);
    });

    it('should update display label with proper text when In the last/Between option is selected and values are properly set', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '5');
        await selectDropdownOption('date-range-advanced-in-last-option-days');
        fixture.detectChanges();
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.DAYS');

        await enterValueInInputField('date-range-advanced-in-last-input', '3');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks');
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.WEEKS');

        await enterValueInInputField('date-range-advanced-in-last-input', '7');
        await selectDropdownOption('date-range-advanced-in-last-option-months');
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.MONTHS');

        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-between-start-input', '6/5/2023');
        await enterValueInInputField('date-range-advanced-between-end-input', '6/10/2023');
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('05-Jun-23 - 10-Jun-23');
    });

    it('should not update display label if anytime option is selected', async() => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.ANY);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('');
    });

    it('should not update display label if no valid value was provided', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        fixture.detectChanges();
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('');

        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.updatedDisplayValue.emit).toHaveBeenCalledWith('');
    });

    it('should set values if initial value is provided', () => {
        let value: any = {
            dateRangeType: component.DateRangeType.ANY
        }
        component.initialValue = value;
        component.ngOnInit();
        expect(component.form.controls.dateRangeType.value).toEqual(component.DateRangeType.ANY);

        value = {
            dateRangeType: component.DateRangeType.IN_LAST,
            inLastValueType: component.InLastDateType.WEEKS,
            inLastValue: '5'
        }
        component.initialValue = value;
        component.ngOnInit();
        expect(component.form.controls.dateRangeType.value).toEqual(component.DateRangeType.IN_LAST);
        expect(component.form.controls.inLastValueType.value).toEqual(component.InLastDateType.WEEKS);
        expect(component.form.controls.inLastValue.value).toEqual('5');

        value = {
            dateRangeType: component.DateRangeType.BETWEEN,
            betweenStartDate: startOfYesterday(),
            betweenEndDate: endOfToday()
        }
        component.initialValue = value;
        component.ngOnInit();
        expect(component.form.controls.dateRangeType.value).toEqual(component.DateRangeType.BETWEEN);
        expect(component.form.controls.betweenStartDate.value).toEqual(startOfYesterday());
        expect(component.form.controls.betweenEndDate.value).toEqual(endOfToday());
    });
    it('should not have any validators on any input fields when anytime option is selected', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.ANY);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.form.controls.inLastValue.validator).toBeNull();
        expect(component.form.controls.betweenStartDate.validator).toBeNull();
        expect(component.form.controls.betweenEndDate.validator).toBeNull();
    });

    it('should set the required validator on in last input field and remove validators from between input fields when In the last option is selected', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.IN_LAST);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.form.controls.inLastValue.validator).toBe(Validators.required);
        expect(component.form.controls.betweenStartDate.validator).toBeNull();
        expect(component.form.controls.betweenEndDate.validator).toBeNull();
    });

    it('should set the required validator on in between input fields and remove validator from in last input fields when Between option is selected', async () => {
        component.form.controls.dateRangeType.setValue(component.DateRangeType.BETWEEN);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.form.controls.betweenStartDate.validator).toBe(Validators.required);
        expect(component.form.controls.betweenEndDate.validator).toBe(Validators.required);
        expect(component.form.controls.inLastValue.validator).toBeNull();
    });
});
