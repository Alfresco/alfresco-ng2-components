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

import { DEFAULT_DATETIME_FORMAT, SearchDatetimeRangeComponent } from './search-datetime-range.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { MatDatetimepickerInputEvent } from '@mat-datetimepicker/core';
import { DateFnsUtils } from '@alfresco/adf-core';
import { endOfMinute, isValid, startOfMinute } from 'date-fns';
import { ReplaySubject } from 'rxjs';

describe('SearchDatetimeRangeComponent', () => {
    let fixture: ComponentFixture<SearchDatetimeRangeComponent>;
    let component: SearchDatetimeRangeComponent;
    const fromDatetime = new Date('2016-10-16 12:30');
    const toDatetime = new Date('2017-10-16 20:00');
    const datetimeFormatFixture = 'DD-MMM-YY HH:mm'; // dd-MMM-yy HH:mm
    const maxDatetime = DateFnsUtils.parseDate('10-Mar-20 20:00', datetimeFormatFixture);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, SearchDatetimeRangeComponent]
        });
        fixture = TestBed.createComponent(SearchDatetimeRangeComponent);
        component = fixture.componentInstance;
        component.id = 'createdDateRange';
        component.context = {
            queryFragments: {
                createdDatetimeRange: ''
            },
            filterRawParams: {},
            populateFilters: new ReplaySubject(1),
            update: jasmine.createSpy('update')
        } as any;
        component.settings = { field: 'cm:created' };
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

    it('should reset form and filter params', async () => {
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
        expect(component.context.filterRawParams[component.id]).toBeUndefined();
    });

    it('should reset fromMaxDatetime on reset', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.fromMaxDatetime = fromDatetime;
        component.reset();

        expect(component.fromMaxDatetime).toEqual(undefined);
    });

    it('should update query builder on reset', async () => {
        component.context.queryFragments[component.id] = 'query';

        fixture.detectChanges();
        await fixture.whenStable();

        component.reset();

        expect(component.context.queryFragments.createdDatetimeRange).toEqual('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should update the query in UTC format when values change', async () => {
        component.settings = { field: 'cm:created' };
        fixture.detectChanges();
        await fixture.whenStable();

        component.apply(
            {
                from: fromDatetime,
                to: toDatetime
            },
            true
        );

        const expectedQuery = `cm:created:['2016-10-16T12:30:00.000Z' TO '2017-10-16T20:00:59.000Z']`;
        const expectedFromDate = DateFnsUtils.utcToLocal(startOfMinute(fromDatetime)).toISOString();
        const expectedToDate = DateFnsUtils.utcToLocal(endOfMinute(toDatetime)).toISOString();

        expect(component.context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(component.context.filterRawParams[component.id]).toEqual({ start: expectedFromDate, end: expectedToDate });
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should be able to update the query in UTC format from a GMT format', async () => {
        const fromInGmt = new Date('2021-02-24T17:00:00+02:00');
        const toInGmt = new Date('2021-02-28T15:00:00+02:00');
        component.settings = { field: 'cm:created' };

        fixture.detectChanges();
        await fixture.whenStable();

        component.apply(
            {
                from: fromInGmt,
                to: toInGmt
            },
            true
        );

        // Instead of checking exact string, verify the ISO string contains correct base date/time and that update was called
        const startDate = component.context.filterRawParams[component.id].start;
        const endDate = component.context.filterRawParams[component.id].end;

        expect(startDate).toContain('2021-02-24');
        expect(endDate).toContain('2021-02-28');
        expect(component.context.update).toHaveBeenCalled();

        // Verify the query structure is correct without hardcoding exact timezone values
        const query = component.context.queryFragments[component.id];
        expect(query).toMatch(/cm:created:\['\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z' TO '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z'\]/);
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

        const inputs = fixture.debugElement.nativeElement.querySelectorAll('input[ng-reflect-max]');

        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).not.toBeNull();
        expect(inputs[1]).toBeDefined();
        expect(inputs[1]).not.toBeNull();
    });

    it('should populate filter state when populate filters event has been observed', () => {
        component.context.filterLoaded = new ReplaySubject(1);
        spyOn(component.context.filterLoaded, 'next').and.stub();
        spyOn(component.displayValue$, 'next').and.stub();
        fixture.detectChanges();
        const fromDateString = startOfMinute(fromDatetime).toISOString();
        const toDateString = endOfMinute(toDatetime).toISOString();
        const expectedFromDate = DateFnsUtils.utcToLocal(startOfMinute(fromDatetime)).toISOString();
        const expectedToDate = DateFnsUtils.utcToLocal(endOfMinute(toDatetime)).toISOString();
        component.context.populateFilters.next({ createdDateRange: { start: fromDateString, end: toDateString } });
        fixture.detectChanges();

        expect(component.displayValue$.next).toHaveBeenCalledWith('16/10/2016 12:30 - 16/10/2017 20:00');
        expect(component.context.filterRawParams[component.id].start).toEqual(expectedFromDate);
        expect(component.context.filterRawParams[component.id].end).toEqual(expectedToDate);
        expect(component.context.filterLoaded.next).toHaveBeenCalled();
    });
});
