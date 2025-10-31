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
import { IsFeatureOff, isFeatureOff } from './is-feature-off.guard';
import { Route } from '@angular/router';
import { provideMockFeatureFlags } from '../mocks/features-service-mock.factory';
import { firstValueFrom } from 'rxjs';

describe('IsFeatureOff', () => {
    let guard: IsFeatureOff;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IsFeatureOff,
                provideMockFeatureFlags({
                    enabledFeature: true,
                    disabledFeature: false
                })
            ]
        });
        guard = TestBed.inject(IsFeatureOff);
    });

    it('should return true when feature is off using canMatch', async () => {
        const route: Route = {
            path: 'test',
            data: { feature: 'disabledFeature' }
        };

        const result = await firstValueFrom(guard.canMatch(route));
        expect(result).toBe(true);
    });

    it('should return false when feature is on using canMatch', async () => {
        const route: Route = {
            path: 'test',
            data: { feature: 'enabledFeature' }
        };

        const result = await firstValueFrom(guard.canMatch(route));
        expect(result).toBe(false);
    });

    it('should return true when feature is off using functional guard', async () => {
        const result = await TestBed.runInInjectionContext(() => {
            const guardFn = isFeatureOff('disabledFeature');
            return firstValueFrom(guardFn());
        });
        expect(result).toBe(true);
    });

    it('should return false when feature is on using functional guard', async () => {
        const result = await TestBed.runInInjectionContext(() => {
            const guardFn = isFeatureOff('enabledFeature');
            return firstValueFrom(guardFn());
        });
        expect(result).toBe(false);
    });
});
