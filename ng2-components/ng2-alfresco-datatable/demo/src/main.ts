/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter,
    DataSorting,
    ObjectDataRow,
    ObjectDataColumn
} from 'ng2-alfresco-datatable/dist/ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-datatable-demo',
    template: `
        <div class="container">
            <div class="p-10">
                <alfresco-datatable [data]="data" [multiselect]="multiselect"></alfresco-datatable>
            </div>
            <div class="p-10">
                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
                    <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" [(ngModel)]="multiselect">
                    <span class="mdl-checkbox__label">Multiselect</span>
                </label>
            </div>
            <div class="p-10">
                <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                    (click)="reset()">
                    Reset to default
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                    (click)="addRow()">
                    Add row
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                    (click)="replaceRows()">
                    Replace rows
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                    (click)="replaceColumns()">
                    Replace columns
                </button>
            </div>
        </div>
    `,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ],
    directives: [ALFRESCO_DATATABLE_DIRECTIVES]
})
class DataTableDemo {

    multiselect: boolean = false;
    data: ObjectDataTableAdapter;

    private _imageUrl: string = 'http://placehold.it/140x100';
    private _createdBy: any = {
        name: 'Denys Vuika',
        email: 'denys.vuika@alfresco.com'
    };

    constructor() {
        this.reset();
    }

    reset() {
        this.data = new ObjectDataTableAdapter(
            [
                {id: 1, name: 'Name 1', createdBy: this._createdBy, icon: 'material-icons://folder_open'},
                {id: 2, name: 'Name 2', createdBy: this._createdBy, icon: 'material-icons://accessibility'},
                {id: 3, name: 'Name 3', createdBy: this._createdBy, icon: 'material-icons://alarm'},
                {id: 4, name: 'Image 1', createdBy: this._createdBy, icon: this._imageUrl}
            ],
            [
                {type: 'image', key: 'icon', title: '', srTitle: 'Thumbnail'},
                {type: 'text', key: 'id', title: 'Id', sortable: true},
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'createdBy.name', title: 'Created By', sortable: true}
            ]
        );

        this.data.setSorting(new DataSorting('id', 'asc'));
    }

    addRow() {
        let id = this.data.getRows().length + 1;
        let row = new ObjectDataRow({
            id: id,
            name: 'Name ' + id,
            icon: 'material-icons://extension',
            createdBy: this._createdBy
        });
        this.data.getRows().push(row);
        this.data.sort();
    }

    replaceRows() {
        let objects = [
            {id: 10, name: 'Name 10', createdBy: this._createdBy, icon: 'material-icons://face'},
            {id: 11, name: 'Name 11', createdBy: this._createdBy, icon: 'material-icons://language'},
            {id: 12, name: 'Name 12', createdBy: this._createdBy, icon: 'material-icons://pets'},
            {id: 13, name: 'Image 13', createdBy: this._createdBy, icon: this._imageUrl}
        ];
        let rows = objects.map(obj => new ObjectDataRow(obj));
        this.data.setRows(rows);
    }

    replaceColumns() {
        let schema = [
            { type: 'text', key: 'id', title: 'Id', sortable: true },
            { type: 'text', key: 'name', title: 'Name', sortable: true, cssClass: 'full-width name-column' }
        ];
        let columns = schema.map(col => new ObjectDataColumn(col));
        this.data.setColumns(columns);
    }
}

bootstrap(DataTableDemo, []);
