/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { of } from 'rxjs';
import { FeaturesServiceToken, FlagChangeset, IFeaturesService } from '../interfaces/features.interface';

export interface MockFeatureFlags {
    [key: string]: boolean;
}

const assertFeatureFlag = (flagChangeset: FlagChangeset, key: string): void => {
    const flagChangesetValue = flagChangeset[key];

    if (flagChangesetValue === undefined) {
        throw new Error(
            `ERROR FEATURE-FLAG\n'${key}' feature is not mocked, please mock '${key}' using '${provideMockFeatureFlags.name}' helper in your test\n`
        );
    }
};

const mockFeaturesService = (flagChangeset: FlagChangeset): IFeaturesService => ({
    init: () => of(flagChangeset),
    isOn$: (key) => {
        assertFeatureFlag(flagChangeset, key);
        return of(flagChangeset[key].current);
    },
    isOff$: (key) => {
        assertFeatureFlag(flagChangeset, key);
        return of(!flagChangeset[key].current);
    },
    getFlags$: () => of(flagChangeset)
});

const arrayToFlagChangeset = (featureFlags: string[]): FlagChangeset => {
    const flagChangeset: FlagChangeset = { /* empty */ };
    featureFlags.forEach((featureFlag) => {
        flagChangeset[featureFlag] = { current: true, previous: null };
    });
    return flagChangeset;
};

const mockFeatureFlagsToFlagChangeset = (mockFeatureFlags: MockFeatureFlags) => {
    const flagChangeset: FlagChangeset = { /* empty */ };
    const featureFlags = Object.keys(mockFeatureFlags);
    featureFlags.forEach((featureFlag) => {
        flagChangeset[featureFlag] = { current: mockFeatureFlags[featureFlag], previous: null };
    });
    return flagChangeset;
};

export const provideMockFeatureFlags = (featureFlag: MockFeatureFlags | string | string[]) => {
    if (typeof featureFlag === 'string') {
        featureFlag = [featureFlag];
    }

    const flagChangeset = Array.isArray(featureFlag) ? arrayToFlagChangeset(featureFlag) : mockFeatureFlagsToFlagChangeset(featureFlag);

    return {
        provide: FeaturesServiceToken,
        useValue: mockFeaturesService(flagChangeset)
    };
};
