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

import { of, Observable, map, combineLatest, take, defer } from 'rxjs';
import { FeaturesServiceToken, FlagChangeset, FlagChangesetValues, IFeaturesService } from '../interfaces/features.interface';

/**
 * Feature flags to mock. A boolean sets a fixed value, an observable lets the test change the value over time.
 *
 * Observable flags must have a current value, use 'BehaviorSubject' or 'of(...)'.
 * A bare 'Subject' has no value until it emits, and 'getFlags$()'/'init()' withhold the whole changeset
 * until every observable flag has emitted at least once.
 */
export interface MockFeatureFlags {
    [key: string]: boolean | Observable<boolean>;
}

interface MockFlagChangesetValues extends FlagChangesetValues {
    current: boolean | Observable<boolean>;
    previous: null;
}

interface MockFlagChangeset extends FlagChangeset {
    [key: string]: MockFlagChangesetValues;
}

const assertFeatureFlag = (flagChangeset: FlagChangeset, key: string): void => {
    const flagChangesetValue = flagChangeset[key];

    if (flagChangesetValue === undefined) {
        throw new Error(
            `ERROR FEATURE-FLAG\n'${key}' feature is not mocked, please mock '${key}' using '${provideMockFeatureFlags.name}' helper in your test\n`
        );
    }
};

/**
 * Calling 'pipe' on a 'Subject' returns an 'AnonymousSubject' that still writes through to the original 'Subject',
 * so piping alone does not stop a consumer from pushing values into the mocked flag.
 * 'defer' breaks that chain and gives back a plain, read only observable.
 *
 * @param value$ Observable feature flag value provided by the test
 * @returns Observable that cannot be used to change the mocked value
 */
const toReadOnly = (value$: Observable<boolean>): Observable<boolean> => defer(() => value$);

const mockFeaturesService = (flagChangeset: MockFlagChangeset): IFeaturesService => ({
    init: () => resolveFeatureFlagValues(flagChangeset).pipe(take(1)),
    isOn$: (key) => {
        assertFeatureFlag(flagChangeset, key);
        const featureFlagValue = flagChangeset[key].current;

        // In case of an observable, we do not want to return the original observable, so a consumer cannot 'next', 'error' or 'complete' it
        return typeof featureFlagValue === 'boolean' ? of(featureFlagValue) : toReadOnly(featureFlagValue).pipe(map(Boolean));
    },
    isOff$: (key) => {
        assertFeatureFlag(flagChangeset, key);
        const featureFlagValue = flagChangeset[key].current;

        return typeof featureFlagValue === 'boolean' ? of(!featureFlagValue) : toReadOnly(featureFlagValue).pipe(map((value) => !value));
    },
    getFlags$: () => resolveFeatureFlagValues(flagChangeset)
});

/**
 * 'provideMockFeatureFlags' can receive observables, therefore we need to resolve these values
 *
 * @param mockFlagChangeset Mocked flag changeset
 * @returns FlagChangeset
 */
const resolveFeatureFlagValues = (mockFlagChangeset: MockFlagChangeset): Observable<FlagChangeset> => {
    // No FF provided, just return empty object
    if (Object.keys(mockFlagChangeset).length === 0) {
        return of({});
    }

    const resolveFeatureFlagValues$ = Object.entries(mockFlagChangeset).map(([featureKey, values]) => {
        if (typeof values.current === 'boolean') {
            return of([featureKey, { ...values }] as const);
        }

        // Value is observable, we need to resolve it
        const observableValue$ = values.current;

        const resolveFlagValue$ = observableValue$.pipe(map((resolvedValue) => [featureKey, { current: resolvedValue, previous: null }] as const));

        return resolveFlagValue$;
    });

    return combineLatest(resolveFeatureFlagValues$).pipe(
        map((resolvedFlags) => {
            const resolvedFeatureFlag: FlagChangeset = {};

            resolvedFlags.forEach(([key, values]) => {
                resolvedFeatureFlag[key] = values;
            });

            return resolvedFeatureFlag;
        })
    );
};

const arrayToFlagChangeset = (featureFlags: string[]): FlagChangeset => {
    const flagChangeset: FlagChangeset = {};
    featureFlags.forEach((featureFlag) => {
        flagChangeset[featureFlag] = { current: true, previous: null };
    });
    return flagChangeset;
};

const mockFeatureFlagsToFlagChangeset = (mockFeatureFlags: MockFeatureFlags) => {
    const flagChangeset: FlagChangeset = {};
    const featureFlags = Object.keys(mockFeatureFlags);
    featureFlags.forEach((featureFlag) => {
        flagChangeset[featureFlag] = { current: mockFeatureFlags[featureFlag], previous: null };
    });
    return flagChangeset;
};

/**
 * Mock the FeaturesService with the provided feature flags.
 * A string or string[] sets every listed feature to true, a MockFeatureFlags object sets each value explicitly.
 * Every flag the code under test asks for has to be mocked, otherwise 'isOn$'/'isOff$' throw.
 *
 * Use a 'BehaviorSubject' for a flag that changes during the test. A bare 'Subject' has no current value,
 * so the flag stays silent and 'getFlags$()'/'init()' withhold the whole changeset, until it emits.
 *
 * @example
 *
 * const featureA$ = new BehaviorSubject(false);
 *
 * providers: [provideMockFeatureFlags('featureA')]
 * providers: [provideMockFeatureFlags(['featureA', 'featureB'])]
 * providers: [provideMockFeatureFlags({ featureA: true, featureB: false })]
 * providers: [provideMockFeatureFlags({ featureA: featureA$ })]
 *
 * @param featureFlag The feature flag(s) to mock. Can be a single feature flag string, an array of feature flag strings, or a MockFeatureFlags object.
 * @returns A provider object for the FeaturesServiceToken with the mocked feature flags.
 */
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
