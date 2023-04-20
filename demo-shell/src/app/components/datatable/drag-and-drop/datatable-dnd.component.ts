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

/* cspell:disable */

import { Component, OnInit } from '@angular/core';
import { ObjectDataTableAdapter, DataSorting, NotificationService, DataTableDropEvent } from '@alfresco/adf-core';

const createdBy = {
    name: 'Administrator',
    email: 'admin@alfresco.com'
};

@Component({
    selector: 'app-datatable-dnd',
    templateUrl: './datatable-dnd.component.html'
})
export class DataTableDnDComponent implements OnInit {

    data: ObjectDataTableAdapter;

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.data = new ObjectDataTableAdapter(
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
                    createdBy,
                    icon: 'material-icons://folder_open',
                    json: null
                },
                {
                    id: 2,
                    name: 'Name 2',
                    createdOn: new Date(2016, 6, 2, 15, 8, 2),
                    createdBy,
                    icon: 'material-icons://accessibility',
                    json: null
                },
                {
                    id: 3,
                    name: 'Name 3',
                    createdOn: new Date(2016, 6, 2, 15, 8, 3),
                    createdBy,
                    icon: 'material-icons://alarm',
                    json: null
                },
                {
                    id: 4,
                    name: 'Image 8',
                    createdOn: new Date(2016, 6, 2, 15, 8, 4),
                    createdBy,
                    icon: 'material-icons://alarm'
                }
            ],
            [
                { type: 'image', key: 'icon', title: '', srTitle: 'Thumbnail' },
                { type: 'text', key: 'id', title: 'Id', sortable: true , cssClass: '' },
                { type: 'text', key: 'createdOn', title: 'Created On', sortable: true, cssClass: 'adf-ellipsis-cell adf-expand-cell-2' },
                { type: 'text', key: 'name', title: 'Name', cssClass: 'adf-ellipsis-cell', sortable: true },
                { type: 'text', key: 'createdBy.name', title: 'Created By', sortable: true, cssClass: ''}
            ]
        );

        this.data.setSorting(new DataSorting('id', 'asc'));
    }

    onDragOver(event: Event) {
        event.preventDefault();
    }

    onDrop(event: DataTableDropEvent) {
        event.preventDefault();

        const { column, target } = event.detail;
        const message = `Dropped data on [ ${column.key} ] ${target}`;

        this.notificationService.openSnackMessage(message);
    }
}
