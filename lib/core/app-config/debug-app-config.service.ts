/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { StorageService } from '@alfresco/adf-core/storage';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { ExtensionService } from '@alfresco/adf-extensions';

@Injectable()
export class DebugAppConfigService extends AppConfigService {
    constructor(private storage: StorageService, http: HttpClient, extensionService: ExtensionService) {
        super(http, extensionService);
    }

    /** @override */
    get<T>(key: string, defaultValue?: T): T {
        if (key === AppConfigValues.OAUTHCONFIG) {
            return (JSON.parse(this.storage.getItem(key)) || super.get<T>(key, defaultValue));
        } else if (key === AppConfigValues.APPLICATION) {
            return undefined;
        } else {
            return (this.storage.getItem(key) as any || super.get<T>(key, defaultValue));
        }
    }
}
