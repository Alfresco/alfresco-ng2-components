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

import * as moment from 'moment';

export class DateUtil {

    static formatDate(dateFormat: string, date: Date = new Date(), days: number | string = 0): string {
        return moment(date).add(days, 'days').format(dateFormat);
    }

    static parse(date: string, dateFormat: string = 'DD-MM-YY'): Date {
        return moment(date, dateFormat).toDate();
    }
}
