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

@Injectable()
export class SettingsService {

    static DEFAULT_ECM_ADDRESS: string = 'http://' + window.location.hostname + ':8080';
    static DEFAULT_BPM_ADDRESS: string = 'http://' + window.location.hostname + ':9999';
    static DEFAULT_CSRF_CONFIG: boolean = false;

    static DEFAULT_BPM_CONTEXT_PATH: string = '/activiti-app';

    private _ecmHost: string = SettingsService.DEFAULT_ECM_ADDRESS;
    private _bpmHost: string = SettingsService.DEFAULT_BPM_ADDRESS;
    private _csrfDisabled: boolean = SettingsService.DEFAULT_CSRF_CONFIG;

    private _bpmContextPath = SettingsService.DEFAULT_BPM_CONTEXT_PATH;

    private providers: string = 'ALL'; // ECM, BPM , ALL

    public bpmHostSubject: Subject<string> = new Subject<string>();
    public ecmHostSubject: Subject<string> = new Subject<string>();
    public csrfSubject: Subject<boolean> = new Subject<boolean>();
    public providerSubject: Subject<string> = new Subject<string>();

    public get ecmHost(): string {
        return this._ecmHost;
    }

    public set csrfDisabled(csrfDisabled: boolean) {
        this.csrfSubject.next(csrfDisabled);
        this._csrfDisabled = csrfDisabled;
    }

    public set ecmHost(ecmHostUrl: string) {
        this.ecmHostSubject.next(ecmHostUrl);
        this._ecmHost = ecmHostUrl;
    }

    public get bpmHost(): string {
        return this._bpmHost;
    }

    public set bpmHost(bpmHostUrl: string) {
        this.bpmHostSubject.next(bpmHostUrl);
        this._bpmHost = bpmHostUrl;
    }

    public getBPMApiBaseUrl(): string {
        return this._bpmHost + this._bpmContextPath;
    }

    public getProviders(): string {
        return this.providers;
    }

    public setProviders(providers: string) {
        this.providerSubject.next(providers);
        this.providers = providers;
    }
}
