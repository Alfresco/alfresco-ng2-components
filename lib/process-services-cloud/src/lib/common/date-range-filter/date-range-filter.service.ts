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
import moment from 'moment';
import { DateRangeFilter, DateCloudFilterType } from '../../models/date-cloud-filter.model';

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
            startDate: moment().startOf('day').toISOString(true),
            endDate: moment().add(7, 'days').endOf('day').toISOString(true)
        };
    }

    private getTomorrowDateRange(): DateRangeFilter {
        return {
            startDate: moment().endOf('day').toISOString(true),
            endDate: moment().add(1, 'days').endOf('day').toISOString(true)
        };
    }

    private getCurrentYearDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('year').toISOString(true),
            endDate: moment().endOf('year').toISOString(true)
        };
    }

    private getTodayDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('day').toISOString(true),
            endDate: moment().endOf('day').toISOString(true)
        };
    }

    private getCurrentWeekRange(): DateRangeFilter {
        return  {
            startDate: moment().startOf('week').toISOString(true),
            endDate: moment().endOf('week').toISOString(true)
        };
    }

    private getCurrentMonthDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('month').toISOString(true),
            endDate: moment().endOf('month').toISOString(true)
        };
    }

    private getQuarterDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('quarter').toISOString(true),
            endDate: moment().endOf('quarter').toISOString(true)
        };
    }
}
