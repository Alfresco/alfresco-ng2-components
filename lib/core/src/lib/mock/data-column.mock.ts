/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { mockPathInfos } from '../datatable/components/mocks/datatable.mock';

export const textColumnRows = [{ firstname: 'John' }, { firstname: 'Henry' }, { firstname: 'David' }, { firstname: 'Thomas' }];

export const dateColumnRows = [
    { createdOn: new Date(2016, 6, 1, 11, 8, 4) },
    { createdOn: new Date(2018, 4, 3, 12, 8, 4) },
    { createdOn: new Date(2021, 2, 3, 9, 8, 4) }
];

const aMinuteInMilliseconds = 60 * 1000;
const anHourInMilliseconds = 60 * aMinuteInMilliseconds;
const aDayInMilliseconds = 24 * anHourInMilliseconds;

export const dateColumnTimeAgoRows = [
    { modifiedOn: new Date() },
    { modifiedOn: new Date(Date.now() - 44 * aMinuteInMilliseconds) },
    { modifiedOn: new Date(Date.now() - 45 * aMinuteInMilliseconds) },
    { modifiedOn: new Date(Date.now() - 23 * anHourInMilliseconds) },
    { modifiedOn: new Date(Date.now() - 7 * aDayInMilliseconds) },
    { modifiedOn: new Date(Date.now() - 8 * aDayInMilliseconds) }
];

export const locationColumnRows = [
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

export const booleanColumnRows = [{ bool: 'true' }, { bool: 'false' }, { bool: true }, { bool: false }];

export const iconColumnRows = [{ icon: 'alarm' }, { icon: 'folder_open' }, { icon: 'accessibility' }];

export const imageColumnRows = [{ image: 'material-icons://image' }, { image: 'material-icons://image' }, { image: 'material-icons://image' }];

export const fileSizeColumnRows = [{ size: 12313 }, { size: 23 }, { size: 42421412421 }];

export const amountColumnRows = [{ price: 1230 }, { price: 422.55 }, { price: 50000.7855332 }, { price: 0.123 }, { price: -2022.3321 }];

export const jsonColumnRows = [{ rowInfo: { id: 1, name: 'row1' } }, { rowInfo: { id: 2, name: 'row2' } }, { rowInfo: { id: 3, name: 'row3' } }];
