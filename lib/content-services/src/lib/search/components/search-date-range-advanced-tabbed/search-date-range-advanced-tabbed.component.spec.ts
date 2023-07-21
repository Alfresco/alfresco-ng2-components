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
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchDateRangeAdvanced } from './search-date-range-advanced/search-date-range-advanced';
import { SearchFilterTabbedComponent } from '../search-filter-tabbed/search-filter-tabbed.component';
import { SearchDateRangeAdvancedComponent } from './search-date-range-advanced/search-date-range-advanced.component';
import { SearchDateRangeAdvancedTabbedComponent } from './search-date-range-advanced-tabbed.component';
import { DateRangeType } from './search-date-range-advanced/date-range-type';
import { InLastDateType } from './search-date-range-advanced/in-last-date-type';
import {
    endOfDay,
    endOfToday,
    formatISO,
    parse,
    startOfDay, startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks
} from 'date-fns';

@Component({
    selector: 'adf-search-filter-tabbed',
    template: ``
})
export class MockSearchFilterTabbedComponent {}

@Component({
    selector: 'adf-search-date-range-advanced',
    template: ``
})
export class MockSearchDateRangeAdvancedComponent {
    @Input()
    dateFormat: string;
    @Input()
    maxDate: string;
    @Input()
    field: string;
    @Input()
    initialValue: SearchDateRangeAdvanced;

    @Output()
    changed = new EventEmitter<Partial<SearchDateRangeAdvanced>>();
    @Output()
    valid = new EventEmitter<boolean>();
}
describe('SearchDateRangeAdvancedTabbedComponent', () => {
    let component: SearchDateRangeAdvancedTabbedComponent;
    let fixture: ComponentFixture<SearchDateRangeAdvancedTabbedComponent>;
    let betweenMockData: SearchDateRangeAdvanced;
    let inLastMockData: SearchDateRangeAdvanced;
    let anyMockDate: SearchDateRangeAdvanced;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchDateRangeAdvancedTabbedComponent, SearchFilterTabbedComponent, SearchDateRangeAdvancedComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            providers: [
                { provide: SearchFilterTabbedComponent, useClass: MockSearchFilterTabbedComponent },
                { provide: SearchDateRangeAdvancedComponent, useClass: MockSearchDateRangeAdvancedComponent }
            ]
        });
        fixture = TestBed.createComponent(SearchDateRangeAdvancedTabbedComponent);

        component = fixture.componentInstance;
        component.id = 'dateRangeAdvanced';
        component.context = {
            queryFragments: {
                dateRangeAdvanced: ''
            },
            update: jasmine.createSpy('update')
        } as any;
        component.settings = {
            hideDefaultAction: false,
            dateFormat: 'dd-MMM-yy',
            maxDate: 'today',
            field: 'createdDate, modifiedDate',
            displayedLabelsByField: {
                createdDate: 'Created Date',
                modifiedDate: 'Modified Date'
            }
        };
        component.tabsValidity = {
            createdDate: true,
            modifiedDate: true
        };

        betweenMockData = {
            dateRangeType: DateRangeType.BETWEEN,
            inLastValueType: InLastDateType.DAYS,
            inLastValue: undefined,
            betweenStartDate: parse('05-Jun-23', 'dd-MMM-yy', new Date()),
            betweenEndDate: parse('07-Jun-23', 'dd-MMM-yy', new Date())
        };
        inLastMockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.WEEKS,
            inLastValue: '5',
            betweenStartDate: undefined,
            betweenEndDate: undefined
        };
        anyMockDate = {
            dateRangeType: DateRangeType.ANY,
            inLastValueType: InLastDateType.DAYS,
            inLastValue: null,
            betweenStartDate: null,
            betweenEndDate: null
        };

        fixture.detectChanges();
    });

    it('should be able to generate separate fields on init', () => {
        fixture.detectChanges();
        expect(component.fields.length).toBe(2);
        expect(component.fields).toEqual(['createdDate', 'modifiedDate']);
    });

    it('should return hasValidValue as false if any of the fields has an invalid value', () => {
        component.tabsValidity['createdDate'] = false;
        fixture.detectChanges();
        expect(component.hasValidValue()).toBeFalse();
        fixture.detectChanges();
        component.tabsValidity['modifiedDate'] = false;
        fixture.detectChanges();
        expect(component.hasValidValue()).toBeFalse();
        component.tabsValidity['createdDate'] = true;
        component.tabsValidity['modifiedDate'] = true;
        fixture.detectChanges();
        expect(component.hasValidValue()).toBeTrue();
    });

    it('should update displayValue when values are submitted', () => {
        spyOn(component.displayValue$, 'next');
        component.onDateRangedValueChanged(betweenMockData, 'createdDate');
        component.onDateRangedValueChanged(inLastMockData, 'modifiedDate');
        fixture.detectChanges();
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledWith('CREATED DATE: 05-Jun-23 - 07-Jun-23 MODIFIED DATE: SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.WEEKS');

        component.onDateRangedValueChanged(anyMockDate, 'createdDate');
        component.onDateRangedValueChanged(anyMockDate, 'modifiedDate');
        fixture.detectChanges();
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should update query when values are changed', () => {
        component.onDateRangedValueChanged(betweenMockData, 'createdDate');
        component.onDateRangedValueChanged(inLastMockData, 'modifiedDate');
        fixture.detectChanges();
        let inLastStartDate = startOfWeek(subWeeks(new Date(), 5));
        let query = `createdDate:['${formatISO(startOfDay(betweenMockData.betweenStartDate))}' TO '${formatISO(endOfDay(betweenMockData.betweenEndDate))}']` +
         ` AND modifiedDate:['${formatISO(startOfDay(inLastStartDate))}' TO '${formatISO(endOfToday())}']`;
        expect(component.combinedQuery).toEqual(query);

        inLastMockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.DAYS,
            inLastValue: '9',
            betweenStartDate: null,
            betweenEndDate: null
        };
        component.onDateRangedValueChanged(inLastMockData, 'modifiedDate');
        fixture.detectChanges();
        inLastStartDate = startOfDay(subDays(new Date(), 9));
        query = `createdDate:['${formatISO(startOfDay(betweenMockData.betweenStartDate))}' TO '${formatISO(endOfDay(betweenMockData.betweenEndDate))}']` +
         ` AND modifiedDate:['${formatISO(startOfDay(inLastStartDate))}' TO '${formatISO(endOfToday())}']`;
        expect(component.combinedQuery).toEqual(query);

        inLastMockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.MONTHS,
            inLastValue: '7',
            betweenStartDate: null,
            betweenEndDate: null
        };
        component.onDateRangedValueChanged(inLastMockData, 'modifiedDate');
        fixture.detectChanges();
        inLastStartDate = startOfMonth(subMonths(new Date(), 7));
        query = `createdDate:['${formatISO(startOfDay(betweenMockData.betweenStartDate))}' TO '${formatISO(endOfDay(betweenMockData.betweenEndDate))}']` +
         ` AND modifiedDate:['${formatISO(startOfDay(inLastStartDate))}' TO '${formatISO(endOfToday())}']`;
        expect(component.combinedQuery).toEqual(query);
        expect(component.combinedQuery).toEqual(query);

        component.onDateRangedValueChanged(anyMockDate, 'createdDate');
        component.onDateRangedValueChanged(anyMockDate, 'modifiedDate');
        fixture.detectChanges();
        expect(component.combinedQuery).toEqual('');
    });

    it('should trigger context.update() when values are submitted', () => {
        component.onDateRangedValueChanged(betweenMockData, 'createdDate');
        component.onDateRangedValueChanged(inLastMockData, 'modifiedDate');
        fixture.detectChanges();
        component.submitValues();
        fixture.detectChanges();
        const inLastStartDate = startOfWeek(subWeeks(new Date(), 5));
        const query = `createdDate:['${formatISO(startOfDay(betweenMockData.betweenStartDate))}' TO '${formatISO(endOfDay(betweenMockData.betweenEndDate))}']` +
         ` AND modifiedDate:['${formatISO(startOfDay(inLastStartDate))}' TO '${formatISO(endOfToday())}']`;
        expect(component.context.queryFragments['dateRangeAdvanced']).toEqual(query);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should clear values and search filter when widget is reset', () => {
        spyOn(component.displayValue$, 'next');
        component.reset();
        fixture.detectChanges();
        expect(component.combinedQuery).toBe('');
        expect(component.combinedDisplayValue).toBe('');
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
        expect(component.context.queryFragments['dateRangeAdvanced']).toEqual('');
        expect(component.context.update).toHaveBeenCalled();
    });
});
