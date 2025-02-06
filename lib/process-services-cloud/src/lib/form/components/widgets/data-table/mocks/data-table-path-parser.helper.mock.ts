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

export const mockResultData = [
    {
        id: '1',
        decimal: '1.0',
        name: 'test1',
        date: '1-12-2023',
        amount: '0.12',
        data: '{ "result": "positive" }',
        trust: 'true',
        image: 'check_circle'
    },
    {
        id: '2',
        decimal: '2.2',
        name: 'test2',
        date: '2-13-2023',
        amount: '2.2',
        data: '{ "result": "negative" }',
        trust: 'true',
        image: 'bookmark'
    }
];

export const mockResponseResultData = (propertyName?: string) => ({
    response: {
        [propertyName]: mockResultData
    }
});

export const mockResponseResultDataWithArrayInsideArray = (propertyName?: string) => ({
    response: {
        [propertyName]: [
            {
                data: mockResultData
            }
        ]
    }
});
