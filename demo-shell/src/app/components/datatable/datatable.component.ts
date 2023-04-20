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

import { Component, Input, ViewChild } from '@angular/core';
import {
    DataCellEvent,
    DataColumn,
    DataRow,
    DataRowActionEvent,
    DataSorting,
    ObjectDataColumn,
    ObjectDataRow,
    ObjectDataTableAdapter
} from '@alfresco/adf-core';

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
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss']
})
export class DataTableComponent {

    @Input()
    selectionMode = 'single';

    @ViewChild('customColumnHeaderTemplate') customColumnHeaderTemplate;

    multiselect = false;
    data: FilteredDataAdapter;
    stickyHeader = false;

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    private imageUrl = 'http://placehold.it/140x100';
    private createdBy: any = {
        name: 'Administrator',
        email: 'admin@alfresco.com'
    };

    constructor() {
        this.reset();
    }

    resolver(row: DataRow, col: DataColumn): any {
        const value = row.getValue(col.key);
        if (col.key === 'users') {
            return (value || []).map(user => `${user.firstName} ${user.lastName}`).toString();
        }

        if (col.key === 'status') {
            const users = row.getValue('users');
            return (value || []).map((status, index) => ({ name: `${users[index].firstName} ${users[index].lastName}`, status }));
        }

        return value;
    }

    /* spellchecker: disable */
    reset() {
        this.data = new FilteredDataAdapter(
            [
                {
                    id: 1,
                    name: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident,
                            sunt in culpa qui officia deserunt mollit anim id est laborum.`,
                    createdOn: new Date(2016, 6, 2, 15, 8, 1),
                    createdBy: this.createdBy,
                    icon: 'material-icons://folder_open',
                    json: null,
                    users: [
                        {
                            firstName: 'Super',
                            lastName: 'Man'
                        },
                        {
                            firstName: 'Iron',
                            lastName: 'Man'
                        }
                    ],
                    status: [
                        'I am here to save the world.. By world means AMERICA',
                        'That nobody is John Wick…'
                    ]
                },
                {
                    id: 2,
                    name: 'Name 2',
                    createdOn: new Date(2016, 6, 2, 15, 8, 2),
                    createdBy: this.createdBy,
                    icon: 'material-icons://accessibility',
                    json: null,
                    users: [
                        {
                            firstName: 'Mister',
                            lastName: 'Bean'
                        },
                        {
                            firstName: 'Doctor',
                            lastName: 'Strange'
                        }
                    ],
                    status: [
                        'I am here to save the world.. By world means AMERICA',
                        'That nobody is John Wick…'
                    ]
                },
                {
                    id: 3,
                    name: 'Name 3',
                    createdOn: new Date(2016, 6, 2, 15, 8, 3),
                    createdBy: this.createdBy,
                    icon: 'material-icons://alarm',
                    json: null,
                    users: [
                        {
                            firstName: 'Thunder',
                            lastName: 'Thor'
                        },
                        {
                            firstName: 'Marvel',
                            lastName: 'Avenger'
                        }
                    ],
                    status: [
                        'I am here to save the world.. By world means AMERICA',
                        'That nobody is John Wick…'
                    ]
                },
                {
                    id: 4,
                    name: 'Image 8',
                    createdOn: new Date(2016, 6, 2, 15, 8, 4),
                    createdBy: this.createdBy,
                    icon: 'material-icons://alarm',
                    json: {
                        id: 4,
                        name: 'Image 8',
                        createdOn: new Date(2016, 6, 2, 15, 8, 4),
                        createdBy: {
                            name: 'Felipe',
                            lastName: 'Melo'
                        },
                        icon: 'material-icons://alarm'
                    },
                    users: [
                        {
                            firstName: 'Spider',
                            lastName: 'Man'
                        },
                        {
                            firstName: '17',
                            lastName: 'Again'
                        }
                    ],
                    status: [
                        'I am here to save the world.. By world means AMERICA',
                        'That nobody is John Wick…'
                    ]
                },
                {
                    id: 5,
                    name: 'I am using custom resolver',
                    createdOn: new Date(2016, 6, 2, 15, 8, 4),
                    createdBy: this.createdBy,
                    icon: 'material-icons://person_outline',
                    users: [
                        {
                            firstName: 'Captain',
                            lastName: 'America'
                        },
                        {
                            firstName: 'John',
                            lastName: 'Wick'
                        }
                    ],
                    status: [
                        'I am here to save the world.. By world means AMERICA',
                        'That nobody is John Wick…'
                    ]
                }
            ],
            [
                { type: 'image', key: 'icon', title: '', srTitle: 'Thumbnail' },
                { type: 'text', key: 'id', title: 'Id', sortable: true , cssClass: '', draggable: true},
                { type: 'date', key: 'createdOn', title: 'Created On', sortable: true, cssClass: 'adf-ellipsis-cell adf-expand-cell-2', draggable: true },
                { type: 'text', key: 'name', title: 'Name', cssClass: 'adf-ellipsis-cell', sortable: true, draggable: true },
                { type: 'text', key: 'createdBy.name', title: 'Created By', sortable: true, cssClass: '', draggable: true},
                { type: 'json', key: 'json', title: 'Json', cssClass: 'adf-expand-cell-2', draggable: true},
                { type: 'text', key: 'users', title: 'Users', cssClass: 'adf-expand-cell-2', draggable: true},
                { type: 'json', key: 'status', title: 'Status', cssClass: 'adf-expand-cell-2', draggable: true}
            ]
        );

        this.data.setSorting(new DataSorting('id', 'asc'));
    }
    /* spellchecker: enable */

    addRow() {
        const id = this.data.getRows().length + 1;
        const row = new ObjectDataRow({
            id,
            name: 'Name ' + id,
            createdOn: new Date(),
            icon: 'material-icons://extension',
            createdBy: this.createdBy
        });
        this.data.getRows().push(row);
        this.data.sort();
    }

    replaceRows() {
        const objects = [
            {
                id: 10,
                name: 'Name 10',
                createdBy: this.createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 5),
                icon: 'material-icons://face'
            },
            {
                id: 11,
                name: 'Name 11',
                createdBy: this.createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 6),
                icon: 'material-icons://language'
            },
            {
                id: 12,
                name: 'Name 12',
                createdBy: this.createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 7),
                icon: 'material-icons://pets'
            },
            {
                id: 13,
                name: 'Image 13',
                createdBy: this.createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 8),
                icon: this.imageUrl
            }
        ];
        const rows = objects.map((obj) => new ObjectDataRow(obj));
        this.data.setRows(rows);
    }

    replaceColumns() {
        const schema = [
            { type: 'text', key: 'id', title: 'Id', sortable: true },
            { type: 'text', key: 'name', title: 'Name', sortable: true, cssClass: 'full-width name-column' }
        ];
        const columns = schema.map((col) => new ObjectDataColumn(col));
        this.data.setColumns(columns);
    }

    showCustomHeaderColumn() {
        const columns = this.data.getColumns().map(column => {
            if (column.title === 'Users') {
                return {
                    ...column,
                    header: this.customColumnHeaderTemplate
                };
            }

            return column;
        });

        this.data.setColumns(columns);
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        const myAction = {
            title: 'Hello'
            // you custom metadata needed for onExecuteRowAction
        };
        event.value.actions = [
            myAction
        ];
    }

    onColumnsVisibilityChange(columns: DataColumn[]): void {
        this.data.setColumns(columns);
    }

    onExecuteRowAction(event: DataRowActionEvent) {
        const args = event.value;
        window.alert(`My custom action: ${args.action.title}`);
    }

    toggleStickyHeader() {
        this.stickyHeader = !this.stickyHeader;
    }
}
