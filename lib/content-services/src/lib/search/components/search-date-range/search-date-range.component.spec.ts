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
import moment, { Moment } from 'moment';
import { startOfDay, endOfDay, parse } from 'date-fns';

describe('SearchDateRangeComponent', () => {
    let fixture: ComponentFixture<SearchDateRangeComponent>;
    let component: SearchDateRangeComponent;
    const fromDate = '2016-10-16';
    const toDate = '2017-10-16';
    const dateFormatFixture = 'DD-MMM-YY';

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

        const inputString = '20-feb-18';
        const momentFromInput = moment(inputString, dateFormatFixture);

        expect(momentFromInput.isValid()).toBeTruthy();

        component.onChangedHandler({ value: momentFromInput } as MatDatepickerInputEvent<Moment>, component.from);

        expect(component.from.value.toString()).toEqual(momentFromInput.toString());
    });

    it('should NOT setup form control with invalid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
        fixture.detectChanges();

        const inputString = '20.f.18';
        const momentFromInput = moment(inputString, dateFormatFixture);

        expect(momentFromInput.isValid()).toBeFalsy();

        component.onChangedHandler({ value: momentFromInput } as MatDatepickerInputEvent<Moment>, component.from);

        expect(component.from.value).not.toEqual(momentFromInput);
    });

    it('should reset form', () => {
        const from = moment(fromDate);
        const to = moment(toDate);

        fixture.detectChanges();
        component.form.setValue({ from, to });

        expect(component.from.value).toEqual(from);
        expect(component.to.value).toEqual(to);

        component.reset();

        expect(component.from.value).toBeNull();
        expect(component.to.value).toBeNull();
        expect(component.form.value).toEqual({ from: null, to: null });
    });

    it('should reset fromMaxDate on reset', () => {
        fixture.detectChanges();
        component.fromMaxDate = moment(fromDate);
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
            from: moment(fromDate),
            to: moment(toDate)
        }, true);

        const startDate = startOfDay(parse(fromDate, 'yyyy-MM-dd', new Date())).toISOString();
        const endDate = endOfDay(parse(toDate, 'yyyy-MM-dd', new Date())).toISOString();

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

        expect(component.maxDate).toBeUndefined();
    });

    it('should be able to set a fixed maximum date', async () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture, maxDate: '10-Mar-20' };
        fixture.detectChanges();

        const expected = endOfDay(new Date(2020, 2, 10));
        expect(component.maxDate.toDate()).toEqual(expected);
    });

    it('should be able to set the maximum date to today', async () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture, maxDate: 'today' };
        fixture.detectChanges();
        const today = endOfDay(new Date());

        expect(component.maxDate.toDate()).toEqual(today);
    });
});
