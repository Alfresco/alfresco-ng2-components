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

export enum DateCloudFilterType {
    NO_DATE = 'NO_DATE',
    TODAY = 'TODAY',
    TOMORROW = 'TOMORROW',
    NEXT_7_DAYS = 'NEXT_7_DAYS',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
    RANGE = 'RANGE'
}

export interface DateRangeFilter {
    startDate: Date;
    endDate: Date;
}
export interface RangeKeys {
    from: string;
    to: string;
}
