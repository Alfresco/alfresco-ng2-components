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
import * as alfrescoApi from  'alfresco-js-api';
import { AlfrescoApi } from  'alfresco-js-api';

@Injectable()
export class AlfrescoApiService {

    private _instance: AlfrescoApi;

    public getInstance(): AlfrescoApi {
        return this._instance;
    }

    public setInstance(value: AlfrescoApi) {
        this._instance = value;
    }

    constructor() {
        this._instance = <AlfrescoApi>new alfrescoApi({
            provider: 'ALL',
            ticketEcm: null,
            ticketBpm: null,
            hostEcm: 'http://localhost:8080',
            hostBpm: 'http://localhost:9999',
            contextRoot: 'alfresco',
            disableCsrf: true
        });
    }

}
