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

/*tslint:disable*/ // => because of ADF file naming problems... Try to remove it, if you don't believe me :P

import { AlfrescoApiConfig } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { JsApiHttpClient } from '../js-api/js-api-http-client';
import { JsApiAngularHttpClient } from './js-api-angular-http-client';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AlfrescoApiV2Service {
    public contentPrivateClient: JsApiHttpClient;
    public contentClient: JsApiHttpClient;
    public authClient: JsApiHttpClient;
    public searchClient: JsApiHttpClient;
    public discoveryClient: JsApiHttpClient;
    public gsClient: JsApiHttpClient;
    public processClient: JsApiHttpClient;

    constructor(private httpClient: HttpClient) {}

    init(config: AlfrescoApiConfig) {
        this.contentPrivateClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/private/alfresco/versions/1`,
            this.httpClient
        );

        this.contentClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/alfresco/versions/1`,
            this.httpClient
        );

        this.authClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/authentication/versions/1`,
            this.httpClient
        );

        this.searchClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/search/versions/1`,
            this.httpClient
        );
        this.discoveryClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api`,
            this.httpClient
        );

        this.gsClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/gs/versions/1`,
            this.httpClient
        );

        this.processClient = new JsApiAngularHttpClient(
            config.hostBpm,
            config.contextRootBpm,
            '',
            this.httpClient
        );
    }
}
