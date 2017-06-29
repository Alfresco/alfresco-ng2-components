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
import { Subject } from 'rxjs/Subject';
import { AppConfigService } from './app-config.service';

@Injectable()
export class AlfrescoSettingsService {

    static DEFAULT_CSRF_CONFIG: boolean = false;

    private _csrfDisabled: boolean = AlfrescoSettingsService.DEFAULT_CSRF_CONFIG;
    private providers: string = 'ALL'; // ECM, BPM , ALL

    public csrfSubject: Subject<boolean> = new Subject<boolean>();
    public providerSubject: Subject<string> = new Subject<string>();

    constructor(private appConfig: AppConfigService) {}

    public get ecmHost(): string {
        return this.appConfig.get<string>('ecmHost');
    }

    public set csrfDisabled(csrfDisabled: boolean) {
        this.csrfSubject.next(csrfDisabled);
        this._csrfDisabled = csrfDisabled;
    }

    /* @deprecated in 1.6.0 */
    public set ecmHost(ecmHostUrl: string) {
        console.log('AlfrescoSettingsService.ecmHost is deprecated. Use AppConfigService instead.');
    }

    public get bpmHost(): string {
        return this.appConfig.get<string>('bpmHost');
    }

    /* @deprecated in 1.6.0 */
    public set bpmHost(bpmHostUrl: string) {
        console.log('AlfrescoSettingsService.bpmHost is deprecated. Use AppConfigService instead.');
    }

    /* @deprecated in 1.6.0 */
    public getBPMApiBaseUrl(): string {
        console.log('AlfrescoSettingsService.getBPMApiBaseUrl is deprecated.');
        return this.bpmHost + '/activiti-app';
    }

    public getProviders(): string {
        return this.providers;
    }

    public setProviders(providers: string) {
        this.providerSubject.next(providers);
        this.providers = providers;
    }
}
