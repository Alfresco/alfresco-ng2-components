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

import { AuthService } from '@alfresco/adf-core/auth';
import { AlfrescoApi, AlfrescoApiConfig, Node } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { JsApiAngularHttpClient } from '@alfresco/adf-core/api';
import { AuthConfigService } from '../auth-factories/auth-config.service';


@Injectable()
export class LegacyAlfrescoApiServiceFacade {

    nodeUpdated = new Subject<Node>();
    instance: AlfrescoApi;

    constructor(private readonly auth: AuthService, private readonly authConfig: AuthConfigService, private readonly jsHttpClient: JsApiAngularHttpClient) {}

    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);

    getInstance(): AlfrescoApi {
        return this.instance;
    }

    init(config: AlfrescoApiConfig) {
        this.instance = this.createInstance(config);
        this.alfrescoApiInitialized.next(true);
    }

    createInstance(config: AlfrescoApiConfig) {
        return new AlfrescoApi(config, this.jsHttpClient);
    }

    async reset() {
        const config = this.authConfig.loadAppConfig();
        this.auth.updateIDPConfiguration(config);
        this.auth.login();
    }

}
