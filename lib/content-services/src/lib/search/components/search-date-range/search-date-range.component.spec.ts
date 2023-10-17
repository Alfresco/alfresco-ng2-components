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

import { SearchDateRangeComponent } from './search-date-range.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { startOfDay, endOfDay, isValid, addDays, format } from 'date-fns';

describe('SearchDateRangeComponent', () => {
    let fixture: ComponentFixture<SearchDateRangeComponent>;
    let component: SearchDateRangeComponent;

    const dateFormatFixture = 'dd-MMM-yy';
    const fromDate = new Date('2016-10-16');
    const toDate = new Date('2017-10-16');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });
        fixture = TestBed.createComponent(SearchDateRangeComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => fixture.destroy());

    it('should setup form elements on init', () => {
        fixture.detectChanges();

        expect(component.from).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should setup form control with formatted valid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
        fixture.detectChanges();

        const date = new Date('20-feb-18');
        expect(isValid(date)).toBeTrue();

        component.onChangedHandler({ value: date } as MatDatepickerInputEvent<Date>, component.from);
        expect(component.from.value.toString()).toEqual(date.toString());
    });

    it('should NOT setup form control with invalid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
        fixture.detectChanges();

        const date = new Date('20.f.18');
        expect(isValid(date)).toBeFalse();

        component.onChangedHandler({ value: date } as MatDatepickerInputEvent<Date>, component.from);
        expect(component.from.value).not.toEqual(date);
    });

    it('should reset form', () => {

        fixture.detectChanges();
        component.form.setValue({ from: fromDate, to: toDate });

        expect(component.from.value).toEqual(fromDate);
        expect(component.to.value).toEqual(toDate);

        component.reset();

        expect(component.from.value).toBeNull();
        expect(component.to.value).toBeNull();
        expect(component.form.value).toEqual({ from: null, to: null });
    });

    it('should reset fromMaxDate on reset', () => {
        fixture.detectChanges();
        component.fromMaxDate = fromDate;
        component.reset();

        expect(component.fromMaxDate).toEqual(undefined);
    });

    it('should update query builder on reset', () => {
        const context: any = {
            queryFragments: {
                createdDateRange: 'query'
            },
            update: () => {}
        };

        component.id = 'createdDateRange';
        component.context = context;

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        component.reset();

        expect(context.queryFragments.createdDateRange).toEqual('');
        expect(context.update).toHaveBeenCalled();
    });

    it('should update query builder on value changes', () => {
        const context: any = {
            queryFragments: {},
            update: () => {}
        };

        component.id = 'createdDateRange';
        component.context = context;
        component.settings = { field: 'cm:created' };

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        component.apply({
            from: fromDate,
            to: toDate
        }, true);

        const startDate = startOfDay(fromDate).toISOString();
        const endDate = endOfDay(toDate).toISOString();

        const expectedQuery = `cm:created:['${startDate}' TO '${endDate}']`;

        expect(context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(context.update).toHaveBeenCalled();
    });

    it('should show date-format error when Invalid found', async () => {
        fixture.detectChanges();

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        input.value = '10-f-18';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.INVALID-DATE');
    });

    it('should hide date-format error when correcting input', async () => {
        fixture.detectChanges();

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        input.value = '10-f-18';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.INVALID-DATE');

        input.value = '10-10-2018';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('');
    });

    it('should show error for max date constraint', async () => {
        component.settings = { field: 'cm:created', maxDate: 'today' };
        fixture.detectChanges();

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        input.value = format(addDays(new Date(), 1), 'dd-MM-yyyy');
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATE');
    });

    it('should show error for required constraint', async () => {
        fixture.detectChanges();

        const fromInput = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        fromInput.value = '';
        fromInput.dispatchEvent(new Event('input'));

        const toInput = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-to-input"]');
        toInput.value = '';
        toInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.REQUIRED-VALUE');
        expect(component.getToValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.REQUIRED-VALUE');
    });

    it('should show error for incorrect date range', async () => {
        fixture.detectChanges();

        const fromInput = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        fromInput.value = '11-10-2018';
        fromInput.dispatchEvent(new Event('input'));

        const toInput = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-to-input"]');
        toInput.value = '10-10-2018';
        toInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('');
        expect(component.getToValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.NO-DAYS');
    });

    it('should not show date-format error when valid found', async () => {
        fixture.detectChanges();

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        input.value = '10-10-2018';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('');
    });

    it('should have no maximum date by default', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.maxDate).toBeUndefined();
    });

    it('should be able to set a fixed maximum date', async () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture, maxDate: '10-Mar-20' };
        fixture.detectChanges();

        const expected = endOfDay(new Date(2020, 2, 10));
        expect(component.maxDate).toEqual(expected);
    });

    it('should be able to set the maximum date to today', async () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture, maxDate: 'today' };
        fixture.detectChanges();
        const today = endOfDay(new Date());

        expect(component.maxDate).toEqual(today);
    });
});
