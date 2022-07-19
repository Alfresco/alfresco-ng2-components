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

import { AlfrescoApiConfig, BaseAlfrescoApi, ContentAuth, ContentClient, Oauth2Auth, ProcessAuth, ProcessClient } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { JsApiAngularHttpClient } from './js-api-angular-http-client';

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiV2 extends BaseAlfrescoApi {

    constructor(config: AlfrescoApiConfig, jsHttpClient: JsApiAngularHttpClient) {
        super(config, jsHttpClient);
    }

    initProcessClient(config: AlfrescoApiConfig): ProcessClient {
        return new ProcessClient(config, this.httpClient);
    }

    initOauth2Auth(config: AlfrescoApiConfig): Oauth2Auth {
        return new Oauth2Auth(config, this, this.httpClient);
    }

    initProcessAuth(config: AlfrescoApiConfig): ProcessAuth {
        return new ProcessAuth(config, this.httpClient);
    }

    initContentAuth(config: AlfrescoApiConfig): ContentAuth {
        return new ContentAuth(config, this, this.httpClient);
    }

    initContentClient(config: AlfrescoApiConfig, servicePath: string): ContentClient {
        return new ContentClient(config, servicePath, this.httpClient);
    }
}
