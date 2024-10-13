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

import { IsFlagsOverrideOn } from '../guards/is-flags-override-on.guard';
import { IsFeatureOn } from '../guards/is-feature-on.guard';
import { IsFeatureOff } from '../guards/is-feature-off.guard';
import { FeaturesServiceToken, FlagsOverrideToken } from '../interfaces/features.interface';
import { DummyFeaturesService } from '../services/dummy-features.service';

/**
 * Provides the dummy feature flags.
 * @returns Environment Providers for Feature Flags.
 */
export function provideDummyFeatureFlags() {
    return [
        { provide: FeaturesServiceToken, useClass: DummyFeaturesService },
        { provide: FlagsOverrideToken, useValue: false },
        IsFeatureOn,
        IsFeatureOff,
        IsFlagsOverrideOn
    ];
}
