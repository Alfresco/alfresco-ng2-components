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

import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, of, Subject } from 'rxjs';
import { FeaturesServiceToken, IFeaturesService } from '../interfaces/features.interface';
import { MockFeatureFlags, provideMockFeatureFlags } from './features-service-mock.factory';

describe('provideMockFeatureFlags', () => {
    let featureValue$: BehaviorSubject<boolean>;
    const feature1 = 'feature1';

    const setupFeatureService = (featureFlags: MockFeatureFlags | string | string[]): IFeaturesService => {
        TestBed.configureTestingModule({
            providers: [provideMockFeatureFlags(featureFlags)]
        });

        return TestBed.inject(FeaturesServiceToken);
    };

    beforeEach(() => {
        featureValue$ = new BehaviorSubject(false);
    });

    it('should emit the updated value when an observable feature flag changes', async () => {
        const featuresService = setupFeatureService({ [feature1]: featureValue$ });

        expect(await firstValueFrom(featuresService.isOn$(feature1))).toBe(false);
        expect(await firstValueFrom(featuresService.isOff$(feature1))).toBe(true);

        featureValue$.next(true);

        expect(await firstValueFrom(featuresService.isOn$(feature1))).toBe(true);
        expect(await firstValueFrom(featuresService.isOff$(feature1))).toBe(false);

        featureValue$.next(false);

        expect(await firstValueFrom(featuresService.isOn$(feature1))).toBe(false);
        expect(await firstValueFrom(featuresService.isOff$(feature1))).toBe(true);
    });

    it('should not let a consumer change the feature flag value through the observable returned by isOn$', async () => {
        const originalValue$ = new BehaviorSubject(true);
        const service = setupFeatureService({ [feature1]: originalValue$ });

        const isOn$ = service.isOn$(feature1) as Subject<boolean>;

        expect(isOn$).not.toBe(originalValue$);
        expect(() => isOn$.next(false)).toThrow();
        expect(await firstValueFrom(service.isOn$(feature1))).toBe(true);
        expect(await firstValueFrom(originalValue$)).toBe(true);
    });

    it('should mock a string feature flag as enabled', async () => {
        const service = setupFeatureService(feature1);

        expect(await firstValueFrom(service.isOn$(feature1))).toBe(true);
        expect(await firstValueFrom(service.isOff$(feature1))).toBe(false);
    });

    it('should mock every feature flag in an array as enabled', async () => {
        const feature2 = 'feature2';
        const service = setupFeatureService([feature1, feature2]);

        expect(await firstValueFrom(service.getFlags$())).toEqual({
            [feature1]: { current: true, previous: null },
            [feature2]: { current: true, previous: null }
        });
    });

    it('should emit an empty changeset when no feature flags are provided', async () => {
        const service = setupFeatureService({});

        expect(await firstValueFrom(service.getFlags$())).toEqual({});
        expect(await firstValueFrom(service.init())).toEqual({});
    });

    it('should emit an empty changeset when an empty feature flag array is provided', async () => {
        const service = setupFeatureService([]);

        expect(await firstValueFrom(service.getFlags$())).toEqual({});
        expect(await firstValueFrom(service.init())).toEqual({});
    });

    it('should return the expected state when the feature flag is true', async () => {
        const service = setupFeatureService({ [feature1]: true });

        expect(await firstValueFrom(service.init())).toEqual({
            [feature1]: { current: true, previous: null }
        });
        expect(await firstValueFrom(service.isOn$(feature1))).toBe(true);
        expect(await firstValueFrom(service.isOff$(feature1))).toBe(false);
    });

    it('should return the expected state when the feature flag is false', async () => {
        const service = setupFeatureService({ [feature1]: false });

        expect(await firstValueFrom(service.init())).toEqual({
            [feature1]: { current: false, previous: null }
        });
        expect(await firstValueFrom(service.isOn$(feature1))).toBe(false);
        expect(await firstValueFrom(service.isOff$(feature1))).toBe(true);
    });

    it('should resolve observable values in the complete feature flags result', async () => {
        const service = setupFeatureService({ [feature1]: of(true) });

        expect(await firstValueFrom(service.getFlags$())).toEqual({
            [feature1]: { current: true, previous: null }
        });
    });

    it('should throw when a feature flag has not been mocked', () => {
        const featuresService = setupFeatureService({ [feature1]: true });

        expect(() => featuresService.isOn$('missing-feature')).toThrowError(/missing-feature.*not mocked/);
        expect(() => featuresService.isOff$('missing-feature')).toThrowError(/missing-feature.*not mocked/);
    });
});
