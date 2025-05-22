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

import { inject, provideAppInitializer } from '@angular/core';
import {
    FlagsOverrideToken,
    FeaturesServiceToken,
    QaFeaturesHelperConfig,
    WritableFeaturesServiceConfig,
    WritableFeaturesServiceConfigToken,
    WritableFeaturesServiceToken,
    IFeaturesService,
    IWritableFeaturesService,
    FlagChangeset
} from '../interfaces/features.interface';
import { StorageFeaturesService } from '../services/storage-features.service';
import { DebugFeaturesService } from '../services/debug-features.service';
import { QaFeaturesHelper } from '../services/qa-features.helper';
import { DOCUMENT } from '@angular/common';

/**
 *
 * @param config Configuration for the Feature Flags
 * @returns Environment Providers for Feature Flags
 */
export function provideDebugFeatureFlags(config: WritableFeaturesServiceConfig & QaFeaturesHelperConfig) {
    return [
        { provide: FlagsOverrideToken, useValue: true },
        { provide: FeaturesServiceToken, useClass: DebugFeaturesService },
        { provide: WritableFeaturesServiceConfigToken, useValue: config },
        { provide: WritableFeaturesServiceToken, useClass: StorageFeaturesService },
        { provide: QaFeaturesHelper, useClass: QaFeaturesHelper },
        provideAppInitializer(() => {
            const initializerFn = (
                (featuresService: IFeaturesService<FlagChangeset> & IWritableFeaturesService) => () =>
                    featuresService.init()
            )(inject(WritableFeaturesServiceToken));
            return initializerFn();
        }),
        provideAppInitializer(() => {
            const initializerFn = ((qaFeaturesHelper: QaFeaturesHelper, document: Document) => () => {
                (document as any)[config.helperExposeKeyOnDocument ?? 'featureOverrides'] = qaFeaturesHelper;
            })(inject(QaFeaturesHelper), inject(DOCUMENT));
            return initializerFn();
        })
    ];
}
