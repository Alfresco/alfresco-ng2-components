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

import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { StorageService } from '../common/services/storage.service';

/**
 * Loads application config file
 *
 * @param appConfigService configuration service
 * @param storageService storage service
 * @returns a factory to load application config
 */
export function loadAppConfig(appConfigService: AppConfigService, storageService: StorageService) {
    return () =>
        appConfigService.load().then(() => {
            storageService.prefix = appConfigService.get<string>(AppConfigValues.STORAGE_PREFIX, '');
        });
}
