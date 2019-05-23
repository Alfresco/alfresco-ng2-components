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

import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';
import { DemoForm } from '../mock/form/demo-form.mock';

@Injectable({
    providedIn: 'root'
})
export class CoreAutomationService {

    public forms = new DemoForm();

    constructor(private appConfigService: AppConfigService,
                private alfrescoApiService: AlfrescoApiService,
                private userPreferencesService: UserPreferencesService,
                private storageService: StorageService) {
    }

    setup() {
        const adfProxy = window['adf'] || {};

        adfProxy.setConfigField = (field: string, value: string) => {
            this.appConfigService.config[field] = JSON.parse(value);
        };

        adfProxy.setStorageItem = (key: string, data: string) => {
            this.storageService.setItem(key, data);
        };

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
        };

        window['adf'] = adfProxy;
    }
}
