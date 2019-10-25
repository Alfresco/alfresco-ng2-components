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

import { DynamicTableColumn } from './dynamic-table-column.model';
import { DynamicTableRow } from './dynamic-table-row.model';
import { DynamicRowValidationSummary } from './dynamic-row-validation-summary.model';

export interface CellValidator {

    isSupported(column: DynamicTableColumn): boolean;
    validate(row: DynamicTableRow, column: DynamicTableColumn, summary?: DynamicRowValidationSummary): boolean;

}
