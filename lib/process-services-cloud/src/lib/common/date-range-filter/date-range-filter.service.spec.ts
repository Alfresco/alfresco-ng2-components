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

import { TestBed } from '@angular/core/testing';
import { DateRangeFilterService } from './date-range-filter.service';
import { DateCloudFilterType } from '../../models/date-cloud-filter.model';
import { add, endOfDay, endOfMonth, endOfQuarter, endOfYear, startOfDay, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';

describe('Date Range Filter service', () => {

    let service: DateRangeFilterService;

    beforeEach(() => {
        service = TestBed.inject(DateRangeFilterService);
    });

    it('should return today range', () => {
        const expectedDate = {
            startDate: startOfDay(new Date()).toISOString(),
            endDate: endOfDay(new Date()).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.TODAY)).toEqual(expectedDate);
    });

    it('should return month range', () => {
        const expectedDate = {
            startDate: startOfMonth(new Date()).toISOString(),
            endDate: endOfMonth(new Date()).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.MONTH)).toEqual(expectedDate);
    });

    it('should return year range', () => {
        const expectedDate = {
            startDate: startOfYear(new Date()).toISOString(),
            endDate: endOfYear(new Date()).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.YEAR)).toEqual(expectedDate);
    });

    it('should return quarter range', () => {
        const expectedDate = {
            startDate: startOfQuarter(new Date()).toISOString(),
            endDate: endOfQuarter(new Date()).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.QUARTER)).toEqual(expectedDate);
    });

    it('should reset date range when no_date type is selected', () => {
        const expectedDate = {
            startDate: null,
            endDate: null
        };
        expect(service.getDateRange(DateCloudFilterType.NO_DATE)).toEqual(expectedDate);
    });

    it('should return tomorow range', () => {
        const expectedDate = {
            startDate: endOfDay(new Date()).toISOString(),
            endDate: add(endOfDay(new Date()), { days: 1 }).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.TOMORROW)).toEqual(expectedDate);
    });

    it('should return next 7 days range', () => {
        const expectedDate = {
            startDate: startOfDay(new Date()).toISOString(),
            endDate: add(endOfDay(new Date()), { days: 7 }).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.NEXT_7_DAYS)).toEqual(expectedDate);
    });
});
