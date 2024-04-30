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

import { DataColumn } from '../data-column.model';

export const mockPersonData = [
    {
        person: {
            personData: {
                'address.[data]test': {
                    street: '1234 Main St',
                    city: 'Springfield'
                }
            },
            name: 'John Doe',
            phoneNumbers: [
                {
                    type: 'home',
                    phoneNumber: '123-456-7890'
                },
                {
                    type: 'work',
                    phoneNumber: '098-765-4321'
                }
            ]
        }
    },
    {
        person: {
            personData: {
                'address.[data]test': {
                    street: '731 Second St',
                    city: 'Westlake'
                }
            },
            name: 'Sam Smith',
            phoneNumbers: [
                {
                    type: 'home',
                    phoneNumber: '123-456-7891'
                },
                {
                    type: 'work',
                    phoneNumber: '321-654-1987'
                }
            ]
        }
    }
];

export const mockPersonSchema: DataColumn[] = [
    {
        type: 'json',
        key: 'person.personData.[address.[data]test]',
        title: 'Address',
        sortable: true,
        draggable: true
    },
    {
        type: 'text',
        key: 'person.name',
        title: 'Name',
        sortable: true,
        draggable: true
    },
    {
        type: 'json',
        key: 'person.phoneNumbers',
        title: 'Phone numbers',
        sortable: true,
        draggable: true
    }
];
