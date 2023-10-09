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
import { DateFnsUtils } from '@alfresco/adf-core';
import { DateAdapter } from '@angular/material/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { endOfDay, endOfToday, isValid, startOfDay } from 'date-fns';

declare let moment: any;

describe('SearchDateRangeComponent', () => {
    let fixture: ComponentFixture<SearchDateRangeComponent>;
    let component: SearchDateRangeComponent;
    let adapter: DateFnsAdapter;
    const fromDate = '2016-10-16';
    const toDate = '2017-10-16';
    const maxDate = '10-Mar-20';
    const dateFormatFixture = 'DD-MMM-YY';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });
        fixture = TestBed.createComponent(SearchDateRangeComponent);
        adapter = fixture.debugElement.injector.get(DateAdapter) as DateFnsAdapter;
        component = fixture.componentInstance;
    });

    afterEach(() => fixture.destroy());

    it('should use date-fns adapter', () => {
        fixture.detectChanges();

        expect(adapter instanceof DateFnsAdapter).toBe(true);
        const expectedFormat = DateFnsUtils.convertMomentToDateFnsFormat('DD/MM/YYYY');
        expect(component.datePickerFormat).toBe(expectedFormat);
    });

    it('should setup form elements on init', () => {
        fixture.detectChanges();

        expect(component.from).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should check the format of the date from component', () => {
        component.settings = { field: 'cm:created', dateFormat: DateFnsUtils.convertMomentToDateFnsFormat(dateFormatFixture) };
        fixture.detectChanges();

        expect(component.datePickerFormat).toBe(DateFnsUtils.convertMomentToDateFnsFormat(dateFormatFixture));
    });

    it('should setup form control with formatted valid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: DateFnsUtils.convertMomentToDateFnsFormat(dateFormatFixture) };
        fixture.detectChanges();

        const inputString = '20-feb-18';
        const dateFromInput = DateFnsUtils.parseDate(inputString, DateFnsUtils.convertMomentToDateFnsFormat(dateFormatFixture));

        expect(isValid(dateFromInput)).toBeTruthy();

        component.onChangedHandler({ value: inputString }, component.from);

        expect(component.from.value.toString()).toEqual(dateFromInput.toString());
    });

    it('should NOT setup form control with invalid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: DateFnsUtils.convertMomentToDateFnsFormat(dateFormatFixture) };
        fixture.detectChanges();

        const inputString = '20.f.18';
        const dateFromInput = DateFnsUtils.parseDate(inputString, DateFnsUtils.convertMomentToDateFnsFormat(dateFormatFixture));

        expect(isValid(dateFromInput)).toBeFalsy();

        component.onChangedHandler({ value: inputString }, component.from);

        expect(component.from.value.toString()).not.toEqual(dateFromInput.toString());
    });

    it('should reset form', () => {
        fixture.detectChanges();
        component.form.setValue({ from: fromDate, to: toDate });

        expect(component.from.value).toEqual(fromDate);
        expect(component.to.value).toEqual(toDate);

        component.reset();

        expect(component.from.value).toEqual('');
        expect(component.to.value).toEqual('');
        expect(component.form.value).toEqual({ from: '', to: '' });
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

        const startDate = startOfDay(new Date(fromDate)).toISOString();
        const endDate = endOfDay(new Date(toDate)).toISOString();

        const expectedQuery = `cm:created:['${startDate}' TO '${endDate}']`;

        expect(context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(context.update).toHaveBeenCalled();
    });

    it('should show date-format error when Invalid found', async () => {
        fixture.detectChanges();

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        input.value = '10-05-18';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.INVALID-DATE');
    });

    it('should not show date-format error when valid found', async () => {
        fixture.detectChanges();

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="date-range-from-input"]');
        input.value = '10/10/2018';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('');
    });

    it('should have no maximum date by default', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.debugElement.nativeElement.querySelector('input[ng-reflect-max]')).toBeNull();
    });

    it('should be able to set a fixed maximum date', async () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture, maxDate };
        fixture.detectChanges();

        const inputs = fixture.debugElement.nativeElement.querySelectorAll('input[ng-reflect-max="Tue Mar 10 2020 23:59:59 GMT+0"]');

        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).not.toBeNull();
        expect(inputs[1]).toBeDefined();
        expect(inputs[1]).not.toBeNull();
    });

    it('should be able to set the maximum date to today', async () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture, maxDate: 'today' };
        fixture.detectChanges();
        const today = endOfToday().toString().slice(0,30);

        const inputs = fixture.debugElement.nativeElement.querySelectorAll('input[ng-reflect-max="' + today + '"]');

        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).not.toBeNull();
        expect(inputs[1]).toBeDefined();
        expect(inputs[1]).not.toBeNull();
    });
});
