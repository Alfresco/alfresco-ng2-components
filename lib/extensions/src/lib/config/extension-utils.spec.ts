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

import { mergeObjects } from './extension-utils';

describe('Extension Utils', () => {
    describe('mergeObjects', () => {
        it('should merge two objects', () => {
           const obj1 = { aHello: 1 };
           const obj2 = { bWorld: 2 };

           const result = mergeObjects(obj1, obj2);

           expect(result).toEqual({
               aHello: 1,
               bWorld: 2
           });
        });

        it('should merge three objects', () => {
            const obj1 = { aHello: 1 };
            const obj2 = { bWorld: 2 };
            const obj3 = { aHello: 3 };

            const result = mergeObjects(obj1, obj2, obj3);

            expect(result).toEqual({
                aHello: 3,
                bWorld: 2
            });
        });

        it('should not process special properties starting with $', () => {
            const obj1 = { $id: 'uid', aHello: 1 };
            const obj2 = { $schema: 'schema-id', bWorld: 2 };

            const result = mergeObjects(obj1, obj2);

            expect(result).toEqual({
                aHello: 1,
                bWorld: 2
            });
        });

        it('should merge arrays', () => {
           const obj1 = { values: ['one', 'two'] };
           const obj2 = { values: ['three', 'four'] };

           const result = mergeObjects(obj1, obj2);

           expect(result).toEqual({
               values: ['one', 'two', 'three', 'four']
           });
        });

        it('should replace array', () => {
            const obj1 = { values: ['one', 'two'] };
            const obj2 = { 'values.$replace': ['three', 'four'] };

            const result = mergeObjects(obj1, obj2);

            expect(result).toEqual({
                values: ['three', 'four']
            });
        });

        it('should replace objects', () => {
           const obj1 = { values: { tag: 'test' } };
           const obj2 = { 'values.$replace': { hello: 'world' } };

           const result = mergeObjects(obj1, obj2);

           expect(result).toEqual({
               values: { hello: 'world' }
           });
        });

        it('should replace nested objects', () => {
            const obj1 = { level1: { level2: { name: 'level2' } } };
            const obj2 = { level1: { 'level2.$replace': { name: 'modified', tag: 'node' }  } };

            const result = mergeObjects(obj1, obj2);

            expect(result).toEqual({
                level1: {
                    level2: {
                        name: 'modified',
                        tag: 'node'
                    }
                }
            });
        });
    });
});
