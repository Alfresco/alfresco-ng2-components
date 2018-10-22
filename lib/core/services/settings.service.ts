/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(private appConfig: AppConfigService,
                private logService: LogService,
                private storage: StorageService) {
    }

    /** @deprecated in 1.6.0 */
    public get ecmHost(): string {
        this.logService.log('SettingsService.ecmHost is deprecated. Use AppConfigService instead.');
        return this.appConfig.get<string>(AppConfigValues.ECMHOST);
    }

    /** @deprecated in 1.7.0 */
    public set csrfDisabled(csrfDisabled: boolean) {
        this.logService.log(`SettingsService.csrfDisabled is deprecated. Use UserPreferencesService.disableCSRF instead.`);
        if (csrfDisabled !== null && csrfDisabled !== undefined) {
            this.storage.setItem(AppConfigValues.DISABLECSRF, csrfDisabled.toString());
        }
    }

    /** @deprecated in 1.6.0 */
    public set ecmHost(ecmHostUrl: string) {
        this.logService.log('SettingsService.ecmHost is deprecated. Use AppConfigService instead.');
    }

    /** @deprecated in 1.6.0 */
    public get bpmHost(): string {
        this.logService.log('SettingsService.bpmHost is deprecated. Use AppConfigService instead.');
        return this.appConfig.get<string>(AppConfigValues.BPMHOST);
    }

    /** @deprecated in 1.6.0 */
    public set bpmHost(bpmHostUrl: string) {
        this.logService.log('SettingsService.bpmHost is deprecated. Use AppConfigService instead.');
    }

    /** @deprecated in 1.6.0 */
    public getBPMApiBaseUrl(): string {
        this.logService.log('SettingsService.getBPMApiBaseUrl is deprecated.');
        return this.bpmHost + '/activiti-app';
    }

    /** @deprecated in 1.7.0 */
    public getProviders(): string {
        this.logService.log(`SettingsService.getProviders is deprecated. Use UserPreferencesService.authType instead.`);
        return this.storage.getItem(AppConfigValues.PROVIDERS) || this.appConfig.get<string>(AppConfigValues.PROVIDERS);
    }

    /** @deprecated in 1.7.0 */
    public setProviders(providers: string) {
        this.logService.log(`SettingsService.setProviders is deprecated. Use the app-config.json`);
        if (providers) {
            this.storage.setItem(AppConfigValues.PROVIDERS, providers);
        }
    }
}
