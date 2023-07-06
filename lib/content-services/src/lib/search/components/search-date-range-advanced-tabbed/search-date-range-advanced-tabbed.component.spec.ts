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
import { DateRangeType } from "./search-date-range-advanced/date-range-type";
import { InLastDateType } from "./search-date-range-advanced/in-last-date-type";
import { endOfDay, formatISO, parse, startOfDay } from "date-fns";
import { By } from '@angular/platform-browser';

@Component({
    selector: 'adf-search-filter-tabbed',
    template: ``
})
class MockSearchFilterTabbedComponent {}

@Component({
    selector: 'adf-search-date-range-advanced',
    template: ``
})
class MockSearchDateRangeAdvancedComponent {
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
    let createdDateRangeComponent: SearchDateRangeAdvancedComponent;
    // let modifiedDateRangeComponent: SearchDateRangeAdvancedComponent;
    let mockData = {
        dateRangeType: DateRangeType.BETWEEN,
        inLastValueType: InLastDateType.DAYS,
        inLastValue: undefined,
        betweenStartDate: parse('05-Jun-23', 'dd-MMM-yy', new Date()),
        betweenEndDate: parse('07-Jun-23', 'dd-MMM-yy', new Date())
    }

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
                'createdDate': 'Created Date',
                'modifiedDate': 'Modified Date'
            }
        };
        component.tabsValidity = {
            'createdDate': true,
            'modifiedDate': true
        };
        fixture.detectChanges();

        const searchDateRangeAdvancedComponentList = fixture.debugElement.queryAll(By.directive(SearchDateRangeAdvancedComponent));
        createdDateRangeComponent = searchDateRangeAdvancedComponentList.find(searchDateRangeAdvancedComponent => (searchDateRangeAdvancedComponent.componentInstance as SearchDateRangeAdvancedComponent).field === 'createdDate').componentInstance;
        // modifiedDateRangeComponent = searchDateRangeAdvancedComponentList.find(searchDateRangeAdvancedComponent => searchDateRangeAdvancedComponent.attributes['field'] === 'modifiedDate').componentInstance;
    });

    it('should update displayValue when values are submitted', () => {
        spyOn(component.displayValue$, 'next');
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledWith('CREATED DATE: 05-Jun-23 - 07-Jun-23');

        mockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.WEEKS,
            inLastValue: 5,
            betweenStartDate: null,
            betweenEndDate: null
        }
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledWith('CREATED DATE: SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.WEEKS');

        mockData = {
            dateRangeType: DateRangeType.ANY,
            inLastValueType: InLastDateType.DAYS,
            inLastValue: null,
            betweenStartDate: null,
            betweenEndDate: null
        }
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should update query when values are changed', () => {
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        let query = `createdDate:['${formatISO(startOfDay(mockData.betweenStartDate))}' TO '${formatISO(endOfDay(mockData.betweenEndDate))}']`;
        expect(component.combinedQuery).toEqual(query);

        mockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.DAYS,
            inLastValue: 5,
            betweenStartDate: null,
            betweenEndDate: null
        }
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        query = `createdDate:[NOW/DAY-5DAYS TO NOW/DAY+1DAY]`;
        expect(component.combinedQuery).toEqual(query);

        mockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.WEEKS,
            inLastValue: 7,
            betweenStartDate: null,
            betweenEndDate: null
        }
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        query = `createdDate:[NOW/DAY-7WEEKS TO NOW/DAY+1DAY]`;
        expect(component.combinedQuery).toEqual(query);

        mockData = {
            dateRangeType: DateRangeType.IN_LAST,
            inLastValueType: InLastDateType.MONTHS,
            inLastValue: 9,
            betweenStartDate: null,
            betweenEndDate: null
        }
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        query = `createdDate:[NOW/DAY-9MONTHS TO NOW/DAY+1DAY]`;
        expect(component.combinedQuery).toEqual(query);

        mockData = {
            dateRangeType: DateRangeType.ANY,
            inLastValueType: InLastDateType.DAYS,
            inLastValue: null,
            betweenStartDate: null,
            betweenEndDate: null
        }
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        expect(component.combinedQuery).toEqual('');
    });

    it('should trigger context.update() when values are submitted', () => {
        createdDateRangeComponent.changed.emit(mockData);
        fixture.detectChanges();
        component.submitValues();
        fixture.detectChanges();
        const query = `createdDate:['${formatISO(startOfDay(mockData.betweenStartDate))}' TO '${formatISO(endOfDay(mockData.betweenEndDate))}']`;
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
