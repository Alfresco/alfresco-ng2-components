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

    describe('isObject', () => {
        it('should return false for null and undefined types', () => {
            expect(ObjectUtils.isObject(null)).toBe(false);
            expect(ObjectUtils.isObject(undefined)).toBe(false);
        });

        it('should return false for non object types', () => {
            const numberTest = 1;
            const stringTest = 'test';
            expect(ObjectUtils.isObject(numberTest)).toBe(false);
            expect(ObjectUtils.isObject(stringTest)).toBe(false);
        });

        it('should return true for object types', () => {
            const obj = {
                id: 1
            };
            const date = new Date();
            expect(ObjectUtils.isObject(obj)).toBe(true);
            expect(ObjectUtils.isObject(date)).toBe(true);
        });
    });

    describe('isEmpty', () => {
        it('should return true for empty objects', () => {
            const emptyObj = {};
            expect(ObjectUtils.isEmpty(emptyObj)).toBe(true);
        });

        it('should return false for non empty objects', () => {
            const obj = {
                id: 1
            };
            const date = new Date();
            expect(ObjectUtils.isEmpty(obj)).toBe(false);
            expect(ObjectUtils.isEmpty(date)).toBe(false);
        });
    });

    describe('isBooleanObject', () => {
        it('should return true for objects with all bollean values', () => {
            const obj = {
                testOne: true,
                testTwo: false
            };
            expect(ObjectUtils.isBooleanObject(obj)).toBe(true);
        });

        it('should return false for objects with at least one non boolean value', () => {
            const objOne = {
                testOne: true,
                testTwo: 1
            };
            const objTwo = {
                testOne: 1,
                testTwo: 2
            };
            expect(ObjectUtils.isBooleanObject(objOne)).toBe(false);
            expect(ObjectUtils.isBooleanObject(objTwo)).toBe(false);
        });
    });

    describe('booleanPrettify', () => {
        it('should return empty string for empty types', () => {
            expect(ObjectUtils.booleanPrettify(null)).toBe('');
            expect(ObjectUtils.booleanPrettify(undefined)).toBe('');
        });

        it('should return string if not object', () => {
            const numberTest = 1;
            expect(ObjectUtils.booleanPrettify(numberTest)).toBe(numberTest.toString());
        });

        it('should return empty string for empty objects', () => {
            const obj = {};
            expect(ObjectUtils.booleanPrettify(obj)).toBe('');
        });

        it('should return string for objects with no keys', () => {
            const date = new Date();
            expect(ObjectUtils.booleanPrettify(date)).toBe(date.toString());
        });

        it('should return empty string for objects containing non boolean values', () => {
            const nonBooleanObjOne = {
                testOne: 1,
                testTwo: 2
            };
            const nonBooleanObjTwo = {
                testOne: 1,
                testTwo: false
            };
            expect(ObjectUtils.booleanPrettify(nonBooleanObjOne)).toBe('');
            expect(ObjectUtils.booleanPrettify(nonBooleanObjTwo)).toBe('');
        });

        it('should return string with either &#9989 or &#10060 symbols if object with boolean values', () => {
            const obj = {
                testOne: true,
                testTwo: false
            };
            expect(ObjectUtils.booleanPrettify(obj)).toBe('&#9989 testOne\n&#10060 testTwo');
        });

        it('should return enhanced string with either &#9989 or &#10060 symbols if object with boolean values', () => {
            const obj = {
                testOne: true,
                testTwo: false
            };

            const enhancer = (e: string) => e + 'test';

            expect(ObjectUtils.booleanPrettify(obj, enhancer)).toBe('&#9989 testOnetest\n&#10060 testTwotest');
        });
    });
});
