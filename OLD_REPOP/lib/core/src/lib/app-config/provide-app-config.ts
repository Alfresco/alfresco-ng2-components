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

import { inject, provideAppInitializer, Provider, EnvironmentProviders } from '@angular/core';
import { StoragePrefixFactory } from './app-config-storage-prefix.factory';
import { loadAppConfig } from './app-config.loader';
import { AppConfigService } from './app-config.service';
import { StorageService } from '../common';
import { AdfHttpClient } from '@alfresco/adf-core/api';

/**
 * Provides the application configuration for the application.
 *
 * @returns An array of providers to initialize the application configuration.
 */
export function provideAppConfig(): (Provider | EnvironmentProviders)[] {
    return [
        StoragePrefixFactory,
        provideAppInitializer(() => {
            const initializerFn = loadAppConfig(
                inject(AppConfigService),
                inject(StorageService),
                inject(AdfHttpClient),
                inject(StoragePrefixFactory)
            );
            return initializerFn();
        })
    ];
}
