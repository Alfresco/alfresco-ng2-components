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

import { MatDateFormats } from '@angular/material/core';

/**
 * Provides date/time display formatting for the cloud components.
 *
 * Notes for developers: display formats are different from the storage formats.
 * Components have a fixed format for saving dates and datetime values,
 * while dynamic format for UI display.
 */
export const CLOUD_FORM_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'dd-MM-yyyy'
    },
    display: {
        dateInput: 'dd-MM-yyyy',
        monthLabel: 'LLL',
        monthYearLabel: 'LLL uuuu',
        dateA11yLabel: 'PP',
        monthYearA11yLabel: 'LLLL uuuu'
    }
};
