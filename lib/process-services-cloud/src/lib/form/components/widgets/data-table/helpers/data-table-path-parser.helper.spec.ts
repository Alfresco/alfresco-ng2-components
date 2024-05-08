/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataTablePathParserHelper } from './data-table-path-parser.helper';
import { mockResponseResultData, mockResultData } from './mocks/data-table-path-parser.helper.mock';

interface DataTablePathParserTestCase {
    description: string;
    path: string;
    data?: any;
    propertyName?: string;
    expected?: unknown[];
}

describe('DataTablePathParserHelper', () => {
    let helper: DataTablePathParserHelper;

    beforeEach(() => {
        helper = new DataTablePathParserHelper();
    });

    describe('should return the correct data for path', () => {
        const testCases: DataTablePathParserTestCase[] = [
            {
                description: 'not existent',
                data: {},
                path: 'nonexistent.path',
                expected: []
            },
            {
                description: 'not defined',
                data: {},
                path: undefined,
                expected: []
            },
            {
                description: 'nested',
                data: { level1: { level2: { level3: { level4: ['parrot', 'fish'] } } } },
                propertyName: 'level4',
                path: 'level1.level2.level3.level4',
                expected: ['parrot', 'fish']
            },
            {
                description: 'NOT nested',
                data: { pets: ['cat', 'dog'] },
                propertyName: 'pets',
                path: 'pets',
                expected: ['cat', 'dog']
            },
            {
                description: 'NOT nested with separator (.) in property name',
                data: { 'my.pets': ['cat', 'dog'] },
                propertyName: 'my.pets',
                path: '[my.pets]',
                expected: ['cat', 'dog']
            },
            {
                description: 'with nested brackets followed by an additional part of property name',
                propertyName: 'file.file[data]file',
                path: 'response.[file.file[data]file]'
            },
            {
                description: 'with nested brackets',
                propertyName: 'file.file[data]',
                path: 'response.[file.file[data]]'
            },
            {
                description: 'with separator before nested brackets in property name',
                propertyName: 'file.[data]file',
                path: 'response.[file.[data]file]'
            },
            {
                description: 'with separator before and no separator after nested brackets in property name',
                propertyName: 'file.[data]',
                path: 'response.[file.[data]]'
            },
            {
                description: 'with separator after nested brackets',
                propertyName: 'file[data].file',
                path: 'response.[file[data].file]'
            },
            {
                description: 'with multiple brackets in property name',
                propertyName: 'file.file[data]file[data]',
                path: 'response.[file.file[data]file[data]]'
            },
            {
                description: 'with special characters except separator (.) in brackets',
                propertyName: 'xyz:abc,xyz-abc,xyz_abc,abc+xyz',
                path: 'response.[xyz:abc,xyz-abc,xyz_abc,abc+xyz]'
            },
            {
                description: 'with special characters except separator (.) without brackets',
                propertyName: 'xyz:abc,xyz-abc,xyz_abc,abc+xyz',
                path: 'response.xyz:abc,xyz-abc,xyz_abc,abc+xyz'
            },
            {
                description: 'without separator in brackets',
                propertyName: 'my-data',
                path: '[response].[my-data]'
            }
        ];

        testCases.forEach((testCase) => {
            it(testCase.description, () => {
                const data = testCase.data ?? mockResponseResultData(testCase.propertyName);
                const result = helper.retrieveDataFromPath(data, testCase.path);
                const expectedResult = testCase.expected ?? mockResultData;
                expect(result).toEqual(expectedResult);
            });
        });
    });
});
