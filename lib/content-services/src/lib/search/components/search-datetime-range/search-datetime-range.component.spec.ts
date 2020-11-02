/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { SearchDatetimeRangeComponent } from './search-datetime-range.component';
import { setupTestBed } from '@alfresco/adf-core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let moment: any;

describe('SearchDatetimeRangeComponent', () => {
    let fixture: ComponentFixture<SearchDatetimeRangeComponent>;
    let component: SearchDatetimeRangeComponent;
    const fromDatetime = '2016-10-16 12:30';
    const toDatetime = '2017-10-16 20:00';
    const maxDatetime = '10-Mar-20 20:00';
    const datetimeFormatFixture = 'DD-MMM-YY HH:mm';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchDatetimeRangeComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => fixture.destroy());

    it('should setup form elements on init', () => {
        fixture.detectChanges();

        expect(component.from).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should setup form control with formatted valid datetime on change', () => {
        component.settings = { field: 'cm:created', datetimeFormat: datetimeFormatFixture };
        fixture.detectChanges();

        const inputString = '20-feb-18 20:00';
        const momentFromInput = moment(inputString, datetimeFormatFixture);

        expect(momentFromInput.isValid()).toBeTruthy();

        component.onChangedHandler({ value: inputString }, component.from);

        expect(component.from.value.toString()).toEqual(momentFromInput.toString());
    });

    it('should NOT setup form control with invalid datetime on change', () => {
        component.settings = { field: 'cm:created', datetimeFormat: datetimeFormatFixture };
        fixture.detectChanges();

        const inputString = '2017-10-16 20:f:00';
        const momentFromInput = moment(inputString, datetimeFormatFixture);

        expect(momentFromInput.isValid()).toBeFalsy();

        component.onChangedHandler({ value: inputString }, component.from);

        expect(component.from.value.toString()).not.toEqual(momentFromInput.toString());
    });

    it('should reset form', () => {
        fixture.detectChanges();
        component.form.setValue({ from: fromDatetime, to: toDatetime });

        expect(component.from.value).toEqual(fromDatetime);
        expect(component.to.value).toEqual(toDatetime);

        component.reset();

        expect(component.from.value).toEqual('');
        expect(component.to.value).toEqual('');
        expect(component.form.value).toEqual({ from: '', to: '' });
    });

    it('should reset fromMaxDatetime on reset', () => {
        fixture.detectChanges();
        component.fromMaxDatetime = fromDatetime;
        component.reset();

        expect(component.fromMaxDatetime).toEqual(undefined);
    });

    it('should update query builder on reset', () => {
        const context: any = {
            queryFragments: {
                createdDatetimeRange: 'query'
            },
            update() {
            }
        };

        component.id = 'createdDatetimeRange';
        component.context = context;

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        component.reset();

        expect(context.queryFragments.createdDatetimeRange).toEqual('');
        expect(context.update).toHaveBeenCalled();
    });

    it('should update query builder on value changes', () => {
        const context: any = {
            queryFragments: {},
            update() {
            }
        };

        component.id = 'createdDateRange';
        component.context = context;
        component.settings = { field: 'cm:created' };

        spyOn(context, 'update').and.stub();

        fixture.detectChanges();
        component.apply({
            from: fromDatetime,
            to: toDatetime
        }, true);

        const startDate = moment(fromDatetime).startOf('minute').format();
        const endDate = moment(toDatetime).endOf('minute').format();

        const expectedQuery = `cm:created:['${startDate}' TO '${endDate}']`;

        expect(context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(context.update).toHaveBeenCalled();
    });

    it('should show datetime-format error when an invalid datetime is set', async () => {
        fixture.detectChanges();
        component.onChangedHandler({ value: '10/14/2020 10:00:00 PM' }, component.from);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toEqual('SEARCH.FILTER.VALIDATION.INVALID-DATETIME');
    });

    it('should not show datetime-format error when valid found', async () => {
        fixture.detectChanges();
        const input = fixture.debugElement.nativeElement.querySelector('[data-automation-id="datetime-range-from-input"]');
        input.value = '10/16/2017 9:00 PM';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.getFromValidationMessage()).toBeFalsy();
    });

    it('should have no maximum datetime by default', async(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.querySelector('input[ng-reflect-max]')).toBeNull();
    }));

    it('should be able to set a fixed maximum datetime', async () => {
        component.settings = { field: 'cm:created', datetimeFormat: datetimeFormatFixture, maxDatetime: maxDatetime };
        fixture.detectChanges();

        const inputs = fixture.debugElement.nativeElement.querySelectorAll('input[ng-reflect-max="Tue Mar 10 2020 20:00:00 GMT+0"]');

        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).not.toBeNull();
        expect(inputs[1]).toBeDefined();
        expect(inputs[1]).not.toBeNull();
    });
});
