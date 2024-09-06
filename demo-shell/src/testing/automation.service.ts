/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AppConfigService, UserPreferencesService, StorageService, AuthenticationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { DemoForm } from './demo-form.mock';
import { AlfrescoApiService } from '@alfresco/adf-content-services';

@Injectable({
    providedIn: 'root'
})
export class CoreAutomationService {
    public forms = new DemoForm();

    constructor(
        private appConfigService: AppConfigService,
        private alfrescoApiService: AlfrescoApiService,
        private userPreferencesService: UserPreferencesService,
        private storageService: StorageService,
        private auth: AuthenticationService
    ) {}

    setup() {
        const adfProxy = window['adf'] || {};

        adfProxy.getConfigField = (field: string): any => this.appConfigService.get(field);

        adfProxy.setConfigField = (field: string, value: string) => {
            this.appConfigService.config[field] = JSON.parse(value);
        };

        adfProxy.setStorageItem = (key: string, data: string) => {
            this.storageService.setItem(key, data);
        };

        adfProxy.removeStorageItem = (key: string) => {
            this.storageService.removeItem(key);
        };

        adfProxy.getStorageItem = (key: string): string => this.storageService.getItem(key);

        adfProxy.setUserPreference = (key: string, data: any) => {
            this.userPreferencesService.set(key, data);
        };

        adfProxy.setFormInEditor = (json: string) => {
            this.forms.formDefinition = JSON.parse(json);
        };

        adfProxy.setCloudFormInEditor = (json: string) => {
            this.forms.cloudFormDefinition = JSON.parse(json);
        };

        adfProxy.clearStorage = () => {
            this.storageService.clear();
        };

        adfProxy.apiReset = () => {
            this.alfrescoApiService.reset();
            this.auth.reset();
        };

        window['adf'] = adfProxy;
    }
}
