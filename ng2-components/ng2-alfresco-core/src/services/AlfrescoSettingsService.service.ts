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

    private _host: string = 'http://127.0.0.1:8080';
    private _contextPath = '/alfresco';
    private _apiBasePath: string = '/api/-default-/public/alfresco/versions/1';

    public get host(): string {
        return this._host;
    }

    public set host(value: string) {
        this._host = value;
    }

    getApiBaseUrl(): string {
        return this._host + this._contextPath + this._apiBasePath;
    }

    getAuthToken(): string {
        // todo: get proper token value
        return 'Basic ' + btoa('admin:admin');
    }
}
