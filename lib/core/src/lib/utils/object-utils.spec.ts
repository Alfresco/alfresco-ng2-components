/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ObjectUtils } from './object-utils';

describe('ObjectUtils', () => {

    it('should get top level property value', () => {
        const obj = {
            id: 1
        };
        expect(ObjectUtils.getValue(obj, 'id')).toBe(1);
    });

    it('should not get top level property value', () => {
        const obj = {};
        expect(ObjectUtils.getValue(obj, 'missing')).toBeUndefined();
    });

    it('should get nested property value', () => {
        const obj = {
            name: {
                firstName: 'John',
                lastName: 'Doe'
            }
        };

        expect(ObjectUtils.getValue(obj, 'name.lastName')).toBe('Doe');
    });

    it('should not get nested property value', () => {
        const obj = {};
        expect(ObjectUtils.getValue(obj, 'some.missing.property')).toBeUndefined();
    });

    it('should return undefined when getting value for missing target', () => {
        expect(ObjectUtils.getValue(null, 'id')).toBeUndefined();
    });

    describe('merge', () => {
        it('should merge top level properties', () => {
            const obj1 = {
                prop1: 'value1'
            };

            const obj2 = {
                prop2: 'value2'
            };

            const result = ObjectUtils.merge(obj1, obj2);
            expect(result).toEqual({
                prop1: 'value1',
                prop2: 'value2'
            });
        });

        it('should merge object properties', () => {
            const obj1 = {
                child: {
                    prop1: 1
                },
                prop: 1
            };
            const obj2 = {
                child: {
                    prop1: 2,
                    prop2: 3
                }
            };

            const result = ObjectUtils.merge(obj1, obj2);
            expect(result).toEqual({
                child: {
                    prop1: 2,
                    prop2: 3
                },
                prop: 1
            });
        });

        it('should merge arrays', () => {
            const obj1 = {
                arr: [1, 2, 3]
            };
            const obj2 = {
                arr: [4, 5, 6]
            };

            const result = ObjectUtils.merge(obj1, obj2);
            expect(result).toEqual({
                arr: [1, 2, 3, 4, 5, 6]
            });
        });

        it('should overwrite only single property in the object', () => {
            const obj1 = {
                child: {
                    prop1: 1,
                    prop2: 2,
                    prop3: 3
                }
            };
            const obj2 = {
                child: {
                    prop3: 0
                }
            };

            const result = ObjectUtils.merge(obj1, obj2);
            expect(result).toEqual({
                child: {
                    prop1: 1,
                    prop2: 2,
                    prop3: 0
                }
            });
        });
    });
});
