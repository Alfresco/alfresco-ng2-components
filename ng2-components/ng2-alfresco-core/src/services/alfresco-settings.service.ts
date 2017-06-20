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
<<<<<<< HEAD
import { AppConfigService } from './app-config.service';
import { UserPreferencesService } from './user-preferences.service';
=======
import { Subject } from 'rxjs/Subject';
import { AppConfigService } from './app-config.service';
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)

@Injectable()
export class AlfrescoSettingsService {

<<<<<<< HEAD
    constructor(
        private appConfig: AppConfigService,
        private preferences: UserPreferencesService) {
    }

    /** @deprecated in 1.6.0 */
    public get ecmHost(): string {
        console.log('AlfrescoSettingsService.ecmHost is deprecated. Use AppConfigService instead.');
=======
    static DEFAULT_CSRF_CONFIG: boolean = false;

    private _csrfDisabled: boolean = AlfrescoSettingsService.DEFAULT_CSRF_CONFIG;
    private providers: string = 'ALL'; // ECM, BPM , ALL

    public csrfSubject: Subject<boolean> = new Subject<boolean>();
    public providerSubject: Subject<string> = new Subject<string>();

    constructor(private appConfig: AppConfigService) {}

    public get ecmHost(): string {
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
        return this.appConfig.get<string>('ecmHost');
    }

    /** @deprecated in 1.7.0 */
    public set csrfDisabled(csrfDisabled: boolean) {
        console.log(`AlfrescoSettingsService.csrfDisabled is deprecated. Use UserPreferencesService.disableCSRF instead.`);
        this.preferences.disableCSRF = csrfDisabled;
    }

<<<<<<< HEAD
    /** @deprecated in 1.6.0 */
=======
    /* @deprecated in 1.6.0 */
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
    public set ecmHost(ecmHostUrl: string) {
        console.log('AlfrescoSettingsService.ecmHost is deprecated. Use AppConfigService instead.');
    }

    /** @deprecated in 1.6.0 */
    public get bpmHost(): string {
<<<<<<< HEAD
        console.log('AlfrescoSettingsService.bpmHost is deprecated. Use AppConfigService instead.');
        return this.appConfig.get<string>('bpmHost');
    }

    /** @deprecated in 1.6.0 */
=======
        return this.appConfig.get<string>('bpmHost');
    }

    /* @deprecated in 1.6.0 */
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
    public set bpmHost(bpmHostUrl: string) {
        console.log('AlfrescoSettingsService.bpmHost is deprecated. Use AppConfigService instead.');
    }

<<<<<<< HEAD
    /** @deprecated in 1.6.0 */
=======
    /* @deprecated in 1.6.0 */
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
    public getBPMApiBaseUrl(): string {
        console.log('AlfrescoSettingsService.getBPMApiBaseUrl is deprecated.');
        return this.bpmHost + '/activiti-app';
    }

    /** @deprecated in 1.7.0 */
    public getProviders(): string {
        console.log(`AlfrescoSettingsService.getProviders is deprecated. Use UserPreferencesService.authType instead.`);
        return this.preferences.authType;
    }

    /** @deprecated in 1.7.0 */
    public setProviders(providers: string) {
        console.log(`AlfrescoSettingsService.getProviders is deprecated. Use UserPreferencesService.authType instead.`);
        this.preferences.authType = providers;
    }
}
