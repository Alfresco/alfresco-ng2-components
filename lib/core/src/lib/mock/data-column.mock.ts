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

import { ObjectDataTableAdapter } from '../datatable/data/object-datatable-adapter';
import { DataColumn } from '../datatable/data/data-column.model';

export const getDataColumnMock = <T = unknown>(
    column: Partial<DataColumn<T>> = {}
): DataColumn<T> => ({
    id: 'columnId',
    key: 'key',
    type: 'text',
    format: 'format',
    sortable: false,
    title: 'title',
    srTitle: 'srTitle',
    cssClass: 'cssClass',
    template: undefined,
    copyContent: false,
    editable: false,
    focus: false,
    sortingKey: 'sortingKey',
    header: undefined,
    draggable: false,
    isHidden: false,
    customData: undefined,
    ...column
});

export const dataText = new ObjectDataTableAdapter([
    { id: '1 first' },
    { id: '2 second' },
    { id: '3 third' }
]);

export const dateRows = [
    { createdOn: new Date(2016, 6, 1, 11, 8, 4) },
    { createdOn: new Date(2018, 4, 3, 12, 8, 4) },
    { createdOn: new Date(2021, 2, 3, 9, 8, 4) }
];

export const dateColumns = {
    type: 'date',
    key: 'createdOn',
    title: 'Created On'
};

export const locationRows = [
    {
        path: {
            elements: [
                { id: '1', name: 'path' },
                { id: '2', name: 'to' },
                { id: '3', name: 'location' }
            ],
            name: '/path/to/location-link'
        }
    }
];

export const locationColumns = [
    { format: '/somewhere', type: 'location', key: 'path', title: 'Location' }
];

export const dataIcon = new ObjectDataTableAdapter([
    { icon: 'alarm' },
    { icon: 'folder_open' },
    { icon: 'accessibility' }
]);

export const dataSizeInBytes = new ObjectDataTableAdapter([
    { size: 12313 },
    { size: 23 },
    { size: 42421412421 }
]);
