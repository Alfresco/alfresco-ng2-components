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
import { MomentDateAdapter, setupTestBed } from '@alfresco/adf-core';
import { DateAdapter } from '@angular/material/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let moment: any;

describe('SearchDateRangeComponent', () => {
    let fixture: ComponentFixture<SearchDateRangeComponent>;
    let component: SearchDateRangeComponent;
    let adapter: MomentDateAdapter;
    const fromDate = '2016-10-16';
    const toDate = '2017-10-16';
    const maxDate = '10-Mar-20';
    const dateFormatFixture = 'DD-MMM-YY';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchDateRangeComponent);
        adapter = fixture.debugElement.injector.get(DateAdapter) as MomentDateAdapter;
        component = fixture.componentInstance;
    });

    afterEach(() => fixture.destroy());

    it('should use moment adapter', () => {
        fixture.detectChanges();

        expect(adapter instanceof MomentDateAdapter).toBe(true);
        expect(component.datePickerFormat).toBe('DD/MM/YYYY');
    });

    it('should setup form elements on init', () => {
        fixture.detectChanges();

        expect(component.from).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should setup the format of the date from configuration', () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
        fixture.detectChanges();

        expect(adapter.overrideDisplayFormat).toBe(dateFormatFixture);
    });

    it('should setup form control with formatted valid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
        fixture.detectChanges();

        const inputString = '20-feb-18';
        const momentFromInput = moment(inputString, dateFormatFixture);

        expect(momentFromInput.isValid()).toBeTruthy();

        component.onChangedHandler({ value: inputString }, component.from);

        expect(component.from.value.toString()).toEqual(momentFromInput.toString());
    });

    it('should NOT setup form control with invalid date on change', () => {
        component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
        fixture.detectChanges();

        const inputString = '20.f.18';
        const momentFromInput = moment(inputString, dateFormatFixture);

        expect(momentFromInput.isValid()).toBeFalsy();

        component.onChangedHandler({ value: inputString }, component.from);

        expect(component.from.value.toString()).not.toEqual(momentFromInput.toString());
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

        const startDate = moment(fromDate).startOf('day').format();
        const endDate = moment(toDate).endOf('day').format();

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
        const today = adapter.today().endOf('day').toString().slice(0, -3);

        const inputs = fixture.debugElement.nativeElement.querySelectorAll('input[ng-reflect-max="' + today + '"]');

        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).not.toBeNull();
        expect(inputs[1]).toBeDefined();
        expect(inputs[1]).not.toBeNull();
    });
});
