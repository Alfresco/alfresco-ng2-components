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
    CardViewArrayItemModel,
    CardViewBoolItemModel,
    CardViewDateItemModel,
    CardViewDatetimeItemModel,
    CardViewIntItemModel,
    CardViewKeyValuePairsItemModel,
    CardViewMapItemModel,
    CardViewSelectItemModel,
    CardViewTextItemModel
} from '../public-api';
import { of } from 'rxjs';

export const cardViewDataSource = [
    new CardViewTextItemModel({
        label: 'CardView Text Item - Multivalue (chips)',
        value: [1, 2, 3, 4],
        key: 'name',
        default: 'default bar',
        multiline: true,
        multivalued: true,
        icon: 'icon',
        editable: true
    }),
    new CardViewDateItemModel({
        label: 'CardView Date Item - Multivalue (chips)',
        value: [new Date(1983, 11, 24, 10, 0, 30)],
        key: 'date',
        default: new Date(1983, 11, 24, 10, 0, 30),
        format: 'shortDate',
        editable: true,
        multivalued: true
    }),
    new CardViewDatetimeItemModel({
        label: 'CardView Datetime Item - Multivalue (chips)',
        value: [new Date(1983, 11, 24, 10, 0, 0)],
        key: 'datetime',
        default: new Date(1983, 11, 24, 10, 0, 0),
        format: 'short',
        editable: true,
        multivalued: true
    }),
    new CardViewBoolItemModel({
        label: 'Agree to all terms and conditions',
        value: true,
        key: 'boolean',
        default: false,
        editable: true
    }),
    new CardViewIntItemModel({
        label: 'CardView Int Item',
        value: 213,
        key: 'int',
        default: 1,
        editable: true
    }),
    new CardViewKeyValuePairsItemModel({
        label: 'CardView Key-Value Pairs Item',
        value: [
            { name: 'hey', value: 'you' },
            { name: 'hey', value: 'you' }
        ],
        key: 'key-value-pairs',
        editable: true
    }),
    new CardViewSelectItemModel({
        label: 'CardView Select Item',
        value: 'one',
        options$: of([
            { key: 'one', label: 'One' },
            { key: 'two', label: 'Two' }
        ]),
        key: 'select',
        editable: true
    }),
    new CardViewMapItemModel({
        label: 'My map',
        value: new Map([['999', 'My Value']]),
        key: 'map',
        default: 'default map value'
    }),
    new CardViewTextItemModel({
        label: 'This is clickable ',
        value: 'click here',
        key: 'click',
        default: 'click here',
        editable: true,
        clickable: true,
        icon: 'close'
    }),
    new CardViewArrayItemModel({
        label: 'CardView Array of items',
        value: of([
            { icon: 'directions_bike', value: 'Zlatan' },
            { icon: 'directions_bike', value: 'Lionel Messi' },
            { value: 'Mohamed', directions_bike: 'save' },
            { value: 'Ronaldo' }
        ]),
        key: 'array',
        icon: 'edit',
        default: 'Empty',
        noOfItemsToDisplay: 2,
        editable: true
    })
];

export const cardViewUndefinedValues = [
    new CardViewTextItemModel({
        label: 'CardView Text Item - Multivalue (chips)',
        value: undefined,
        key: 'name',
        default: undefined,
        multiline: true,
        multivalued: true,
        icon: 'icon',
        editable: true
    }),
    new CardViewDateItemModel({
        label: 'CardView Date Item - Multivalue (chips)',
        value: undefined,
        key: 'date',
        default: undefined,
        format: 'shortDate',
        editable: true,
        multivalued: true
    }),
    new CardViewDatetimeItemModel({
        label: 'CardView Datetime Item - Multivalue (chips)',
        value: undefined,
        key: 'datetime',
        default: undefined,
        format: 'short',
        editable: true,
        multivalued: true
    }),
    new CardViewIntItemModel({
        label: 'CardView Int Item',
        value: undefined,
        key: 'int',
        default: undefined,
        editable: true
    }),
    new CardViewSelectItemModel({
        label: 'CardView Select Item',
        value: undefined,
        options$: of([
            { key: 'one', label: 'One' },
            { key: 'two', label: 'Two' }
        ]),
        key: 'select',
        editable: true
    }),
    new CardViewMapItemModel({
        label: 'My map',
        value: undefined,
        key: 'map',
        default: undefined
    }),
    new CardViewTextItemModel({
        label: 'This is clickable ',
        value: undefined,
        key: 'click',
        default: undefined,
        editable: true,
        clickable: true,
        icon: 'close'
    })
];
