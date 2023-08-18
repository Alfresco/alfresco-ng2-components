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

import { Injectable } from '@angular/core';
import { DateRangeFilter, DateCloudFilterType } from '../../models/date-cloud-filter.model';
import { add, endOfDay, endOfMonth, endOfQuarter, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from 'date-fns';

@Injectable({
    providedIn: 'root'
})
export class DateRangeFilterService {

    currentDate = new Date();

    getDateRange(type: DateCloudFilterType): DateRangeFilter {
        switch (type) {
            case DateCloudFilterType.TODAY: return this.getTodayDateRange();
            case DateCloudFilterType.TOMORROW: return this.getTomorrowDateRange();
            case DateCloudFilterType.NEXT_7_DAYS: return this.getNext7DaysDateRange();
            case DateCloudFilterType.WEEK: return this.getCurrentWeekRange();
            case DateCloudFilterType.MONTH: return this.getCurrentMonthDateRange();
            case DateCloudFilterType.QUARTER: return this.getQuarterDateRange();
            case DateCloudFilterType.YEAR: return this.getCurrentYearDateRange();
            default: return this.resetDateRange();
        }
    }

    isDateRangeType(type: DateCloudFilterType) {
        return type === DateCloudFilterType.RANGE;
    }

    private resetDateRange(): DateRangeFilter {
        return {
            startDate: null,
            endDate: null
        };
    }

    private getNext7DaysDateRange(): DateRangeFilter {
        return {
            startDate: startOfDay(new Date()).toISOString(),
            endDate: add(endOfDay(new Date()), { days: 7 }).toISOString()
        };
    }

    private getTomorrowDateRange(): DateRangeFilter {
        return {
            startDate: endOfDay(new Date()).toISOString(),
            endDate: add(endOfDay(new Date()), { days: 1 }).toISOString()
        };
    }

    private getCurrentYearDateRange(): DateRangeFilter {
        return {
            startDate: startOfYear(new Date()).toISOString(),
            endDate: endOfYear(new Date()).toISOString()
        };
    }

    private getTodayDateRange(): DateRangeFilter {
        return {
            startDate: startOfDay(new Date()).toISOString(),
            endDate: endOfDay(new Date()).toISOString()
        };
    }

    private getCurrentWeekRange(): DateRangeFilter {
        return  {
            startDate: startOfWeek(new Date()).toISOString(),
            endDate: endOfWeek(new Date()).toISOString()
        };
    }

    private getCurrentMonthDateRange(): DateRangeFilter {
        return {
            startDate: startOfMonth(new Date()).toISOString(),
            endDate: endOfMonth(new Date()).toISOString()
        };
    }

    private getQuarterDateRange(): DateRangeFilter {
        return {
            startDate: startOfQuarter(new Date()).toISOString(),
            endDate: endOfQuarter(new Date()).toISOString()
        };
    }
}
