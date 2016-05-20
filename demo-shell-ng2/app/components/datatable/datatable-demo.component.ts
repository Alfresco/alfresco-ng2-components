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

import { Component } from 'angular2/core';
import { AlfrescoPipeTranslate } from 'ng2-alfresco-core/services';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter, 
    DataSorting,
    ObjectDataRow
} from 'ng2-alfresco-datatable/ng2-alfresco-datatable';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'datatable-demo',
    templateUrl: './datatable-demo.component.html',
    directives: [ALFRESCO_DATATABLE_DIRECTIVES],
    pipes: [AlfrescoPipeTranslate]
})
export class DataTableDemoComponent {
    data: ObjectDataTableAdapter;

    private _imageUrl: string = 'http://placehold.it/140x100';
    private _createdBy: any = {
        name: 'Denys Vuika',
        email: 'denys.vuika@alfresco.com'
    };

    constructor() {
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
}
