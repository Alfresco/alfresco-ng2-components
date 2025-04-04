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

import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { SettingsApi } from '@alfresco/js-api';
import { HttpClient } from '@angular/common/http';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { ExtensionInfoModel } from '../models/extension-info.model';
import { ExtensionCompositionEntry } from '../models/extension-composition-entry';
import { AppConfigPluginRef } from '../models/app-config-plugin-ref';
import { ExtensionComposition } from '../models/extension-composition';

@Injectable({
    providedIn: 'root'
})
export class ExtensionManagerService {
    constructor(private apiService: AlfrescoApiService, private httpClient: HttpClient) {}

    private _settingsApi: SettingsApi;

    get settingsApi(): SettingsApi {
        this._settingsApi ??= new SettingsApi(this.apiService.getInstance());
        return this._settingsApi;
    }

    /**
     * Fetches the extension configuration from a running application
     *
     * @param instanceUrl URL of the running application
     * @returns Observable<ExtensionInfoModel>
     */
    getPluginInfo(instanceUrl: string): Observable<ExtensionInfoModel[]> {
        return this.httpClient.get<ExtensionInfoModel[]>(`${instanceUrl}/pluginInfo.json`);
    }

    /**
     * Fetches the saved extension configuration from the database
     *
     * @param instanceId Unique id under which the extension configuration is saved
     * @returns Observable<ExtensionCompositionEntry>
     */
    getSavedPluginState(instanceId: string): Observable<ExtensionCompositionEntry> {
        // TODO: Update below code once backend APIs are working
        // eslint-disable-next-line no-console
        console.log(instanceId);
        return of(new ExtensionCompositionEntry());
        // return from(this.settingsApi.getSavedExtensionState(instanceId));
    }

    /**
     * Fetches the states of plugins from a running application
     *
     * @param instanceUrl URL of the running application
     * @returns Observable<AppConfigPluginRef>
     */
    getDefaultPluginState(instanceUrl: string): Observable<AppConfigPluginRef> {
        return this.httpClient.get<AppConfigPluginRef>(`${instanceUrl}/app.config.json`);
    }

    /**
     * Publishes the extensions configuration to the database
     *
     * @param instanceId Id to use to identify the application
     * @param pluginConfig The extension configuration to be saved
     * @returns void
     */
    publishExtensionConfig(instanceId: string, pluginConfig: ExtensionComposition): Observable<void> {
        return from(this.settingsApi.publishExtensionConfig(instanceId, pluginConfig));
    }
}
