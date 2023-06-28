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

import { SearchDateRangeAdvancedTabbedComponent } from './search-date-range-advanced-tabbed.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    SearchDateRangeAdvancedComponent,
    SearchFilterTabbedComponent,
    SearchWidgetSettings
} from '@alfresco/adf-content-services';
import { SearchDateRangeAdvanced } from './search-date-range-advanced/search-date-range-advanced';

@Component({
    selector: 'adf-search-filter-tabbed',
    template: ``
})
export class MockSearchFilterTabbedComponent {
    @Input()
    settings: SearchWidgetSettings;
    @Input()
    queries: { [key: string]: string } = {};
    @Input()
    valuesToDisplay: { [key: string]: string } = {};
    @Output()
    fieldsChanged = new EventEmitter<string[]>();
    @Output()
    displayedLabelsByFieldTranslated = new EventEmitter<{ [key: string]: string }>();
    @Output()
    queriesCombined = new EventEmitter<string>();
    @Output()
    valuesToDisplayCombined = new EventEmitter<string>();
}

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
    updatedQuery = new EventEmitter<string>();
    @Output()
    updatedDisplayValue = new EventEmitter<string>();
    @Output()
    changed = new EventEmitter<Partial<SearchDateRangeAdvanced>>();
    @Output()
    valid = new EventEmitter<boolean>();
}
describe('SearchDateRangeAdvancedTabbedComponent', () => {
    let component: SearchDateRangeAdvancedTabbedComponent;
    let fixture: ComponentFixture<SearchDateRangeAdvancedTabbedComponent>;

    async function clickApplyBtn() {
        const applyBtn: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="date-range-advanced-btn-apply"]')).nativeElement;
        applyBtn.click();
        fixture.detectChanges();
        await fixture.whenStable();
    }

    async function clickResetBtn() {
        const clearBtn: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="date-range-advanced-btn-clear"]')).nativeElement;
        clearBtn.click();
        fixture.detectChanges();
        await fixture.whenStable();
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
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
            maxDate: 'oday',
            field: 'test-field-1, test-field-2',
            displayedLabelsByField: {
                'test-field-1': 'Test Field 1',
                'test-field-2': 'Test Field 2'
            }
        };
        component.tabsValidity = {
            'test-field-1': true,
            'test-field-2': true
        };
        fixture.detectChanges();
    });

    it('should update displayValue when values are submitted', async () => {
        spyOn(component.displayValue$, 'next');
        component.combinedValuesToDisplay = 'test-combined-values-to-display';
        await clickApplyBtn();
        expect(component.displayValue$.next).toHaveBeenCalledWith('test-combined-values-to-display');
    });

    it('should clear values when widget is reset', async () => {
        spyOn(component.displayValue$, 'next');
        component.combinedValuesToDisplay = 'test-combined-values-to-display';
        await clickResetBtn();
        await fixture.whenStable();
        expect(component.queries).toEqual({'test-field-1': '', 'test-field-2': ''});
        expect(component.valuesToDisplay).toEqual({'test-field-1': '', 'test-field-2': ''});
        expect(component.context.queryFragments[component.id]).toEqual('');
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should trigger context.update() when when values are submitted', async () => {
        component.combinedQuery = 'test-combined-query';
        await clickApplyBtn();
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should update displayLabels by field from settings object', () => {
        component.settings = {
            field: 'test-field-1, test-field-2',
            displayedLabelsByField: {
                'test-field-1': 'Test Field 1',
                'test-field-2': 'Test Field 2'
            }
        };
        fixture.detectChanges();
        expect(component.displayedLabelsByField).not.toBeNull();
        expect(component.displayedLabelsByField['test-field-1']).toBe('Test Field 1');
        expect(component.displayedLabelsByField['test-field-2']).toBe('Test Field 2');
    });

    it('should update array of fields from settings object', () => {
        component.settings = {
            field: 'test-field-1, test-field-2, test-field-3'
        };
        fixture.detectChanges();
        expect(component.fields.length).toBe(3);
        expect(component.fields).toContain('test-field-1');
        expect(component.fields).toContain('test-field-2');
        expect(component.fields).toContain('test-field-3');
    });
});
