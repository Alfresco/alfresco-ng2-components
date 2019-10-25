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

import moment from 'moment-es6';
import { CellValidator } from './cell-validator.model';
import { DynamicRowValidationSummary } from './dynamic-row-validation-summary.model';
import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';

export class DateCellValidator implements CellValidator {

    private supportedTypes: string[] = [
        'Date'
    ];

    isSupported(column: DynamicTableColumn): boolean {
        return column && column.editable && this.supportedTypes.indexOf(column.type) > -1;
    }

    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean {

        if (this.isSupported(column)) {
            const value = row.value[column.id];

            if (!value && !column.required) {
                return true;
            }

            const dateValue = moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSSZ', true);
            if (!dateValue.isValid()) {
                if (summary) {
                    summary.isValid = false;
                    summary.message = `Invalid '${column.name}' format.`;
                }
                return false;
            }
        }

        return true;
    }
}
