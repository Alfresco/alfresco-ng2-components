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

import { DEFAULT_DATETIME_FORMAT, SearchDatetimeRangeComponent } from './search-datetime-range.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatetimepickerInputEvent } from '@mat-datetimepicker/core';
import { DateFnsUtils } from '@alfresco/adf-core';
import { isValid } from 'date-fns';


describe('SearchDatetimeRangeComponent', () => {
    let fixture: ComponentFixture<SearchDatetimeRangeComponent>;
    let component: SearchDatetimeRangeComponent;
    const fromDatetime = new Date('2016-10-16 12:30');
    const toDatetime = new Date('2017-10-16 20:00');
    const datetimeFormatFixture = 'DD-MMM-YY HH:mm'; // dd-MMM-yy HH:mm
    const maxDatetime = DateFnsUtils.parseDate('10-Mar-20 20:00', datetimeFormatFixture);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });
        fixture = TestBed.createComponent(SearchDatetimeRangeComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => fixture.destroy());

    it('should setup form elements on init', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.from).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should setup form control with formatted valid datetime on change', async () => {
        component.settings = { field: 'cm:created', datetimeFormat: datetimeFormatFixture };

        fixture.detectChanges();
        await fixture.whenStable();

        const inputString = '20-feb-18 20:00';
        const fromDate = DateFnsUtils.parseDate(inputString, datetimeFormatFixture);

        expect(isValid(fromDate)).toBeTrue();

        component.onChangedHandler({ value: fromDate } as MatDatetimepickerInputEvent<Date>, component.from);

        expect(component.from.value.toString()).toEqual(fromDate.toString());
    });

    it('should NOT setup form control with invalid datetime on change', async () => {
        component.settings = { field: 'cm:created', datetimeFormat: datetimeFormatFixture };

        fixture.detectChanges();
        await fixture.whenStable();

        component.onChangedHandler({ value: new Date('2017-10-16 20:f:00') } as MatDatetimepickerInputEvent<Date>, component.from);

        expect(component.from.value).toBeNull();
    });

    it('should reset form', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.form.setValue({
            from: fromDatetime,
            to: toDatetime
        });

        expect(component.from.value).toEqual(fromDatetime);
        expect(component.to.value).toEqual(toDatetime);

        component.reset();

        expect(component.from.value).toBeNull();
        expect(component.to.value).toBeNull();
        expect(component.form.value).toEqual({ from: null, to: null });
    });

    it('should reset fromMaxDatetime on reset', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.fromMaxDatetime = fromDatetime;
        component.reset();

        expect(component.fromMaxDatetime).toEqual(undefined);
    });

    it('should update query builder on reset', async () => {
        const context: any = {
            queryFragments: {
                createdDatetimeRange: 'query'
            },
            update: () => {}
        };

        component.id = 'createdDatetimeRange';
        component.context = context;

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        await fixture.whenStable();

        component.reset();

        expect(context.queryFragments.createdDatetimeRange).toEqual('');
        expect(context.update).toHaveBeenCalled();
    });

    it('should update the query in UTC format when values change', async () => {
        const context: any = {
            queryFragments: {},
            update: () => {}
        };

        component.id = 'createdDateRange';
        component.context = context;
        component.settings = { field: 'cm:created' };

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        await fixture.whenStable();

        component.apply({
            from: fromDatetime,
            to: toDatetime
        }, true);

        const expectedQuery = `cm:created:['2016-10-16T12:30:00.000Z' TO '2017-10-16T20:00:59.000Z']`;

        expect(context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(context.update).toHaveBeenCalled();
    });

    it('should be able to update the query in UTC format from a GMT format', async () => {
        const context: any = {
            queryFragments: {},
            update: () => {}
        };
        const fromInGmt = new Date('2021-02-24T17:00:00+02:00');
        const toInGmt = new Date('2021-02-28T15:00:00+02:00');

        component.id = 'createdDateRange';
        component.context = context;
        component.settings = { field: 'cm:created' };

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        await fixture.whenStable();

        component.apply({
            from: fromInGmt,
            to: toInGmt
        }, true);

        const expectedQuery = `cm:created:['2021-02-24T15:00:00.000Z' TO '2021-02-28T13:00:59.000Z']`;

        expect(context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(context.update).toHaveBeenCalled();
    });

    it('should show datetime-format error when an invalid datetime is set', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.onChangedHandler({ value: new Date('invalid') } as MatDatetimepickerInputEvent<Date>, component.from);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.INVALID-DATETIME');
    });

    it('should display date with default format in the input', async () => {
        component.settings = { field: 'cm:created' };

        fixture.detectChanges();
        await fixture.whenStable();

        component.onChangedHandler({ value: new Date() } as MatDatetimepickerInputEvent<Date>, component.from);

        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="datetime-range-from-input"]');
        const expected = DateFnsUtils.formatDate(new Date(), DEFAULT_DATETIME_FORMAT);
        expect(input.value).toBe(expected);
    });

    it('should have no maximum datetime by default', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.debugElement.nativeElement.querySelector('input[ng-reflect-max]')).toBeNull();
    });

    it('should be able to set a fixed maximum datetime', async () => {
        component.settings = { field: 'cm:created', datetimeFormat: datetimeFormatFixture, maxDatetime };

        fixture.detectChanges();
        await fixture.whenStable();

        const inputs = fixture.debugElement.nativeElement.querySelectorAll('input[ng-reflect-max="Tue Mar 10 2020 20:00:00 GMT+0"]');

        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).not.toBeNull();
        expect(inputs[1]).toBeDefined();
        expect(inputs[1]).not.toBeNull();
    });
});
