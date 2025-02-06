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

export const mockPersonsData = [
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
            ],
            cars: [
                {
                    make: 'Toyota',
                    model: 'Corolla',
                    year: 2019,
                    previousOwners: [
                        {
                            name: 'Jane Smith'
                        },
                        {
                            name: 'Jim Down'
                        }
                    ]
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
            ],
            cars: [
                {
                    make: 'Honda',
                    model: 'Civic',
                    year: 2018,
                    previousOwners: [
                        {
                            name: 'Bob Johnson'
                        },
                        {
                            name: 'Tom Brown'
                        }
                    ]
                }
            ]
        }
    }
];

export const mockPersonDataFirstRow = mockPersonsData[0].person;
