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

/* tslint:disable:component-selector  */

import { CellValidator } from './cell-validator.model';
import { DynamicRowValidationSummary } from './dynamic-row-validation-summary.model';
import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';

export class NumberCellValidator implements CellValidator {

    private supportedTypes: string[] = [
        'Number',
        'Amount'
    ];

    isSupported(column: DynamicTableColumn): boolean {
        return column && column.required && this.supportedTypes.indexOf(column.type) > -1;
    }

    isNumber(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        }

        return !isNaN(+value);
    }

    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean {

        if (this.isSupported(column)) {
            const value = row.value[column.id];
            if (value === null ||
                value === undefined ||
                value === '' ||
                this.isNumber(value)) {
                return true;
            }

            if (summary) {
                summary.isValid = false;
                summary.message = `Field '${column.name}' must be a number.`;
            }
            return false;
        }
        return true;
    }
}
