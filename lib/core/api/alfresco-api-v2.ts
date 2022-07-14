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
/* eslint-disable */

import { AlfrescoApiConfig, BaseAlfrescoApi, ContentAuth, ContentClient, Oauth2Auth, ProcessAuth, ProcessClient } from "@alfresco/js-api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JsApiAngularHttpClient } from "./js-api-angular-http-client";

@Injectable({
    providedIn: "root"
})
export class AlfrescoApiV2 extends BaseAlfrescoApi {

    constructor(config: AlfrescoApiConfig, httpClient: HttpClient) {
        // const config = new AlfrescoApiConfig({
        //     "hostEcm": "http://localhost:3000",
        //     "hostBpm": "http://localhost:3000",
        //     "authType": "OAUTH",
        //     "contextRoot": "alfresco",
        //     "tenant": "-default-",
        //     "contextRootBpm": "activiti-app",
        //     "domainPrefix": "ADF",
        //     "provider": "ALL",
        //     "disableCsrf": false,
        //     "withCredentials": false,
        //     "oauth2": {
        //         "host": "https://apadev.envalfresco.com/auth/realms/alfresco",
        //         "clientId": "alfresco",
        //         "redirectUri": "http://localhost:3000/",
        //         "redirectUriLogout": "http://localhost:3000/",
        //         "scope": "openid profile email",
        //         "secret": "",
        //         "silentLogin": true,
        //         "implicitFlow": false,
        //         "codeFlow": true,
        //         "publicUrls": [
        //             "**/preview/s/*",
        //             "**/settings",
        //             "**/logout"
        //         ]
        //     }
        // });

        super(config, httpClient);
    }

    initProcessClient(config: AlfrescoApiConfig): ProcessClient {
        const { hostBpm: host, contextRootBpm: contextRoot } = config;
        const http = new JsApiAngularHttpClient({ host, contextRoot }, this.httpClient);

        return new ProcessClient(config, http)
    }

    initOauth2Auth(config: AlfrescoApiConfig): Oauth2Auth {
        const { hostEcm: host, contextRoot } = config;
        const http = new JsApiAngularHttpClient({ host, contextRoot }, this.httpClient);

        return new Oauth2Auth(config, this, http);
    }

    initProcessAuth(config: AlfrescoApiConfig): ProcessAuth {
        const { hostEcm: host, contextRoot } = config;
        const http = new JsApiAngularHttpClient({ host, contextRoot }, this.httpClient);

        return new ProcessAuth(config, http);
    }

    initContentAuth(config: AlfrescoApiConfig): ContentAuth {
        const { hostEcm: host, contextRoot } = config;
        const http = new JsApiAngularHttpClient({ host, contextRoot }, this.httpClient);

        return new ContentAuth(config, this, http);
    }

    initContentClient(config: AlfrescoApiConfig, servicePath: string): ContentClient {
        const { hostEcm: host, contextRoot } = config;
        const http = new JsApiAngularHttpClient({ host, contextRoot, servicePath }, this.httpClient);

        return new ContentClient(config, servicePath, http);
    }
}
