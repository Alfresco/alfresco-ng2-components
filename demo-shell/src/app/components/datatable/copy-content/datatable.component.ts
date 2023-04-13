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

import { Component, Input } from '@angular/core';
import { DataColumn, DataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';

export class FilteredDataAdapter extends ObjectDataTableAdapter {

    filterValue = '';
    filterKey = 'name';

    getRows(): Array<DataRow> {
        let rows = super.getRows();
        const filter = (this.filterValue || '').trim().toLowerCase();

        if (this.filterKey && filter) {
            rows = rows.filter((row) => {
                const value = row.getValue(this.filterKey);
                if (value !== undefined && value !== null) {
                    const stringValue: string = value.toString().trim().toLowerCase();
                    return stringValue.startsWith(filter);
                }
                return false;
            });
        }
        return rows;
    }

    constructor(data?: any[], schema?: DataColumn[]) {
        super(data, schema);
    }
}

@Component({
    selector: 'app-datatable',
    templateUrl: './datatable.component.html'
})
export class DataTableComponent {

    @Input()
    selectionMode = 'single';

    dataForCopy = new FilteredDataAdapter(
    [
        {
            id: 1,
            name: 'First',
            createdBy: 'Created one',
            json: null
        },
        {
            id: 2,
            name: 'Second',
            createdBy: 'Created two',
            json: {
                id: 4
            }
        },
        {
            id: 3,
            name: 'Third',
            createdBy: 'Created three',
            json: {
                id: 4,
                name: 'Image 8',
                createdOn: new Date(2016, 6, 2, 15, 8, 4)
            }
        }
    ]
);
    data = new FilteredDataAdapter(
    [
        {
            id: 1,
            name: 'Name 1',
            createdBy: 'Created One',
            icon: 'material-icons://folder_open',
            json: null
        },
        {
            id: 2,
            name: 'Name 2',
            createdBy: 'Created Two',
            icon: 'material-icons://accessibility',
            json: null
        },
        {
            id: 3,
            name: 'Name 3',
            createdBy: 'Created Three',
            icon: 'material-icons://alarm',
            json: null
        },
        {
            id: 4,
            name: 'Image 8',
            createdBy: 'Created Four',
            icon: 'material-icons://alarm',
            json: {
                id: 4,
                name: 'Image 8',
                createdOn: new Date(2016, 6, 2, 15, 8, 4),
                createdBy: {
                    name: 'Felipe',
                    lastname: 'Melo'
                },
                icon: 'material-icons://alarm'
            }
        }
    ],
    [
        { type: 'image', key: 'icon', title: '', srTitle: 'Thumbnail' },
        { type: 'text', key: 'id', title: 'Id', sortable: true , cssClass: '', copyContent: true },
        { type: 'text', key: 'name', title: 'Name', cssClass: 'adf-ellipsis-cell', sortable: true, copyContent: false },
        { type: 'text', key: 'createdBy', title: 'Created By', sortable: true, cssClass: ''},
        { type: 'json', key: 'json', title: 'Json', cssClass: 'adf-expand-cell-2', copyContent: true}
    ]
);
}
