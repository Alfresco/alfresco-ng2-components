/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CoverageCanary } from './coverage-canary.fake';

describe('CoverageCanary', () => {
    describe('isEven', () => {
        it('should return true when value is even', () => {
            expect(CoverageCanary.isEven(4)).toBe(true);
        });

        it('should return false when value is odd', () => {
            expect(CoverageCanary.isEven(3)).toBe(false);
        });
    });

    describe('double', () => {
        it('should double a positive value', () => {
            expect(CoverageCanary.double(5)).toBe(10);
        });

        it('should double a negative value', () => {
            expect(CoverageCanary.double(-3)).toBe(-6);
        });

        it('should return zero when doubling zero', () => {
            expect(CoverageCanary.double(0)).toBe(0);
        });
    });
});
