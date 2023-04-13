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

import { isConstructor, getQueryParamsWithCustomEncoder, removeNilValues } from './alfresco-api.utils';

describe('AlfrescoApiUtils', () => {

    describe('isConstructor', () => {
        class MockClass {}
        function mockFUnction() {}

        it('should return true for class and functions', () => {
            expect(isConstructor(MockClass)).toBe(true);
            expect(isConstructor(mockFUnction)).toBe(true);
        });

        it('should return false for instances of a class/function', () => {
            expect(isConstructor(new MockClass())).toBe(false);
            expect(isConstructor(new mockFUnction())).toBe(false);
        });

        it('should return false for object', () => {
            expect(isConstructor({})).toBe(false);
        });

        it('should return false for primitive types', () => {
            expect(isConstructor('test')).toBe(false);
            expect(isConstructor(1)).toBe(false);
            expect(isConstructor(true)).toBe(false);
            expect(isConstructor(false)).toBe(false);
            expect(isConstructor(null)).toBe(false);
            expect(isConstructor(undefined)).toBe(false);
        });
    });


    describe('getQueryParamsWithCustomEncoder', () => {

        it('should return queryParams with removed undefined values', () => {
            const actual = getQueryParamsWithCustomEncoder({
                key1: 'value1',
                key2: undefined
            });

            expect(actual?.has('key2')).toBe(false);
        });

        it('should handle array values', () => {
            const actual = getQueryParamsWithCustomEncoder({
                key1: 'value1',
                key2: [undefined, 'value2', null, 'value3', '']
            });

            expect(actual?.get('key2')).toEqual('value2');
            expect(actual?.getAll('key2')).toEqual(['value2', 'value3']);
        });
    });


    describe('removeUndefinedValues', () => {

        it('should return queryParams with removed undefined values', () => {
            const actual = removeNilValues({
                key1: 'value1',
                key2: undefined,
                key3: null
            });

            expect(actual).toEqual({
                key1: 'value1'
            });
        });

        it('should handle array values', () => {
            const actual = getQueryParamsWithCustomEncoder({
                key1: 'value1',
                key2: [undefined, 'value2', null, 'value3', '']
            });

            expect(actual?.get('key2')).toEqual('value2');
            expect(actual?.getAll('key2')).toEqual(['value2', 'value3']);
        });
    });

});
