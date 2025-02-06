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

import { DataTablePathParserHelper } from './data-table-path-parser.helper';
import { mockResponseResultData, mockResponseResultDataWithArrayInsideArray, mockResultData } from '../mocks/data-table-path-parser.helper.mock';

interface DataTablePathParserTestCase {
    description: string;
    path?: string;
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
                description: 'empty string',
                path: '',
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
                description: 'with missing closing bracket in outermost square brackets',
                propertyName: 'file.file[data',
                path: 'response.[file.file[data]'
            },
            {
                description: 'with missing openning bracket in outermost square brackets',
                propertyName: 'file.filedata]',
                path: 'response.[file.filedata]]'
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
            },
            {
                description: 'with property followed by single index reference',
                propertyName: 'users',
                path: 'response.users[0].data',
                data: mockResponseResultDataWithArrayInsideArray('users')
            },
            {
                description: 'with property followed by multiple index references',
                propertyName: 'users:Array',
                path: 'response.[users:Array][0][1][12].data',
                data: mockResponseResultDataWithArrayInsideArray('users:Array'),
                expected: []
            },
            {
                description: 'when path points to array in the middle (incorrect path)',
                propertyName: 'users',
                path: 'response.users.incorrectPath',
                data: mockResponseResultDataWithArrayInsideArray('users'),
                expected: []
            },
            {
                description: 'when path points to the particular element of the array',
                propertyName: 'users',
                path: 'response.users[1]',
                expected: [mockResultData[1]]
            },
            {
                description: 'when path points to the particular element of the array which does NOT exist',
                propertyName: 'users',
                path: 'response.users[100]',
                expected: []
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

    it('should split path to properties', () => {
        const testCases: { path: string; expected: string[] }[] = [
            { path: 'response.0', expected: ['response', '0'] },
            { path: 'response', expected: ['response'] },
            { path: 'response.person.file', expected: ['response', 'person', 'file'] },
            { path: 'response.persons[0]', expected: ['response', 'persons[0]'] },
            { path: 'response.[persons:Array][0]', expected: ['response', '[persons:Array][0]'] },
            { path: 'response.persons[0][1]', expected: ['response', 'persons[0][1]'] },
            { path: 'response.persons[0].file.data[4]', expected: ['response', 'persons[0]', 'file', 'data[4]'] },
            { path: '', expected: [] },
            { path: null, expected: [] },
            { path: undefined, expected: [] }
        ];

        testCases.forEach((testCase) => {
            const result = helper.splitPathIntoProperties(testCase.path);
            expect(result).toEqual(testCase.expected);
        });
    });

    it('should extract pure property name', () => {
        const testCases: { property: string; expected: string }[] = [
            { property: '[persons]', expected: 'persons' },
            { property: '[persons:data]', expected: 'persons:data' },
            { property: '[persons.data]', expected: 'persons.data' },
            { property: '[persons.data[1]]', expected: 'persons.data[1]' },
            { property: '[persons.data1]]', expected: 'persons.data1]' },
            { property: 'persons.data1]', expected: 'persons.data1]' },
            { property: 'persons.[data1]', expected: 'persons.[data1]' },
            { property: 'persons', expected: 'persons' },
            { property: 'persons[0]', expected: 'persons' },
            { property: '[persons:Array][0]', expected: 'persons:Array' },
            { property: 'persons[0][1]', expected: 'persons' },
            { property: '[persons[0].file.data][4]', expected: 'persons[0].file.data' },
            { property: '[persons[0].file.data][1][4]', expected: 'persons[0].file.data' },
            { property: '[persons.data1]][2][4][23]', expected: 'persons.data1]' },
            { property: '', expected: '' },
            { property: undefined, expected: '' },
            { property: null, expected: '' }
        ];

        testCases.forEach((testCase) => {
            const result = helper.extractPurePropertyName(testCase.property);
            expect(result).toEqual(testCase.expected);
        });
    });

    it('should return index references from property', () => {
        const testCases: { property: string; expected: number[] }[] = [
            { property: 'persons[0]', expected: [0] },
            { property: '[persons:Array][0]', expected: [0] },
            { property: 'persons[0][1][7]', expected: [0, 1, 7] },
            { property: '[persons[0].file.data][4]', expected: [4] },
            { property: '[persons[0].file.data][1][4]', expected: [1, 4] },
            { property: '[persons[0].file.data]', expected: [] },
            { property: 'persons', expected: [] },
            { property: undefined, expected: [] },
            { property: null, expected: [] },
            { property: '', expected: [] }
        ];

        testCases.forEach((testCase) => {
            const result = helper.getIndexReferencesFromProperty(testCase.property);
            expect(result).toEqual(testCase.expected);
        });
    });
});
