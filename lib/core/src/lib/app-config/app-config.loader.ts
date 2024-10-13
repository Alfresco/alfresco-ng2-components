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

import { AppConfigService, AppConfigValues } from './app-config.service';
import { StorageService } from '../common/services/storage.service';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { StoragePrefixFactory } from './app-config-storage-prefix.factory';

/**
 * Create a factory to load app configuration
 * @param appConfigService app config service
 * @param storageService storage service
 * @param adfHttpClient http client
 * @param storagePrefixFactory prefix factory
 * @returns factory function
 */
export function loadAppConfig(
    appConfigService: AppConfigService,
    storageService: StorageService,
    adfHttpClient: AdfHttpClient,
    storagePrefixFactory: StoragePrefixFactory
) {
    const init = () => {
        adfHttpClient.disableCsrf = appConfigService.get<boolean>(AppConfigValues.DISABLECSRF, true);
        const withCredentials = appConfigService.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS);
        if (withCredentials !== undefined && withCredentials !== null) {
            adfHttpClient.setDefaultSecurityOption({ withCredentials });
        }

        storageService.prefix = appConfigService.get<string>(AppConfigValues.STORAGE_PREFIX, '');

        storagePrefixFactory.getPrefix().subscribe((property) => {
            storageService.prefix = property;
        });
    };
    return () => appConfigService.load(init);
}
