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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateCellComponent } from './date-cell.component';
import { DataColumn, DateConfig } from '../../data/data-column.model';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from '../../../app-config';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

let component: DateCellComponent;
let appConfigService: AppConfigService;
let fixture: ComponentFixture<DateCellComponent>;
let testingUtils: UnitTestingUtils;

let mockDate;
let mockTooltip = '';
const mockColumn: DataColumn = {
    key: 'mock-date',
    type: 'date',
    format: 'full'
};

const renderDateCell = (dateConfig: DateConfig, value: number | string | Date, tooltip: string) => {
    component.value$ = new BehaviorSubject<number | string | Date>(value);
    component.dateConfig = dateConfig;
    component.tooltip = tooltip;

    fixture.detectChanges();
};

const checkDisplayedDate = (expectedDate: string) => {
    const displayedDate = testingUtils.getByCSS('span').nativeElement.textContent.trim();

    expect(displayedDate).toBeTruthy();
    expect(displayedDate).toBe(expectedDate);
};

const checkDisplayedTooltip = (expectedTooltip: string) => {
    const displayedTooltip = testingUtils.getByCSS('span').nativeElement.title;

    expect(displayedTooltip).toBeTruthy();
    expect(displayedTooltip).toBe(expectedTooltip);
};

const configureTestingModule = (providers: any[]) => {
    TestBed.configureTestingModule({
        imports: [DateCellComponent],
        providers
    });
    fixture = TestBed.createComponent(DateCellComponent);
    component = fixture.componentInstance;
    testingUtils = new UnitTestingUtils(fixture.debugElement);

    appConfigService = TestBed.inject(AppConfigService);

    appConfigService.config = {
        dateValues: {
            defaultDateFormat: 'mediumDate',
            defaultTooltipDateFormat: 'long',
            defaultLocale: 'en-US'
        }
    };
};

describe('DateCellComponent', () => {
    beforeEach(() => {
        registerLocaleData(localePL);
        configureTestingModule([]);
        mockDate = new Date('2023-10-25T00:00:00');
        mockTooltip = mockDate.toISOString();
    });

    it('should set default date config', () => {
        expect(component.defaultDateConfig.format).toBe('medium');
        expect(component.defaultDateConfig.tooltipFormat).toBe('medium');
        expect(component.defaultDateConfig.locale).toBeUndefined();
    });

    it('should display date and tooltip with provided config', () => {
        const mockDateConfig: DateConfig = {
            format: 'short',
            tooltipFormat: 'shortDate'
        };

        const expectedDate = '10/25/23, 12:00 AM';
        const expectedTooltip = '10/25/23';

        renderDateCell(mockDateConfig, mockDate, mockTooltip);
        checkDisplayedDate(expectedDate);
        checkDisplayedTooltip(expectedTooltip);
    });
    //eslint-disable-next-line
    xit('should display date and tooltip with based on appConfig values if dateConfig is NOT provided', () => {
        const mockDateConfig: DateConfig = {};
        const expectedDate = 'Oct 25, 2023';
        const expectedTooltip = 'October 25, 2023 at 12:00:00 AM GMT+0';

        renderDateCell(mockDateConfig, mockDate, mockTooltip);
        checkDisplayedDate(expectedDate);
        checkDisplayedTooltip(expectedTooltip);

        expect(component.config.format).toEqual('mediumDate');
        expect(component.config.tooltipFormat).toEqual('long');
        expect(component.config.locale).toEqual('en-US');
    });

    it('should display date and tooltip with defaules values if NO dateConfig or appConfig is provided', () => {
        appConfigService.config = {
            dateValues: {}
        };
        const mockDateConfig: DateConfig = {};

        const expectedDate = 'Oct 25, 2023, 12:00:00 AM';
        const expectedTooltip = expectedDate;

        renderDateCell(mockDateConfig, mockDate, mockTooltip);
        checkDisplayedDate(expectedDate);
        checkDisplayedTooltip(expectedTooltip);
    });

    it('should display date with timeAgo format', () => {
        const mockDateConfig: DateConfig = {
            format: 'timeAgo'
        };
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const expectedDate = '1 day ago';

        renderDateCell(mockDateConfig, yesterday, mockTooltip);
        checkDisplayedDate(expectedDate);
    });

    it('should display date with timeAgo format if NO dateConfig and column format provided', () => {
        component.column = { ...mockColumn, format: 'timeAgo' };
        const mockDateConfig = undefined as any;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const expectedDate = '1 day ago';
        renderDateCell(mockDateConfig, yesterday, mockTooltip);
        checkDisplayedDate(expectedDate);
    });
    //eslint-disable-next-line
    xit('should display date with column format if dateConfig format is not provided', () => {
        component.column = mockColumn;
        const mockDateConfig: DateConfig = {
            tooltipFormat: 'short'
        };

        const expectedDate = 'Wednesday, October 25, 2023 at 12:00:00 AM GMT+00:00';

        renderDateCell(mockDateConfig, mockDate, mockTooltip);
        checkDisplayedDate(expectedDate);
    });

    it('should display date and override column format by dateConfig if is provided', () => {
        component.column = mockColumn;
        const mockDateConfig: DateConfig = {
            format: 'short'
        };

        const expectedDate = '10/25/23, 12:00 AM';

        renderDateCell(mockDateConfig, mockDate, mockTooltip);
        checkDisplayedDate(expectedDate);
    });

    it('should display date based on string', () => {
        const mockDateConfig: DateConfig = {
            format: 'short',
            tooltipFormat: 'short'
        };
        const mockStringDate = 'Oct 25, 2023';

        const expectedDate = '10/25/23, 12:00 AM';

        renderDateCell(mockDateConfig, mockStringDate, mockTooltip);
        checkDisplayedDate(expectedDate);
    });

    it('should display date based on timestamp', () => {
        const mockDateConfig: DateConfig = {
            format: 'short',
            tooltipFormat: 'short'
        };
        const mockTimestamp = Date.parse('Oct 25, 2023');

        const expectedDate = '10/25/23, 12:00 AM';

        renderDateCell(mockDateConfig, mockTimestamp, mockTooltip);
        checkDisplayedDate(expectedDate);
    });
});

describe('DateCellComponent locale', () => {
    it('should display date and tooltip with custom locale', () => {
        configureTestingModule([{ provide: LOCALE_ID, useValue: 'pl-PL' }]);
        registerLocaleData(localePL);

        const mockDateConfig: DateConfig = {
            format: 'short',
            tooltipFormat: 'medium',
            locale: 'pl-PL'
        };

        const expectedDate = '25.10.2023, 00:00';
        const expectedTooltip = '25 paź 2023, 00:00:00';

        renderDateCell(mockDateConfig, mockDate, mockTooltip);
        checkDisplayedDate(expectedDate);
        checkDisplayedTooltip(expectedTooltip);
    });
});
