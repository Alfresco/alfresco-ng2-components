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

/* eslint-disable @angular-eslint/component-selector */

import { CellValidator } from './cell-validator.model';
import { DynamicRowValidationSummary } from './dynamic-row-validation-summary.model';
import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';
import { isValid } from 'date-fns';

export class DateCellValidator implements CellValidator {
    static DATE_TYPE = 'Date';

    private supportedTypes: string[] = [DateCellValidator.DATE_TYPE];

    isSupported(column: DynamicTableColumn): boolean {
        return !!(column?.editable && this.supportedTypes.indexOf(column?.type) > -1);
    }

    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean {
        if (this.isSupported(column)) {
            const value = row?.value[column.id];

            if (value) {
                const dateValue = new Date(value);

                if (isValid(dateValue)) {
                    return true;
                }

                if (summary) {
                    summary.isValid = false;
                    summary.message = `Invalid '${column.name}' format.`;
                }

                return false;
            } else {
                return !column.required;
            }
        }

        return true;
    }
}
