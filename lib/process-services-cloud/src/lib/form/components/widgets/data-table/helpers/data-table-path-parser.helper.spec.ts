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

import { DataTablePathParserHelper } from './data-table-path-parser.helper';
import {
    mockEuropeCountriesData,
    mockJsonNestedResponseEuropeCountriesDataWithSeparatorInPropertyName,
    mockJsonNestedResponseEuropeCountriesDataWithMultipleSpecialCharacters,
    mockJsonNestedResponseEuropeCountriesData
} from '../../../../mocks/data-table-widget.mock';

describe('DataTablePathParserHelper', () => {
    let helper: DataTablePathParserHelper;

    beforeEach(() => {
        helper = new DataTablePathParserHelper();
    });

    it('should return the correct data for path with separator in nested brackets', () => {
        const data = mockJsonNestedResponseEuropeCountriesDataWithSeparatorInPropertyName;
        const path = 'response.[my.data].[country[data].country]';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(mockEuropeCountriesData);
    });

    it('should return the correct data for path with special characters except separator (.) in brackets', () => {
        const data = mockJsonNestedResponseEuropeCountriesDataWithMultipleSpecialCharacters;
        const path = 'response.[xyz:abc,xyz-abc,xyz_abc,abc+xyz]';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(mockEuropeCountriesData);
    });

    it('should return the correct data for path with special characters except separator (.) without brackets', () => {
        const data = mockJsonNestedResponseEuropeCountriesDataWithMultipleSpecialCharacters;
        const path = 'response.xyz:abc,xyz-abc,xyz_abc,abc+xyz';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(mockEuropeCountriesData);
    });

    it('should return the correct data for path without separator in brackets', () => {
        const data = mockJsonNestedResponseEuropeCountriesData;
        const path = '[response].[my-data]';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(mockEuropeCountriesData);
    });

    it('should return an empty array if the path does not exist in the data', () => {
        const data = {};
        const path = 'nonexistent.path';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual([]);
    });

    it('should return the correct data if the path is nested', () => {
        const data = { level1: { level2: { level3: { level4: ['parrot', 'fish'] } } } };
        const path = 'level1.level2.level3.level4';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(['parrot', 'fish']);
    });

    it('should return the correct data if the path is NOT nested', () => {
        const data = { pets: ['cat', 'dog'] };
        const path = 'pets';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(['cat', 'dog']);
    });

    it('should return the correct data if the path is NOT nested with separator (.) in property name', () => {
        const data = { 'my.pets': ['cat', 'dog'] };
        const path = '[my.pets]';
        const result = helper.retrieveDataFromPath(data, path);
        expect(result).toEqual(['cat', 'dog']);
    });
});
