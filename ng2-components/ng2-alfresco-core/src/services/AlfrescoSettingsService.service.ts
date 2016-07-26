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

@Injectable()
export class AlfrescoSettingsService {

    static DEFAULT_ECM_ADDRESS: string = 'http://127.0.0.1:8080';
    static DEFAULT_BPM_ADDRESS: string = 'http://127.0.0.1:9999';

    static DEFAULT_ECM_CONTEXT_PATH: string = '/alfresco';
    static DEFAULT_BPM_CONTEXT_PATH: string = '/activiti-app';

    static DEFAULT_ECM_BASE_API_PATH: string = '/api/-default-/public/alfresco/versions/1';
    static DEFAULT_BPM_BASE_API_PATH: string = '/app';

    private _ecmHost: string = AlfrescoSettingsService.DEFAULT_ECM_ADDRESS;
    private _bpmHost: string = AlfrescoSettingsService.DEFAULT_BPM_ADDRESS;

    private _ecmContextPath = AlfrescoSettingsService.DEFAULT_ECM_CONTEXT_PATH;
    private _bpmContextPath = AlfrescoSettingsService.DEFAULT_BPM_CONTEXT_PATH;

    private _apiECMBasePath: string = AlfrescoSettingsService.DEFAULT_ECM_BASE_API_PATH;
    private _apiBPMBasePath: string = AlfrescoSettingsService.DEFAULT_BPM_BASE_API_PATH;

    private providers: string[] = ['ECM', 'BPM'];

    public get ecmHost(): string {
        return this._ecmHost;
    }

    public set ecmHost(value: string) {
        this._ecmHost = value;
    }

    public get bpmHost(): string {
        return this._bpmHost;
    }

    public set bpmHost(value: string) {
        this._bpmHost = value;
    }

    public getBPMApiBaseUrl(): string {
        return this._bpmHost + this._bpmContextPath + this._apiBPMBasePath;
    }

    public getECMApiBaseUrl(): string {
        return this._ecmHost + this._ecmContextPath + this._apiECMBasePath;
    }

    public getProviders(): string [] {
        return this.providers;
    }

    public setProviders(providers: string []) {
        this.providers = providers;
    }
}
