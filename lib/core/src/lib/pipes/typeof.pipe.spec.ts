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

import { TypeofPipe } from './typeof.pipe';

describe('TypeofPipe', () => {
    let pipe: TypeofPipe;

    beforeEach(() => {
        pipe = new TypeofPipe();
    });

    it('should return "string"', () => {
        const testStrings = ['', 'number', 'boolean', 'object', 'function', 'symbol',
                                'undefined', 'bigint', 'false', 'true', '0', '1', '{}', '[]', '1n'];

        testStrings.forEach((testString) => {
            expect(pipe.transform(testString)).toBe('string');
        });
    });

    it('should return "number"', () => {
        const testNumbers = [-100, -1, 0, 1, 20, Infinity, -Infinity, NaN];
        testNumbers.forEach((testNumber) => {
            expect(pipe.transform(testNumber)).toBe('number');
        });
    });

    it('should return "boolean"', () => {
        const testBooleans = [true, false];
        testBooleans.forEach((testBoolean) => {
            expect(pipe.transform(testBoolean)).toBe('boolean');
        });
    });

    it('should return "object"', () => {
        const testObjects = [{}, { foo: 'bar' }, { foo: { bar: 'baz' } }, [], new Date(), /hello/, new Map(), new Set()];
        testObjects.forEach((testObject) => {
            expect(pipe.transform(testObject)).toBe('object');
        });
    });

    it('should return "function"', () => {
        const testFunctions = [() => {}, function () {}, class Foo {}];
        testFunctions.forEach((testFunction) => {
            expect(pipe.transform(testFunction)).toBe('function');
        });
    });

    it('should return "symbol"', () => {
        const testSymbols = [Symbol(), Symbol('foo')];
        testSymbols.forEach((testSymbol) => {
            expect(pipe.transform(testSymbol)).toBe('symbol');
        });
    });

    it('should return "undefined"', () => {
        expect(pipe.transform(undefined)).toBe('undefined');
    });

    it('should return "bigint"', () => {
        const testBigInts = [BigInt(0), BigInt(1), BigInt(100), BigInt(-1), BigInt(-100)];
        testBigInts.forEach((testBigInt) => {
            expect(pipe.transform(testBigInt)).toBe('bigint');
        });
    });
});
