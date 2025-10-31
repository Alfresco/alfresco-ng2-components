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

import { TestBed } from '@angular/core/testing';
import { IsFlagsOverrideOn, isFlagsOverrideOn } from './is-flags-override-on.guard';
import { FlagsOverrideToken } from '../interfaces/features.interface';

describe('IsFlagsOverrideOn', () => {
    it('should return true when flags override is enabled', () => {
        TestBed.configureTestingModule({
            providers: [IsFlagsOverrideOn, { provide: FlagsOverrideToken, useValue: true }]
        });
        const guard = TestBed.inject(IsFlagsOverrideOn);

        const result = guard.canMatch();

        expect(result).toBe(true);
    });

    it('should return false when flags override is disabled', () => {
        TestBed.configureTestingModule({
            providers: [IsFlagsOverrideOn, { provide: FlagsOverrideToken, useValue: false }]
        });
        const guard = TestBed.inject(IsFlagsOverrideOn);

        const result = guard.canMatch();

        expect(result).toBe(false);
    });

    it('should return false when token is not provided', () => {
        TestBed.configureTestingModule({
            providers: [IsFlagsOverrideOn]
        });
        const guard = TestBed.inject(IsFlagsOverrideOn);

        const result = guard.canMatch();

        expect(result).toBe(false);
    });

    it('should return true using functional guard when override is enabled', () => {
        TestBed.configureTestingModule({
            providers: [{ provide: FlagsOverrideToken, useValue: true }]
        });

        const result = TestBed.runInInjectionContext(() => {
            const guardFn = isFlagsOverrideOn();
            return guardFn();
        });

        expect(result).toBe(true);
    });

    it('should return false using functional guard when override is disabled', () => {
        TestBed.configureTestingModule({
            providers: [{ provide: FlagsOverrideToken, useValue: false }]
        });

        const result = TestBed.runInInjectionContext(() => {
            const guardFn = isFlagsOverrideOn();
            return guardFn();
        });

        expect(result).toBe(false);
    });

    it('should return false using functional guard when token is not provided', () => {
        TestBed.configureTestingModule({
            providers: [{ provide: FlagsOverrideToken, useValue: null }]
        });

        const result = TestBed.runInInjectionContext(() => {
            const guardFn = isFlagsOverrideOn();
            return guardFn();
        });

        expect(result).toBe(false);
    });
});
