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

import { BooleanPipe } from './boolean.pipe';

describe('BooleanPipe', () => {
    let pipe: BooleanPipe;

    beforeEach(() => {
        pipe = new BooleanPipe();
    });

    describe('should return "true" when', () => {
        it('boolean value is true', () => {
            expect(pipe.transform(true)).toBe('true');
        });

        it('exact string is provided', () => {
            expect(pipe.transform('true')).toBe('true');
        });
    });

    describe('should return "false" when', () => {
        it('boolean value is false', () => {
            expect(pipe.transform(false)).toBe('false');
        });

        it('exact string is provided', () => {
            expect(pipe.transform('false')).toBe('false');
        });
    });

    describe('should return empty string in case of', () => {
        it('invalid string', () => {
            expect(pipe.transform('fal')).toBe('');
            expect(pipe.transform('truee')).toBe('');
            expect(pipe.transform('0')).toBe('');
            expect(pipe.transform('1')).toBe('');
            expect(pipe.transform('122')).toBe('');
            expect(pipe.transform('TRUE')).toBe('');
            expect(pipe.transform('FALSE')).toBe('');
            expect(pipe.transform(' false')).toBe('');
            expect(pipe.transform(' true  ')).toBe('');
        });

        it('falsy value (excluding false)', () => {
            expect(pipe.transform(null)).toBe('');
            expect(pipe.transform(undefined)).toBe('');
            expect(pipe.transform(false)).not.toBe('');
            expect(pipe.transform(NaN)).toBe('');
            expect(pipe.transform(0)).toBe('');
            expect(pipe.transform(-0)).toBe('');
            expect(pipe.transform(BigInt(0))).toBe('');
            expect(pipe.transform('')).toBe('');
        });

        it('number', () => {
            expect(pipe.transform(-20.5)).toBe('');
            expect(pipe.transform(-1)).toBe('');
            expect(pipe.transform(0)).toBe('');
            expect(pipe.transform(1)).toBe('');
            expect(pipe.transform(100)).toBe('');
            expect(pipe.transform(100.5)).toBe('');
        });

        it('object', () => {
            expect(pipe.transform({})).toBe('');
            expect(pipe.transform({ value: 'true'})).toBe('');
        });
    });
});
