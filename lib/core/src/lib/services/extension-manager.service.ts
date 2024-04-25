/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { AlfrescoApiService } from './alfresco-api.service';
import { from, Observable } from 'rxjs';
import { AppConfigPluginRef, SettingsApi, ExtensionCompositionEntry, ExtensionComposition } from '@alfresco/js-api';
import { HttpClient } from '@angular/common/http';
import { ExtensionInfoModel } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ExtensionManagerService {
    constructor(private apiService: AlfrescoApiService, private httpClient: HttpClient) {}

    private _settingsApi: SettingsApi;

    get settingsApi(): SettingsApi {
        this._settingsApi = this._settingsApi ?? new SettingsApi(this.apiService.getInstance());
        return this._settingsApi;
    }

    getPluginInfo(instanceUrl: string): Observable<ExtensionInfoModel[]> {
        return this.httpClient.get<ExtensionInfoModel[]>(`${instanceUrl}/pluginInfo.json`);
    }

    getSavedPluginState(instanceId: string): Observable<ExtensionCompositionEntry> {
        return from(this.settingsApi.getSavedExtensionState(instanceId));
    }

    getDefaultPluginState(instanceUrl: string): Observable<AppConfigPluginRef> {
        return this.httpClient.get<AppConfigPluginRef>(`${instanceUrl}/app.config.json`);
    }

    publishExtensionConfig(instanceId: string, pluginConfig: ExtensionComposition): Observable<void> {
        return from(this.settingsApi.publishExtensionConfig(instanceId, pluginConfig));
    }
}
