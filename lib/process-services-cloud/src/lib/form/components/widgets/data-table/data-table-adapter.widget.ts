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

import {
    ObjectDataTableAdapter,
    DataColumn,
    DataRow
} from '@alfresco/adf-core';

export class WidgetDataTableAdapter extends ObjectDataTableAdapter {

    private rows: DataRow[];
    private columns: DataColumn[];

    constructor(data?: any[], schema?: DataColumn[]) {
        super(data, schema);
        this.rows = super.getRows();
        this.columns = super.getColumns();
    }

    getRows(): DataRow[] {
        if (this.isDataSourceValid()) {
            return this.rows;
        }

        return [];
    }

    isDataSourceValid(): boolean {
        return this.hasAllColumnsLinkedToData() && this.hasAllMandatoryColumnPropertiesHaveValues();
    }

    private hasAllMandatoryColumnPropertiesHaveValues(): boolean {
        return this.columns.every(column => !!column.key);
    }

    private hasAllColumnsLinkedToData(): boolean {
        const availableColumnKeys: string[] = this.columns.map(column => column.key);

        return availableColumnKeys.every(columnKey => this.rows.some(row => Object.keys(row.obj).includes(columnKey)));
    }
}
