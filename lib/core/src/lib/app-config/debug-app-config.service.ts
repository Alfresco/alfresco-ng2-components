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

import { inject, Injectable } from '@angular/core';
import { StorageService } from '../common/services/storage.service';
import { AppConfigService, AppConfigValues } from './app-config.service';

@Injectable()
export class DebugAppConfigService extends AppConfigService {
    private readonly storage = inject(StorageService);

    get<T>(key: string, defaultValue?: T): T {
        if (key === AppConfigValues.OAUTHCONFIG) {
            return JSON.parse(this.storage.getItem(key)) || super.get<T>(key, defaultValue);
        } else if (key === AppConfigValues.APPLICATION) {
            return undefined;
        } else {
            return (this.storage.getItem(key) as any) || super.get<T>(key, defaultValue);
        }
    }
}
