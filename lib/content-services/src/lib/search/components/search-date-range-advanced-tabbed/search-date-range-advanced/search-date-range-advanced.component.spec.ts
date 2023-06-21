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
import { endOfDay, formatISO, startOfDay } from 'date-fns';

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
        component.id = 'date-range-advanced';
        component.settings = {
            field: 'test-field',
            hideDefaultAction: false
        }
        component.context = {
            queryFragments: {
                date: ''
            },
            update: jasmine.createSpy()
        } as any;

        fixture.detectChanges();
    });

    const getElementByDataAutomationId = (dataAutomationId) => {
        return fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`)).nativeElement;
    }

    const clickElementByAutomationId = async (elementDataAutomationId) => {
        const el = getElementByDataAutomationId(elementDataAutomationId);
        el.dispatchEvent(new Event('click'));
        await fixture.whenStable();
        fixture.detectChanges();
    }

    const enterValueInInputField = async (inputElementId: string, value: string) => {
        const inputField = getElementByDataAutomationId(inputElementId);
        inputField.value = value;
        inputField.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();
    }

    const selectDropdownOption = (itemId: string) => {
        const matSelect = fixture.debugElement.query(By.css('[data-automation-id="date-range-advanced-in-last-dropdown"]')).nativeElement;
        matSelect.click();
        fixture.detectChanges();
        const matOption = fixture.debugElement.query(By.css(`[data-automation-id="${itemId}"]`)).nativeElement;
        matOption.click();
        fixture.detectChanges();
    };

    it('should not set any date filter in context when Anytime option is selected', async () => {
        component.dateRangeTypeValue = component.DateRangeType.ANY;
        fixture.detectChanges();
        await fixture.whenStable();
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should set proper date filter in context when In the last option is selected', async () => {
        component.dateRangeTypeValue = component.DateRangeType.IN_LAST;
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '5');
        await selectDropdownOption('date-range-advanced-in-last-option-days')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        let query = 'test-field:[NOW/DAY-5DAYS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();

        component.dateRangeTypeValue = component.DateRangeType.IN_LAST;
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '3');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        query = 'test-field:[NOW/DAY-3WEEKS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();

        component.dateRangeTypeValue = component.DateRangeType.IN_LAST;
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '6');
        await selectDropdownOption('date-range-advanced-in-last-option-months');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        query = 'test-field:[NOW/DAY-6MONTHS TO NOW/DAY+1DAY]';
        expect(component.context.queryFragments[component.id]).toBe(query);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should not set any date filter in context when In the last or Between option is selected, but no value is provided', async () => {
        component.dateRangeTypeValue = component.DateRangeType.IN_LAST;
        fixture.detectChanges();
        await fixture.whenStable();
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();

        component.dateRangeTypeValue = component.DateRangeType.BETWEEN;
        fixture.detectChanges();
        await fixture.whenStable();
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should set proper date filter in context when Between option is selected', async () => {
        component.dateRangeTypeValue = component.DateRangeType.BETWEEN;
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-between-start-input', '6/5/2023');
        await enterValueInInputField('date-range-advanced-between-end-input', '6/10/2023');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        let query = `test-field:['${formatISO(startOfDay(component.betweenStartDate))}' TO '${formatISO(endOfDay(component.betweenEndDate))}']`;
        expect(component.context.queryFragments[component.id]).toEqual(query);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should clear context when widget is reset', async () => {
        component.context.queryFragments[component.id] = '[NOW/DAY-5DAYS TO NOW/DAY+1DAY]';
        await clickElementByAutomationId('date-range-advanced-clear-btn');
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should update display label with proper text when In the last/Between option is selected and values are properly set', async () => {
        spyOn(component.displayValue$, 'next');

        component.dateRangeTypeValue = component.DateRangeType.IN_LAST;
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-in-last-input', '5');
        await selectDropdownOption('date-range-advanced-in-last-option-days')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.DAYS');

        await enterValueInInputField('date-range-advanced-in-last-input', '3');
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.WEEKS');

        await enterValueInInputField('date-range-advanced-in-last-input', '7');
        await selectDropdownOption('date-range-advanced-in-last-option-months')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.MONTHS');

        component.dateRangeTypeValue = component.DateRangeType.BETWEEN;
        fixture.detectChanges();
        await fixture.whenStable();
        await enterValueInInputField('date-range-advanced-between-start-input', '6/5/2023');
        await enterValueInInputField('date-range-advanced-between-end-input', '6/10/2023');
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        expect(component.displayValue$.next).toHaveBeenCalledWith('05-Jun-23 - 10-Jun-23');
    });

    it('should not update display label if anytime option is selected', async() => {
        spyOn(component.displayValue$, 'next');

        component.dateRangeTypeValue = component.DateRangeType.ANY;
        fixture.detectChanges();
        await fixture.whenStable();
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should not update display label if no valid value was provided', async () => {
        spyOn(component.displayValue$, 'next');

        component.dateRangeTypeValue = component.DateRangeType.IN_LAST;
        fixture.detectChanges();
        await fixture.whenStable();
        await selectDropdownOption('date-range-advanced-in-last-option-weeks')
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');

        component.dateRangeTypeValue = component.DateRangeType.BETWEEN;
        fixture.detectChanges();
        await fixture.whenStable();
        await clickElementByAutomationId('date-range-advanced-apply-btn');
        fixture.detectChanges();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should set values if initial value is provided', () => {
        let value: any = {
            dateRangeType: component.DateRangeType.ANY
        }
        component.startValue = value;
        component.ngOnInit();
        expect(component.getCurrentValue()).toEqual(value);

        value = {
            dateRangeType: component.DateRangeType.IN_LAST,
            inLastValue: 5,
            inLastValueType: component.InLastDateType.WEEKS
        }
        component.startValue = value;
        component.ngOnInit();
        expect(component.getCurrentValue()).toEqual(value);

        value = {
            dateRangeType: component.DateRangeType.BETWEEN,
            betweenStartDate: '6/5/2023',
            betweenEndDate: '6/10/2023'
        }
        component.startValue = value;
        component.ngOnInit();
        expect(component.getCurrentValue()).toEqual(value);
    });

    it('should not allow selecting a date after the current date when Between option is selected, and no maxDate is provided', async () => {
    });

    it('should not allow selecting a date after the maxDate when Between option is selected and maxDate is provided', async () => {
    });
});
