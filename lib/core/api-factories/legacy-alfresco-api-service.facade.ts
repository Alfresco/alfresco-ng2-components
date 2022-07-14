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
import { AlfrescoApiConfig, AlfrescoApiType, Node } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { AlfrescoApiV2 } from '@alfresco/adf-core/api';
import { AuthConfigService } from '../auth-factories/auth-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LegacyAlfrescoApiServiceFacade {

    nodeUpdated = new Subject<Node>();

    instance: AlfrescoApiType;

    constructor(private readonly auth: AuthService, private readonly authConfig: AuthConfigService, private readonly httpClient: HttpClient) { }

    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);

    getInstance(): AlfrescoApiType {
        return this.instance;
    }

    init(config: AlfrescoApiConfig) {
        this.createInstance(config);
        this.alfrescoApiInitialized.next(true);
    }

    createInstance(config: AlfrescoApiConfig) {

        console.log(`%c DEBUG:LOG config`, 'color: green');
        console.log(config);
        console.log('%c ------------------------------', 'color: tomato');

        return this.instance = new AlfrescoApiV2(config, this.httpClient);
    }

    async reset() {
        const config = this.authConfig.loadAppConfig();
        this.auth.updateIDPConfiguration(config);
        this.auth.login();
    }

}
