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
import { mockPathInfos } from '../datatable/components/mocks/datatable.mock';

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
        path: mockPathInfos[0]
    },
    {
        path: mockPathInfos[1]
    },
    {
        path: mockPathInfos[2]
    }
];

export const dataLocation = new ObjectDataTableAdapter(locationRows);

export const dataBoolean = new ObjectDataTableAdapter([
    { bool: 'true' },
    { bool: 'false' },
    { bool: true },
    { bool: false }
]);

export const dataIcon = new ObjectDataTableAdapter([
    { icon: 'alarm' },
    { icon: 'folder_open' },
    { icon: 'accessibility' }
]);

export const dataImage = new ObjectDataTableAdapter([
    { image: 'material-icons://image' },
    { image: 'material-icons://image' },
    { image: 'material-icons://image' }
]);

export const dataSizeInBytes = new ObjectDataTableAdapter([
    { size: 12313 },
    { size: 23 },
    { size: 42421412421 }
]);

export const dataAmount = new ObjectDataTableAdapter([
    { price: 1230 },
    { price: 422.55 },
    { price: 50000.7855332 },
    { price: 0.123 },
    { price: -2022.3321 }
]);
