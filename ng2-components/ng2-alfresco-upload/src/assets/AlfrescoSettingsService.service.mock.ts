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
export class AlfrescoSettingsServiceMock {

    static DEFAULT_HOST_ADDRESS: string = 'fakehost';
    static DEFAULT_CONTEXT_PATH: string = '/fake-path-alfresco';
    static DEFAULT_BASE_API_PATH: string = '/fake-api/fake-public/fake-alfresco/fake-versions/1';

    private providers: string[] = ['ECM', 'BPM'];

    private _host: string = AlfrescoSettingsServiceMock.DEFAULT_HOST_ADDRESS;
    private _contextPath = AlfrescoSettingsServiceMock.DEFAULT_CONTEXT_PATH;
    private _apiBasePath: string = AlfrescoSettingsServiceMock.DEFAULT_BASE_API_PATH;

    public get host(): string {
        return this._host;
    }

    getApiBaseUrl(): string {
        return this._host + this._contextPath + this._apiBasePath;
    }

    getProviders(): string [] {
        return this.providers;
    }
}
